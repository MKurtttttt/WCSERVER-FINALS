<template>
  <div class="absolute left-0 w-1/2 h-full z-10 flex items-center justify-center transition-all duration-500">
    <form @submit.prevent="handleLogin" class="flex flex-col items-center bg-white px-10 w-full">
      <h1 class="text-2xl font-bold mb-4">Sign In</h1>
      <input v-model="email" type="email" placeholder="Email" class="w-full bg-gray-100 p-3 mb-3 rounded" />
      <input v-model="password" type="password" placeholder="Password" class="w-full bg-gray-100 p-3 mb-3 rounded" />
      <a href="#" class="text-sm text-gray-500 mb-4">Forgot your password?</a>
      <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-10 rounded-full transition">
        Sign In
      </button>
      <p class="mt-6 text-gray-500 text-sm">
        Don’t have an account? 
        <button @click="$emit('switchMode')" class="text-red-500 hover:underline">Sign Up</button>
      </p>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const { data } = await axios.post("http://localhost:5000/api/auth/login", {
      email: email.value,
      password: password.value,
    });
    console.log("Login successful:", data);
    alert("Welcome back!");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed.");
  }
};
</script>
