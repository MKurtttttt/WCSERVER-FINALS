<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 font-[Poppins]">
    <div
      class="relative bg-white rounded-2xl shadow-xl overflow-hidden w-[800px] max-w-full min-h-[500px] transition-all duration-500"
      :class="{ 'right-panel-active': isSignUp }"
      id="container"
    >
      <!-- Sign Up -->
      <div
        class="absolute top-0 h-full w-1/2 flex flex-col items-center justify-center transition-all duration-500"
        :class="{ 'translate-x-full opacity-100 z-10': isSignUp, 'opacity-0 z-0': !isSignUp }"
      >
        <form @submit.prevent="handleSignup" class="flex flex-col items-center justify-center text-center p-10">
          <h1 class="font-bold text-2xl mb-4">Create Account</h1>
          <input v-model="signupForm.name" type="text" placeholder="Name" class="input" required />
          <input v-model="signupForm.email" type="email" placeholder="Email" class="input" required />
          <input v-model="signupForm.password" type="password" placeholder="Password" class="input" required />
          <button type="submit" class="btn mt-4">Sign Up</button>
        </form>
      </div>

      <!-- Sign In -->
      <div
        class="absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center transition-all duration-500 z-20"
        :class="{ 'translate-x-full': isSignUp }"
      >
        <form @submit.prevent="handleLogin" class="flex flex-col items-center justify-center text-center p-10">
          <h1 class="font-bold text-2xl mb-4">Sign in</h1>
          <input v-model="loginForm.email" type="email" placeholder="Email" class="input" required />
          <input v-model="loginForm.password" type="password" placeholder="Password" class="input" required />
          <button type="submit" class="btn mt-4">Sign In</button>
        </form>
      </div>

      <!-- Overlay -->
      <div
        class="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-pink-500 to-red-500 text-white flex flex-col justify-center items-center text-center p-10 transition-all duration-500"
        :class="{ '-translate-x-full': isSignUp }"
      >
        <div v-if="isSignUp">
          <h1 class="text-3xl font-bold mb-3">Welcome Back!</h1>
          <p class="mb-5">To keep connected with us please login with your personal info</p>
          <button @click="togglePanel" class="btn bg-transparent border-white border hover:bg-white hover:text-pink-500">Sign In</button>
        </div>
        <div v-else>
          <h1 class="text-3xl font-bold mb-3">Hello, Friend!</h1>
          <p class="mb-5">Enter your personal details and start your journey with us</p>
          <button @click="togglePanel" class="btn bg-transparent border-white border hover:bg-white hover:text-pink-500">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const isSignUp = ref(false);

const loginForm = ref({
  email: "",
  password: "",
});

const signupForm = ref({
  name: "",
  email: "",
  password: "",
});

const togglePanel = () => {
  isSignUp.value = !isSignUp.value;
};

const handleSignup = async () => {
  try {
    await axios.post("http://localhost:5000/api/auth/register", signupForm.value);
    alert("Signup successful! You can now log in.");
    isSignUp.value = false; // switch to sign in panel
  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};

const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", loginForm.value);
    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};
</script>

<style scoped>
.input {
  @apply bg-gray-100 border-none py-3 px-4 my-2 w-full rounded-md outline-none focus:ring-2 focus:ring-pink-400;
}
.btn {
  @apply bg-pink-500 text-white uppercase font-bold text-sm py-3 px-10 rounded-full tracking-wide hover:bg-pink-600 transition;
}
.right-panel-active .sign-in-container {
  transform: translateX(100%);
}
</style>
