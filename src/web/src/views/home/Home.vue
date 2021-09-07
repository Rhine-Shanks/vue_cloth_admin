<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../assets/images/布料.png" alt="" />
        <span class="title">布料管理系统</span>
      </div>
      <el-button @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边导航栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-collapse" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#001529"
          text-color="#fff"
          active-text-color="#4c8bf4"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          router
          :default-active="activeNavPath"
        >
          <el-submenu
            :index="item.path"
            v-for="item in menusAndRightsTreeList"
            :key="item.rightId"
          >
            <template slot="title">
              <i :class="menuIcon[item.rightId]"></i>
              <span>{{ item.rightDesc }}</span>
            </template>
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.rightId"
              @click="clickSubMenu(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.rightDesc }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
      menusAndRightsTreeList: JSON.parse(
        window.sessionStorage.getItem("menusAndRightsTreeList")
      ),
      menuIcon: {
        1: "el-icon-s-tools",
        2: "el-icon-s-home",
        3: "el-icon-s-management",
        4: "el-icon-picture",
        5: "el-icon-s-help",
      },
      activeNavPath: window.sessionStorage.getItem("activeNavPath"),
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    clickSubMenu(path) {
      window.sessionStorage.setItem("activeNavPath", path);
      this.activeNavPath = path;
    },
  },
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #002140;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  color: white;
  font-size: 20px;
}

img {
  height: 30px;
  width: 30px;
  border-radius: 5px;
}
span {
  margin: 15px;
}
.el-header > div {
  display: flex;
  align-items: center;
}

.el-aside {
  background-color: #001529;
  color: #333;
}

.el-main {
  background-color: #eeeeee;
  color: #333;
}

.el-menu {
  border-right: 0px;
}
.toggle-collapse {
  background-color: #343746;
  line-height: 24px;
  color: white;
  text-align: center;
  font-size: 10px;
  cursor: pointer;
  letter-spacing: 0.3em;
}
</style>