import request from './request'

function postGetRightList(data = {}) {
    data.tableName = 'v_right_list'
    data.operateType = 'findAll'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}


function postGetRightByRightId(data = {}) {
    data.tableName = 'tenant_right'
    data.operateType = 'findOne'
    return request({
        method: "POST",
        url: 'graphOperate',
        data
    })
}

function postAddRight(data = {}) {
    data.tableName = 'tenant_right'
    data.operateType = 'create'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postUpdateRight(data = {}) {
    data.tableName = 'tenant_right'
    data.operateType = 'update'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postDeleteRight(data = {}) {
    data.tableName = 'tenant_right'
    data.operateType = 'update'
    data.dataContent = { isDelete: 1 }
    return request({
        method: "POST",
        url: "graphOperate",
        data: data
    })
}

export {
    postGetRightList,
    postGetRightByRightId,
    postUpdateRight,
    postDeleteRight,
    postAddRight
}