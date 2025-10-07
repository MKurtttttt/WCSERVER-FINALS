<template>
  <div id="container" :class="{'right-panel-active': isRightPanelActive}" class="container">
    <!-- Sign Up -->
    <div class="form-container sign-up-container bg-white">
      <RegisterForm />
    </div>

    <!-- Sign In -->
    <div class="form-container sign-in-container bg-white">
      <LoginForm />
    </div>

    <!-- Overlay -->
    <div class="overlay-container">
      <div class="overlay flex">
        <div class="flex flex-col items-center justify-center text-center w-1/2 p-8">
          <h1 class="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p class="mb-6">To stay connected with us please login with your personal info</p>
          <button @click="togglePanel(false)" class="bg-transparent border border-white px-8 py-2 rounded text-white hover:bg-white hover:text-emerald-700 transition">
            Sign In
          </button>
        </div>

        <div class="flex flex-col items-center justify-center text-center w-1/2 p-8">
          <h1 class="text-4xl font-bold mb-4">Hello, Friend!</h1>
          <p class="mb-6">Enter your personal details and start your journey with us</p>
          <button @click="togglePanel(true)" class="bg-transparent border border-white px-8 py-2 rounded text-white hover:bg-white hover:text-emerald-700 transition">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/auth.css";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";

export default {
  name: "AuthView",
  components: { LoginForm, RegisterForm },
  data() {
    return { isRightPanelActive: false };
  },
  methods: {
    togglePanel(state) {
      this.isRightPanelActive = state;
    },
  },
};
</script>
