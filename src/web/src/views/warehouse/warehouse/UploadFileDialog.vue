<template>
  <el-dialog
    title="批量新增库房"
    :visible="uploadFileDialogVisible"
    @open="openUploadFileDialog"
    @close="closeUploadFileDialog"
    width="50%"
  >
    <el-steps>
      <el-step
        title="解析模板"
        :status="resolveTemplateStatus"
        description="验证传入模板是否符合要求"
      ></el-step>
      <el-step
        title="解析数据"
        :status="resolveJsonDataStatus"
        description="验证待上传数据格式是否有误"
      ></el-step>
      <el-step
        title="确认上传"
        :status="finishUploadStatus"
        description="验证完成，确认上传"
      ></el-step>
    </el-steps>
    <el-upload
      drag
      :multiple="false"
      action="alert"
      ref="uploadFileRef"
      :auto-upload="false"
      :on-change="handleParseExcel"
      :disabled="uploadRegionDisable"
    >
      <!-- 开始解析数据 -->
      <div v-if="resolveTemplateStatus === ''">
        <i class="el-icon-upload"></i>
        <div class="upload-text">
          请选择要上传的文件（超过20w条数据请分批次导入）
        </div>
      </div>
      <!-- 解析模板出错 -->
      <div class="upload-content" v-else-if="resolveTemplateStatus === 'error'">
        <div class="upload-text">解析模板失败</div>
        <el-button @click="downloadResolveTemplateResult"
          >下载模板匹配结果</el-button
        >
      </div>
      <!-- 解析数据成功 -->
      <div
        class="upload-content"
        v-else-if="resolveJsonDataStatus === 'success'"
      >
        <div class="upload-text">解析数据完成，等待确认上传 . . .</div>
      </div>
      <!-- 解析数据出错 -->
      <div class="upload-content" v-else-if="resolveJsonDataStatus === 'error'">
        <div class="upload-text">解析数据失败</div>
        <el-button @click="downloadResolveJsonDataResult"
          >下载数据解析结果</el-button
        >
      </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="clearReloadFileList"
        >重新上传</el-button
      >
      <el-button @click="closeUploadFileDialog">取 消</el-button>
      <el-button
        type="primary"
        @click="handleUploadJsonData"
        :disabled="uploadBtnDisabled"
        >确定上传</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {
  readExcelToJson,
  validJsonFieldsByTemplate,
  validJsonDataByTemplate,
} from "@/assets/js/util.js";
import { postBulkCreateWarehouse } from "@/network/warehouses.js";

export default {
  name: "UploadFileDialog",
  props: ["uploadFileDialogVisible", "headers", "importFieldsConfig"],
  data() {
    return {
      // 上传区域是否可点击：
      uploadRegionDisable: false,
      // 确认上传按钮是否可点击：
      uploadBtnDisabled: true,
      resolveTemplateStatus: "",
      resolveJsonDataStatus: "",
      finishUploadStatus: "",
      // 解析模板出错结果
      validTemplateResult: [],
      // 解析数据出错结果
      validJsonDataResult: [],
      // 解析后的json数据：
      jsonData: [],
    };
  },
  methods: {
    openUploadFileDialog() {},
    // 处理上传数据的整个过程
    async handleParseExcel(file, fileList) {
      try {
        this.uploadRegionDisable = true;
        // excel数据转成json
        let res_json = await readExcelToJson(file.raw);
        if (res_json.length === 0) {
          this.$message.warning("上传的文件不能为空");
          this.clearReloadFileList();
          return;
        }
        // 1. 验证传入模板是否符合要求：
        if (!this.validateTemplate(res_json)) return;
        // 2. 验证待上传数据格式是否符合要求：
        if (!this.validateJson(res_json)) return;
        // 3. 验证成功之后，把json数据存储：
        this.jsonData = res_json;
        this.uploadBtnDisabled = false;
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 验证模板
    validateTemplate(jsonData) {
      let res_template = validJsonFieldsByTemplate(
        jsonData,
        this.importFieldsConfig
      );
      if (res_template.code !== 1) {
        this.resolveTemplateStatus = "error";
        this.validTemplateResult = res_template.message;
        return false;
      }
      this.resolveTemplateStatus = "success";
      return true;
    },
    // 验证数据
    validateJson(jsonData) {
      let res_valid = validJsonDataByTemplate(
        jsonData,
        this.importFieldsConfig
      );
      if (res_valid.code !== 1) {
        this.resolveJsonDataStatus = "error";
        this.validJsonDataResult = res_valid.message;
        return false;
      }
      this.resolveJsonDataStatus = "success";
      return true;
    },
    // 点击下载解析模板出错结果：
    downloadResolveTemplateResult() {
      let a = document.createElement("a");
      a.href =
        "data:text/txt;chartset=utf-8," + this.validTemplateResult.join("\n");
      a.download = "解析模板出错结果.txt";
      a.click();
    },
    // 点击下载解析数据出错结果：
    downloadResolveJsonDataResult() {
      let a = document.createElement("a");
      a.href =
        "data:text/txt;chartset=utf-8," + this.validJsonDataResult.join("\n");
      a.download = "解析数据出错结果.txt";
      a.click();
    },
    // 点击清空已上传文件，以助于重新上传文件
    clearReloadFileList() {
      this.$refs.uploadFileRef.clearFiles();
      this.uploadBtnDisabled = true;
      this.uploadRegionDisable = false;
      this.resolveTemplateStatus = "";
      this.resolveJsonDataStatus = "";
    },
    closeUploadFileDialog() {
      this.$emit("update:uploadFileDialogVisible", false);
      this.clearReloadFileList();
    },
    async handleUploadJsonData() {
      let res = await postBulkCreateWarehouse({ dataContent: this.jsonData });
      if (res.code !== 1) {
        return this.$message.error("批量导入库房失败：" + res.message);
      }
      this.$message.success("批量导入库房成功！");
      this.$emit("update:uploadFileDialogVisible", false);
      this.$emit("reloadWarehouseList");
      this.clearReloadFileList();
    },
  },
};
</script>

<style scoped>
.upload-text {
  font-size: 20px;
}
.upload-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>