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
            @click="showAddOrgDialog"
            >新增组织</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="operateRights.canEdit"
            type="warning"
            plain
            icon="el-icon-edit"
            :disabled="btnDisable"
            @click="showEditOrgDialog"
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
            @click="handleDeleteOrg"
            >删除</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 机构列表区域 -->
    <el-card>
      <el-table
        height="518"
        :data="childrenOrgList"
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
          :type="item.type"
          :key="item.key"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :sortable="item.sortable"
        ></el-table-column>
      </el-table>
      <span style="font-size: 13px">共 {{ childrenOrgList.length }} 条</span>
    </el-card>

    <!-- 添加组织对话框 -->
    <add-org-dialog
      :data="''"
      :orgList="orgList"
      :orgTreeList="orgTreeList"
      :addOrgDialogVisible.sync="addOrgDialogVisible"
      @reloadOrg="reloadOrg"
    />
    <!-- 编辑组织对话框 -->
    <edit-org-dialog
      :selectColumn="selectColumn"
      :orgTreeList="orgTreeList"
      :childrenOrgList.sync="childrenOrgList"
      :editOrgDialogVisible.sync="editOrgDialogVisible"
      @reloadOrg="reloadOrg"
      @reloadChildrenOrgList="reloadChildrenOrgList"
    />
  </div>
</template>

<script>
import { postDeleteOrg } from "../../../network/orgs";
import AddOrgDialog from "./AddOrgDialog.vue";
import EditOrgDialog from "./EditOrgDialog.vue";

export default {
  name: "OrgTable",
  components: {
    AddOrgDialog,
    EditOrgDialog,
  },
  props: [
    "headers",
    "operateRights",
    "orgList",
    "orgTreeList",
    "childrenOrgList",
  ],
  data() {
    return {
      addOrgDialogVisible: false,
      editOrgDialogVisible: false,
      btnDisable: true,
      selectColumn: "",
    };
  },
  methods: {
    // 显示添加组织对话框：
    showAddOrgDialog() {
      this.addOrgDialogVisible = true;
    },
    // 显示编辑组织对话框：
    showEditOrgDialog() {
      this.editOrgDialogVisible = true;
    },
    // 处理删除组织
    async handleDeleteOrg() {
      let confirm_res = await this.$confirm(
        "此操作将永久删除该组织, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        this.$message.info("取消删除");
      });
      if (confirm_res === "confirm") {
        let res = await postDeleteOrg({
          query: { orgId: this.selectColumn.orgId },
        });
        if (res.code !== 1) {
          return this.$message.error("删除组织失败：" + res.message);
        }
        this.$message.success("删除组织成功！");
        this.reloadOrg();
      }
    },
    // 处理表单选项发生改变的事件
    handleSelectionChange(selectColumnList) {
      if (selectColumnList.length === 1) {
        this.btnDisable = false;
        this.selectColumn = selectColumnList[0];
      } else {
        this.btnDisable = true;
        this.selectColumn = "";
      }
    },
    // 重新加载组织机构树
    reloadOrg() {
      this.$emit("reloadOrg");
    },
    reloadChildrenOrgList(updatedOrg) {
      this.$emit("reloadChildrenOrgList", updatedOrg);
    },
  },
};
</script>

<style scoped>
</style>