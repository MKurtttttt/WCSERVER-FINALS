<template>
  <div class="flex flex-col items-center justify-center px-8 py-10 text-center">
    <h1 class="text-3xl font-semibold mb-6 text-gray-800">Sign In</h1>

    <!-- Alert Messages -->
    <transition name="fade">
      <p v-if="alert.message" :class="alert.type === 'success' ? 'text-green-600' : 'text-red-600'" class="mb-4">
        {{ alert.message }}
      </p>
    </transition>

    <form @submit.prevent="handleLogin" class="flex flex-col w-full max-w-sm">
      <input v-model="email" type="email" placeholder="Email" class="p-3 mb-3 rounded bg-gray-100 focus:outline-none" />
      <input v-model="password" type="password" placeholder="Password" class="p-3 mb-3 rounded bg-gray-100 focus:outline-none" />
      <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded mt-2 transition">
        Login
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      alert: { message: "", type: "" },
    };
  },
  methods: {
    async handleLogin() {
      this.alert.message = "";
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Login failed");

        this.alert = { message: "Login successful! Redirecting...", type: "success" };
        console.log("Login successful:", data);

        // Simulate redirect after short delay
        setTimeout(() => {
          this.$router.push("/home");
        }, 2000);
      } catch (err) {
        this.alert = { message: err.message, type: "error" };
        console.error("Login failed:", err);
        setTimeout(() => (this.alert.message = ""), 3000);
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
