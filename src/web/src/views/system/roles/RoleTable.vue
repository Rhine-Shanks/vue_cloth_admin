<template>
  <div>
    <!-- 顶部操作区域 -->
    <el-card>
      <el-row :gutter="20" style="min-width: 1200px">
        <el-col :span="2.5">
          <el-button
            v-if="operateRights.canAdd"
            type="primary"
            icon="el-icon-plus"
            @click="showAddRoleDialog"
            >新增角色</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="operateRights.canEdit"
            type="warning"
            plain
            icon="el-icon-edit"
            :disabled="btnDisable"
            @click="showEditRoleDialog"
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
            @click="handleDeleteRole"
            >删除</el-button
          > </el-col
        ><el-col :span="2.5">
          <el-button
            v-if="operateRights.canDistributeRight"
            type="success"
            plain
            icon="el-icon-setting"
            :disabled="btnDisable"
            @click="showDistributeRoleRightDialogVisible"
            >分配权限</el-button
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

    <el-card>
      <!-- 角色列表区域 -->
      <el-table
        height="500"
        :data="roleList"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'createTime', order: 'ascending' }"
      >
        <!-- 展开行 -->
        <el-table-column :key="0" type="expand" width="40" fixed>
          <template slot-scope="scope">
            <el-row
              :class="['bd-bottom', i1 === 0 ? 'bd-top' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.rightId"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  :closable="isTagClosable"
                  @close="deleteRoleRightByRightId(item1)"
                >
                  {{ item1.rightDesc }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bd-top', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.rightId"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      :closable="isTagClosable"
                      @close="deleteRoleRightByRightId(item2)"
                      >{{ item2.rightDesc }}</el-tag
                    ><i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18"
                    ><el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.rightId"
                      :closable="isTagClosable"
                      @close="deleteRoleRightByRightId(item3)"
                      >{{ item3.rightDesc }}</el-tag
                    ></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
        </el-table-column>
      </el-table>
      <!-- 分页显示区域 -->
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

    <!-- 添加角色对话框 -->
    <add-role-dialog
      :addRoleDialogVisible.sync="addRoleDialogVisible"
      @reloadRoleList="getRoleList"
    />

    <!-- 编辑角色对话框 -->
    <edit-role-dialog
      :selectColumn="selectColumn"
      :editRoleDialogVisible.sync="editRoleDialogVisible"
      @reloadRoleList="getRoleList"
    />
    <!-- 分配权限对话框 -->
    <distribute-role-right-dialog
      :selectColumn="selectColumn"
      :distributeRoleRightDialogVisible.sync="distributeRoleRightDialogVisible"
      @reloadRoleList="getRoleList"
    />
  </div>
</template>

<script>
import AddRoleDialog from "./AddRoleDialog";
import EditRoleDialog from "./EditRoleDialog";
import DistributeRoleRightDialog from "./DistributeRoleRightDialog";

import {
  postGetRoleList,
  postDeleteRole,
  postBulkCreateRoleRight,
} from "../../../network/roles.js";
import { matchSorter } from "match-sorter";

export default {
  name: "RoleTable",
  components: {
    AddRoleDialog,
    EditRoleDialog,
    DistributeRoleRightDialog,
  },
  props: ["headers", "operateRights"],
  created() {
    this.getRoleList();
    // 判断是否有删除权限;
    this.isTagClosable = this.operateRights.canDelete;
  },
  data() {
    return {
      roleList: [],
      total: 0,
      queryInfo: {
        query: {},
        pageNum: 1,
        pageSize: 10,
      },
      fuzzySearchContent: "",
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      distributeRoleRightDialogVisible: false,
      // 删除或编辑按钮是否无效：
      btnDisable: true,
      // 当前选中行
      selectColumn: "",
      // 展开行的标签是否带有删除标志：
      isTagClosable: false,
    };
  },
  methods: {
    async getRoleList() {
      let res = await postGetRoleList(this.queryInfo);
      if (res.code !== 1) {
        return this.$message.error("获取角色列表失败：" + res.message);
      }
      this.roleList = res.data.data;
      this.total = res.data.total;
    },
    clearFuzzySearchContent() {
      this.getRoleList();
    },
    handleFuzzySearch() {
      if (this.fuzzySearchContent) {
        let res = matchSorter(this.roleList, this.fuzzySearchContent.trim(), {
          keys: ["roleName", "orgName"],
        });
        this.roleList = res;
        this.total = res.length;
      } else {
        this.$message({
          type: "warning",
          message: "请输入查询内容",
        });
      }
    },
    // 监听页面显示条数的变化
    handlePageSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getRoleList();
    },
    handlePageNumChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getRoleList();
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
    async handleDeleteRole() {
      if (this.selectColumn.roleId === "1") {
        return this.$message.warning("管理员角色不能删除");
      }
      const confirm_res = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message.info("已取消删除");
      });
      if (confirm_res === "confirm") {
        let res = await postDeleteRole({
          query: { roleId: this.selectColumn.roleId },
        });
        if (res.code !== 1) {
          return this.$message.error("删除角色失败：" + res.message);
        }
        this.$message.success("删除角色成功");
        this.getRoleList();
      }
    },
    showAddRoleDialog() {
      this.addRoleDialogVisible = true;
    },
    showEditRoleDialog() {
      if (this.selectColumn.roleId === "1") {
        return this.$message.warning("管理员角色不能编辑");
      }
      this.editRoleDialogVisible = true;
    },
    showDistributeRoleRightDialogVisible() {
      this.distributeRoleRightDialogVisible = true;
    },
    // 根据权限ID删除权限：
    async deleteRoleRightByRightId(rightItem) {
      if (rightItem.roleId === "1") {
        return this.$message.warning("系统管理员的权限不能删除");
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
        this.$message.info("已取消删除");
      });

      if (confirm_res === "confirm") {
        // 获取待删除的权限数组：
        let deleteRightIdArr = [];
        this.getRightIdAndItsAllLowerRightId(rightItem, deleteRightIdArr);
        // 进行权限软删除，即把 isDelete 更新为 1
        let dataContent = deleteRightIdArr.map((item) => {
          return {
            orgId: rightItem.orgId,
            roleId: rightItem.roleId,
            rightId: item,
            isDelete: 1,
          };
        });
        let res = await postBulkCreateRoleRight({ dataContent });
        if (res.code !== 1) {
          return this.$message.error("删除角色的权限失败：" + res.message);
        }
        this.$message.success("删除角色的权限成功");
        this.getRoleList();
      }
    },
    // 通过递归形式获取所有下级权限的权限ID,返回当前权限及下级权限的数组 arr：
    getRightIdAndItsAllLowerRightId(node, arr) {
      if (!node.children) {
        return arr.push(node.rightId);
      }
      arr.push(node.rightId);
      node.children.forEach((item) => {
        this.getRightIdAndItsAllLowerRightId(item, arr);
      });
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.bd-top {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>