<template>
  <el-dialog
    title="新增用户"
    :visible="addUserDialogVisible"
    width="50%"
    @open="openAddUserDialog"
    @close="closeAddUserDialog"
  >
    <!-- 添加用户表单 -->
    <el-form
      :model="addUserForm"
      :rules="addUserFormRules"
      ref="addUserFormRef"
      label-width="90px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="addUserForm.orgId"
          :options="orgTreeList"
          :props="cascaderProps"
          clearable
        />
      </el-form-item>
      <el-form-item label="关联员工" prop="employeeId">
        <el-select
          v-model="addUserForm.employeeId"
          placeholder="请选择关联员工"
        >
          <el-option
            v-for="item in employeeList"
            :key="item.employeeId"
            :label="item.employeeName"
            :value="item.employeeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="userId">
        <el-input v-model="addUserForm.userId"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeAddUserDialog">取 消</el-button>
      <el-button type="primary" @click="handleAddUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postAddUser } from "../../../network/users";

export default {
  name: "AddUserDialog",
  props: ["addUserDialogVisible"],
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      employeeList: JSON.parse(window.sessionStorage.getItem("employeeList")),
      addUserForm: {
        orgId: "",
        employeeId: "",
        userId: "",
        password: "",
      },
      addUserFormRules: {
        orgId: [{ required: true, message: "请选择所属组织", trigger: "blur" }],
        employeeId: [
          { required: true, message: "请选择关联员工", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 级联选择器属性支持
      cascaderProps: {
        value: "orgId",
        label: "orgName",
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
    openAddUserDialog() {},
    // 关闭新增用户对话框
    closeAddUserDialog() {
      this.$refs.addUserFormRef.resetFields();
      this.$emit("update:addUserDialogVisible", false);
    },
    // 处理新增用户操作
    async handleAddUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postAddUser({ dataContent: this.addUserForm });
        if (res.code !== 1) {
          return this.$message.error("新增用户失败：" + res.message);
        }
        this.$message.success("新增用户成功");
        this.$emit("update:addUserDialogVisible", false);
        this.$emit("reloadUserList");
      });
    },
  },
};
</script>

<style scoped>
</style>