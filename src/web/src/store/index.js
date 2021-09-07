import Vue from 'vue'
import Vuex from 'vuex'
import { list_2_tree } from '../assets/js/util.js'

import { postGetMenusAndRights } from '../network/login'
import { postGetOrgList } from '../network/orgs';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        tenantId: '',
        userId: '',
        orgId: '',
        orgList: [],
        employeeList: [],
        menusAndRightsTreeList: [],
    },
    getters: {
        orgIdList(state) {
            console.log(state.orgList)
            let result = [state.orgId];
            getChildrenId(state.orgId, state.orgList, result);
            function getChildrenId(currentOrgId, orgList, res) {
                for (item of orgList) {
                    if (item.parentId === currentOrgId) {
                        res.push(item.orgId)
                        getChildrenId(item.orgId, orgList, res)
                    }
                }
            }
            return result;
        },
        orgTreeList(state) {
            return list_2_tree(state.orgList, 'orgId')
        }
    },
    mutations: {
        updateBaseData(state, paload) {
            state.tenantId = paload.tenantId;
            state.orgId = paload.orgId;
            state.userId = paload.userId;
        },
        updateOrgList(state, orgList) {
            state.orgList = orgList;
        },
    },
    actions: {
        async getOrgList(ctx, payload) {
            let res = await postGetOrgList();
            ctx.commit('updateOrgList', res.data )
        }
    }
})

export default store