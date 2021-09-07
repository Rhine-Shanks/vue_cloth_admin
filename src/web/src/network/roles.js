import request from "./request";

function postGetRoleList(data) {
    data.tableName = 'v_role_list'
    data.operateType = 'findAll'
    return request({
        method: "POST",
        url: 'graphOperate',
        data
    })
}


function postGetRoleByRoleId(data = {}) {
    data.tableName = 'tenant_role'
    data.operateType = 'findOne'
    return request({
        method: "POST",
        url: 'graphOperate',
        data
    })
}

function postAddRole(data = {}) {
    data.tableName = 'tenant_role'
    data.operateType = 'create'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}
// 分配权限，存在则更新，不存在则新增：
function postBulkCreateRoleRight(data = {}) {
    data.tableName = 'tenant_role_right'
    data.operateType = 'bulkCreate';
    data.updateOnDuplicate = ['isDelete']
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postUpdateRole(data = {}) {
    data.tableName = 'tenant_role'
    data.operateType = 'update'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postDeleteRole(data = {}) {
    data.tableName = 'tenant_role'
    data.operateType = 'update'
    data.dataContent = { isDelete: 1 }
    return request({
        method: "POST",
        url: "graphOperate",
        data: data
    })
}

// 删除角色权限为'软删除'，只是将 isDelete 字段更新为 1
function postDeleteRoleRight(data) {
    data.tableName = 'tenant_role_right'
    data.operateType = 'update'
    return request({
        method: "POST",
        url: "graphOperate",
        data,
    })
}

export {
    postGetRoleList,
    postGetRoleByRoleId,
    postAddRole,
    postBulkCreateRoleRight,
    postUpdateRole,
    postDeleteRole,
    postDeleteRoleRight
}