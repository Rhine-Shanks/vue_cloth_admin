<template>
  <el-dialog
    title="分配角色权限"
    :visible="distributeRoleRightDialogVisible"
    width="50%"
    @open="openDistributeRoleRightDialogVisible"
    @close="closeDistributeRoleRightDialogVisible"
  >
    <el-tree
      :data="rightTreeList"
      :props="treeProps"
      ref="rightTreeRef"
      show-checkbox
      node-key="rightId"
      default-expand-all
      :default-checked-keys="defaultCheckedKeys"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDistributeRoleRightDialogVisible"
        >取 消</el-button
      >
      <el-button type="primary" @click="handleDistributeRoleRight"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { postGetRightList } from "../../../network/rights";
import { postBulkCreateRoleRight } from "../../../network/roles";

export default {
  name: "DistributeRoleRightDialog",
  props: ["distributeRoleRightDialogVisible", "selectColumn"],
  data() {
    return {
      rightList: [],
      rightTreeList: [],
      // 机构树配置
      treeProps: {
        label: "rightDesc",
        children: "children",
      },
      //   默认选中节点
      defaultCheckedKeys: [],
    };
  },
  created() {
    this.getRightTreeList();
  },
  methods: {
    openDistributeRoleRightDialogVisible() {
      this.getRightTreeList();
      this.getLeafKeys(this.selectColumn, this.defaultCheckedKeys);
    },
    // 获取权限列表,按照树形结构的形式返回：
    async getRightTreeList() {
      let res_rightList = await postGetRightList({});
      let res_rightTreeList = await postGetRightList({
        dataType: "tree",
        fieldId: "rightId",
      });
      if (res_rightList.code !== 1) {
        return this.$message.error(
          "获取所有权限列表失败: " + res_rightList.message
        );
      }
      if (res_rightTreeList.code !== 1) {
        return this.$message.error(
          "获取权限树失败: " + res_rightTreeList.message
        );
      }
      this.rightList = res_rightList.data;
      this.rightTreeList = res_rightTreeList.data;
    },
    closeDistributeRoleRightDialogVisible() {
      this.defaultCheckedKeys = [];
      this.$emit("update:distributeRoleRightDialogVisible", false);
    },
    // 通过递归形式获取所有三级权限的ID,并赋值给树结构已选中列表中：
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.rightId);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 处理分配权限
    async handleDistributeRoleRight() {
      // 获取所有选中的权限ID：
      const selected_rightId_arr = [
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedKeys(),
      ];
      const dataContent = this.rightList.map((item) => {
        return {
          orgId: this.selectColumn.orgId,
          roleId: this.selectColumn.roleId,
          rightId: item.rightId,
          isDelete: selected_rightId_arr.includes(item.rightId) ? 0 : 1,
        };
      });
      let res = await postBulkCreateRoleRight({ dataContent });
      if (res.code !== 1) {
        return this.$message.error("分配权限失败：" + res.message);
      }
      this.$message.success("分配权限成功!");
      this.$emit("update:distributeRoleRightDialogVisible", false);
      this.$emit("reloadRoleList");
    },
  },
};
</script>

<style scoped>
</style>