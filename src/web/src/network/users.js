import request from './request'

function postGetUserList(data = {}) {
    data.tableName = 'v_user_list'
    data.operateType = 'findAll'

    return request({
        method: "POST",
        url: "graphOperate",
        data: data
    })
}

function postGetUserByUserId(data) {
    data.tableName = 'tenant_user'
    data.operateType = 'findOne'
    return request({
        method: "POST",
        url: 'graphOperate',
        data
    })
}

function postAddUser(data) {
    data.tableName = 'tenant_user'
    data.operateType = 'create'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postUpdateUser(data) {
    data.tableName = 'tenant_user'
    data.operateType = 'update'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postDeleteUser(data) {
    data.tableName = 'tenant_user'
    data.operateType = 'update'
    data.dataContent = { isDelete: 1 }
    return request({
        method: "POST",
        url: "graphOperate",
        data: data
    })
}

// 分配用户角色，存在则更新，不存在则新增：
function postBulkCreateUserRole(data = {}) {
    data.tableName = 'tenant_user_role'
    data.operateType = 'bulkCreate',
    data.updateOnDuplicate = ['roleId']
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

export {
    postGetUserList,
    postGetUserByUserId,
    postUpdateUser,
    postDeleteUser,
    postAddUser,
    postBulkCreateUserRole
}