import { postGetMenusAndRights } from '@/network/login'
import { postGetOrgList } from '../../network/orgs';
import { postGetEmployeeList } from '../../network/employees';


// 全局数据初始化 --------------------------------------------------
const initial_window_sessionStorage = async (baseData) => {
    try {
        window.sessionStorage.setItem("tenantId", baseData.tenantId);
        window.sessionStorage.setItem("userId", baseData.userId);
        window.sessionStorage.setItem("orgId", baseData.orgId);
        window.sessionStorage.setItem("token", baseData.token);

        // 获取菜单权限信息
        const menusAndRightsTreeList = await getMenusAndRightsTreeList(baseData);
        window.sessionStorage.setItem('menusAndRightsTreeList', JSON.stringify(menusAndRightsTreeList))

        // 获取组织信息
        const { orgList, orgIdList, orgTreeList } = await getOrgListAndOrgIdlistAndOrgTreeList();
        window.sessionStorage.setItem("orgList", JSON.stringify(orgList));
        window.sessionStorage.setItem("orgIdList", JSON.stringify(orgIdList));
        window.sessionStorage.setItem("orgTreeList", JSON.stringify(orgTreeList));

        // 获取员工信息：
        const employeeList = await getEmployeeList();
        window.sessionStorage.setItem("employeeList", JSON.stringify(employeeList));

        return { code: 1, message: 'success' }
    } catch (error) {
        return { code: -1, message: error.message }
    }
}

const update_window_orgListAndOrgIdlistAndOrgTreeList = async () => {
    const { orgList, orgIdList, orgTreeList } = await getOrgListAndOrgIdlistAndOrgTreeList();
    window.sessionStorage.setItem("orgList", JSON.stringify(orgList));
    window.sessionStorage.setItem("orgIdList", JSON.stringify(orgIdList));
    window.sessionStorage.setItem("orgTreeList", JSON.stringify(orgTreeList));
}

const update_window_employeeList = async () => {
    const employeeList = await getEmployeeList();
    window.sessionStorage.setItem("employeeList", JSON.stringify(employeeList));
}

async function getMenusAndRightsTreeList(baseData) {
    let res = await postGetMenusAndRights({
        query: { userId: baseData.userId },
        dataType: "tree",
        fieldId: "rightId",
    });
    if (res.code !== 1) {
        return this.$message.error("获取菜单权限列表失败：" + res.message);
    }
    return res.data;
}

// 将当前用户包含的组织及其子组织ID保存到缓存中：
async function getOrgListAndOrgIdlistAndOrgTreeList() {
    let res = await postGetOrgList({});
    if (res.code !== 1) {
        return this.$message.error("获取组织列表失败：" + res.message);
    }
    let loginUserOrgId = window.sessionStorage.getItem("orgId");

    let orgList = res.data;
    let orgTreeList = [res.data.find(item => item.orgId === loginUserOrgId)]
    let orgIdList = [loginUserOrgId];
    getChildrenOrgId(loginUserOrgId, orgTreeList[0], res.data, orgIdList);
    return { orgList, orgIdList, orgTreeList }
}

// 递归获取子组织
function getChildrenOrgId(currentOrgId, currentOrgInfo, allOrgList, orgIdList) {
    for (let item of allOrgList) {
        if (item.parentId === currentOrgId) {
            currentOrgInfo.children = currentOrgInfo.children || [];
            currentOrgInfo.children.push(item);
            orgIdList.push(item.orgId);
            getChildrenOrgId(
                item.orgId,
                currentOrgInfo.children[currentOrgInfo.children.length - 1],
                allOrgList,
                orgIdList
            );
        }
    }
}

async function getEmployeeList() {
    let res = await postGetEmployeeList({});
    if (res.code !== 1)
        return this.$message.error("获取员工信息失败：" + res.message);
    return res.data;
}

// 单页面数据和操作权限的初始化 --------------------------------------------------
const initial_page_operateRights = () => {
    let currentPageRights = [];
    let operateRights = {
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canQuery: false,
        canDistributeRole: false,
        canDistributeRight: false,
    }
    const menusAndRightsTreeList = JSON.parse(
        window.sessionStorage.getItem("menusAndRightsTreeList")
    );
    const activeNavPath = window.sessionStorage.getItem("activeNavPath");
    // 定义递归查询的方法：
    function getCurrentPageRights(activeNavPath, menusAndRightsTreeList) {
        for (let item of menusAndRightsTreeList) {
            if (item.path === activeNavPath) {
                currentPageRights = item.children;
            } else if (item.children) {
                getCurrentPageRights(activeNavPath, item.children);
            }
        }
    }
    getCurrentPageRights(activeNavPath, menusAndRightsTreeList);
    currentPageRights.map((item) => {
        if (item.rightName.indexOf("Add") !== -1) {
            operateRights.canAdd = true;
        }
        if (item.rightName.indexOf("Delete") !== -1) {
            operateRights.canDelete = true;
        }
        if (item.rightName.indexOf("Edit") !== -1) {
            operateRights.canEdit = true;
        }
        if (item.rightName.indexOf("Query") !== -1) {
            operateRights.canQuery = true;
        }
        if (item.rightName.indexOf("Distribute") !== -1) {
            operateRights.canDistributeRole = true;
            operateRights.canDistributeRight = true;
        }
    });
    return operateRights
}

export {
    initial_window_sessionStorage,
    update_window_orgListAndOrgIdlistAndOrgTreeList,
    update_window_employeeList,
    initial_page_operateRights,
}