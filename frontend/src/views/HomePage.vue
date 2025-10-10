<template>
  <div class="home-page">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <h2>BookMedia</h2>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link active">Home</router-link>
          
          <div class="dropdown">
            <button class="nav-link dropdown-btn">
              Category <span>▼</span>
            </button>
            <div class="dropdown-content">
              <a @click="filterByCategory('')">All</a>
              <a @click="filterByCategory('Fiction')">Fiction</a>
              <a @click="filterByCategory('Non-Fiction')">Non-Fiction</a>
              <a @click="filterByCategory('Science')">Science</a>
              <a @click="filterByCategory('History')">History</a>
              <a @click="filterByCategory('Biography')">Biography</a>
              <a @click="filterByCategory('Fantasy')">Fantasy</a>
              <a @click="filterByCategory('Mystery')">Mystery</a>
            </div>
          </div>

          <router-link to="/saved" class="nav-link" v-if="isLoggedIn">Saved</router-link>
          <router-link to="/profile" class="nav-link" v-if="isLoggedIn">Profile</router-link>
          <router-link to="/admin" class="nav-link" v-if="isAdmin">Admin</router-link>
        </div>
        <div class="nav-actions">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              @input="handleSearch"
              type="text" 
              placeholder="Search books..."
            />
            <button @click="handleSearch">🔍</button>
          </div>
          <button v-if="!isLoggedIn" @click="$router.push('/auth')" class="btn-login">
            Login
          </button>
          <button v-else @click="handleLogout" class="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <section class="hero-section">
      <div class="hero-content">
        <h1>Discover Your Next Great Read</h1>
        <p>Explore thousands of books and media from various genres</p>
      </div>
    </section>

    <section class="trending-section">
      <div class="container">
        <h2>Trending Now</h2>
        <div class="loading" v-if="loading">
          <div class="spinner"></div>
        </div>
        <div class="media-grid" v-else>
          <div 
            v-for="item in displayedMedia" 
            :key="item._id" 
            class="media-card"
            @click="viewMediaDetail(item._id)"
          >
            <div class="media-image">
              <img v-if="item.coverImageUrl" :src="resolveImage(item.coverImageUrl)" :alt="item.title" />
              <div v-else class="placeholder-img">📚</div>
            </div>
            <div class="media-info">
              <h3>{{ item.title }}</h3>
              <p class="author">by {{ item.author }}</p>
              <p class="category">{{ item.category }}</p>
              <div class="media-stats">
                <span>👁️ {{ item.views }}</span>
                <span>💾 {{ item.saves }}</span>
              </div>
              <button 
                v-if="isLoggedIn" 
                @click.stop="saveMedia(item._id)"
                class="btn-save"
              >
                Save to Library
              </button>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="page-btn"
          >
            Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mediaAPI, userMediaAPI, PUBLIC_BASE_URL } from '../services/api'

export default {
  name: 'HomePage',
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      displayedMedia: [],
      loading: false,
      currentPage: 1,
      totalPages: 1,
      limit: 12,
      isLoggedIn: false,
      isAdmin: false
    }
  },
  mounted() {
    this.checkAuth()
    this.loadMedia()
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      this.isLoggedIn = !!token
      this.isAdmin = user.role === 'admin'
    },
    resolveImage(path) {
      if (!path) return ''
      if (path.startsWith('http://') || path.startsWith('https://')) return path
      return `${PUBLIC_BASE_URL}${path}`
    },
    async loadMedia() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.limit
        }
        if (this.searchQuery) params.title = this.searchQuery
        if (this.selectedCategory) params.category = this.selectedCategory

        const response = await mediaAPI.getAll(params)
        this.displayedMedia = response.data.results
        this.totalPages = Math.ceil(response.data.total / this.limit)
      } catch (error) {
        console.error('Error loading media:', error)
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.loadMedia()
    },
    filterByCategory(category) {
      this.selectedCategory = category
      this.currentPage = 1
      this.loadMedia()
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadMedia()
        window.scrollTo(0, 0)
      }
    },
    viewMediaDetail(id) {
      this.$router.push(`/media/${id}`)
    },
    async saveMedia(mediaId) {
      try {
        await userMediaAPI.add({ mediaId, status: 'To Read' })
        alert('Media saved to your library!')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to save media')
      }
    },
    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isLoggedIn = false
      this.isAdmin = false
      this.$router.push('/auth')
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
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.logo h2 {
  margin: 0;
  font-size: 24px;
  color: #ec4899;
}

.nav-links {
  display: flex;
  gap: 25px;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover, .nav-link.active {
  color: #3498db;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dropdown-btn span {
  font-size: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background: white;
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-radius: 5px;
  top: 100%;
  left: 0;
  margin-top: 10px;
  z-index: 1001;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  color: #2c3e50;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
  transition: background 0.3s;
}

.dropdown-content a:hover {
  background: #f1f1f1;
}

.nav-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 25px;
  overflow: hidden;
}

.search-box input {
  border: none;
  padding: 8px 15px;
  outline: none;
  width: 200px;
}

.search-box button {
  background: #3498db;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-box button:hover {
  background: #2980b9;
}

.btn-login, .btn-logout {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-login:hover {
  background: #2980b9;
}

.btn-logout {
  background: #e74c3c;
}

.btn-logout:hover {
  background: #c0392b;
}

.hero-section {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 20px;
  opacity: 0.9;
}

.trending-section {
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.trending-section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
  color: #2c3e50;
}

.loading {
  text-align: center;
  padding: 40px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.media-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.media-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.media-image {
  height: 200px;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder-img {
  font-size: 60px;
}

.media-info {
  padding: 20px;
}

.media-info h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #2c3e50;
}

.author {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 5px;
}

.category {
  display: inline-block;
  background: #ec4899;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  margin: 10px 0;
}

.media-stats {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #7f8c8d;
  margin: 10px 0;
}

.btn-save {
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  transition: background 0.3s;
}

.btn-save:hover {
  background: #229954;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #2980b9;
}

.page-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>