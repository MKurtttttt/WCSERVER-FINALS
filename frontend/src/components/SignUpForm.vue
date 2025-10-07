<template>
  <div class="absolute left-0 w-1/2 h-full z-10 flex items-center justify-center transition-all duration-500">
    <form @submit.prevent="handleRegister" class="flex flex-col items-center bg-white px-10 w-full">
      <h1 class="text-2xl font-bold mb-4">Create Account</h1>
      <input v-model="name" type="text" placeholder="Name" class="w-full bg-gray-100 p-3 mb-3 rounded" />
      <input v-model="email" type="email" placeholder="Email" class="w-full bg-gray-100 p-3 mb-3 rounded" />
      <input v-model="password" type="password" placeholder="Password" class="w-full bg-gray-100 p-3 mb-3 rounded" />
      <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-10 rounded-full transition">
        Sign Up
      </button>
      <p class="mt-6 text-gray-500 text-sm">
        Already have an account? 
        <button @click="$emit('switchMode')" class="text-red-500 hover:underline">Sign In</button>
      </p>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const name = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  try {
    const { data } = await axios.post("http://localhost:5000/api/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    console.log("Registered:", data);
    alert("Account created successfully!");
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed.");
  }
};
</script>
