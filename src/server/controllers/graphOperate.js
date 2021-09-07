const dbOperate = require('../services/mysql/dbOperate')
const schema = require('../services/mysql/schema')
const operateTypeEnum = {
    total: ["findOne", "findAll", "create", "bulkCreate", "destroy", "update"],
    needQuery: ["findOne", "findAll", "destroy", "update"],
    needDataContent: ["create", "bulkCreate", "update"]
}
/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 * ctx.request.body 的参数示例：
 * {
 *    tenantId: "",
 *    orgId: "",
 *    userId: "",
 * 
 *    tableName: "",
 *    operateType: "",
 *    query: {},
 *    dataContent: {}/[],
 *    pageNum: "",
 *    pageSize: "",
 * }
 */

const graphOperate = async (ctx, next) => {
    try {
        console.log("ctx.request.body", ctx.request.body)
        // 1.验证请求参数：
        validatePostRequestBody(ctx.request.body);
        const {
            tableName, operateType, query, dataContent, fields,
            pageNum, pageSize,
            dataType, fieldId,
            updateOnDuplicate
        } = ctx.request.body;
        if (operateType === 'destroy') {
            return ctx.body = { code: 1, message: '暂停删除操作' }
        }
        // 2.数据库操作：
        const params = { tableName, query, dataContent, fields, pageNum, pageSize, updateOnDuplicate }
        let result = await dbOperate[operateType](params);
        // 3.数据格式化操作：
        if (dataType && dataType === "tree") {
            result = format_list_to_tree(result, fieldId);
        }
        // 如果查询的是角色列表，则应返回角色的所属权限，放在children属性下：
        if (tableName === "v_role_list" && pageNum && pageSize) {
            result.data = await appendRightTreeListForRole(result.data)
        }
        // console.log(result)
        ctx.body = { code: 1, message: "success", data: result }
    } catch (error) {
        console.log(error)
        ctx.response.body = error.name === "SequelizeUniqueConstraintError"
            ? { code: -111, message: "重复的编号" } :
            { code: -100, message: error.message }
    }
    await next()
}
// 验证请求参数
function validatePostRequestBody(body) {
    const { tableName, operateType, query, dataContent, fields, pageNum, pageSize, dataType, fieldId } = body;
    if (!Object.keys(schema).includes(tableName))
        throw new Error(`[${tableName}]表名未定义`)
    if (!operateTypeEnum["total"].includes(operateType))
        throw new Error(`[${operateType}]操作类型未定义`)
    if (operateTypeEnum["needQuery"].includes(operateType) && typeof query !== "object")
        throw new Error(`查询字段不能为空`);
    if (operateTypeEnum["needDataContent"].includes(operateType) && !dataContent)
        throw new Error(`dataContent字段不能为空`);
    if (fields && (!Array.isArray(fields) || fields.length < 1))
        throw new Error("属性参数attributes必须为数组且不能为空")
    if ((pageNum && !pageSize) || (!pageNum && pageSize))
        throw new Error(`pageSize和pageSize字段必须同时存在`);
    if ((dataType && !fieldId) || (!dataType && fieldId))
        throw new Error(`dataType和fieldId字段必须同时存在`)
}
// 列数据转化为树结构
function format_list_to_tree(data_list, fieldId) {
    // 等级排列，按照【低等级 -> 高等级】 
    data_list.sort((a, b) => b.level - a.level)
    // 从低等级开始，遍历每一个等级，并将低等级push到高等级数组：
    for (let i = 0; i < data_list.length; i++) {
        let current_data_obj = data_list[i];
        let parent_data_index = data_list.findIndex(item => item[fieldId] === current_data_obj.parentId);
        // 判断是否存在父等级，存在则push：
        if (parent_data_index > -1) {
            if (!data_list[parent_data_index].children) {
                data_list[parent_data_index].children = []
            }
            data_list[parent_data_index].children.push(current_data_obj)
        }
    }

    // 最终把最高等级的数据筛选后返回：
    data_list = data_list.filter(item => item.level === '1')

    // 拿到树结构数据之后，对每个节点数据按照order排序，如果order存在的话：
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
    // 如果存在order属性，将每个等级的数据都进行排序：
    sortByOrder(data_list)

    return data_list
}

async function appendRightTreeListForRole(roleList) {
    for (let i = 0; i < roleList.length; i++) {
        let role = roleList[i];
        let rightList = await dbOperate.findAll({
            tableName: 'v_role_right', query: {
                tenantId: role.tenantId,
                orgId: role.orgId,
                roleId: role.roleId
            }
        })
        role.children = format_list_to_tree(rightList, 'rightId')
    }
    return roleList;
}

module.exports = {
    "POST /v1.0/graphOperate": graphOperate,
}
