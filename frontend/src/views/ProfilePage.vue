<template>
  <div class="profile-page">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <h2>BookMedia</h2>
        </div>
        <button @click="$router.push('/')" class="btn-back">← Back to Home</button>
      </div>
    </nav>

    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar">
          <span>{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <h1>{{ user.name }}</h1>
          <p>{{ user.email }}</p>
          <span class="role-badge" :class="user.role">{{ user.role }}</span>
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <h2>Edit Profile</h2>
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label>Name</label>
              <input v-model="editForm.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="editForm.email" type="email" required />
            </div>
            <div class="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input v-model="editForm.password" type="password" placeholder="Enter new password" />
            </div>
            <button type="submit" class="btn-primary">Update Profile</button>
            <p v-if="updateMessage" class="message" :class="{ error: updateError }">
              {{ updateMessage }}
            </p>
          </form>
        </div>

        <div class="profile-card">
          <h2>My Statistics</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">Total Books</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.reading }}</div>
              <div class="stat-label">Currently Reading</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.completed }}</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.toRead }}</div>
              <div class="stat-label">To Read</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userMediaAPI } from '../services/api'

export default {
  name: 'ProfilePage',
  data() {
    return {
      user: {
        name: '',
        email: '',
        role: 'user'
      },
      editForm: {
        name: '',
        email: '',
        password: ''
      },
      stats: {
        total: 0,
        reading: 0,
        completed: 0,
        toRead: 0
      },
      updateMessage: '',
      updateError: false
    }
  },
  computed: {
    userInitials() {
      return this.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },
  mounted() {
    this.loadUserData()
    this.loadStats()
  },
  methods: {
    loadUserData() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      this.user = userData
      this.editForm = {
        name: userData.name || '',
        email: userData.email || '',
        password: ''
      }
    },
    async loadStats() {
      try {
        const response = await userMediaAPI.getAll()
        const userMedia = response.data
        
        this.stats.total = userMedia.length
        this.stats.reading = userMedia.filter(m => m.status === 'In Progress').length
        this.stats.completed = userMedia.filter(m => m.status === 'Completed').length
        this.stats.toRead = userMedia.filter(m => m.status === 'To Read').length
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    },
    async updateProfile() {
      this.updateMessage = ''
      this.updateError = false
      
      try {
        const updatedUser = { ...this.user, ...this.editForm }
        delete updatedUser.password
        localStorage.setItem('user', JSON.stringify(updatedUser))
        this.user = updatedUser
        
        this.updateMessage = 'Profile updated successfully!'
        this.editForm.password = ''
      } catch (error) {
        this.updateError = true
        this.updateMessage = error.response?.data?.message || 'Failed to update profile'
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #2c3e50;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h2 {
  margin: 0;
  font-size: 24px;
  color: #3498db;
}

.btn-back {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #2980b9;
}

.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-header {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: white;
}

.user-info h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #2c3e50;
}

.user-info p {
  margin: 0 0 10px 0;
  color: #7f8c8d;
  font-size: 16px;
}

.role-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #e74c3c;
  color: white;
}

.role-badge.user {
  background: #3498db;
  color: white;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.profile-card {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.profile-card h2 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: background 0.3s;
  width: 100%;
}

.btn-primary:hover {
  background: #2980b9;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  background: #d4edda;
  color: #155724;
  text-align: center;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.3s;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 8px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>