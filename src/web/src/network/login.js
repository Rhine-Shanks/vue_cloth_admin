import request from './request';

function postLogin(data) {
    return request({
        url: 'login',
        method: 'POST',
        data: data
    })
}

function postGetMenusAndRights(data) {
    data.tableName = 'v_user_right'
    data.operateType = 'findAll'
    return request({
        url: 'graphOperate',
        method: 'POST',
        data
    })
}

export {
    postLogin,
    postGetMenusAndRights
}