<template>
  <div>
    <!-- 搜索和添加区域： -->
    <el-card>
      <el-row :gutter="20" style="min-width: 1200px">
        <el-col :span="2.5">
          <el-button
            v-if="operateRights.canAdd"
            type="primary"
            icon="el-icon-plus"
            @click="showAddRightDialog"
            >新增权限</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="operateRights.canEdit"
            type="warning"
            plain
            icon="el-icon-edit"
            :disabled="btnDisable"
            @click="showEditRightDialog"
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
            @click="handleDeleteRight"
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
        :data="rightList"
        style="width: 100%"
        stripe
        border
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
        />
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handlePageNumChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </el-card>

    <!-- 添加权限对话框 -->
    <add-right-dialog
      :addRightDialogVisible.sync="addRightDialogVisible"
      @reloadRightList="getRightList"
    />
    <!-- 编辑权限对话框 -->
    <edit-right-dialog
      :selectColumn="selectColumn"
      :editRightDialogVisible.sync="editRightDialogVisible"
      @reloadRightList="getRightList"
    />
  </div>
</template>

<script>
import AddRightDialog from "./AddRightDialog.vue";
import EditRightDialog from "./EditRightDialog.vue";
import { matchSorter } from "match-sorter";

import { postGetRightList, postDeleteRight } from "../../../network/rights";

export default {
  name: "RightTable",
  props: ["headers", "operateRights"],
  data() {
    return {
      rightList: [],
      // 模糊查询输入的内容
      fuzzySearchContent: "",
      // 查询权限列表的参数
      queryInfo: {
        query: {},
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      btnDisable: true,
      // 当前选中的权限
      selectColumn: {},
      // 添加权限对话框显示与隐藏：
      addRightDialogVisible: false,
      editRightDialogVisible: false,
    };
  },
  components: {
    AddRightDialog,
    EditRightDialog,
  },
  created() {
    this.getRightList();
  },
  methods: {
    // 获取权限列表
    async getRightList() {
      let res = await postGetRightList(this.queryInfo);
      if (res.code != 1) {
        return this.$message.error("获取权限列表失败: " + res.message);
      }
      this.rightList = res.data.data;
      this.total = res.data.total;
    },
    // 处理模糊查询
    handleFuzzySearch() {
      if (this.fuzzySearchContent) {
        let res = matchSorter(this.rightList, this.fuzzySearchContent.trim(), {
          keys: ["rightName", "rightDesc", "orgName"],
        });
        this.rightList = res;
        this.total = res.length;
      } else {
        this.$message({
          type: "warning",
          message: "请输入查询内容",
        });
      }
    },
    // 清空查询内容：
    clearFuzzySearchContent() {
      this.getRightList();
    },
    // 监听点击添加权限对话框
    showAddRightDialog() {
      this.addRightDialogVisible = true;
    },
    // 监听页面显示条数的变化
    handlePageSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getRightList();
    },
    handlePageNumChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getRightList();
    },
    handleSelectionChange(selectColumnList) {
      if (selectColumnList.length === 1) {
        this.btnDisable = false;
        this.selectColumn = selectColumnList[0];
      } else {
        this.btnDisable = true;
        this.selectColumn = "";
      }
    },
    // 展示编辑权限对话框：
    showEditRightDialog(rightInfo) {
      this.editRightInfo = rightInfo;
      this.editRightDialogVisible = true;
    },
    // 处理删除权限
    async handleDeleteRight() {
      if (parseInt(this.selectColumn.rightId) <= 76) {
        return this.$message.warning("基础权限不能删除");
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
        let res = await postDeleteRight({
          query: { rightId: this.selectColumn.rightId },
        });
        if (res.code !== 1) {
          return this.$message.error("删除权限失败：" + res.message);
        }
        this.$message.success("删除权限成功");
        this.getRightList();
      }
    },
  },
};
</script>

<style scoped>
</style>