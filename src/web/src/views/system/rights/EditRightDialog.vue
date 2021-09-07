<template>
  <el-dialog
    title="编辑权限"
    :visible="editRightDialogVisible"
    width="50%"
    @open="openEditRightDialog"
    @close="closeEditRightDialog"
  >
    <el-form
      :model="editRightForm"
      :rules="editRightFormRules"
      ref="editRightFormRef"
      label-width="100px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="editRightForm.orgId"
          :options="orgTreeList"
          :props="orgCascaderProps"
          disabled
          clearable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="父级权限" prop="parentId">
        <el-cascader
          v-model="editRightForm.parentId"
          :options="rightTreeList"
          :props="rightCascaderProps"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="权限名称" prop="rightName">
        <el-input v-model="editRightForm.rightName"></el-input>
      </el-form-item>
      <el-form-item label="权限描述" prop="rightDesc">
        <el-input v-model="editRightForm.rightDesc"></el-input>
      </el-form-item>
      <el-form-item label="路由路径" prop="path">
        <el-input v-model="editRightForm.path"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="editRightForm.remarks"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEditRightDialog">取 消</el-button>
      <el-button type="primary" @click="handleEditRight">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postGetRightList, postUpdateRight } from "../../../network/rights";

export default {
  name: "EditRightDialog",
  props: ["editRightDialogVisible", "selectColumn"],
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      rightTreeList: [],
      editRightForm: {
        // 默认权限都是顶级权限，不可更改
        orgName: "1",
        rightName: "",
        rightDesc: "",
        // 不选择父级权限默认是顶级权限：
        parentId: "",
        path: "",
        remarks: "",
      },
      editRightFormRules: {
        orgId: [{ required: true, message: "请选择所属组织", trigger: "blur" }],
        rightName: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
        ],
        rightDesc: [
          { required: true, message: "请输入权限描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "字段范围在 3 到 15 个字符之间",
            trigger: "blur",
          },
        ],
        parentId: [
          { required: true, message: "请输入权限所属父级ID", trigger: "blur" },
        ],
        path: [
          {
            required: true,
            message: "请输入请输入前端路由导航路径",
            trigger: "blur",
          },
        ],
        remarks: [
          { required: false, message: "请输入备注信息", trigger: "blur" },
        ],
      },
      // 组织 - 级联选择配置
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
      // 权限 - 级联选择器配置：
      rightCascaderProps: {
        label: "rightDesc",
        value: "rightId",
        children: "children",
        expandTrigger: "hover",
        // 是否各个节点都可以选择
        checkStrictly: true,
        // 是否返回多级数组，还是只返回选中项：
        emitPath: false,
      },
      selectedOrgs: "",
      selectedRightParentId: "",
    };
  },
  methods: {
    // 监听打开对话框：
    openEditRightDialog() {
      this.getRightTreeList();
      this.editRightForm = this.selectColumn;
      this.selectedOrgs = this.selectColumn.orgId;
      this.selectedRightParentId = this.selectColumn.parentId;
    },
    // 监听关闭修改权限对话框：
    closeEditRightDialog() {
      this.$refs.editRightFormRef.resetFields();
      this.selectedRightParentId = "";
      this.$emit("update:editRightDialogVisible", false);
    },
    // 获取权限列表,按照树形结构的形式返回：
    async getRightTreeList() {
      let res = await postGetRightList({
        dataType: "tree",
        fieldId: "rightId",
      });
      if (res.code != 1) {
        return this.$message.error("获取权限列表失败: " + res.message);
      }
      // 递归权限列表树，为等级为3的权限添加禁用字段：
      function attachDisable(dataList) {
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].level === "3") {
            dataList[i].disabled = true;
          }
          if (dataList[i].children) attachDisable(dataList[i].children);
        }
      }
      attachDisable(res.data);

      this.rightTreeList = res.data;
    },
    // 处理编辑权限操作：
    handleEditRight() {
      this.$refs.editRightFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postUpdateRight({
          query: { rightId: this.editRightForm.rightId },
          dataContent: this.editRightForm,
        });
        if (res.code !== 1) {
          return this.$message.error("更新权限失败：" + res.message);
        }
        this.$message.success("更新权限成功");
        this.$emit("update:editRightDialogVisible", false);
        this.$emit("reloadRightList");
      });
    },
  },
};
</script>

<style scoped>
</style>