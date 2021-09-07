const dbOperate = require('../services/mysql/dbOperate')

// 获取组织机构列表，按组织层级关系返回：
const handle_getOrgs = async (ctx, next) => {
    try {
        // console.log('ctx.request.body', ctx.request.body)
        const { query, type } = ctx.request.body;

        // 默认查询所有组织机构，且管理员才有查询以及分配的权限：
        delete query['userId'];
        delete query['orgId'];
        const org_list = await dbOperate.findAll('v_org_list',query)

        ctx.body = {
            code: 1,
            message: 'success',
            data: type === 'tree' ? format_org_list_to_tree(org_list) : org_list
        }
    } catch (error) {
        console.log(error)
        ctx.body = { code: -112, message: error.message }
    }
    await next()
}

// 重新格式化组织列表，转化为tree
function format_org_list_to_tree(org_list) {
    // 组织排列，按照【低等级 -> 高等级】 
    org_list = org_list.sort((a, b) => b.level - a.level)
    // 从低级组织开始，遍历每一个组织，并将子组织push到父组织：
    for (let i = 0; i < org_list.length; i++) {
        let current_org = org_list[i];
        let parent_org_index = org_list.findIndex(item => item.orgId === current_org.parentId);
        if (parent_org_index > -1) {
            if(!org_list[parent_org_index].children){
                org_list[parent_org_index].children = []
            }
            org_list[parent_org_index].children.push(current_org)
        }
    }
    const top_org_obj = org_list[org_list.length - 1]

    return [top_org_obj]
}


module.exports = {
    "POST /v1.0/orgs": handle_getOrgs
}




