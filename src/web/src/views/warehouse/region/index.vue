<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-bread-crumb :breadList="breadList" />
    <div style="font-size: 20px; background-color: #ccc;margin-top:20px;">界面待开发，敬请期待......</div>
  </div>
</template>

<script>
import MyBreadCrumb from "@/components/common/MyBreadCrumb.vue";

export default {
  name: "index",
  components: {
    MyBreadCrumb,
  },
  data() {
    return {
      // 面包屑导航配置
      breadList: [
        { name: "首页", path: "/home/welcome" },
        { name: "库房管理", path: "" },
        { name: "区域信息", path: "" },
      ],
    };
  },
};
</script>

<style scoped>
</style>