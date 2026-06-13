# TaskMate

TaskMate is a premium study helper and task management application designed to gamify focus and boost productivity. It features a robust Node.js backend with MongoDB storage and a cross-platform React Native / Expo mobile client.

## Core Features

- **Gamified Study tracking**: Level up and earn XP by focusing.
- **Focus Timer**: Interactive Pomodoro timer with selectable focus categories (e.g., Study, Coding, Design, Reading).
- **Task Management**: Structured task list with priorities, status tracking, and calendar views.
- **Achievements Grid**: Unlock specific badges and achievements as you build positive habits.
- **Clean Backend API**: Complete RESTful interface with authentication and database integration.

## Project Structure

```text
taskmate/
├── backend/
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Request controllers
│   │   ├── middleware/  # JWT Authentication middleware
│   │   ├── models/      # Mongoose Schemas (User, Task, Session, Achievement)
│   │   ├── routes/      # Express API routes
│   │   └── server.js    # Entry point
│   ├── package.json
│   └── .env.example
└── mobile/
    ├── src/
    │   ├── components/  # Reusable UI components (TaskCard, PomodoroTimer, BadgeGrid, etc.)
    │   ├── constants/   # Brand colors, typography, styles
    │   ├── context/     # Global state providers (Auth, Tasks)
    │   ├── hooks/       # Custom React hooks (useTimer, useTasks)
    │   ├── navigation/  # Bottom Tab & Stack navigation definitions
    │   └── screens/     # Application screens (Welcome, Dashboard, Focus, Profile, etc.)
    ├── package.json
    ├── app.json
    └── App.js
```

## Setup & Running

### Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Mobile
1. Navigate to the `mobile/` directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Expo development server:
   ```bash
   npx expo start
   ```
