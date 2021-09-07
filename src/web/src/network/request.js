import axios from 'axios';
import NProgress from 'nprogress';

function request(config) {
    const instance = axios.create({
        baseURL: "http://localhost:6001/v1.0",
        timeout: 5000
    })
    instance.interceptors.request.use(config => {
        // 在ruquest拦截器中展示进度条：
        NProgress.start()
        // 不是login的请求，默认请求头加上access_token,同时请求参数都加上tenantId和orgId
        if (config.url !== "login" && config.method === "post") {
            const tenantId = window.sessionStorage.getItem('tenantId')
            const orgId = window.sessionStorage.getItem('orgId')
            const userId = window.sessionStorage.getItem('userId')
            const token = window.sessionStorage.getItem('token')
            config.headers["access_token"] = token
            // 如果传入的参数为空，则应赋值一个空对象：
            config.data = config.data || {}
            config.data["tenantId"] = tenantId
            config.data["orgId"] = orgId
            config.data["userId"] = userId
            // 如果不存在查询条件，则默认附加该登录账号的租户
            config.data.query = config.data.query || { tenantId }
            config.data.query.tenantId = tenantId;
            // 默认给新增的数据，附加tenantId、createPerson、createTime属性
            if (config.data.operateType === "create" || config.data.operateType === "bulkCreate") {
                if (!Array.isArray(config.data.dataContent)) {
                    config.data.dataContent.tenantId = tenantId
                    config.data.dataContent.createPerson = userId
                    config.data.dataContent.createTime = new Date()
                }
                if (Array.isArray(config.data.dataContent)) {
                    for (let i = 0; i < config.data.dataContent.length; i++) {
                        config.data.dataContent[i].tenantId = tenantId
                        config.data.dataContent[i].createPerson = userId
                        config.data.dataContent[i].createTime = new Date()
                    }
                }
            }
            // 默认给更新的数据添加 updatePerson 和 updateTime
            if (config.data.operateType === 'update') {
                config.data.dataContent.updatePerson = userId
                config.data.dataContent.updateTime = new Date()
            }
            // 将query中字段值为空或null或undefined，删除该查询字段
            Object.keys(config.data.query).forEach(each_field => {
                const invalid_value = [null, undefined, '']
                if (invalid_value.includes(config.data.query[each_field])) {
                    throw new Error('查询字段的值不能为空！！！')
                    // delete config.data.query[each_field]
                }
            })
        }
        return config
    })
    instance.interceptors.response.use(result => {
        // 在ruquest拦截器中关闭进度条：
        NProgress.done()
        return result.data
    })
    return instance(config)
}

export default request;