[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19923108&assignment_repo_type=AssignmentRepo)
# Real-Time Chat Application with Socket.io

This assignment focuses on building a real-time chat application using Socket.io, implementing bidirectional communication between clients and server.
## Setup Instructions

Follow these steps to set up and run the real-time chat application locally:

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd week-5-web-sockets-assignment-Viossixth
```

### 2. Install Dependencies

Install dependencies for both the client and server:

```bash
# In the root directory
cd client
npm install

cd ../server
npm install
```

### 3. Configure Environment Variables

- Create a `.env` file in the `server` directory if required (refer to `Week5-Assignment.md` for details).
- Set up any necessary environment variables such as `PORT` or database connection strings.

### 4. Start the Development Servers

Open two terminal windows/tabs:

- **Start the server:**
  ```bash
  cd server
  npm run dev
  ```
- **Start the client:**
  ```bash
  cd client
  npm start
  ```

### 5. Access the Application

- Open your browser and navigate to `http://localhost:3000` to use the chat application.

### 6. Additional Notes

- For advanced features or deployment, refer to the documentation and assignment instructions.
- Ensure Node.js (v18+) and npm/yarn are installed on your system.



## Project Summary

This project is a real-time chat application built with React for the client and Node.js/Express with Socket.io for the server. It enables users to communicate instantly through web sockets, supporting features such as user authentication, multiple chat rooms, private messaging, real-time notifications, typing indicators, and read receipts. The application demonstrates the implementation of bidirectional communication between clients and server, providing a modern, interactive chat experience. The codebase is organized for scalability and maintainability, making it a solid foundation for further enhancements or deployment.

## Assignment Overview

You will build a chat application with the following features:
1. Real-time messaging using Socket.io
2. User authentication and presence
3. Multiple chat rooms or private messaging
4. Real-time notifications
5. Advanced features like typing indicators and read receipts

## Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── socket/         # Socket.io client setup
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Socket event handlers
│   ├── models/             # Data models
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week5-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Files Included

- `Week5-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Socket.io configuration templates
  - Sample components for the chat interface

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement the core chat functionality
3. Add at least 3 advanced features
4. Document your setup process and features in the README.md
5. Include screenshots or GIFs of your working application
6. Optional: Deploy your application and add the URLs to your README.md

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat) 