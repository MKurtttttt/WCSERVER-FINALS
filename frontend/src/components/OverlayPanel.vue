<template>
  <div
    class="absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-500"
    :class="isSignUpActive ? '-translate-x-full bg-gradient-to-r from-pink-500 to-red-500' : 'translate-x-0 bg-gradient-to-l from-pink-500 to-red-500'"
  >
    <div class="flex flex-col justify-center items-center h-full text-white px-10">
      <h1 class="text-3xl font-bold mb-2">
        {{ isSignUpActive ? 'Welcome Back!' : 'Hello, Friend!' }}
      </h1>
      <p class="text-sm mb-5">
        {{ isSignUpActive ? 'To keep connected with us please login with your personal info' : 'Enter your details and start your journey with us' }}
      </p>
      <button
        @click="$emit('switchMode')"
        class="border-2 border-white text-white px-8 py-2 rounded-full font-bold uppercase text-sm hover:bg-white hover:text-red-500 transition"
      >
        {{ isSignUpActive ? 'Sign In' : 'Sign Up' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isSignUpActive: Boolean
});
</script>
