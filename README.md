# Book & Media Library

A simple web application for browsing, saving, and managing books and media content. Users can explore a collection of books across different categories, save items to their personal library, and administrators can manage the content.

## What it does

- Browse books and media by category (Fiction, Non-Fiction, Science, History, etc.)
- Search for books by title or author
- Save books to your personal library
- View detailed information about each book
- User authentication and profile management
- Admin panel for content management

## Tech Stack

**Backend:**
- Node.js with Express
- MongoDB database
- JWT authentication
- File upload handling with Multer

**Frontend:**
- Vue.js 3
- Vue Router for navigation
- Axios for API calls
- Vite for development

## Setup

### Backend Setup

1. Go to the backend folder:
```
cd currentBookMedia/backend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the backend folder with:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Go to the frontend folder:
```
cd currentBookMedia/frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

The frontend will run on http://localhost:5173

## Features

- **Home Page**: Browse trending books and media
- **Search**: Find books by title or author
- **Categories**: Filter books by genre
- **User Accounts**: Register, login, and manage profile
- **Save Library**: Save books to your personal collection
- **Admin Panel**: Manage books and media (admin users only)
- **Responsive Design**: Works on desktop and mobile

## Default Admin Account

You can create an admin account by registering a new user and manually updating their role to 'admin' in the database.

## File Structure

```
currentBookMedia/
├── backend/          # Node.js API server
│   ├── controllers/  # API route handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── uploads/      # File uploads
└── frontend/         # Vue.js web app
    ├── src/
    │   ├── components/  # Vue components
    │   ├── views/       # Page components
    │   └── services/    # API services
```
