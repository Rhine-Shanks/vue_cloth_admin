<template>
  <div>
    <span>欢迎登陆布料管理系统</span>
    <button @click="changeName">修改name</button>
    <div>orgIdList: {{ $store.getters.orgIdList }}</div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {};
  },
  methods: {
    async changeName() {
      // this.$store.commit('updateName','Rhine');
      let res = await this.$store.dispatch("getOrgList");
    },
  },
};
</script>

<style scoped>
</style>