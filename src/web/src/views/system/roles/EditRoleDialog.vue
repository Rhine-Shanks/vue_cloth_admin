<template>
  <el-dialog
    title="编辑角色"
    :visible="editRoleDialogVisible"
    width="50%"
    @open="openEditRoleDialog"
    @close="editRoleDialogClose"
  >
    <el-form
      :model="editRoleForm"
      :rules="editRoleFormRules"
      ref="editRoleFormRef"
      label-width="100px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="editRoleForm.orgId"
          :options="orgTreeList"
          :props="orgCascaderProps"
          @change="selectedOrgChange"
          clearable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="权限编号" prop="roleId">
        <el-input v-model="editRoleForm.roleId" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editRoleForm.roleName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editRoleDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleEditRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postUpdateRole } from "../../../network/roles";

export default {
  name: "EditRoleDialog",
  props: ["editRoleDialogVisible", "selectColumn"],
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      editRoleForm: {
        orgId: "",
        roleId: "",
        roleName: "",
      },
      editRoleFormRules: {
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
    openEditRoleDialog() {
      this.editRoleForm = this.selectColumn;
    },
    editRoleDialogClose() {
      this.$emit("update:editRoleDialogVisible", false);
    },
    selectedOrgChange(orgId) {
      this.editRoleForm.orgId = orgId;
    },
    handleEditRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postUpdateRole({
          query: { roleId: this.editRoleForm.roleId },
          dataContent: this.editRoleForm,
        });
        if (res.code !== 1) {
          return this.$message.error("编辑角色失败：" + res.message);
        }
        this.$message.success("编辑角色成功");
        this.$emit("update:editRoleDialogVisible", false);
        this.$emit("reloadRoleList");
      });
    },
  },
};
</script>

<style scoped>
</style>