<template>
  <el-dialog
    title="编辑库房"
    :visible="editWarehouseDialogVisible"
    width="50%"
    @open="openEditWarehouseDialog"
    @close="closeEditWarehouseDialog"
  >
    <el-form
      :model="editWarehouseForm"
      :rules="editWarehouseFormRules"
      ref="editWarehouseFormRef"
      label-width="90px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="editWarehouseForm.orgId"
          :options="orgTreeList"
          :props="cascaderProps"
          clearable
        />
      </el-form-item>
      <el-form-item label="库房编号" prop="warehouseId">
        <el-input v-model="editWarehouseForm.warehouseId"></el-input>
      </el-form-item>
      <el-form-item label="库房名称" prop="warehouseId">
        <el-input v-model="editWarehouseForm.warehouseName"></el-input>
      </el-form-item>
      <el-form-item label="库房类型" prop="warehouseType">
        <el-radio-group v-model="editWarehouseForm.warehouseType">
          <el-radio-button label="主馆"></el-radio-button>
          <el-radio-button label="分馆"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="主机IP" prop="ip">
        <el-input v-model="editWarehouseForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="主机端口" prop="port">
        <el-input v-model="editWarehouseForm.port"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeEditWarehouseDialog">取 消</el-button>
      <el-button type="primary" @click="handleEditWarehouse">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postEditWarehouse } from "@/network/warehouses.js";

export default {
  name: "AddWarehouseDialog",
  props: ["editWarehouseDialogVisible", "selectColumn"],
  data() {
    return {
      editWarehouseForm: {
        orgId: window.sessionStorage.getItem("orgId"),
        warehouseId: "",
        warehouseName: "",
        warehouseType: "",
        ip: "",
        port: "",
      },
      editWarehouseFormRules: {
        orgId: [{ required: true, message: "请输入库房编号", trigger: "blur" }],
        warehouseId: [
          { required: true, message: "请输入库房编号", trigger: "blur" },
        ],
        warehouseName: [
          { required: true, message: "请输入库房名称", trigger: "blur" },
        ],
        warehouseType: [
          { required: true, message: "请输入库房类型", trigger: "blur" },
        ],
      },
      orgTreeList: JSON.parse(window.sessionStorage.getItem("orgTreeList")),
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
    openEditWarehouseDialog() {
      this.editWarehouseForm = Object.assign({}, this.selectColumn);
    },
    closeEditWarehouseDialog() {
      this.$refs.editWarehouseFormRef.resetFields();
      this.$emit("update:editWarehouseDialogVisible", false);
    },
    handleEditWarehouse() {
      this.$refs.editWarehouseFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postEditWarehouse({
          query: { warehouseId: this.selectColumn.warehouseId },
          dataContent: this.editWarehouseForm,
        });
        if (res.code !== 1) {
          return this.$message.error("更新库房失败：" + res.message);
        }

        this.$message.success("更新库房成功");
        this.$emit("update:editWarehouseDialogVisible", false);
        this.$emit("reloadWarehouseList");
      });
    },
  },
};
</script>

<style scoped>
</style>