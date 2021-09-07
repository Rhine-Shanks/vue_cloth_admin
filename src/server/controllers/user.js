const dbOperate = require('../services/mysql/dbOperate')
/**
 * 查询用户列表：
 */
const handle_getUsers = async (ctx, next) => {
    try {
        // console.log("ctx.request.body", ctx.request.body)
        // 验证输入参数
        let { orgId, query, pageNum, pageSize } = ctx.request.body;
        if (!query && Object.keys(query).length < 1) throw new Error("查询参数不能为空.")

        // 顶级组织默认可以查看所有的用户，所以需要删除查询条件的组织Id限定
        if (orgId === '1' && query["orgId"]) { delete query["orgId"] }

        // 获取用户数据：
        let res_user_list = await dbOperate.findAll('v_user_list', query, pageNum, pageSize)

        ctx.response.body = { code: 1, message: "success", data: res_user_list };
    } catch (error) {
        console.log(error)
        ctx.response.body = { code: -111, message: "获取用户列表失败：" + error.message }
    }
    await next()
}

/**
 *查询单个用户信息：
 */
const handle_getUserByUserId = async (ctx, next) => {
    try {
        // console.log("ctx.request.body", ctx.request.body)
        const { query } = ctx.request.body
        if (!query && Object.keys(query).length < 1) throw new Error("查询参数不能为空.")

        let user = await dbOperate.findOne('v_user_list', query)

        ctx.body = { code: 1, message: 'success', data: user }
    } catch (error) {
        console.log(error)
        ctx.body = { code: -112, message: error.message }
    }
    await next()
}

/**
 * 编辑用户信息
 */
const handle_editUser = async (ctx, next) => {
    try {
        // console.log("ctx.request.body", ctx.request.body)
        // 1. 验证输入参数
        let { query, dataContent } = ctx.request.body;
        if (!query && Object.keys(query).length < 1) throw new Error("查询参数不能为空.")
        Object.keys(query).forEach(each => {
            if (!query[each]) { delete query[each] }
        })
        if (!dataContent && Object.keys(dataContent).length < 1) throw new Error("更新参数不能为空.")
        // 更新用户数据
        let res = await dbOperate.updateData('tenant_user', query, dataContent)

        ctx.response.body = { code: 1, message: "success" };
    } catch (error) {
        // console.log(error)
        ctx.response.body = { code: -111, message: error.message }
    }
    await next()
}

/**
 * 删除用户
 */
const handle_deleteUser = async (ctx, next) => {
    try {
        console.log("ctx.request.body", ctx.request.body)
        // 1. 验证输入参数
        let { query } = ctx.request.body;
        if (!query && Object.keys(query).length < 1) throw new Error("查询参数不能为空.")
        Object.keys(query).forEach(each => {
            if (!query[each]) { delete query[each] }
        })
        // 更新用户数据
        let res = await dbOperate.deleteData('tenant_user', query)

        ctx.response.body = { code: 1, message: "success" };
    } catch (error) {
        // console.log(error)
        ctx.response.body = { code: -111, message: error.message }
    }
    await next()
}

/**
 * 新增用户
 */
const handle_addUser = async (ctx, next) => {
    try {
        // 1. 验证输入参数
        // console.log('ctx.request.body', ctx.request.body)

        let { dataContent } = ctx.request.body;
        if (!dataContent && Object.keys(dataContent).length < 1) throw new Error("新增用户数据不能为空.")
        let res = await dbOperate.createData('tenant_user', dataContent)

        ctx.response.body = { code: 1, message: "success" };
    } catch (error) {
        // console.log(error)
        ctx.response.body = {
            code: -111,
            message: error.name === "SequelizeUniqueConstraintError"
                ? "该用户名已注册，请重新拟定用户名" : error.message
        }
    }
    await next()
}

module.exports = {
    "POST /v1.0/users": handle_getUsers,
    "POST /v1.0/users/user": handle_getUserByUserId,
    "POST /v1.0/users/user/edit": handle_editUser,
    "POST /v1.0/users/user/delete": handle_deleteUser,
    "POST /v1.0/users/user/add": handle_addUser,
}

// get_user_menus('test', 'admin')