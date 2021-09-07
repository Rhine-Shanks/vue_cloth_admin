import request from './request.js'

function postGetWarehouseList(data = {}) {
    data.tableName = 'v_warehouse_list'
    data.operateType = 'findAll'
    return request({
        method: 'POST',
        url: 'graphOperate',
        data
    })
}

function postAddWarehouse(data) {
    data.tableName = 'tenant_warehouse'
    data.operateType = 'create'
    return request({
        method: 'POST',
        url: 'graphOperate',
        data
    })
}
function postDeleteWarehouse(data) {
    data.tableName = 'tenant_warehouse'
    data.operateType = 'update'
    data.dataContent = { isDelete: 1 }
    return request({
        method: 'POST',
        url: 'graphOperate',
        data
    })
}
function postEditWarehouse(data) {
    data.tableName = 'tenant_warehouse'
    data.operateType = 'update'
    return request({
        method: 'POST',
        url: 'graphOperate',
        data
    }) 
}

function postBulkCreateWarehouse(data = {}) {
    data.tableName = 'tenant_warehouse'
    data.operateType = 'bulkCreate';
    // data.updateOnDuplicate = ['isDelete']
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}


export {
    postGetWarehouseList,
    postAddWarehouse,
    postDeleteWarehouse,
    postEditWarehouse,
    postBulkCreateWarehouse,
}