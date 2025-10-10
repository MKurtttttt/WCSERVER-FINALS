<template>
  <div class="detail-page">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <h2>BookMedia</h2>
        </div>
        <button @click="$router.push('/')" class="btn-back">← Back to Home</button>
      </div>
    </nav>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div v-else-if="media" class="detail-container">
      <div class="detail-content">
        <div class="media-image-large">
          <img v-if="media.coverImageUrl" :src="resolveImage(media.coverImageUrl)" :alt="media.title" class="cover-large" />
          <div v-else class="placeholder-img">📚</div>
        </div>

        <div class="media-details">
          <h1>{{ media.title }}</h1>
          <p class="author-large">by {{ media.author }}</p>
          <span class="category-large">{{ media.category }}</span>

          <div class="stats-section">
            <div class="stat">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ media.views }} views</span>
            </div>
            <div class="stat">
              <span class="stat-icon">💾</span>
              <span class="stat-value">{{ media.saves }} saves</span>
            </div>
          </div>

          <div class="actions-section">
            <button v-if="isLoggedIn" @click="saveToLibrary" class="btn-save-large">
              Save to Library
            </button>
            <button v-else @click="$router.push('/auth')" class="btn-login-large">
              Login to Save
            </button>
          </div>

          <div class="info-section">
            <h3>About this Book</h3>
            <p class="description">
              This is a {{ media.category }} book by {{ media.author }}. 
              Explore this title and many more in our extensive collection.
            </p>
            <div class="meta-info">
              <p><strong>Added:</strong> {{ formatDate(media.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <h2>Media not found</h2>
      <button @click="$router.push('/')" class="btn-primary">Go Home</button>
    </div>
  </div>
</template>

<script>
import { mediaAPI, userMediaAPI, PUBLIC_BASE_URL } from '../services/api'

export default {
  name: 'MediaDetail',
  data() {
    return {
      media: null,
      loading: false,
      isLoggedIn: false
    }
  },
  mounted() {
    this.checkAuth()
    this.loadMedia()
  },
  methods: {
    checkAuth() {
      this.isLoggedIn = !!localStorage.getItem('token')
    },
    resolveImage(path) {
      if (!path) return ''
      if (path.startsWith('http://') || path.startsWith('https://')) return path
      return `${PUBLIC_BASE_URL}${path}`
    },
    async loadMedia() {
      this.loading = true
      try {
        const response = await mediaAPI.getById(this.$route.params.id)
        this.media = response.data
      } catch (error) {
        console.error('Error loading media:', error)
      } finally {
        this.loading = false
      }
    },
    async saveToLibrary() {
      try {
        await userMediaAPI.add({ 
          mediaId: this.media._id, 
          status: 'To Read' 
        })
        alert('Media saved to your library!')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to save media')
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
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

.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.loading {
  text-align: center;
  padding: 100px;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.detail-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 60px;
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.media-image-large {
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.cover-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.placeholder-img {
  font-size: 120px;
}

.media-details h1 {
  font-size: 42px;
  margin-bottom: 15px;
  color: #2c3e50;
}

.author-large {
  font-size: 24px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.category-large {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 30px;
}

.stats-section {
  display: flex;
  gap: 30px;
  margin: 30px 0;
  padding: 20px 0;
  border-top: 1px solid #ecf0f1;
  border-bottom: 1px solid #ecf0f1;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 24px;
}

.stat-value {
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.actions-section {
  margin: 30px 0;
}

.btn-save-large,
.btn-login-large {
  background: #27ae60;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s;
}

.btn-save-large:hover {
  background: #229954;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
}

.btn-login-large {
  background: #3498db;
}

.btn-login-large:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.info-section {
  margin-top: 40px;
}

.info-section h3 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.description {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 30px;
}

.meta-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
}

.meta-info p {
  margin: 10px 0;
  color: #7f8c8d;
  font-size: 14px;
}

.meta-info strong {
  color: #2c3e50;
}

.error-state {
  text-align: center;
  padding: 100px 20px;
}

.error-state h2 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 30px;
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
}

.btn-primary:hover {
  background: #2980b9;
}

@media (max-width: 968px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .media-image-large {
    height: 400px;
  }
  
  .media-details h1 {
    font-size: 32px;
  }
}
</style>