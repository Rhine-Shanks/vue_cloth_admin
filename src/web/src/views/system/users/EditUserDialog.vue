<template>
  <el-dialog
    title="编辑用户"
    :visible="editUserDialogVisible"
    width="50%"
    @open="openEditUserDialog"
    @close="closeEditUserDialog"
  >
    <!-- 编辑用户表单 -->
    <el-form
      :model="editUserForm"
      :rules="editUserFormRules"
      ref="editUserFormRef"
      label-width="90px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="editUserForm.orgId"
          :options="orgTreeList"
          :props="cascaderProps"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="关联员工" prop="employeeId">
        <el-select
          v-model="editUserForm.employeeId"
          placeholder="请选择关联员工"
        >
          <el-option
            v-for="item in employeeList"
            :key="item.employeeId"
            :label="item.employeeName"
            :value="item.employeeId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="userId">
        <el-input v-model="editUserForm.userId" disabled></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="editUserForm.password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEditUserDialog">取 消</el-button>
      <el-button type="primary" @click="handleEditUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "EditUserDialog",
  props: ["editUserDialogVisible", "userInfo"],
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      employeeList: JSON.parse(window.sessionStorage.getItem("employeeList")),
      editUserForm: {
        orgId: "",
        employeeId: "",
        userId: "",
        password: "",
      },
      editUserFormRules: {
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
    //   打开对话框
    async openEditUserDialog() {
      this.editUserForm = this.userInfo;
    },
    // 关闭新增用户对话框
    closeEditUserDialog() {
      this.$refs.editUserFormRef.resetFields();
      this.$emit("update:editUserDialogVisible", false);
    },
    // 处理编辑用户操作
    handleEditUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postUpdateUser({
          query: {
            userId: this.editUserForm.userId,
          },
          dataContent: this.editUserForm,
        });
        if (res.code !== 1) {
          return this.$message.error("更新用户失败：" + res.message);
        }
        this.$message.success("更新用户成功");
        this.editUserDialogVisible = !this.editUserDialogVisible;
        this.getUserList();
      });
    },
  },
};
</script>

<style scoped>
</style>