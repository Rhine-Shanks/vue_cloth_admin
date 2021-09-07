<template>
  <el-dialog
    title="编辑组织"
    :visible="editOrgDialogVisible"
    @open="openEditOrgDialog"
    @close="closeEditOrgDialog"
  >
    <el-form
      :model="editOrgForm"
      :rules="editOrgFormRules"
      ref="editOrgFormRef"
      label-width="100px"
    >
      <el-form-item label="组织编号" prop="orgId">
        <el-input v-model="editOrgForm.orgId"></el-input>
      </el-form-item>
      <el-form-item label="组织名称" prop="orgName">
        <el-input v-model="editOrgForm.orgName"></el-input>
      </el-form-item>
      <el-form-item label="上级组织" prop="parentId">
        <el-cascader
          v-model="selectedOrgParentId"
          :options="orgTreeList"
          :props="parentOrgCascaderProps"
          @change="selectedParentOrgChange"
          clearable
        >
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEditOrgDialog">取 消</el-button>
      <el-button type="primary" @click="handleEditOrg">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postUpdateOrg } from "../../../network/orgs";

export default {
  name: "EditOrgDialog",
  props: ["editOrgDialogVisible", "selectColumn", "orgTreeList", "childrenOrgList"],
  data() {
    return {
      editOrgForm: {
        orgId: "",
        orgName: "",
        parentId: "",
      },
      editOrgFormRules: {
        orgId: [{ required: true, message: "请输入组织编号", trigger: "blur" }],
        orgName: [
          { required: true, message: "请输入组织名称", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "请选择父级组织", trigger: "blur" },
        ],
      },
      //   级联选择配置
      parentOrgCascaderProps: {
        label: "orgName",
        value: "orgId",
        children: "children",
        expandTrigger: "hover",
        // 是否各个节点都可以选择
        checkStrictly: true,
        // 是否返回多级数组，还是只返回选中项：
        emitPath: false,
      },
      selectedOrgParentId: "",
    };
  },
  methods: {
    openEditOrgDialog() {
      this.editOrgForm = Object.assign({}, this.selectColumn);
      this.selectedOrgParentId = this.editOrgForm.parentId;
    },
    closeEditOrgDialog() {
      this.$refs.editOrgFormRef.resetFields();
      this.$emit("update:editOrgDialogVisible", false);
    },
    selectedParentOrgChange() {
      this.editOrgForm.parentId = this.selectedOrgParentId;
    },
    handleEditOrg() {
      this.$refs.editOrgFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postUpdateOrg({
          query: { orgId: this.selectColumn.orgId },
          dataContent: this.editOrgForm,
        });
        if (res.code !== 1) {
          return this.$message.error("更新组织失败：" + res.message);
        }
        this.$message.success("更新组织成功！");
        this.$emit("update:editOrgDialogVisible", false);
        this.$emit("reloadOrg");
      });
    },
  },
};
</script>

<style scoped>
</style>