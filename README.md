# MERN Todo Kanban Board

A simple Kanban board built with MERN stack. Drag tasks between columns, edit them, and see changes in real-time across multiple tabs.

## What's Built

- **Drag & Drop**: Move tasks between "To Do", "In Progress", and "Done" columns
- **Real-time Updates**: Changes sync instantly across all open tabs
- **Task Management**: Add, edit, and delete tasks
- **MongoDB**: All data saved to MongoDB Atlas
- **Socket.io**: Real-time communication between users

## Quick Start

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Setup Environment
Create `server/.env` file:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
```

### 3. Run the App
```bash
# Start both frontend and backend
npm run dev:full
```

Or run separately:
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### 4. Open Browser
Go to `http://localhost:3000` (or 3001/3002/3003 if 3000 is busy)

## Tech Stack

- **Frontend**: Next.js, React, Redux Toolkit
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.io
- **Drag & Drop**: @hello-pangea/dnd

## Features

- ✅ Drag tasks between columns
- ✅ Add new tasks
- ✅ Edit task titles
- ✅ Delete tasks
- ✅ Real-time sync across tabs
- ✅ Data persistence in MongoDB
- ✅ Optimistic UI updates

That's it! Simple and functional. 🚀