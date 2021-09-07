<template>
  <el-dialog
    title="新增库房"
    :visible="addWarehouseDialogVisible"
    width="50%"
    @open="openAddWarehouseDialog"
    @close="closeAddWarehouseDialog"
  >
    <el-form
      :model="addWarehouseForm"
      :rules="addWarehouseFormRules"
      ref="addWarehouseFormRef"
      label-width="90px"
    >
      <el-form-item label="所属组织" prop="orgId">
        <el-cascader
          v-model="addWarehouseForm.orgId"
          :options="orgTreeList"
          :props="cascaderProps"
          clearable
        />
      </el-form-item>
      <el-form-item label="库房编号" prop="warehouseId">
        <el-input v-model="addWarehouseForm.warehouseId"></el-input>
      </el-form-item>
      <el-form-item label="库房名称" prop="warehouseId">
        <el-input v-model="addWarehouseForm.warehouseName"></el-input>
      </el-form-item>
      <el-form-item label="库房类型" prop="warehouseType">
        <el-radio-group v-model="addWarehouseForm.warehouseType">
          <el-radio-button label="主馆"></el-radio-button>
          <el-radio-button label="分馆"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="主机IP" prop="ip">
        <el-input v-model="addWarehouseForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="主机端口" prop="port">
        <el-input v-model="addWarehouseForm.port"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeAddWarehouseDialog">取 消</el-button>
      <el-button type="primary" @click="handleAddWarehouse">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postAddWarehouse } from "@/network/warehouses.js";

export default {
  name: "AddWarehouseDialog",
  props: ["addWarehouseDialogVisible"],
  data() {
    return {
      addWarehouseForm: {
        orgId: window.sessionStorage.getItem("orgId"),
        warehouseId: "",
        warehouseName: "",
        warehouseType: "",
        ip: "",
        port: "",
      },
      addWarehouseFormRules: {
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
    openAddWarehouseDialog() {},
    closeAddWarehouseDialog() {
      this.$refs.addWarehouseFormRef.resetFields();
      this.$emit("update:addWarehouseDialogVisible", false);
    },
    handleAddWarehouse() {
      this.$refs.addWarehouseFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postAddWarehouse({
          dataContent: this.addWarehouseForm,
        });
        if (res.code !== 1) {
          return this.$message.error("新增库房失败：" + res.message);
        }

        this.$message.success("添加库房成功");
        this.$emit("update:addWarehouseDialogVisible", false);
        this.$emit("reloadWarehouseList");
      });
    },
  },
};
</script>

<style scoped>
</style>