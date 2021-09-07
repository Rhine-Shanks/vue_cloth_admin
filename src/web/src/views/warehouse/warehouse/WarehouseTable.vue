<template>
  <div>
    <!-- 操作控件区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 新增库房 -->
        <el-col :span="2.5">
          <el-button
            v-if="operateRights.canAdd"
            type="primary"
            icon="el-icon-plus"
            @click="showAddWarehouseDialog"
            >新增库房</el-button
          >
        </el-col>
        <!-- 编辑库房 -->
        <el-col :span="2.5">
          <el-button
            v-if="operateRights.canEdit"
            plain
            type="warning"
            icon="el-icon-edit"
            :disabled="btnDisabled"
            @click="showEditWarehouseDialog"
            >编辑</el-button
          >
        </el-col>
        <!-- 删除库房 -->
        <el-col :span="2.5">
          <el-button
            v-if="operateRights.canDelete"
            plain
            type="danger"
            icon="el-icon-delete"
            :disabled="btnDisabled"
            @click="handleDeleteWarehouse"
            >删除</el-button
          >
        </el-col>
        <!-- 批量导入库房 -->
        <el-col :span="2.5">
          <el-dropdown
            v-if="operateRights.canAdd"
            @command="handleDropDownCommand"
          >
            <el-button type="primary">
              批量新增<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="downLoadTemplate">
                导出模板
              </el-dropdown-item>
              <el-dropdown-item command="uploadFile">批量新增</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <!-- 批量导出库房信息： -->
        <el-col :span="2.5">
          <el-tooltip effect="dark" content="批量导出" placement="top">
            <el-button
              type="primary"
              plain
              icon="el-icon-download"
              circle
              @click="handleBulkDownloadWarehouse"
            ></el-button>
          </el-tooltip>
        </el-col>
        <!-- 模糊查询库房 -->
        <el-col :span="8">
          <el-input
            v-if="operateRights.canQuery"
            placeholder="请输入查询条件"
            v-model="fuzzyContent"
            clearable
            @clear="clearFuzzySearchContent"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleFuzzySearch"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <!-- 表格数据区域 -->
    <el-card>
      <el-table
        height="500"
        style="width: 100%"
        stripe
        border
        :data="warehouseList"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'createTime', order: 'ascending' }"
      >
        <!-- 筛选列 -->
        <el-table-column type="selection" label="#" />
        <!-- 索引列 -->
        <el-table-column type="index" label="#" />
        <!-- 数据列 -->
        <el-table-column
          v-for="item in headers"
          :key="item.key"
          :type="item.type"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :width="item.width"
        >
          <template slot-scope="scope">
            <div v-if="item.type === 'tag'">
              <el-tag
                :type="scope.row[item.prop] === '主馆' ? '' : 'success'"
                >{{ scope.row[item.prop] }}</el-tag
              >
            </div>
            <div v-else>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 20, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 新增库房对话框 -->
    <add-warehouse-dialog
      :addWarehouseDialogVisible.sync="addWarehouseDialogVisible"
      @reloadWarehouseList="getWarehouseList"
    />
    <!-- 编辑库房对话框 -->
    <edit-warehouse-dialog
      :editWarehouseDialogVisible.sync="editWarehouseDialogVisible"
      :selectColumn="selectColumn"
      @reloadWarehouseList="getWarehouseList"
    />
    <!-- 上传文件对话框 -->
    <upload-file-dialog
      :importFieldsConfig="importFieldsConfig"
      :uploadFileDialogVisible.sync="uploadFileDialogVisible"
      @reloadWarehouseList="getWarehouseList"
    />
  </div>
</template>

<script>
import AddWarehouseDialog from "./AddWarehouseDialog.vue";
import EditWarehouseDialog from "./EditWarehouseDialog.vue";
import UploadFileDialog from "./UploadFileDialog.vue";
import {
  postGetWarehouseList,
  postDeleteWarehouse,
} from "@/network/warehouses.js";

import { matchSorter } from "match-sorter";
import dayjs from 'dayjs';
import { exportJsonToExcel } from "@/assets/js/util.js";

export default {
  name: "WarehouseTable",
  components: {
    AddWarehouseDialog,
    EditWarehouseDialog,
    UploadFileDialog,
  },
  props: ["headers", "operateRights", "importFieldsConfig"],
  data() {
    return {
      fuzzyContent: "",
      warehouseList: [],
      total: 0,
      queryInfo: {
        query: {
          orgId: JSON.parse(window.sessionStorage.getItem("orgIdList")),
        },
        pageNum: 1,
        pageSize: 10,
      },
      btnDisabled: true,
      // 选中项
      selectColumn: "",
      // 选中的多项
      selectColumnList: [],
      addWarehouseDialogVisible: false,
      editWarehouseDialogVisible: false,
      uploadFileDialogVisible: false,
      // 导出模板内容：
      downloadTemplateData: [],
    };
  },
  created() {
    this.getWarehouseList();
  },
  methods: {
    async getWarehouseList() {
      let res = await postGetWarehouseList(this.queryInfo);
      if (res.code !== 1) {
        return this.$message.error("获取库房列表失败：" + res.message);
      }
      //  this.$message.success("获取库房列表成功.");
      this.warehouseList = res.data.data;
      this.total = res.data.total;
    },
    showAddWarehouseDialog() {
      this.addWarehouseDialogVisible = true;
    },
    showEditWarehouseDialog() {
      this.editWarehouseDialogVisible = true;
    },
    handleDropDownCommand(command) {
      if (command === "downLoadTemplate") {
        let res = exportJsonToExcel(
          this.downloadTemplateData,
          this.importFieldsConfig.map((item) => item.field),
          "库房数据导入模板"
        );
        if (res.code !== 1) {
          return this.$message.error(res.message);
        }
        return this.$message.success("模板导出成功！");
      }
      if (command === "uploadFile") {
        this.uploadFileDialogVisible = true;
      }
    },
    async handleDeleteWarehouse() {
      // 删除提示框
      const confirm_res = await this.$confirm(
        "此操作将永久删除该库房, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        this.$message.info("已取消删除");
      });
      // 如果确认删除
      if (confirm_res === "confirm") {
        const res = await postDeleteWarehouse({
          query: { warehouseId: this.selectColumn.warehouseId },
        });
        if (res.code !== 1) {
          return this.$message.error("删除库房失败：" + res.message);
        }
        this.$message.success("删除库房成功");
        this.getWarehouseList();
      }
    },
    handleFuzzySearch() {
      if (this.fuzzyContent) {
        let res = matchSorter(this.warehouseList, this.fuzzyContent.trim(), {
          keys: ["warehouseId", "warehouseName"],
        });
        this.warehouseList = res;
        this.total = res.length;
      } else {
        this.$message.warning("查询条件不能为空");
      }
    },
    clearFuzzySearchContent() {
      this.getWarehouseList();
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
    },
    handleCurrentChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
    },
    handleSelectionChange(selectColumnList) {
      this.selectColumnList = selectColumnList;
      if (selectColumnList.length === 1) {
        this.selectColumn = selectColumnList[0];
        this.btnDisabled = false;
      } else {
        this.btnDisabled = true;
        this.selectColumn = "";
      }
    },
    handleFileChange(file) {
      console.log("this.fileList", this.fileList);
      console.log(file);
    },
    // 处理批量导出库房信息
    handleBulkDownloadWarehouse() {
      if (this.selectColumnList.length < 1) {
        return this.$message.warning("请选择要导出的库房");
      }
      let res = exportJsonToExcel(
        this.selectColumnList,
        this.importFieldsConfig.map((item) => item.field),
        "库房数据" + dayjs().format('YYYY-MM-DD HH:mm:ss')
      );
      if (res.code !== 1) {
        return this.$message.error(res.message);
      }
      return this.$message.success("库房数据导出成功！");
    },
  },
};
</script>

<style scoped>
</style>