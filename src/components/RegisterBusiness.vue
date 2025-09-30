<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light p-3">
    <div class="card shadow p-4 w-100 mx-2" style="max-width: 420px; border-radius: 12px;">
      <div class="card-body">
        <!-- optional header with LIFF profile -->
        <div v-if="profile" class="d-flex align-items-center mb-3 gap-2">
          <img :src="profile.pictureUrl" class="rounded-circle border border-2 border-success" width="48" height="48" alt="profile" />
          <div>
            <div class="fw-semibold">สวัสดี {{ profile.displayName }}</div>
            <div v-if="profile.statusMessage" class="small text-muted">{{ profile.statusMessage }}</div>
          </div>
        </div>

        <h5 class="card-title text-center mb-2">ยืนยันธุรกิจของคุณ</h5>
        <p class="card-text text-center text-muted mb-4">กรุณากรอกอีเมล์เพื่อรับรหัส OTP สำหรับยืนยันธุรกิจ</p>

        <!-- Step 1: email form -->
        <form v-if="step === 'email'" @submit.prevent="onSendOtp">
          <div class="mb-3">
            <label for="email" class="form-label">อีเมล์</label>
            <input
              id="email"
              type="email"
              v-model.trim="email"
              class="form-control"
              placeholder="example@business.com"
              :disabled="loading"
              required
            />
          </div>

          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-success" :disabled="loading || !isValidEmail">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ส่งรหัส OTP
            </button>
          </div>

          <div v-if="message" class="mt-3 alert" :class="messageClass" role="alert">
            {{ message }}
          </div>
        </form>

        <!-- Step 2: enter OTP -->
        <div v-if="step === 'otp'">
          <div class="mb-2 text-center">
            <small class="text-muted">เราได้ส่งรหัสไปที่ <strong>{{ email }}</strong></small>
          </div>

          <form @submit.prevent="onVerifyOtp" class="mb-2">
            <label class="form-label">กรอกรหัส OTP (ตัวเลข {{ otpLength }} หลัก)</label>

            <!-- simple single-input OTP (you can replace with separated inputs if want) -->
            <input
              type="text"
              v-model="otp"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="6"
              class="form-control mb-2 text-center fs-5"
              :disabled="loading"
              placeholder="๐๐๐๐๐๐"
            />

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary flex-grow-1" :disabled="loading || otp.length !== otpLength">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ยืนยัน
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="onCancel" :disabled="loading">ยกเลิก</button>
            </div>
          </form>

          <div class="d-flex justify-content-between align-items-center mt-2 small">
            <div>
              <span v-if="secondsLeft > 0">รหัสจะหมดอายุใน {{ formatSeconds(secondsLeft) }}</span>
              <span v-else class="text-danger">รหัสหมดอายุ</span>
            </div>

            <div>
              <button
                class="btn btn-link p-0"
                :disabled="resendCooldown > 0 || loading"
                @click="onResend"
              >
                <span v-if="resendCooldown > 0">ส่งซ้ำ ({{ resendCooldown }}s)</span>
                <span v-else>ส่งซ้ำ</span>
              </button>
            </div>
          </div>

          <div v-if="message" class="mt-3 alert" :class="messageClass" role="alert">
            {{ message }}
          </div>
        </div>

        <!-- Step success -->
        <div v-if="step === 'success'" class="text-center">
          <div class="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14z"/>
              <path d="M10.97 5.97a.235.235 0 0 1 .02.022l-3.992 4.99L4.324 8.384a.25.25 0 0 1 .374-.336l2.35 2.02 3.412-4.25a.25.25 0 0 1 .512.134z"/>
            </svg>
          </div>
          <h6 class="mb-2">ยืนยันสำเร็จ</h6>
          <p class="text-muted small mb-3">ขอบคุณ! ระบบได้ยืนยันอีเมล์เรียบร้อย</p>
          <div class="d-grid">
            <button class="btn btn-success" @click="onFinish">เสร็จสิ้น</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmailOtpVerification",
  props: {
    profile: {
      type: Object,
      default: null
    },
    // หากมี backend ให้ใส่ url-api ที่นี่ (optional)
    sendOtpUrl: {
      type: String,
      default: "" // e.g. "/api/send-otp"
    },
    verifyOtpUrl: {
      type: String,
      default: "" // e.g. "/api/verify-otp"
    }
  },
  data() {
    return {
      email: "",
      otp: "",
      step: "email", // email | otp | success
      loading: false,
      message: "",
      messageType: "info", // info | success | danger
      // OTP/timeout settings
      otpLength: 6,
      secondsLeft: 0,
      countdownTimer: null,
      // resend cooldown
      resendCooldown: 0,
      resendTimer: null,
      // for local simulation (no backend)
      USE_LOCAL_SIM: !this.sendOtpUrl || !this.verifyOtpUrl
    };
  },
  computed: {
    isValidEmail() {
      // simple email regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    },
    messageClass() {
      return {
        "alert-info": this.messageType === "info",
        "alert-success": this.messageType === "success",
        "alert-danger": this.messageType === "danger"
      };
    }
  },
  methods: {
    async onSendOtp() {
      if (!this.isValidEmail) {
        this.showMessage("กรุณากรอกอีเมล์ที่ถูกต้อง", "danger");
        return;
      }

      this.loading = true;
      this.message = "";

      try {
        if (this.USE_LOCAL_SIM) {
          // simulate backend: generate OTP and "send"
          const simulatedOtp = this._generateLocalOtp();
          console.log("[SIMULATED OTP]", simulatedOtp); // dev only
          // Store hashed? For demo just keep in-memory
          window.__SIM_OTP = { email: this.email, otp: simulatedOtp };
          this.startOtpCountdown(180); // 3 minutes
          this.startResendCooldown(30);
          this.step = "otp";
          this.showMessage("ส่งรหัส OTP เรียบร้อย โปรดตรวจสอบอีเมล์ (ดู console สำหรับโหมดทดสอบ)", "info");
        } else {
          // real backend request
          const payload = { email: this.email, userId: this.profile?.userId || null };
          const res = await fetch(this.sendOtpUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "ส่ง OTP ไม่สำเร็จ");
          // backend should return ttlSeconds or similar
          const ttl = data.ttlSeconds || 180;
          this.startOtpCountdown(ttl);
          this.startResendCooldown(30);
          this.step = "otp";
          this.showMessage("ส่งรหัส OTP เรียบร้อย โปรดตรวจสอบอีเมล์", "info");
        }
      } catch (err) {
        console.error(err);
        this.showMessage(err.message || "เกิดข้อผิดพลาดขณะส่ง OTP", "danger");
      } finally {
        this.loading = false;
      }
    },

    async onVerifyOtp() {
      if (this.otp.length !== this.otpLength) {
        this.showMessage(`กรุณากรอก OTP ให้ครบ ${this.otpLength} หลัก`, "danger");
        return;
      }

      this.loading = true;
      this.message = "";

      try {
        if (this.USE_LOCAL_SIM) {
          const sim = window.__SIM_OTP;
          if (!sim || sim.email !== this.email) {
            throw new Error("ไม่มีรหัสทดสอบ หรืออีเมล์ไม่ตรง");
          }
          if (this.otp !== sim.otp) {
            throw new Error("รหัส OTP ไม่ถูกต้อง");
          }
          // success
          this.clearTimers();
          this.step = "success";
          this.showMessage("ยืนยันสำเร็จ", "success");
        } else {
          const payload = { email: this.email, otp: this.otp };
          const res = await fetch(this.verifyOtpUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "ยืนยัน OTP ไม่สำเร็จ");
          // backend should respond success and maybe token
          this.clearTimers();
          this.step = "success";
          this.showMessage("ยืนยันสำเร็จ", "success");
        }
      } catch (err) {
        console.error(err);
        this.showMessage(err.message || "เกิดข้อผิดพลาดขณะยืนยัน OTP", "danger");
      } finally {
        this.loading = false;
      }
    },

    onResend() {
      if (this.resendCooldown > 0 || this.loading) return;
      // resend: go through same send function but keep email
      this.onSendOtp();
    },

    onCancel() {
      this.clearTimers();
      this.otp = "";
      this.step = "email";
      this.message = "";
    },

    onFinish() {
      // emit success event to parent with email (or token if backend returned)
      this.$emit("verified", { email: this.email });
      // optional: reset
      // this.resetAll();
    },

    showMessage(text, type = "info") {
      this.message = text;
      this.messageType = type;
    },

    startOtpCountdown(seconds) {
      this.secondsLeft = seconds;
      if (this.countdownTimer) clearInterval(this.countdownTimer);
      this.countdownTimer = setInterval(() => {
        this.secondsLeft--;
        if (this.secondsLeft <= 0) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
      }, 1000);
    },

    startResendCooldown(seconds) {
      this.resendCooldown = seconds;
      if (this.resendTimer) clearInterval(this.resendTimer);
      this.resendTimer = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) {
          clearInterval(this.resendTimer);
          this.resendTimer = null;
        }
      }, 1000);
    },

    clearTimers() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      if (this.resendTimer) {
        clearInterval(this.resendTimer);
        this.resendTimer = null;
      }
      this.secondsLeft = 0;
      this.resendCooldown = 0;
    },

    formatSeconds(sec) {
      if (sec <= 0) return "00:00";
      const m = Math.floor(sec / 60).toString().padStart(2, "0");
      const s = (sec % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    },

    _generateLocalOtp() {
      let s = "";
      for (let i = 0; i < this.otpLength; i++) s += String(Math.floor(Math.random() * 10));
      return s;
    },

    resetAll() {
      this.email = "";
      this.otp = "";
      this.step = "email";
      this.clearTimers();
      this.message = "";
    }
  },

  beforeUnmount() {
    this.clearTimers();
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}

/* ปรับ input OTP ให้เด่นบนมือถือ */
input[maxlength] {
  letter-spacing: 0.35rem;
  font-weight: 600;
  text-align: center;
}

/* ให้ปุ่มเต็มความกว้างในมือถือแต่ไม่เกินขนาดบน desktop */
@media (max-width: 576px) {
  .card { padding: 1rem; }
}
</style>
