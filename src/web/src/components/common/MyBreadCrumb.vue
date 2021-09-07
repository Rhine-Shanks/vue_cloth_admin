<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="item in breadList"
      :key="item.name"
      :to="item.path ? { path: item.path } : ''"
      >{{ item.name }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
export default {
  name: "MyBreadCrumb",
  data() {
    return {};
  },
  props: ["breadList"],
};
</script>

<style scoped>
</style>