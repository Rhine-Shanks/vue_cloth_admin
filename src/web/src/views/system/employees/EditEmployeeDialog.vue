<template>
  <el-dialog
    title="编辑员工"
    :visible="editEmployeeDialogVisible"
    @open="openEditEmployeeDialog"
    @close="closeEditEmployeeDialog"
  >
    <el-form
      :model="editEmployeeForm"
      :rules="editEmployeeFormRules"
      ref="editEmployeeFormRef"
      label-width="100px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="selectedOrg"
          :options="orgTreeList"
          :props="orgCascaderProps"
          @change="selectedOrgChange"
          clearable=""
        ></el-cascader>
      </el-form-item>
      <el-form-item label="员工编号" prop="employeeId">
        <el-input v-model="editEmployeeForm.employeeId" disabled></el-input>
      </el-form-item>
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input v-model="editEmployeeForm.employeeName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="telNo">
        <el-input v-model="editEmployeeForm.telNo"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editEmployeeForm.email"></el-input>
      </el-form-item>
      <el-form-item label="更新人" prop="updatePerson">
        <el-input v-model="editEmployeeForm.updatePerson"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEditEmployeeDialog">取 消</el-button>
      <el-button type="primary" @click="handleEditEmployee">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postUpdateEmployee } from "../../../network/employees";

export default {
  name: "EditEmployeeDialog",
  props: ["editEmployeeDialogVisible", "selectColumn"],
  data() {
    let checkEmail = (rule, value, cb) => {
      let regEmail =
        /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的邮箱"));
    };
    let checkTelNo = (rule, value, cb) => {
      let regTelNo =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regTelNo.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      editEmployeeForm: {
        orgId: "",
        employeeId: "",
        employeeName: "",
        telNo: "",
        email: "",
        updatePerson: "",
      },
      editEmployeeFormRules: {
        orgId: [{ required: true, message: "请选择所属组织", trigger: "blur" }],
        employeeId: [
          { required: true, message: "请输入员工编号", trigger: "blur" },
        ],
        employeeName: [
          { required: true, message: "请输入员工姓名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 2 到 15 个字符之间" },
        ],
        telNo: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkTelNo, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, triggle: "blur" },
        ],
        updatePerson: [
          { required: true, message: "请输入更新人", trigger: "blur" },
        ],
      },
      selectedOrg: "",
      // 级联选择器配置：
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
    openEditEmployeeDialog() {
      this.editEmployeeForm = this.selectColumn;
      this.selectedOrg = this.selectColumn.orgId;
      this.editEmployeeForm.updatePerson =
        window.sessionStorage.getItem("userId");
    },
    closeEditEmployeeDialog() {
      this.$refs.editEmployeeFormRef.resetFields();
      this.selectedOrg = "";
      this.$emit("update:editEmployeeDialogVisible", false);
    },
    selectedOrgChange() {
      this.editEmployeeForm.orgId = this.selectedOrg;
    },
    handleEditEmployee() {
      this.$refs.editEmployeeFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postUpdateEmployee({
          query: { employeeId: this.editEmployeeForm.employeeId },
          dataContent: this.editEmployeeForm,
        });
        // console.log(res);
        if (res.code !== 1) {
          return this.$message.error("更新员工失败：" + res.message);
        }
        this.$emit("update:editEmployeeDialogVisible", false);
        this.$emit("reloadEmployeeList");
        this.$message.success("更新员工成功！");
      });
    },
  },
};
</script>

<style scoped>
</style>