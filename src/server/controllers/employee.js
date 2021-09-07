const dbOperate = require('../services/mysql/dbOperate')

// 获取组织机构列表，按组织层级关系返回：
const handle_getEmployees = async (ctx, next) => {
    try {
        // console.log('ctx.request.body', ctx.request.body)
        // 验证输入参数
        let { query, pageNum, pageSize } = ctx.request.body;
        if (!query && Object.keys(query).length < 1) throw new Error("查询参数不能为空.")

        const employee_list = await dbOperate.findAll('tenant_employee', query, pageNum, pageSize)

        ctx.body = {
            code: 1,
            message: 'success',
            data: employee_list
        }
    } catch (error) {
        console.log(error)
        ctx.body = { code: -112, message: error.message }
    }
    await next()
}

module.exports = {
    "POST /v1.0/employees": handle_getEmployees
}




