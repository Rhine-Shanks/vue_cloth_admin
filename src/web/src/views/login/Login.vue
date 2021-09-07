<template>
  <div class="login-container">
    <!-- 登录框区域： -->
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../../assets/images/avatar.jpg" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <div class="login-form">
        <el-form
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
          label-width="0px"
        >
          <el-form-item prop="tenantId">
            <el-input
              v-model="loginForm.tenantId"
              prefix-icon="el-icon-office-building"
            ></el-input>
          </el-form-item>
          <el-form-item prop="userId">
            <el-input
              v-model="loginForm.userId"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="loginClick">登录</el-button>
            <el-button type="warning" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { postLogin } from "../../network/login";
import { initial_window_sessionStorage } from "../../assets/js/global";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        tenantId: "test",
        userId: "admin",
        password: "123456",
      },
      loginFormRules: {
        tenantId: [
          { required: true, message: "请输入租户名", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    loginClick() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await postLogin(this.loginForm);
        if (res.code !== 1) {
          return this.$message.error("登录失败：" + res.message);
        }
        this.$message.success("登录成功");
        await this.initial_pages(res.data);
        // 路由导航到主页：
        this.$router.push("/home").catch((err) => {
          console.log(err);
        });
      });
    },
    async initial_pages(res_login_data) {
      // 初始化缓存数据：
      const baseData = {
        tenantId: this.loginForm.tenantId,
        userId: this.loginForm.userId,
        orgId: res_login_data.orgId,
        token: res_login_data.token,
      };
      let res_initial = await initial_window_sessionStorage(baseData);
      if (res_initial.code !== 1) {
        return this.$message.error(
          "登录后初始化缓存数据失败: " + res_initial.message
        );
      }
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>

<style scoped>
.login-container {
  background-color: #f0f2f5;
  height: 100%;
}

.login-box {
  height: 350px;
  width: 450px;
  border-radius: 10px;
  background-color: #fff;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar-box {
  height: 130px;
  width: 130px;
  background-color: #fff;

  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;

  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login-form {
  position: absolute;
  bottom: 0px;
  box-sizing: border-box;
  padding: 0 20px;
  width: 100%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>