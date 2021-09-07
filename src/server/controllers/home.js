const dbOperate = require('../services/mysql/dbOperate')

const handle_getMenus = async (ctx, next) => {
    try {
        // console.log("ctx.request.body", ctx.request.body)
        // 获取返回数据模板：
        const menus = await get_user_menus(ctx.request.body.query);
        // console.log(menus)
        ctx.response.body = { code: 1, message: "success", data: menus };
    } catch (error) {
        // console.log(error)
        ctx.response.body = { code: -111, message: "获取导航菜单失败：" + error.message }
    }
    await next()
}

// 获取并重新整合菜单列表
async function get_user_menus(query) {
    const right_list = await dbOperate.findAll('v_user_right', query)

    let menu_1_arr = right_list.filter(each => each.level === "1").map(each => { each.children = []; return each }).sort((a, b) => a.order - b.order)
    let menu_2_arr = right_list.filter(each => each.level === "2").map(each => { each.children = []; return each }).sort((a, b) => a.order - b.order)
    let menu_3_arr = right_list.filter(each => each.level === "3").map(each => { each.children = []; return each }).sort((a, b) => a.order - b.order)
    // console.log(menu_1_arr)
    // 先把三级权限赋给二级权限
    children_push_father(menu_2_arr, menu_3_arr)
    // 再把二级权限赋给一级权限
    children_push_father(menu_1_arr, menu_2_arr)
    // 最后返回一级权限即可
    return menu_1_arr
}

// 将子权限赋值给父权限
function children_push_father(father_arr, children_arr) {
    for (let i = 0; i < children_arr.length; i++) {
        let children = children_arr[i];
        for (let j = 0; j < father_arr.length; j++) {
            let father = father_arr[j];
            if (children.parentId === father.rightId) {
                father.children.push(children)
            }
        }
    }
}

module.exports = {
    "POST /v1.0/home/menus": handle_getMenus
}

// test()
// async function test(){
//     let res = await get_user_menus({tenantId:'test', userId:'admin'})
//     console.log(res)
// }
// get_user_menus('test', 'admin')