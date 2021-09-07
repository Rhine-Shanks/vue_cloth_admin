<template>
  <el-dialog
    :title="title"
    :visible="addOrgDialogVisible"
    @open="openAddOrgDialog"
    @close="closeAddOrgDialog"
  >
    <el-form
      :model="addOrgForm"
      :rules="addOrgFormRules"
      ref="addOrgFormRef"
      label-width="100px"
    >
      <el-form-item label="组织编号" prop="orgId">
        <el-input v-model="addOrgForm.orgId"></el-input>
      </el-form-item>
      <el-form-item label="组织名称" prop="orgName">
        <el-input v-model="addOrgForm.orgName"></el-input>
      </el-form-item>
      <el-form-item label="组织等级" prop="level">
        <el-input v-model="addOrgForm.level" disabled></el-input>
      </el-form-item>
      <el-form-item label="上级组织" prop="orgName">
        <el-cascader
          v-model="addOrgForm.parentId"
          :options="orgTreeList"
          :props="parentOrgCascaderProps"
          @change="selectedParentOrgChange"
          :disable="parentOrgInputDisable"
          clearable
        >
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeAddOrgDialog">取 消</el-button>
      <el-button type="primary" @click="handleAddOrg">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postAddOrg } from "../../../network/orgs";

export default {
  name: "AddOrgDialog",
  props: ["orgList", "addOrgDialogVisible", "data", "orgTreeList"],
  data() {
    return {
      title: "",
      parentOrgInputDisable: false,
      addOrgForm: {
        orgId: "",
        orgName: "",
        parentId: "",
        level: "",
      },
      addOrgFormRules: {
        orgId: [{ required: true, message: "请输入组织编号", trigger: "blur" }],
        orgName: [
          { required: true, message: "请输入组织名称", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "请输入上级组织", trigger: "blur" },
        ],
        level: [{ required: true, message: "请输入组织等级", trigger: "blur" }],
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
    };
  },
  methods: {
    openAddOrgDialog() {
      if (this.data) {
        this.parentOrgInputDisable = true;
        if (this.data.addOrgLevel === "same") {
          this.title = "添加同级组织";
          this.addOrgForm.parentId = this.data.currentOrg.parentId;
          this.addOrgForm.level = this.data.currentOrg.level;
        }
        if (this.data.addOrgLevel === "lower") {
          this.title = "添加下级组织";
          this.addOrgForm.parentId = this.data.currentOrg.orgId;
          this.addOrgForm.level = String(
            parseInt(this.data.currentOrg.level) + 1
          );
        }
      } else {
        this.title = "添加组织";
      }
    },
    closeAddOrgDialog() {
      this.parentOrgInputDisable = false;
      this.$refs.addOrgFormRef.resetFields();
      this.$emit("update:addOrgDialogVisible", false);
    },
    selectedParentOrgChange(selectedOrgId) {
      // 选中上级组织后
      this.addOrgForm.parentId = selectedOrgId;
      //   同时给等级复制
      const selectedOrgInfo = this.orgList.find(
        (item) => item.orgId === selectedOrgId
      );
      this.addOrgForm.level = String(parseInt(selectedOrgInfo.level) + 1);
    },
    handleAddOrg() {
      this.$refs.addOrgFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postAddOrg({ dataContent: this.addOrgForm });
        if (res.code !== 1) {
          return this.$message.error("新增组织失败：" + res.message);
        }
        this.$emit("update:addOrgDialogVisible", false);
        this.$emit("reloadOrg");
        this.$message.success("新增组织成功！");
      });
    },
  },
};
</script>

<style scoped>
</style>