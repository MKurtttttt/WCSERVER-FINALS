<template>
  <div class="container" :class="{ 'right-panel-active': isRightPanelActive }">
    <!-- Sign Up Form -->
    <div class="form-container sign-up-container">
      <form @submit.prevent="handleSignup">
        <h1>Create Account</h1>
        <span>Fill the following boxes and join us today!</span>
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>

    <!-- Sign In Form -->
    <div class="form-container sign-in-container">
      <form @submit.prevent="handleLogin">
        <h1>Sign in</h1>
        <span>Sing in today to experience our service!</span>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
    </div>

    <!-- Overlay Panels -->
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>Welcome Back!</h1>
          <p>To keep connected, please log in with your personal info</p>
          <button class="ghost" @click="togglePanel(false)">Sign In</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1>
          <p>Enter your details and start your journey with us</p>
          <button class="ghost" @click="togglePanel(true)">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/auth.css";

export default {
  name: "AuthPanel",
  data() {
    return {
      isRightPanelActive: false,
    };
  },
  methods: {
    togglePanel(state) {
      this.isRightPanelActive = state;
    },
    handleLogin() {
      console.log("Login attempt");
      // later: redirect to /home
    },
    handleSignup() {
      console.log("Signup attempt");
      // later: redirect to login
    },
  },
};
</script>
