<template>
  <el-dialog
    title="分配用户权限"
    :visible="distributeUserRoleDialogVisible"
    width="50%"
    @open="openDistributeUserRoleDialog"
    @close="closeDistributeUserRoleDialog"
  >
    <!-- 编辑用户表单 -->
    <el-form
      :model="distributeUserRoleForm"
      :rules="distributeUserRoleFormRules"
      ref="distributeUserRoleFormRef"
      label-width="100px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="distributeUserRoleForm.orgId"
          :options="orgTreeList"
          :props="cascaderProps"
          clearable
          disabled
        ></el-cascader>
      </el-form-item>
      <el-form-item label="当前用户" prop="userId">
        <el-input v-model="distributeUserRoleForm.userId" disabled></el-input>
      </el-form-item>
      <el-form-item label="当前关联角色">
        <el-input v-model="currentRoleName" disabled></el-input>
      </el-form-item>
      <el-form-item label="关联新角色" prop="roleId">
        <el-select
          v-model="distributeUserRoleForm.roleId"
          placeholder="请选择关联角色"
        >
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDistributeUserRoleDialog">取 消</el-button>
      <el-button type="primary" @click="handleDistributeUserRole"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { postGetRoleList } from "../../../network/roles";
import { postBulkCreateUserRole } from "../../../network/users";

export default {
  name: "DistributeUserRoleDialog",
  props: ["distributeUserRoleDialogVisible", "userInfo"],
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      roleList: [],
      currentRoleName: "",
      distributeUserRoleForm: {
        orgId: "",
        userId: "",
        roleId: "",
        isDelete: 0,
      },
      distributeUserRoleFormRules: {
        orgId: [
          { required: true, message: "请输入用户所属组织", trigger: "blur" },
        ],
        userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        roleId: [
          { required: true, message: "请选择用户角色", trigger: "blur" },
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
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      let res = await postGetRoleList({
        query: {
          orgId: JSON.parse(window.sessionStorage.getItem("orgIdList")),
        },
      });
      if (res.code !== 1) {
        return this.$message.error("获取角色列表失败：" + res.message);
      }
      this.roleList = res.data;
    },
    openDistributeUserRoleDialog() {
      this.currentRoleName = this.userInfo.roleName;
      this.distributeUserRoleForm.userId = this.userInfo.userId;
      this.distributeUserRoleForm.orgId = this.userInfo.orgId;
    },
    closeDistributeUserRoleDialog() {
      this.$emit("update:distributeUserRoleDialogVisible", false);
    },
    handleDistributeUserRole() {
      this.$refs.distributeUserRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        console.log(this.distributeUserRoleForm);
        let res = await postBulkCreateUserRole({
          dataContent: [this.distributeUserRoleForm],
        });
        if (res.code !== 1) {
          return this.$message.error("分配用户权限失败：" + res.message);
        }
        this.$message.success("分配用户权限成功");
        this.$emit("update:distributeUserRoleDialogVisible", false);
        this.$emit("reloadUserList");
      });
    },
  },
};
</script>

<style scoped>
</style>