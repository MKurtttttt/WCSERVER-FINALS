<template>
  <div class="saved-page">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <h2>BookMedia</h2>
        </div>
        <button @click="$router.push('/')" class="btn-back">← Back to Home</button>
      </div>
    </nav>

    <div class="saved-container">
      <h1>My Saved Library</h1>
      
      <div class="filter-tabs">
        <button 
          @click="filterStatus = ''" 
          :class="{ active: filterStatus === '' }"
          class="tab-btn"
        >
          All ({{ savedMedia.length }})
        </button>
        <button 
          @click="filterStatus = 'To Read'" 
          :class="{ active: filterStatus === 'To Read' }"
          class="tab-btn"
        >
          To Read ({{ countByStatus('To Read') }})
        </button>
        <button 
          @click="filterStatus = 'In Progress'" 
          :class="{ active: filterStatus === 'In Progress' }"
          class="tab-btn"
        >
          Reading ({{ countByStatus('In Progress') }})
        </button>
        <button 
          @click="filterStatus = 'Completed'" 
          :class="{ active: filterStatus === 'Completed' }"
          class="tab-btn"
        >
          Completed ({{ countByStatus('Completed') }})
        </button>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="filteredMedia.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>No books in your library yet</h2>
        <p>Start adding books to build your collection!</p>
        <button @click="$router.push('/')" class="btn-primary">Explore Books</button>
      </div>

      <div v-else class="saved-grid">
        <div 
          v-for="item in filteredMedia" 
          :key="item._id" 
          class="saved-card"
        >
          <div class="card-image">
            <div class="placeholder-img">📚</div>
            <div class="status-badge" :class="getStatusClass(item.status)">
              {{ item.status }}
            </div>
          </div>
          
          <div class="card-content">
            <h3>{{ item.mediaId.title }}</h3>
            <p class="author">by {{ item.mediaId.author }}</p>
            <p class="category">{{ item.mediaId.category }}</p>
            
            <div class="progress-section" v-if="item.status === 'In Progress'">
              <div class="progress-info">
                <span>Chapter: {{ item.lastReadChapter || 0 }}</span>
                <span>Page: {{ item.lastReadPage || 0 }}</span>
              </div>
            </div>

            <div class="rating-section" v-if="item.rating">
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= item.rating }">
                  ★
                </span>
              </div>
            </div>

            <div class="card-actions">
              <button @click="openEditModal(item)" class="btn-edit">Edit</button>
              <button @click="removeMedia(item._id)" class="btn-remove">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>Update Book Status</h2>
        <form @submit.prevent="updateMedia">
          <div class="form-group">
            <label>Status</label>
            <select v-model="editForm.status" required>
              <option value="To Read">To Read</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="form-group">
            <label>Rating (1-5)</label>
            <div class="star-rating">
              <span 
                v-for="n in 5" 
                :key="n" 
                @click="editForm.rating = n"
                class="star-input"
                :class="{ filled: n <= editForm.rating }"
              >
                ★
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Last Read Chapter</label>
              <input v-model.number="editForm.lastReadChapter" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Last Read Page</label>
              <input v-model.number="editForm.lastReadPage" type="number" min="0" />
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-primary">Update</button>
            <button type="button" @click="closeEditModal" class="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { userMediaAPI } from '../services/api'

export default {
  name: 'SavedPage',
  data() {
    return {
      savedMedia: [],
      filterStatus: '',
      loading: false,
      showEditModal: false,
      editForm: {
        id: null,
        status: '',
        rating: 0,
        lastReadChapter: 0,
        lastReadPage: 0
      }
    }
  },
  computed: {
    filteredMedia() {
      if (!this.filterStatus) return this.savedMedia
      return this.savedMedia.filter(item => item.status === this.filterStatus)
    }
  },
  mounted() {
    this.loadSavedMedia()
  },
  methods: {
    async loadSavedMedia() {
      this.loading = true
      try {
        const response = await userMediaAPI.getAll()
        this.savedMedia = response.data
      } catch (error) {
        console.error('Error loading saved media:', error)
        alert('Failed to load saved media')
      } finally {
        this.loading = false
      }
    },
    countByStatus(status) {
      return this.savedMedia.filter(item => item.status === status).length
    },
    getStatusClass(status) {
      return status.toLowerCase().replace(' ', '-')
    },
    openEditModal(item) {
      this.editForm = {
        id: item._id,
        status: item.status,
        rating: item.rating || 0,
        lastReadChapter: item.lastReadChapter || 0,
        lastReadPage: item.lastReadPage || 0
      }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
    },
    async updateMedia() {
      try {
        await userMediaAPI.update(this.editForm.id, {
          status: this.editForm.status,
          rating: this.editForm.rating || undefined,
          lastReadChapter: this.editForm.lastReadChapter || undefined,
          lastReadPage: this.editForm.lastReadPage || undefined
        })
        await this.loadSavedMedia()
        this.closeEditModal()
        alert('Book updated successfully!')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to update book')
      }
    },
    async removeMedia(id) {
      if (!confirm('Are you sure you want to remove this book from your library?')) return
      
      try {
        await userMediaAPI.delete(id)
        await this.loadSavedMedia()
        alert('Book removed from library')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to remove book')
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

.saved-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.saved-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.saved-container h1 {
  font-size: 36px;
  margin-bottom: 30px;
  color: #2c3e50;
}

.filter-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-btn {
  background: white;
  border: 2px solid #ddd;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.tab-btn:hover {
  border-color: #3498db;
  color: #3498db;
}

.tab-btn.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

.loading {
  text-align: center;
  padding: 60px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 30px;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.saved-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.saved-card:hover {
  transform: translateY(-5px);
}

.card-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.placeholder-img {
  font-size: 60px;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.status-badge.to-read {
  background: #3498db;
}

.status-badge.in-progress {
  background: #f39c12;
}

.status-badge.completed {
  background: #27ae60;
}

.card-content {
  padding: 20px;
}

.card-content h3 {
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
  background: #ecf0f1;
  color: #2c3e50;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  margin: 10px 0;
}

.progress-section {
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #7f8c8d;
}

.rating-section {
  margin: 15px 0;
}

.stars {
  display: flex;
  gap: 5px;
}

.star {
  font-size: 24px;
  color: #ddd;
}

.star.filled {
  color: #f39c12;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-edit, .btn-remove {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-remove {
  background: #e74c3c;
  color: white;
}

.btn-remove:hover {
  background: #c0392b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 20px;
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

.form-group select,
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.star-rating {
  display: flex;
  gap: 10px;
}

.star-input {
  font-size: 32px;
  cursor: pointer;
  color: #ddd;
  transition: color 0.3s;
}

.star-input.filled,
.star-input:hover {
  color: #f39c12;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn-primary {
  flex: 1;
  background: #3498db;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-cancel {
  flex: 1;
  background: #95a5a6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

@media (max-width: 768px) {
  .saved-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>