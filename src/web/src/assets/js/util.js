import fileSaver from 'file-saver'
import XLSX from 'xlsx'
const sheet2JSONOpts = {
    /** Default value for null/undefined values */
    defval: ''//给defval赋值为空的字符串
}

const exportJsonToExcel = (json, fields, filename = '测试数据') => {
    try {
        json.forEach(item => {
            for (let prop in item) {
                if (item.hasOwnProperty(prop) && fields.includes(prop)) {
                    return item;
                }
                delete item[prop]; //删除原先的对象属性
            }
        })
        let sheetName = filename //excel的文件名称
        let wb = XLSX.utils.book_new()  //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
        let ws = XLSX.utils.json_to_sheet(json, { header: Object.values(fields) }) //将JS对象数组转换为工作表。
        wb.SheetNames.push(sheetName)
        wb.Sheets[sheetName] = ws
        const defaultCellStyle = { font: { name: "Verdana", sz: 13, color: "FF00FF88" }, fill: { fgColor: { rgb: "FFFFAA00" } } };//设置表格的样式
        let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false }  //写入的样式
        let wbout = XLSX.write(wb, wopts)
        let blob = new Blob([str2bin(wbout)], { type: 'application/octet-stream' })
        fileSaver.saveAs(blob, filename + '.xlsx')
        return { code: 1, message: '导出成功！' }
    } catch (error) {
        console.log('exportJsonToExcel error: ', error)
        return { code: -1, message: '导出失败，error：' + error.message }
    }
}

function str2bin(s) {
    if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
    } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}

const readExcelToJson = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event) => {
            try {
                let data = event.target.result;
                let workbook = XLSX.read(data, { type: "binary" });
                // 存储获取到的数据：
                let buildings = [];
                let fromTo = "";
                for (let sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        fromTo = workbook.Sheets[sheet]["!ref"];
                        buildings = buildings.concat(
                            XLSX.utils.sheet_to_json(workbook.Sheets[sheet], sheet2JSONOpts)
                        );
                        // break; // 如果只取第一张sheet表，就取消注释这行
                    }
                }
                let fileRows = buildings.length - 1; //表格内容
                resolve(buildings);
            } catch (error) {
                reject("解析excel的模块readExcelToJson 出错，error：" + error.message);
            }
        };
    });
}


// 验证json数据的字段是否符合模板要求：
const validJsonFieldsByTemplate = (json, templateFormat) => {
    let valid_result = [];
    let json_keys = Object.keys(json[0]);
    let import_fields = templateFormat.map((each) => each.field);
    for (let index = 0; index < json_keys.length; index++) {
        if (json_keys[index] === "__EMPTY") {
            valid_result.push(`第${index + 1}个字段名称不能为空`)
            continue;
        }
        if (!import_fields.includes(json_keys[index])) {
            valid_result.push(`第${index + 1}个字段不是规定中的导入字段`)
            continue;
        }
    }

    if (valid_result.length === 0) {
        return { code: 1, message: 'success' }
    }
    return { code: -1, message: valid_result }
}
// 验证json数据的内容是否符合格式要求：
const validJsonDataByTemplate = (json, templateFormat) => {
    // 2. 再判断每一个字段的值是否符合规定：
    let json_keys = Object.keys(json[0]);
    let valid_result = [];
    for (let i = 0; i < json.length; i++) {
        // 获取excel表格中第 i 行的数据
        let row = json[i];
        for (let j = 0; j < json_keys.length; j++) {
            // 获取每一行数据的每个字段,进行逐一验证：
            let key = json_keys[j];
            let value = row[key];
            let config = templateFormat.find((item) => item.field === key);
            if (value === "" && config.required) {
                valid_result.push(`第 [${i + 1}] 行的字段 [${key}] 的值不能为空`);
            }
        }
    }
    if (valid_result.length === 0) {
        return { code: 1, message: 'success' }
    }
    return { code: -1, message: valid_result }
}

// 将数组数据转化为树结构数据的函数:
/**
 * 
 * @param {*} dataList 数据数组
 * @param {*} treeKey 定义树结构的字段
 * @returns 
 */
const list_2_tree = (dataList, treeKey) => {
    // 先拿到最高等级数据
    let topArr = dataList.filter(item => item.parentId === '0');
    // 再遍历每一个最高等级数据，给它们赋值子等级：
    for (let i = 0; i < topArr.length; i++) {
        getChildren(topArr[i], dataList, treeKey)
    }
    // 最后进行排序处理
    sortByOrder(topArr)
    // -------------------------以下为定义在函数内部的递归函数---------------------
    // 递归获取子数据函数：
    function getChildren(currentData, dataList, treeKey) {
        for (let i = 0; i < dataList.length; i++) {
            if (currentData[treeKey] === dataList[i].parentId) {
                currentData.children = currentData.children || [];
                currentData.children.push(dataList[i]);
                getChildren(currentData.children[currentData.children.length - 1], dataList, treeKey)
            }
        }
    }
    // 递归排序函数：根据order对数据进行排序：
    function sortByOrder(arr) {
        if (arr[0] && arr[0].order) {
            arr.sort((a, b) => a.order - b.order)
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].children && arr[i].children.length > 0) {
                    sortByOrder(arr[i])
                }
            }
        }
    }
    return topArr;
}

export {
    exportJsonToExcel,
    readExcelToJson,
    validJsonFieldsByTemplate,
    validJsonDataByTemplate,
    list_2_tree
}