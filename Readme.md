# 🎨 SVG Holder - Modern SVG Management Platform

A beautiful, modern web application for importing, viewing, and managing SVG files with a MongoDB backend and React frontend.

## ✨ Features

- **🎯 Beautiful SVG Viewer** - Organize SVGs by date (like Google Photos)
- **📤 Easy SVG Import** - Drag & drop interface with preview
- **🔍 Smart Search** - Find SVGs quickly by name or description
- **📥 Direct Download** - Download SVGs directly from the grid
- **📋 Copy to Clipboard** - Copy SVG content with one click
- **🗑️ Safe Deletion** - Remove unwanted SVGs with confirmation
- **📱 Responsive Design** - Works perfectly on all devices
- **🎨 Modern UI** - Beautiful animations and glassmorphism design

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **React Router DOM** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Multer** for file upload handling
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** connection string

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd svgholder
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority
PORT=3001
DB_NAME=svgholder
```

**Note:** Replace the MongoDB URI with your actual connection string.

#### Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Backend will run on:** `http://localhost:3001`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../svgholder
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

## 📁 Project Structure

```
svgholder/
├── backend/                 # Backend Node.js application
│   ├── config.js          # Configuration (MongoDB URI, port)
│   ├── database.js        # MongoDB connection
│   ├── models/            # Mongoose schemas
│   │   └── Svg.js        # SVG data model
│   ├── routes/            # API routes
│   │   └── svgs.js       # SVG CRUD endpoints
│   ├── server.js          # Express server setup
│   └── package.json       # Backend dependencies
│
└── svgholder/             # Frontend React application
    ├── src/
    │   ├── components/    # Reusable UI components
    │   │   └── Navbar.tsx # Navigation component
    │   ├── pages/         # Page components
    │   │   ├── Home.tsx   # Landing page
    │   │   ├── SvgViewer.tsx    # SVG display page
    │   │   └── SvgImporter.tsx  # SVG upload page
    │   ├── services/      # API services
    │   │   └── svgStorage.ts    # SVG API calls
    │   ├── types/         # TypeScript interfaces
    │   │   └── svg.ts     # SVG data types
    │   ├── App.tsx        # Main app component
    │   └── main.tsx       # App entry point
    ├── package.json       # Frontend dependencies
    └── tailwind.config.js # Tailwind CSS configuration
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `GET` | `/svgs` | Get all SVGs |
| `POST` | `/svgs` | Upload new SVG |
| `GET` | `/svgs/:id` | Get SVG by ID |
| `PUT` | `/svgs/:id` | Update SVG |
| `DELETE` | `/svgs/:id` | Delete SVG |
| `GET` | `/svgs/search?q=query` | Search SVGs |

## 🎯 Usage Guide

### 1. **Home Page** (`/`)
- Beautiful landing page with animated hero section
- Quick access to SVG Viewer and Importer
- Feature highlights and statistics

### 2. **SVG Importer** (`/svg-importer`)
- Drag & drop SVG files
- Add name and description
- Live preview before upload
- Form validation and error handling

### 3. **SVG Viewer** (`/svg-viewer`)
- **Date-based organization** (like Google Photos)
- Grid layout with beautiful cards
- **Direct actions**: View Details, Download, Copy, Delete
- Search functionality
- Responsive design for all screen sizes

### 4. **SVG Details Modal**
- Large SVG preview
- Full metadata display
- Copy SVG content to clipboard
- Download original file

## 🚀 Available Scripts

### Backend Scripts
```bash
cd backend
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend Scripts
```bash
cd svgholder
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 Configuration

### Backend Configuration (`backend/config.js`)
```javascript
export const config = {
  MONGODB_URI: 'your_mongodb_connection_string',
  PORT: 3001,
  DB_NAME: 'svgholder'
};
```

### Frontend Configuration
- API base URL: `http://localhost:3001/api`
- CORS enabled for development
- Tailwind CSS with custom animations

## 🐛 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

#### 2. **MongoDB Connection Issues**
- Verify your connection string
- Check if MongoDB Atlas IP whitelist includes your IP
- Ensure database user has proper permissions

#### 3. **Frontend Build Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. **Tailwind CSS Not Working**
```bash
# Rebuild CSS
npm run build
# Restart development server
npm run dev
```

## 🌐 Production Deployment

### Backend Deployment
1. Set environment variables
2. Use PM2 for process management
3. Configure reverse proxy (Nginx)
4. Enable HTTPS

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Configure routing for SPA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the console logs
3. Verify your MongoDB connection
4. Ensure all dependencies are installed

---

**Happy SVG Managing! 🎨✨**
