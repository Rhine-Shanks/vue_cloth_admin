<template>
  <div>
    <el-card>
      <el-row :gutter="20" style="min-width: 1200px">
        <el-col :span="2.5">
          <el-button
            v-if="operateRights.canAdd"
            type="primary"
            icon="el-icon-plus"
            @click="showAddUserDialog"
            >新增用户</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="operateRights.canEdit"
            type="warning"
            plain
            icon="el-icon-edit"
            :disabled="btnDisable"
            @click="showEditUserDialog"
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
            @click="handleDeleteUser"
            >删除</el-button
          > </el-col
        ><el-col :span="2.5">
          <el-button
            v-if="operateRights.canDistributeRole"
            type="success"
            plain
            icon="el-icon-setting"
            :disabled="btnDisable"
            @click="showDistributeUserRoleDialog"
            >分配角色</el-button
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
    <!-- 用户列表区域 -->
    <el-card>
      <el-table
        height="500"
        :data="userList"
        style="width: 100%"
        border
        stripe
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
        >
          <template slot-scope="scope">
            <div v-if="item.type === 'switch'">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="userStatusChange(scope.row)"
              />
            </div>
            <div v-else>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
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

    <!-- 添加用户对话框 -->
    <add-user-dialog
      :addUserDialogVisible.sync="addUserDialogVisible"
      @reloadUserList="getUserList"
    />
    <!-- 编辑用户对话框 -->
    <edit-user-dialog
      :editUserDialogVisible.sync="editUserDialogVisible"
      :userInfo="selectColumn"
      @reloadUserList="getUserList"
    />
    <!-- 分配角色对话框 -->
    <distribute-user-role-dialog
      :distributeUserRoleDialogVisible.sync="distributeUserRoleDialogVisible"
      :userInfo="selectColumn"
      @reloadUserList="getUserList"
    />
  </div>
</template>

<script>
import AddUserDialog from "./AddUserDialog.vue";
import EditUserDialog from "./EditUserDialog.vue";
import DistributeUserRoleDialog from "./DistributeUserRoleDialog.vue";

import {
  postGetUserList,
  postUpdateUser,
  postDeleteUser,
} from "../../../network/users";
import { postGetOrgList } from "../../../network/orgs";
import { matchSorter } from "match-sorter";

export default {
  name: "UserTable",
  components: {
    AddUserDialog,
    EditUserDialog,
    DistributeUserRoleDialog,
  },
  props: ["headers", "operateRights"],
  created() {
    this.getUserList();
    this.getOrgTreeList();
  },
  data() {
    return {
      // 操作按钮是否可用
      btnDisable: true,
      // 选择的列数据
      selectColumn: [],
      // 模糊查询输入的内容
      fuzzySearchContent: "",
      queryInfo: {
        query: {
          orgId: JSON.parse(window.sessionStorage.getItem("orgIdList")),
        },
        pageNum: 1,
        pageSize: 10,
      },
      userList: [],
      total: 0,
      employeeList: [],
      orgTreeList: [],
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      distributeUserRoleDialogVisible: false,
    };
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      let res = await postGetUserList(this.queryInfo);
      if (res.code !== 1) {
        return this.$message.error("获取用户列表失败：" + res.message);
      }
      this.userList = res.data.data;
      this.total = res.data.total;
    },
    // 处理模糊查询
    handleFuzzySearch() {
      if (this.fuzzySearchContent) {
        let res = matchSorter(this.userList, this.fuzzySearchContent.trim(), {
          keys: ["userId", "employeeName", "orgName"],
        });
        this.userList = res;
      } else {
        this.$message({
          type: "warning",
          message: "请输入查询内容",
        });
      }
    },
    // 清空查询内容：
    clearFuzzySearchContent() {
      this.getUserList();
    },
    // 获取组织结构树：
    async getOrgTreeList() {
      let res = await postGetOrgList({ dataType: "tree", fieldId: "orgId" });
      if (res.code !== 1) {
        return this.$message.error("获取组织结构失败：" + res.message);
      }
      this.orgTreeList = res.data;
    },
    // 监听用户状态的改变
    async userStatusChange(userInfo) {
      const res = await postUpdateUser({
        query: { orgId: userInfo.orgId, userId: userInfo.userId },
        dataContent: { status: userInfo.status },
      });
      if (res.code !== 1) {
        userInfo.status = userInfo.status === 1 ? 0 : 1;
        return this.$message.error("更新用户状态失败：" + res.message);
      }
      this.$message.success("更新用户状态成功");
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
    // 处理删除用户操作
    async handleDeleteUser() {
      // 管理员用户不能删除：
      if (this.selectColumn.userId === "admin") {
        return this.$message.warning("管理员用户不能删除");
      }
      // 删除提示框
      const confirm_res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
        const res = await postDeleteUser({
          query: { userId: this.selectColumn.userId },
        });
        if (res.code !== 1) {
          userInfo.status = userInfo.status === 1 ? 0 : 1;
          return this.$message.error("删除用户失败：" + res.message);
        }
        this.getUserList();
        this.$message.success("删除用户成功");
      }
    },
    // 监听分页大小改变的事件
    async handlePageSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getUserList();
    },
    // 监听当前页面数改变的事件
    async handlePageNumChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getUserList();
    },
    showAddUserDialog() {
      this.addUserDialogVisible = true;
    },
    showEditUserDialog() {
      this.editUserDialogVisible = true;
    },
    showDistributeUserRoleDialog() {
      this.distributeUserRoleDialogVisible = true;
    },
  },
};
</script>

<style scoped>
</style>