<template>
  <div>
    <!-- 顶部操作区域 -->
    <el-card>
      <el-row :gutter="20" style="min-width: 1200px">
        <el-col :span="2">
          <el-button
            v-if="operateRights.canAdd"
            type="primary"
            icon="el-icon-plus"
            @click="showAddEmployeeDialog"
            >新增</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="operateRights.canEdit"
            type="warning"
            plain
            icon="el-icon-edit"
            :disabled="btnDisable"
            @click="showEditEmployeeDialog"
            >编辑</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="operateRights.canDelete"
            type="danger"
            plain
            icon="el-icon-delete"
            :disabled="btnDisable"
            @click="handleDeleteEmployee"
            >删除</el-button
          >
        </el-col>
        <el-col :span="8">
          <el-input
            v-if="operateRights.canQuery"
            placeholder="请输入查询条件"
            v-model="fuzzySearchContent"
            clearable
            @clear="clearFuzzySearchContent"
            ><el-button
              type="primary"
              icon="el-icon-search"
              slot="append"
              @click="handleFuzzySearch"
            ></el-button
          ></el-input>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <el-table
        height="500"
        :data="employeeList"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'createTime', order: 'ascending' }"
      >
        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="40" fixed />
        <!-- 选择列 -->
        <el-table-column type="selection" label="#" width="40" fixed />
        <!-- 渲染表格中的每一行 -->
        <el-table-column
          v-for="item in headers"
          :key="item.key"
          :type="item.type"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
        ></el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handlePageNumChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加权限对话框 -->
    <add-employee-dialog
      :addEmployeeDialogVisible.sync="addEmployeeDialogVisible"
      @reloadEmployeeList="getEmployeeList"
    />
    <!-- 编辑权限对话框 -->
    <edit-employee-dialog
      :selectColumn="selectColumn"
      :editEmployeeDialogVisible.sync="editEmployeeDialogVisible"
      @reloadEmployeeList="getEmployeeList"
    />
  </div>
</template>

<script>
import { update_window_employeeList } from "../../../assets/js/global";
import { postGetOrgList } from "../../../network/orgs";
import AddEmployeeDialog from "./AddEmployeeDialog.vue";
import EditEmployeeDialog from "./EditEmployeeDialog.vue";

import {
  postDeleteEmployee,
  postGetEmployeeList,
} from "../../../network/employees";
import { matchSorter } from "match-sorter";

export default {
  name: "EmployeeTable",
  components: {
    AddEmployeeDialog,
    EditEmployeeDialog,
  },
  data() {
    return {
      // 模糊查询输入内容
      fuzzySearchContent: "",
      queryInfo: {
        query: {},
        pageNum: 1,
        pageSize: 10,
      },
      employeeList: [],
      total: 0,
      // 判断操作的按钮是否可用，默认不可用：
      btnDisable: true,
      // 当前选中行：
      selectColumn: "",
      addEmployeeDialogVisible: false,
      editEmployeeDialogVisible: false,
      // 组织机构树，用于新增或编辑对话框的级联选择器：
      orgTreeList: [],
    };
  },
  props: ["headers", "operateRights"],
  created() {
    this.getEmployeeList();
  },
  methods: {
    // 模糊查询
    handleFuzzySearch() {
      if (this.fuzzySearchContent) {
        let res = matchSorter(
          this.employeeList,
          this.fuzzySearchContent.trim(),
          {
            keys: ["employeeId", "employeeName"],
          }
        );
        this.employeeList = res;
      } else {
        return this.$message.warning("请输入查询条件");
      }
    },
    // 去掉模糊查询条件：
    clearFuzzySearchContent() {
      this.getEmployeeList();
    },
    // 获取员工列表
    async getEmployeeList() {
      let res = await postGetEmployeeList(this.queryInfo);
      if (res.code !== 1) {
        return this.$message.error("获取员工列表失败：" + res.message);
      }
      // 同时更新缓存中的员工信息：
      await update_window_employeeList();
      this.employeeList = res.data.data;
      this.total = res.data.total;
    },
    // 显示添加员工对话框：
    showAddEmployeeDialog() {
      this.addEmployeeDialogVisible = true;
    },
    showEditEmployeeDialog() {
      this.editEmployeeDialogVisible = true;
    },
    async handleDeleteEmployee() {
      if (this.selectColumn.employeeId === "em001") {
        return this.$message.warn("管理员员工，不能删除");
      }
      const confirm_res = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      if (confirm_res === "confirm") {
        let res = await postDeleteEmployee({
          query: { employeeId: this.selectColumn.employeeId },
        });
        if (res.code !== 1) {
          return this.$message.error("删除员工失败：" + res.message);
        }
        this.$message.success("删除权限成功");
        this.getEmployeeList();
      }
    },
    // 监听页面显示条数的变化
    handlePageSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getEmployeeList();
    },
    handlePageNumChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getEmployeeList();
    },
    // 监听列表选项的改变：
    handleSelectionChange(selectColumnList) {
      if (selectColumnList.length === 1) {
        this.btnDisable = false;
        this.selectColumn = selectColumnList[0];
      } else {
        this.btnDisable = true;
        this.selectColumn = "";
      }
    },
  },
};
</script>

<style scoped>
</style>