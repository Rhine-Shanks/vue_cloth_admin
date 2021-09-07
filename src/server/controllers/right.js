const dbOperate = require('../services/mysql/dbOperate')

// 获取所有权限数据
const handle_getRightList = async (ctx, next) => {
    try {
        // console.log("ctx.request.body", ctx.request.body)
        const { query, pageNum, pageSize, type } = ctx.request.body
        if (!query && Object.keys(query).length < 1) throw new Error("查询参数不能为空.")

        let right_list = await dbOperate.findAll('v_right_list', query, pageNum, pageSize)

        ctx.body = {
            code: 1,
            message: 'success',
            data: type === 'tree' ? format_data_list_to_tree(right_list, "rightId") : right_list
        }
    } catch (error) {
        console.log(error)
        ctx.body = { code: -113, message: error.message }
    }
    await next()
}
// 重新格式化数据列表，转化为tree
function format_data_list_to_tree(data_list, dataId) {
    // 组织排列，按照【低等级 -> 高等级】 
    data_list = data_list.sort((a, b) => b.level - a.level)
    // 从低级组织开始，遍历每一个组织，并将子组织push到父组织：
    for (let i = 0; i < data_list.length; i++) {
        let current_data_obj = data_list[i];
        let parent_data_index = data_list.findIndex(item => item[dataId] === current_data_obj.parentId);
        if (parent_data_index > -1) {
            if (!data_list[parent_data_index].children) {
                data_list[parent_data_index].children = []
            }
            data_list[parent_data_index].children.push(current_data_obj)
        }
    }

    return data_list.filter(item => item.level === '1')
}

/**
 * 新增权限
 */
const handle_createRight = async (ctx, next) => {
    try {
        console.log("ctx.request.body", ctx.request.body)
        // 1. 验证输入参数
        let { dataContent } = ctx.request.body;
        if (!dataContent && Object.keys(dataContent).length < 1) throw new Error("更新参数不能为空.")

        const res = await dbOperate.createData('tenant_right', dataContent)

        ctx.body = { code: 1, message: 'success' }
    } catch (error) {
        ctx.body = { code: -114, message: error.message }
    }
    await next()
}

/**
 * 删除权限
 */
const handle_deleteRight = async (ctx, next) => {
    try {
        console.log("ctx.request.body", ctx.request.body)
        // 1. 验证输入参数
        let { query } = ctx.request.body;
        if (!query && Object.keys(query).length < 1) throw new Error("查询参数不能为空.")
        // 更新用户数据
        let res = await dbOperate.deleteData('tenant_user', query)

        ctx.response.body = { code: 1, message: "success" };
    } catch (error) {
        // console.log(error)
        ctx.response.body = { code: -111, message: error.message }
    }
    await next()
}



module.exports = {
    "POST /v1.0/rights": handle_getRightList,
    "POST /v1.0/rights/right/add": handle_createRight,
    "POST /v1.0/rights/right/delete": handle_deleteRight,
}