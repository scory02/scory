<template>
  <div class="login">
    <div class="loginBox">
      <div class="left_box" v-if="!isMobile">
        <!-- <img src="/loginbg.jpg" /> -->
        <propeller class="h-full w-full" />
      </div>
      <div class="right_box">
        <div class="logoTxt">
          <h1>Scory</h1>
          <h1>Scory</h1>
          <h1>Scory</h1>
          <h1>Scory</h1>
          <h1>Scory</h1>
        </div>
        <n-tabs class="tabs" animated default-value="signin" size="large" justify-content="space-evenly">
          <n-tab-pane name="signin" tab="登录">
            <n-form ref="formRef" :model="login" :rules="rules" label-placement="left" label-width="auto">
              <n-form-item-row path="username">
                <n-input v-model:value="login.username" placeholder="请输入账号">
                  <template #prefix>
                    <n-icon :component="PeopleLock20Filled" />
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row path="password">
                <n-input type="password" show-password-on="mousedown" placeholder="请输入密码" :maxlength="16"
                  v-model:value="login.password">
                  <template #prefix>
                    <n-icon :component="LockClosed16Regular" />
                  </template>
                </n-input>
              </n-form-item-row>
            </n-form>
            <n-space item-style="display: flex;gap: 8px 12px;" justify="space-between">
              <n-checkbox v-model:checked="checked">
                记住密码
              </n-checkbox>
              <n-button text>
                忘记密码
              </n-button>
            </n-space>
            <n-button type="primary"
              class="button animate-bounce-alt animate-count-infinite animate-duration-1s hover:animate-none"
              attr-type="button" block secondary strong :disabled="!login.username || !login.password" @click="submit">
              登录
            </n-button>
            <pre>{{ JSON.stringify(login, null, 2) }}</pre>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form ref="formRef" :model="logon" :rules="rules" label-placement="left" label-width="auto">
              <n-form-item-row path="username">
                <n-input v-model:value="logon.username" placeholder="请输入账号">
                  <template #prefix>
                    <n-icon :component="PeopleLock20Filled" />
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row path="password">
                <n-input type="password" show-password-on="mousedown" placeholder="请输入密码" :maxlength="16"
                  v-model:value="logon.password">
                  <template #prefix>
                    <n-icon :component="LockClosed16Regular" />
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row path="repassword">
                <n-input type="password" show-password-on="mousedown" placeholder="请输入密码" :maxlength="16"
                  v-model:value="logon.repassword">
                  <template #prefix>
                    <n-icon :component="LockClosed16Regular" />
                  </template>
                </n-input>
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong
              :disabled="!logon.username || !logon.password || !logon.repassword" @click="submit">
              注册
            </n-button>
            <pre>{{ JSON.stringify(logon, null, 2) }}</pre>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
    <div class="beian">
      <span style="font-family:arial;">Copyright &copy;scory </span>
      <n-divider vertical />
      <a href="https://beian.miit.gov.cn/" target="_blank" class="a">陕ICP备2023002971号-1</a>
      <n-divider vertical />
        <img src="/beian.png" class="w-5 h-5 inline mr-1" />
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=61102402611051" target="_blank"
          class="a">陕公网安备 61102402611051号</a>
    </div>
  </div>
</template>

<script setup>
import { useMessage } from 'naive-ui'
import propeller from '@/views/modal/propeller.vue';
import { LockClosed16Regular, PeopleLock20Filled } from "@vicons/fluent";
import generatePassword from "@/utils/pwd";
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user'
import { ResultEnum } from '@/enums';
import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()

const UserStore = useUserStore()
const user = UserStore.getUserInfo()
const router = useRouter();
const route = useRoute();
const message = useMessage()
const formRef = ref(null);
const login = ref({
  username: user?.username || generatePassword(6, true, false, false, false, false),
  password: user?.password || generatePassword(),
});
const logon = ref({
  username: generatePassword(6, true, false, false, false, false),
  password: generatePassword(),
  repassword: null
});
const rules = {
  username: {
    required: true,
    message: "请输入姓名",
  },
  password: {
    required: true,
    message: "请输入密码",
  },
  repassword: {
    required: true,
    message: "请再次输入密码",
  }
}
const checked = ref(user?.checked || false)
const isMobile = computed(() => width.value <= 1000)
function submit() {
  message.loading('登录中...');
  formRef.value?.validate((errors) => {
    if (!errors) {
      try {
        setTimeout(() => {
          message.destroyAll();
          UserStore.login({ ...login.value, checked: checked.value }).then(res => {
            const { code, message: msg } = res
            if (code == ResultEnum.SUCCESS) {
              message.success('登录成功，即将进入系统');
              console.log(route);
              if (route.fullPath.includes('/login')) {
                router.replace('/manage');
              } else router.replace('/login');
            } else {
              message.info(msg || '登录失败');
            }
          })
          /* if (checked.value) {
            store.change({ ...login.value, checked: checked.value })
          } */
        }, 2000);
      } finally {
        console.log(login.value);
      }
    } else {
      message.error("验证失败");
    }
  })
}
/* $(window).keydown(
  throttle(function (event) {
    switch (event.keyCode) {
      case 13:
        if (login.value.username && login.value.password) {
          submit()
        }
        break;
      default:
        break;
    }
  }, 1000)
); */
</script>

<style lang="less" scoped>
.login {
  background: cadetblue;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginBox {
  gap: 8px 12px;
  width: 40%;
  height: 60%;
  background: white;
  border: 7px solid rgba(47, 53, 66, 0.05);
  box-shadow: -50px -50px 100px #2da3a7, 50px 50px 100px #cfebecf5;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .left_box,
  .right_box {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

}

.right_box {
  flex-direction: column;

  .logoTxt {
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.tabs {
  padding: 5%;
  height: 80%;
}

.button {
  margin: 20px 0;
}

img {
  border-radius: 20px;
}


@media screen and (min-height:600px) and (max-height:900px) {
  .loginBox {
    width: 70%;
    height: 70%;
  }
}

@media screen and (min-width:900px) and (max-width: 1000px) {
  .loginBox {
    width: 90%;
    height: 90%;
  }
}
</style>
<!-- logo -->
<style scoped>
.logoTxt {
  animation: wobble 5s ease-in-out infinite;
  transform-origin: center center;
  transform-style: preserve-3d;
  /* perspective: 500px; */
}

@keyframes wobble {

  0%,
  100% {
    transform: rotate3d(1, 1, 0, 40deg);
  }

  25% {
    transform: rotate3d(-1, 1, 0, 40deg);
  }

  50% {
    transform: rotate3d(-1, -1, 0, 40deg);
  }

  75% {
    transform: rotate3d(1, -1, 0, 40deg);
  }
}

h1 {
  position: absolute;
  display: block;
  width: 100%;
  left: -70px;
  font-size: 50px;
  font-weight: bold;
  color: rgba(255, 100, 100, 1);
  text-shadow:
    0 0 5px rgba(255, 0, 0, 1),
    0 0 20px rgba(255, 0, 0, .8),
    0 0 50px rgba(255, 0, 0, .6);
  animation: glow 10s ease-in-out infinite;
}

@keyframes glow {
  from {
    filter: hue-rotate(0);
  }

  to {
    filter: hue-rotate(360deg);
  }
}

h1:nth-child(2) {
  transform: translateZ(5px);
}

h1:nth-child(3) {
  transform: translateZ(10px);
}

h1:nth-child(4) {
  transform: translateZ(15px);
}

h1:nth-child(5) {
  transform: translateZ(20px);
}
</style>
<!-- login按钮 -->
<style scoped>
.login:nth-child(1) {
  background: linear-gradient(238deg,
      rgb(130, 255, 0) 0%,
      rgb(0, 84, 166) 100%);
  animation: move 12s infinite linear;
}

@keyframes move {
  0% {
    filter: unset;
  }

  100% {
    filter: hue-rotate(360deg);
  }
}
</style>