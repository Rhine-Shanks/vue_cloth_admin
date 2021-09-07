<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-bread-crumb :breadList="breadList" />
    <!-- 表格区域和分页 -->
    <right-table :headers="headers" :operateRights="operateRights"/>
  </div>
</template>

<script>
import MyBreadCrumb from "../../../components/common/MyBreadCrumb.vue";
import RightTable from "./RightTable.vue";

import { initial_page_operateRights } from "@/assets/js/global.js";
import { common_table_header } from "@/assets/js/config.js";

export default {
  name: "Rights",
  components: {
    MyBreadCrumb,
    RightTable,
  },
  created() {
    this.operateRights = initial_page_operateRights();
  },
  data() {
    return {
      breadList: [
        { name: "首页", path: "/home/welcome" },
        { name: "系统管理", path: "" },
        { name: "权限管理", path: "" },
      ],
      // 操作权限：
      operateRights: {},
      headers: [
        {
          key: 1,
          type: "normal",
          prop: "orgName",
          label: "所属组织",
          width: 110,
          fixed: false,
          sortable: true,
        },
        {
          key: 2,
          type: "normal",
          prop: "rightId",
          label: "权限编号",
          width: 110,
          fixed: false,
          sortable: true,
        },
        {
          key: 3,
          type: "normal",
          prop: "rightName",
          label: "权限名称",
          width: 180,
          fixed: false,
          sortable: true,
        },
        {
          key: 4,
          type: "normal",
          prop: "rightDesc",
          label: "权限描述",
          width: 180,
          fixed: false,
          sortable: true,
        },
        {
          key: 5,
          type: "normal",
          prop: "parentId",
          label: "父级权限",
          width: 110,
          fixed: false,
          sortable: true,
        },
        {
          key: 6,
          type: "normal",
          prop: "level",
          label: "权限等级",
          width: 110,
          fixed: false,
          sortable: true,
        },
        {
          key: 7,
          type: "normal",
          prop: "order",
          label: "权限顺序",
          width: 110,
          fixed: false,
          sortable: true,
        },
        ...common_table_header
      ],
    };
  },
};
</script>

<style scoped>
</style>