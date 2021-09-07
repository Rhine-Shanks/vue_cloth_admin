import request from '../network/request'

function postGetOrgList(data = {}) {
    data.tableName = 'v_org_list'
    data.operateType = 'findAll'
    return request({
        method: "POST",
        url: "graphOperate",
        data: data
    })
}
function postGetOrgByOrgId(data) {
    data.tableName = 'v_org_list'
    data.operateType = 'findOne'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}


function postAddOrg(data) {
    data.tableName = 'tenant_org'
    data.operateType = 'create'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postUpdateOrg(data) {
    data.tableName = 'tenant_org'
    data.operateType = 'update'
    return request({
        method: "POST",
        url: "graphOperate",
        data
    })
}

function postDeleteOrg(data) {
    data.tableName = 'tenant_org'
    data.operateType = 'update'
    data.dataContent = { isDelete: 1 }
    return request({
        method: "POST",
        url: "graphOperate",
        data: data
    })
}


export {
    postGetOrgList,
    postGetOrgByOrgId,
    postAddOrg,
    postUpdateOrg,
    postDeleteOrg
}