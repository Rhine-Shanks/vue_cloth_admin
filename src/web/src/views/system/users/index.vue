<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-bread-crumb :breadList="breadList" />
    <!-- 用户列表区域 -->
    <user-table :headers="headers" :operateRights="operateRights" />
  </div>
</template>

<script>
import MyBreadCrumb from "../../../components/common/MyBreadCrumb.vue";
import UserTable from "./UserTable.vue";

import { common_table_header } from "@/assets/js/config.js";
import { initial_page_operateRights } from "@/assets/js/global.js";

export default {
  name: "user",
  components: {
    MyBreadCrumb,
    UserTable,
  },
  data() {
    return {
      breadList: [
        { name: "首页", path: "/home/welcome" },
        { name: "系统管理", path: "" },
        { name: "用户管理", path: "" },
      ],
      // 操作权限：
      operateRights: {},
      headers: [
        {
          key: 1,
          type: "normal",
          prop: "userId",
          label: "用户ID",
          width: 100,
          fixed: false,
          sortable: true,
        },
        {
          key: 2,
          type: "normal",
          prop: "employeeName",
          label: "用户名称",
          width: 120,
          fixed: false,
          sortable: true,
        },
        {
          key: 3,
          type: "normal",
          prop: "orgName",
          label: "所属部门",
          width: 120,
          fixed: false,
          sortable: true,
        },
        {
          key: 4,
          type: "normal",
          prop: "latestLoginTime",
          label: "最近一次登录时间",
          width: 180,
          fixed: false,
          sortable: true,
        },
        {
          key: 5,
          type: "normal",
          prop: "loginCount",
          label: "登录次数",
          width: 120,
          fixed: false,
          sortable: true,
        },
        {
          key: 6,
          type: "switch",
          prop: "status",
          label: "状态",
          width: 100,
          fixed: false,
          sortable: true,
        },
        {
          key: 11,
          type: "normal",
          prop: "roleName",
          label: "关联角色",
          width: 120,
          fixed: false,
          sortable: false,
        },
        ...common_table_header,
      ],
    };
  },
  created() {
    this.operateRights = initial_page_operateRights();
  },
  methods: {},
};
</script>

<style scoped>
</style>