<template>
  <div>
    <!-- 搜索区域 -->
    <el-input placeholder="请输入关键字进行过滤" v-model="filterText" />
    <!-- 树结构区域 -->
    <el-tree
      :data="orgTreeList"
      :props="treeProps"
      node-key="orgId"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handleTreeNodeClick"
      ref="orgTree"
      :filter-node-method="filterOrg"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="node.isCurrent">
          <el-popover
            v-if="data.parentId !== '0' && operateRights.canAdd "
            placement="bottom-start"
            :visible-arrow="false"
            width="100"
            trigger="click"
            style="margin-right: 8px"
          >
            <el-button type="text" @click="showAddOrgDialog(data, 'same')"
              >同级组织</el-button
            >
            <el-button type="text" @click="showAddOrgDialog(data, 'lower')"
              >下级组织</el-button
            >
            <el-button type="text" icon="el-icon-plus" slot="reference" />
          </el-popover>

          <el-button
            v-if="data.parentId !== '0' && operateRights.canDelete"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteOrg(data)"
          />
          <el-button
            v-if="data.parentId !== '0'  && operateRights.canEdit"
            type="text"
            icon="el-icon-edit"
            @click="showEditOrgDialog(data)"
          />
        </span>
      </span>
    </el-tree>
    <!-- 添加组织对话框 -->
    <add-org-dialog
      :data="addDialogData"
      :orgTreeList="orgTreeList"
      :addOrgDialogVisible.sync="addOrgDialogVisible"
      @reloadOrg="reloadOrg"
    />
    <!-- 编辑组织对话框 -->
    <edit-org-dialog
      :selectColumn="editDialogData"
      :orgTreeList="orgTreeList"
      :editOrgDialogVisible.sync="editOrgDialogVisible"
      @reloadOrg="reloadOrg"
    />
  </div>
</template>

<script>
import AddOrgDialog from "./AddOrgDialog.vue";
import EditOrgDialog from "./EditOrgDialog.vue";
import { postDeleteOrg } from "../../../network/orgs";

export default {
  name: "OrgTree",
  components: {
    AddOrgDialog,
    EditOrgDialog,
  },
  props: ['operateRights',"selectedOrgId", "orgTreeList"],
  data() {
    return {
      // 模糊查询内容
      filterText: "",
      // 机构树配置
      treeProps: {
        label: "orgName",
        children: "children",
      },
      // 判断是否打开添加组织对话框
      addOrgDialogVisible: false,
      // 判断是否打开编辑组织对话框
      editOrgDialogVisible: false,
      addDialogData: {
        //   当前选中组织的信息
        currentOrg: "",
        //   待添加组织等级，同级or下级
        addOrgLevel: "",
      },
      //   编辑组织传入数据
      editDialogData: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    },
  },
  methods: {
    // 查询组织
    filterOrg(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    showAddOrgDialog(data, level) {
      this.addDialogData.currentOrg = data;
      this.addDialogData.addOrgLevel = level;
      this.addOrgDialogVisible = true;
    },
    showEditOrgDialog(data) {
      this.editDialogData = data;
      this.editOrgDialogVisible = true;
    },
    async handleDeleteOrg(data) {
      let confirm_res = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
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
        let res = await postDeleteOrg({ query: { orgId: data.orgId } });
        if (res.code !== 1) {
          return this.$message.error("删除组织失败：" + res.message);
        }
        this.$message.success("删除组织成功！");
        this.reloadOrg();
      }
    },
    // 处理当前被点击的节点
    async handleTreeNodeClick(current_org) {
      this.$emit("update:selectedOrgId", current_org.orgId);
    },
    // 重新加载组织机构树
    reloadOrg() {
      this.$emit("reloadOrg");
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>