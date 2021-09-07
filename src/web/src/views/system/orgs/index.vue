<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-bread-crumb :breadList="breadList" />
    <!-- 卡片视图区域 -->
    <el-row :gutter="12">
      <el-col :span="6">
        <!-- 机构树卡片 -->
        <el-card style="height: 682px">
          <org-tree
            :operateRights="operateRights"
            :orgTreeList="orgTreeList"
            :selectedOrgId.sync="selectedOrgId"
            @reloadOrg="reloadOrg"
          />
        </el-card>
      </el-col>
      <el-col :span="18">
        <!-- 机构列表展示区域 -->
        <org-table
          :operateRights="operateRights"
          :orgList="orgList"
          :orgTreeList="orgTreeList"
          :selectedOrgId.sync="selectedOrgId"
          :childrenOrgList="childrenOrgList"
          :headers="headers"
          @reloadOrg="reloadOrg"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyBreadCrumb from "../../../components/common/MyBreadCrumb.vue";
import OrgTable from "./OrgTable.vue";
import OrgTree from "./OrgTree.vue";

import {
  initial_page_operateRights,
  update_window_orgListAndOrgIdlistAndOrgTreeList,
} from "@/assets/js/global.js";
import { common_table_header } from "@/assets/js/config.js";

export default {
  name: "Orgs",
  components: {
    MyBreadCrumb,
    OrgTable,
    OrgTree,
  },
  created() {
    // 初始化页面权限：
    this.operateRights = initial_page_operateRights();
  },
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      orgList: JSON.parse(window.sessionStorage.getItem("orgList")),
      // 面包屑导航配置
      breadList: [
        { name: "首页", path: "/home/welcome" },
        { name: "系统管理", path: "" },
        { name: "组织管理", path: "" },
      ],
      // 操作权限：
      operateRights: {},
      // 子组织表表头配置
      headers: [
        {
          key: 1,
          label: "组织编号",
          prop: "orgId",
          width: "120",
          sortable: true,
        },
        {
          key: 2,
          label: "组织名称",
          prop: "orgName",
          width: "120",
          sortable: true,
        },
        {
          key: 3,
          label: "父级组织编号",
          prop: "parentId",
          width: "150",
          sortable: true,
        },
        { key: 4, label: "等级", prop: "level", width: "80" },
        ...common_table_header,
      ],
      // 机构树中，当前被选中的组织：
      selectedOrgId: "1",
      // 当前机构树选中的组织的子组织列表
      childrenOrgList: [],
    };
  },
  watch: {
    selectedOrgId(newOrgId, oldOrgId) {
      this.childrenOrgList = this.orgList.filter(
        (item) => item.parentId === newOrgId
      );
    },
  },
  methods: {
    async reloadOrg() {
      // 更新缓存中的组织表数据
      await update_window_orgListAndOrgIdlistAndOrgTreeList();
      this.orgTreeList = JSON.parse(
        window.sessionStorage.getItem("orgTreeList")
      );
      this.orgList = JSON.parse(window.sessionStorage.getItem("orgList"));
      this.childrenOrgList = this.orgList.filter(
        (item) => item.parentId === this.selectedOrgId
      );
    },
  },
};
</script>

<style scoped>
</style>