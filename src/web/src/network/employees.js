import request from '../network/request'

function postGetEmployeeList(data) {
    data.tableName = 'v_employee_list'
    data.operateType = 'findAll'
    return request({
        method: "POST",
        url: "graphOperate",
        data: data
    })
}

function postAddEmployee(data) {
    data.tableName = 'tenant_employee'
    data.operateType = "create"
    return request({
        method: "POST",
        url: 'graphOperate',
        data,
    })
}
function postDeleteEmployee(data) {
    data.tableName = 'tenant_employee'
    data.operateType = "update"
    data.dataContent = { isDelete: 1 }
    return request({
        method: "POST",
        url: 'graphOperate',
        data,
    })
}
function postUpdateEmployee(data) {
    data.tableName = 'tenant_employee'
    data.operateType = "update"
    return request({
        method: "POST",
        url: 'graphOperate',
        data,
    })
}
function postFindOneEmployee(data) {
    data.tableName = 'tenant_employee'
    data.operateType = "findOne"
    return request({
        method: "POST",
        url: 'graphOperate',
        data,
    })
}

export {
    postGetEmployeeList,
    postAddEmployee,
    postDeleteEmployee,
    postUpdateEmployee,
    postFindOneEmployee
}