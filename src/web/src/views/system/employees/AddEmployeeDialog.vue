<template>
  <el-dialog
    title="添加员工"
    :visible="addEmployeeDialogVisible"
    width="50%"
    @open="openAddEmployeeDialog"
    @close="closeAddEmployeeDialog"
  >
    <el-form
      :model="addEmployeeForm"
      :rules="addEmployeeFormRules"
      ref="addEmployeeFormRef"
      label-width="100px"
    >
      <el-form-item label="所属组织" prop="orgName">
        <el-cascader
          v-model="selectedOrg"
          :options="orgTreeList"
          :props="orgCascaderProps"
          @change="selectedOrgChange"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="员工编号" prop="employeeId">
        <el-input v-model="addEmployeeForm.employeeId"></el-input>
      </el-form-item>
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input v-model="addEmployeeForm.employeeName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="telNo">
        <el-input v-model="addEmployeeForm.telNo"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addEmployeeForm.email"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="createPerson">
        <el-input v-model="addEmployeeForm.createPerson" disabled></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeAddEmployeeDialog">取 消</el-button>
      <el-button type="primary" @click="handleAddEmployee">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postAddEmployee } from "../../../network/employees";

export default {
  name: "AddEmployeeDialog",
  props: ["addEmployeeDialogVisible"],
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
      addEmployeeForm: {
        orgId: "",
        employeeId: "",
        employeeName: "",
        telNo: "",
        email: "",
        createPerson: "",
      },
      addEmployeeFormRules: {
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
        createPerson: [
          { required: true, message: "请输入创建人", trigger: "blur" },
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
    openAddEmployeeDialog() {
      this.addEmployeeForm.createPerson =
        window.sessionStorage.getItem("userId");
    },
    closeAddEmployeeDialog() {
      this.$refs.addEmployeeFormRef.resetFields();
      this.selectedOrg = "";
      this.$emit("update:addEmployeeDialogVisible", false);
    },
    selectedOrgChange() {
      this.addEmployeeForm.orgId = this.selectedOrg;
    },
    handleAddEmployee() {
      this.$refs.addEmployeeFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postAddEmployee({ dataContent: this.addEmployeeForm });
        // console.log(res);
        if (res.code !== 1) {
          return this.$message.error(
            "新增员工失败：" + res.message === "duplicate data"
              ? "该员工已存在"
              : res.message
          );
        }
        this.$emit("update:addEmployeeDialogVisible", false);
        this.$emit("reloadEmployeeList");
        this.$message.success("新增员工成功！");
      });
    },
  },
};
</script>

<style scoped>
</style>