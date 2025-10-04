# MERN Stack Kanban Task Management System

A fully functional Kanban-style task management system built with the MERN stack, featuring real-time synchronization, drag-and-drop functionality, and optimistic UI updates.

## Features

- **Real-time Collaboration**: Multiple users can work on the same board simultaneously with Socket.io
- **Drag & Drop**: Smooth drag-and-drop functionality using @hello-pangea/dnd
- **Optimistic UI**: Instant UI updates with automatic rollback on errors
- **Task Management**: Create, read, update, and delete tasks
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback for all operations
- **Error Handling**: Comprehensive error handling with user notifications

## Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework
- **React 19.1.0** - UI library
- **@hello-pangea/dnd** - Drag and drop functionality
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Socket.io** - Real-time communication
- **Mongoose** - MongoDB ODM

## Project Structure

```
assigned-mern-todo/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   │   ├── Task.js       # Task schema
│   │   └── Board.js      # Board schema
│   ├── routes/            # API routes
│   │   ├── tasks.js      # Task CRUD operations
│   │   └── board.js      # Board operations
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── src/                   # Frontend source
│   ├── app/              # Next.js app directory
│   │   ├── page.js       # Main page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── Board.jsx     # Main board component
│   │   ├── Column.jsx    # Column component
│   │   ├── Task.jsx      # Task component
│   │   └── UserAvatar.jsx # User avatar component
│   ├── context/          # Context providers
│   │   └── BoardContext.jsx # Board state management
│   └── hooks/            # Custom hooks
│       └── useBoard.jsx  # Board hook
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assigned-mern-todo
```

### 2. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your MongoDB Atlas connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban?retryWrites=true&w=majority
NODE_ENV=development
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/status` - Update task status
- `GET /api/tasks/status/:status` - Get tasks by status

### Board
- `GET /api/board` - Get board with tasks
- `POST /api/board` - Add task to board
- `PUT /api/board` - Update entire board (drag & drop)

## Socket.io Events

### Client to Server
- `join-board` - Join a board room
- `task-created` - Task created
- `task-updated` - Task updated
- `task-deleted` - Task deleted
- `board-updated` - Board updated

### Server to Client
- `task:added` - New task added
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `board:updated` - Board updated

## Usage

### Adding Tasks
1. Click on the input field in any column
2. Type the task title
3. Press Enter or click "Add"

### Editing Tasks
1. Click on any task title
2. Edit the text
3. Press Enter to save or Escape to cancel

### Moving Tasks
1. Drag any task from one column to another
2. The task will be moved instantly with optimistic UI
3. Changes are synchronized across all connected users

### Deleting Tasks
1. Click the "Delete" button on any task
2. Confirm the deletion
3. The task will be removed instantly

## Features in Detail

### Real-time Synchronization
- All changes are instantly reflected across all connected users
- Uses Socket.io for real-time communication
- Automatic reconnection on network issues

### Optimistic UI
- UI updates immediately when actions are performed
- Automatic rollback if API calls fail
- Visual feedback during operations

### Drag and Drop
- Smooth animations and transitions
- Visual feedback during dragging
- Works on both desktop and mobile
- Maintains task order and status

### Error Handling
- Comprehensive error handling for all operations
- User-friendly error messages
- Automatic retry mechanisms
- Loading states for better UX

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=development
```

## Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set environment variables in your hosting platform
3. Ensure MongoDB Atlas allows connections from your server IP

### Frontend Deployment
1. Deploy to Vercel, Netlify, or similar platforms
2. Update API URLs to point to your deployed backend
3. Ensure CORS is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue in the repository.

---

**Note**: Make sure to replace the MongoDB Atlas connection string with your actual credentials before running the application.