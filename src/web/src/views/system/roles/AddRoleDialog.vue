<template>
  <el-dialog
    title="添加角色"
    :visible="addRoleDialogVisible"
    width="50%"
    @open="openAddRoleDialog"
    @close="addRoleDialogClose"
  >
    <el-form
      :model="addRoleForm"
      :rules="addRoleFormRules"
      ref="addRoleFormRef"
      label-width="100px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="addRoleForm.orgId"
          :options="orgTreeList"
          :props="orgCascaderProps"
          @change="selectedOrgChange"
          clearable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="权限编号" prop="roleId">
        <el-input v-model="addRoleForm.roleId"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addRoleForm.roleName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addRoleDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleAddRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postAddRole } from "../../../network/roles";

export default {
  name: "AddRoleDialog",
  props: ["addRoleDialogVisible"],
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      addRoleForm: {
        orgId: "",
        roleId: "",
        roleName: "",
      },
      addRoleFormRules: {
        orgId: [{ required: true, message: "请选择所属组织", trigger: "blur" }],
        roleId: [
          { required: true, message: "请输入角色编号", trigger: "blur" },
        ],
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      // 级联选择配置
      orgCascaderProps: {
        label: "orgName",
        value: "orgId",
        children: "children",
        expandTrigger: "hover",
        // 是否各个节点都可以选择
        checkStrictly: true,
        // 是否返回多级数组，还是只返回选中项：
        emitPath: false,
      },
    };
  },
  methods: {
    openAddRoleDialog() {
      this.addRoleForm.orgId = window.sessionStorage.getItem("orgId");
    },
    addRoleDialogClose() {
      this.$emit("update:addRoleDialogVisible", false);
    },
    selectedOrgChange(orgId) {
      this.addRoleForm.orgId = orgId;
    },
    handleAddRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postAddRole({ dataContent: this.addRoleForm });
        if (res.code !== 1) {
          return this.$message.error("添加角色失败：" + res.message);
        }
        this.$message.success("添加角色成功");
        this.$emit("update:addRoleDialogVisible", false);
        this.$emit("reloadRoleList");
      });
    },
  },
};
</script>

<style scoped>
</style>