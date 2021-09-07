<template>
  <el-dialog
    title="添加权限"
    :visible="addRightDialogVisible"
    width="50%"
    @open="openAddRightDialog"
    @close="addRightDialogClose"
  >
    <el-form
      :model="addRightForm"
      :rules="addRightFormRules"
      ref="addRightFormRef"
      label-width="100px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="addRightForm.orgId"
          :options="orgTreeList"
          :props="orgCascaderProps"
          disabled
          clearable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="父级权限" prop="parentId">
        <el-cascader
          v-model="selectedRights"
          :options="rightTreeList"
          :props="rightCascaderProps"
          @change="selectedRightChange"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="权限名称" prop="rightName">
        <el-input v-model="addRightForm.rightName"></el-input>
      </el-form-item>
      <el-form-item label="权限描述" prop="rightDesc">
        <el-input v-model="addRightForm.rightDesc"></el-input>
      </el-form-item>
      <el-form-item label="路由路径" prop="path">
        <el-input v-model="addRightForm.path"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="addRightForm.remarks"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addRightDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleAddRight">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postGetRightList, postAddRight } from "../../../network/rights";

export default {
  name: "AddRightDialog",
  props: ["addRightDialogVisible"],
  data() {
    return {
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
      selectedRights: "",
      allRightList: [],
      rightTreeList: [],
      addRightForm: {
        orgId: "1",
        rightName: "",
        rightDesc: "",
        // 不选择父级权限默认是顶级权限：
        parentId: "0",
        path: "",
        remarks: "",
      },
      addRightFormRules: {
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
    };
  },
  computed: {
    // 完善新增表单数据
    completeAddFormData() {
      let newAddFormData = Object.assign({}, this.addRightForm);
      let parentRight = this.allRightList.find(
        (item) => item.parentId === newAddFormData.rightId
      );
      // 获取最大的权限值：
      let max_rightId = 0;
      // 获取各等级权限中顺序最大的值：
      let max_level_1_order = 0;
      let max_level_2_order = 0;
      let max_level_3_order = 0;
      this.allRightList.map((item) => {
        if (parseInt(item.rightId) > max_rightId) {
          max_rightId = parseInt(item.rightId);
        }
        if (item.level === "1" && parseInt(item.order) > max_level_1_order) {
          max_level_1_order = parseInt(item.order);
        }
        if (
          item.level === "2" &&
          parentRight &&
          item.parentId === parentRight.rightId &&
          parseInt(item.order) > max_level_2_order
        ) {
          max_level_2_order = parseInt(item.order);
        }
        if (
          item.level === "3" &&
          parentRight &&
          item.parentId === parentRight.rightId &&
          parseInt(item.order) > max_level_3_order
        ) {
          max_level_3_order = parseInt(item.order);
        }
      });
      // 赋值递增的权限ID：
      newAddFormData.rightId = String(max_rightId + 1);
      // 如果父级权限不存在，即表明新增的权限为顶级权限：
      if (!parentRight) {
        newAddFormData.level = "1";
        newAddFormData.order = String(max_level_1_order + 1);
      } else if (parentRight.level === "1") {
        newAddFormData.level = String(parseInt(parentRight.level) + 1);
        newAddFormData.order = String(max_level_2_order + 1);
      } else {
        newAddFormData.level = String(parseInt(parentRight.level) + 1);
        newAddFormData.order = String(max_level_3_order + 1);
      }
      return newAddFormData;
    },
  },
  methods: {
    openAddRightDialog() {
      this.getRightTreeList();
      this.getAllRightList();
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
    // 获取全部权限
    async getAllRightList() {
      let res = await postGetRightList();
      if (res.code != 1) {
        return this.$message.error("获取全部权限失败: " + res.message);
      }
      this.allRightList = res.data;
    },
    // 监听关闭添加权限对话框：
    addRightDialogClose() {
      this.$refs.addRightFormRef.resetFields();
      this.selectedRights = "";
      this.$emit("update:addRightDialogVisible", false);
    },
    // 监听级联选择的权限发生变化的事件
    selectedRightChange() {
      this.addRightForm.parentId = this.selectedRights;
    },
    // 处理新增权限：
    handleAddRight() {
      this.$refs.addRightFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postAddRight({ dataContent: this.completeAddFormData });
        if (res.code !== 1) {
          return this.$message.error("新增权限失败：" + res.message);
        }
        this.$message.success("新增权限成功");
        this.$emit("update:addRightDialogVisible", false);
        this.$emit("reloadRightList");
      });
    },
  },
};
</script>

<style scoped>
</style>