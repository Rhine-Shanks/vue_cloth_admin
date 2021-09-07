<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-bread-crumb :breadList="breadList" />
    <!-- 表格及其控件区域 -->
    <warehouse-table
      :headers="headers"
      :operateRights="operateRights"
      :importFieldsConfig="importFieldsConfig"
    />
  </div>
</template>

<script>
import MyBreadCrumb from "@/components/common/MyBreadCrumb.vue";
import WarehouseTable from "./WarehouseTable.vue";

import { initial_page_operateRights } from "@/assets/js/global.js";
import { common_table_header } from "@/assets/js/config.js";

export default {
  name: "index",
  components: {
    MyBreadCrumb,
    WarehouseTable,
  },
  data() {
    return {
      // 面包屑导航配置
      breadList: [
        { name: "首页", path: "/home/welcome" },
        { name: "库房管理", path: "" },
        { name: "库房信息", path: "" },
      ],
      currentPageRights: [],
      // 操作权限：
      operateRights: {
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canQuery: false,
      },
      //  表头字段配置：
      headers: [
        {
          key: 1,
          type: "normal",
          prop: "orgName",
          label: "所属组织",
          width: 120,
          fixed: false,
          sortable: false,
        },
        {
          key: 2,
          type: "normal",
          prop: "warehouseId",
          label: "库房编号",
          width: 120,
          fixed: false,
          sortable: true,
        },
        {
          key: 3,
          type: "normal",
          prop: "warehouseName",
          label: "库房名称",
          width: 120,
          fixed: false,
          sortable: true,
        },
        {
          key: 4,
          type: "tag",
          prop: "warehouseType",
          label: "库房类型",
          width: 120,
          fixed: false,
          sortable: true,
        },
        {
          key: 5,
          type: "normal",
          prop: "ip",
          label: "主机IP",
          width: 120,
          fixed: false,
          sortable: true,
        },
        {
          key: 6,
          type: "normal",
          prop: "port",
          label: "主机端口",
          width: 120,
          fixed: false,
          sortable: true,
        },
        ...common_table_header,
      ],
      // 导入模板字段配置：
      importFieldsConfig: [
        { field: "orgId", required: true, dataType: "string" },
        { field: "warehouseId", required: true, dataType: "string" },
        { field: "warehouseName", required: true, dataType: "string" },
        { field: "warehouseType", required: true, dataType: "string" },
        { field: "ip", required: false, dataType: "string" },
        { field: "port", required: false, dataType: "string" },
        { field: "remarks", required: false, dataType: "string" },
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