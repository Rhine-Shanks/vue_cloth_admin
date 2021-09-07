<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread-crumb :breadList="breadList" />
    <!-- 角色列表区域 -->
    <role-table :headers="headers" :operateRights="operateRights" />
  </div>
</template>

<script>
import MyBreadCrumb from "../../../components/common/MyBreadCrumb.vue";
import RoleTable from "./RoleTable.vue";

import { initial_page_operateRights } from "@/assets/js/global.js";
import { common_table_header } from "@/assets/js/config.js";

export default {
  name: "Roles",
  components: {
    MyBreadCrumb,
    RoleTable,
  },
  data() {
    return {
      breadList: [
        { name: "首页", path: "/home/welcome" },
        { name: "系统管理", path: "" },
        { name: "角色管理", path: "" },
      ],
      // 操作权限：
      operateRights: {},
      headers: [
        {
          type: "",
          key: 3,
          prop: "orgName",
          label: "所属组织",
          width: 120,
          fixed: true,
          sortable: true,
        },
        {
          type: "",
          key: 4,
          prop: "roleId",
          label: "角色编号",
          width: 120,
          fixed: true,
          sortable: true,
        },
        {
          type: "",
          key: 5,
          prop: "roleName",
          label: "角色名称",
          width: 120,
          fixed: true,
          sortable: true,
        },
        ...common_table_header,
      ],
    };
  },
  created() {
    this.operateRights = initial_page_operateRights();
  },
};
</script>

<style scoped>
</style>