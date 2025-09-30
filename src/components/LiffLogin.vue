<template>
  <div class="liff-login">
    <h2>LINE LIFF Login</h2>

    <div v-if="status" class="status">{{ status }}</div>

    <button v-if="!isLoggedIn" @click="login">Login with LINE</button>
    <button v-if="isLoggedIn" @click="logout">Logout</button>

    <pre v-if="profile">{{ profile }}</pre>
  </div>
</template>

<script>
export default {
  name: 'LiffLogin',
  props: {
    liffId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      status: 'กำลังเชื่อมต่อ LIFF...',
      isLoggedIn: false,
      profile: ''
    }
  },
  methods: {
    initLiff() {
      liff.init({ liffId: this.liffId })
        .then(() => {
          this.status = 'LIFF initialized'

          if (liff.isLoggedIn()) {
            this.isLoggedIn = true
            this.getProfile()
          } else {
            this.isLoggedIn = false
          }
        })
        .catch(err => {
          this.status = 'LIFF init error: ' + err
          console.error(err)
        })
    },
    getProfile() {
      liff.getProfile()
        .then(p => {
          this.profile = JSON.stringify(p, null, 2)
        })
        .catch(err => {
          console.error('Profile error', err)
        })
    },
    login() {
      liff.login()
    },
    logout() {
      liff.logout()
      window.location.reload()
    }
  },
  mounted() {
    this.initLiff()
  }
}
</script>

<style scoped>
.liff-login {
  padding: 16px;
}
.status {
  margin-bottom: 10px;
  font-weight: bold;
}
button {
  margin: 5px;
  padding: 8px 16px;
  cursor: pointer;
}
pre {
  background: #f0f0f0;
  padding: 10px;
  margin-top: 10px;
}
</style>
