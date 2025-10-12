<template>
  <div class="admin-page">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo" @click="$router.push('/')" style="cursor: pointer;">
          <h2 class="logo-text">Book & Media Library - Admin Panel</h2>
        </div>
        <div class="nav-actions">
          <button @click="$router.push('/')" class="btn-home">Home</button>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </div>
    </nav>

    <div class="admin-container">
      <div class="admin-header">
        <h1>Media Management</h1>
        <button @click="openCreateModal" class="btn-create">+ Add New Media</button>
      </div>

      <div class="admin-controls">
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="text" 
          placeholder="Search by title or author..."
          class="search-input"
        />
        <select v-model="filterCategory" @change="handleSearch" class="filter-select">
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Biography">Biography</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Mystery">Mystery</option>
        </select>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else class="table-container">
        <table class="media-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Views</th>
              <th>Saves</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in mediaList" :key="item._id">
              <td>
                <img v-if="item.coverImageUrl" :src="resolveImage(item.coverImageUrl)" alt="cover" class="cover-thumb" />
              </td>
              <td>{{ item.title }}</td>
              <td>{{ item.author }}</td>
              <td><span class="category-badge">{{ item.category }}</span></td>
              <td>{{ item.views }}</td>
              <td>{{ item.saves }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td class="actions-cell">
                <button @click="openEditModal(item)" class="btn-action btn-edit-sm">Edit</button>
                <button @click="deleteMedia(item._id)" class="btn-action btn-delete-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="mediaList.length === 0" class="empty-table">
          <p>No media found</p>
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

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ isEditMode ? 'Edit Media' : 'Add New Media' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Title *</label>
            <input v-model="form.title" type="text" required />
          </div>

          <div class="form-group">
            <label>Author *</label>
            <input v-model="form.author" type="text" required />
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select v-model="form.category" required>
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
            </select>
          </div>

          <div class="form-group">
            <label>Cover Image</label>
            <input ref="coverInput" type="file" accept="image/*" />
          </div>

          <div class="form-group">
            <label>Gallery Images (you can select multiple)</label>
            <input ref="galleryInput" type="file" accept="image/*" multiple />
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-submit">
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
            <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mediaAPI, PUBLIC_BASE_URL } from '../services/api'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      mediaList: [],
      searchQuery: '',
      filterCategory: '',
      loading: false,
      showModal: false,
      isEditMode: false,
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      form: {
        id: null,
        title: '',
        author: '',
        category: ''
      }
    }
  },
  mounted() {
    this.loadMedia()
  },
  methods: {
    async loadMedia() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.limit
        }
        if (this.searchQuery) {
          params.title = this.searchQuery
          params.author = this.searchQuery
        }
        if (this.filterCategory) params.category = this.filterCategory

        const response = await mediaAPI.getAll(params)
        this.mediaList = response.data.results
        this.totalPages = Math.ceil(response.data.total / this.limit)
      } catch (error) {
        console.error('Error loading media:', error)
        alert('Failed to load media')
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.loadMedia()
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadMedia()
      }
    },
    openCreateModal() {
      this.isEditMode = false
      this.form = {
        id: null,
        title: '',
        author: '',
        category: ''
      }
      this.showModal = true
    },
    openEditModal(item) {
      this.isEditMode = true
      this.form = {
        id: item._id,
        title: item.title,
        author: item.author,
        category: item.category
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async submitForm() {
      try {
        const fd = new FormData()
        fd.append('title', this.form.title)
        fd.append('author', this.form.author)
        fd.append('category', this.form.category)

        const coverFile = this.$refs.coverInput?.files?.[0]
        if (coverFile) fd.append('cover', coverFile)

        const galleryFiles = this.$refs.galleryInput?.files || []
        for (let i = 0; i < galleryFiles.length; i++) {
          fd.append('gallery', galleryFiles[i])
        }

        if (this.isEditMode) {
          await mediaAPI.updateMultipart(this.form.id, fd)
          alert('Media updated successfully!')
        } else {
          await mediaAPI.createMultipart(fd)
          alert('Media created successfully!')
        }
        this.closeModal()
        this.loadMedia()
      } catch (error) {
        alert(error.response?.data?.message || 'Operation failed')
      }
    },
    async deleteMedia(id) {
      if (!confirm('Are you sure you want to delete this media?')) return
      
      try {
        await mediaAPI.delete(id)
        alert('Media deleted successfully!')
        this.loadMedia()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete media')
      }
    },
    resolveImage(path) {
      if (!path) return ''
      if (path.startsWith('http://') || path.startsWith('https://')) return path
      return `${PUBLIC_BASE_URL}${path}`
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/auth')
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #7D3131 0%, #D26565 100%);
  color: #000000;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h2 {
  margin: 0;
  font-size: 24px;
  font-family: 'Rock Salt', cursive;
  color: #ffffff;
}

.nav-actions {
  display: flex;
  gap: 15px;
}

.btn-home {
  background: #7D3131;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  transition: background 0.3s;
}

.btn-home:hover {
  background: #5a2424;
}

.btn-logout {
  background: #7D3131;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #5a2424;
}

.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.admin-header h1 {
  font-size: 36px;
  color: #2c3e50;
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.btn-create {
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-create:hover {
  background: #229954;
}

.admin-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  min-width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: #FFC5C5;
}

.filter-select {
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  cursor: pointer;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #FFC5C5;
}

.loading {
  text-align: center;
  padding: 60px;
}

.table-container {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.media-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.media-table thead {
  background: #FFC5C5;
  color: #000000;
}

.media-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
}

.media-table td {
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
}

.media-table tbody tr:hover {
  background: #f8f9fa;
}

.category-badge {
  display: inline-block;
  background: #FFC5C5;
  color: #000000;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.cover-thumb {
  width: 48px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.actions-cell {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s;
}

.btn-edit-sm {
  background: #FFC5C5;
  color: #000000;
}

.btn-edit-sm:hover {
  background: #ffb0b0;
}

.btn-delete-sm {
  background: #7D3131;
  color: white;
}

.btn-delete-sm:hover {
  background: #5a2424;
}

.empty-table {
  padding: 60px;
  text-align: center;
  color: #7f8c8d;
  font-size: 18px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  background: #7D3131;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  transition: background 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #5a2424;
}

.page-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  color: #2c3e50;
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
}

.modal-content h2 {
  margin-bottom: 25px;
  color: #2c3e50;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  color: #2c3e50;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #FFC5C5;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn-submit {
  flex: 1;
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #229954;
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
  font-family: 'Montserrat', sans-serif;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #7f8c8d;
}
</style>