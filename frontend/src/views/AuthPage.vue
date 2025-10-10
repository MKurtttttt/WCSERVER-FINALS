<template>
  <div class="auth-page">
    <div class="auth-container" :class="{ 'right-panel-active': isSignUp }">
      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>Sign In</h1>
          <input v-model="loginForm.email" type="email" placeholder="Email" required />
          <input v-model="loginForm.password" type="password" placeholder="Password" required />
          <button type="submit" class="auth-btn">Sign In</button>
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </form>
      </div>

      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister">
          <h1>Create Account</h1>
          <input v-model="registerForm.name" type="text" placeholder="Name" required />
          <input v-model="registerForm.email" type="email" placeholder="Email" required />
          <input v-model="registerForm.password" type="password" placeholder="Password" required />
          <div class="role-select">
            <label>
              <input v-model="registerForm.role" type="radio" value="user" /> User
            </label>
            <label>
              <input v-model="registerForm.role" type="radio" value="admin" /> Admin
            </label>
          </div>
          <button type="submit" class="auth-btn">Sign Up</button>
          <p v-if="registerError" class="error-message">{{ registerError }}</p>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button class="ghost-btn" @click="togglePanel">Sign In</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button class="ghost-btn" @click="togglePanel">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../services/api'

export default {
  name: 'AuthPage',
  data() {
    return {
      isSignUp: false,
      loginForm: { email: '', password: '' },
      registerForm: { name: '', email: '', password: '', role: 'user' },
      loginError: '',
      registerError: ''
    }
  },
  methods: {
    togglePanel() {
      this.isSignUp = !this.isSignUp
      this.loginError = ''
      this.registerError = ''
    },
    async handleLogin() {
      this.loginError = ''
      try {
        const response = await authAPI.login(this.loginForm)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        if (response.data.user.role === 'admin') {
          this.$router.push('/admin')
        } else {
          this.$router.push('/')
        }
      } catch (error) {
        this.loginError = error.response?.data?.message || 'Login failed'
      }
    },
    async handleRegister() {
      this.registerError = ''
      try {
        await authAPI.register(this.registerForm)
        alert('Registration successful! Please sign in.')
        this.isSignUp = false
        this.registerForm = { name: '', email: '', password: '', role: 'user' }
      } catch (error) {
        this.registerError = error.response?.data?.message || 'Registration failed'
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFC5C5 0%, #f472b6 100%);
}

.auth-container {
  position: relative;
  width: 900px;
  max-width: 100%;
  min-height: 550px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  overflow: hidden;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.auth-container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.auth-container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

form {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

h1 {
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

input {
  background: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 5px;
  font-size: 14px;
}

input:focus {
  outline: none;
  background: #e0e0e0;
}

.role-select {
  display: flex;
  gap: 20px;
  margin: 10px 0;
}

.role-select label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.auth-btn {
   border-radius: 20px;
  border: 1px solid #020202;
  background: #7D3131;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
  margin-top: 15px;
}

.auth-btn:active {
  transform: scale(0.95);
}

.auth-btn:hover {
  background: #c9424d;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.auth-container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: linear-gradient(to right, #D26565, #7D3131);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.auth-container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.auth-container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.auth-container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.overlay-panel h1 {
  color: #fff;
  margin-bottom: 15px;
}

.overlay-panel p {
  font-size: 14px;
  line-height: 20px;
  margin: 20px 0 30px;
}

.ghost-btn {
  border-radius: 20px;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}

.ghost-btn:active {
  transform: scale(0.95);
}

.ghost-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>