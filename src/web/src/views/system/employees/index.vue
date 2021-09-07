<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-bread-crumb :breadList="breadList" />
    <!-- 卡片视图区域 -->
    <employee-table :headers="headers" :operateRights="operateRights" />
  </div>
</template>

<script>
import MyBreadCrumb from "../../../components/common/MyBreadCrumb.vue";
import EmployeeTable from "./EmployeeTable.vue";

import { initial_page_operateRights } from "@/assets/js/global.js";
import { common_table_header } from "@/assets/js/config.js";

export default {
  name: "Employees",
  components: {
    MyBreadCrumb,
    EmployeeTable,
  },
  created() {
    this.operateRights = initial_page_operateRights();
  },
  data() {
    return {
      // 面包屑导航配置
      breadList: [
        { name: "首页", path: "/home/welcome" },
        { name: "系统管理", path: "" },
        { name: "员工管理", path: "" },
      ],
      // 操作权限：
      operateRights: {},
      // 员工表表头配置
      headers: [
        {
          key: 1,
          label: "组织名称",
          prop: "orgName",
          width: "150",
          sortable: true,
        },
        {
          key: 2,
          label: "员工编号",
          prop: "employeeId",
          width: "120",
          sortable: true,
        },
        {
          key: 3,
          label: "员工姓名",
          prop: "employeeName",
          width: "120",
          sortable: true,
        },
        { key: 4, label: "手机号码", prop: "telNo", width: "150" },
        { key: 5, label: "邮箱", prop: "email", width: "150" },
        ...common_table_header,
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>