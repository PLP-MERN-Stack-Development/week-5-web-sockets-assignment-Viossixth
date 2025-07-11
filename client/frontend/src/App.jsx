import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const notificationSound = new Audio('/notification.mp3'); // Make sure to put sound file in public folder

function App() {
  const [username, setUsername] = useState('');
  const [inputName, setInputName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [privateChatUser, setPrivateChatUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const windowFocused = useRef(true);

  // Track window focus to manage unread count
  useEffect(() => {
    const onFocus = () => {
      windowFocused.current = true;
      setUnreadCount(0);
    };
    const onBlur = () => {
      windowFocused.current = false;
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    if (!username) return;

    // Request browser notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    socketRef.current = io('http://localhost:5000', {
      query: { username },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected as', username);
    });

    const handleNewMessage = (msg) => {
      setChat((prev) => [...prev, msg]);

      if (!windowFocused.current) {
        setUnreadCount((count) => count + 1);
        notificationSound.play();
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${msg.sender}`, {
            body: msg.message,
            tag: msg.timestamp,
          });
        }
      }
    };

    socketRef.current.on('message', handleNewMessage);
    socketRef.current.on('privateMessage', handleNewMessage);
    socketRef.current.on('roomMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
      if (!windowFocused.current) {
        setUnreadCount((count) => count + 1);
        notificationSound.play();
        if (Notification.permission === 'granted') {
          new Notification(`Room ${msg.room} update`, {
            body: msg.message,
            tag: msg.timestamp,
          });
        }
      }
    });

    socketRef.current.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on('typing', (user) => {
      setTypingUsers((prev) => {
        if (!prev.includes(user)) return [...prev, user];
        return prev;
      });
    });

    socketRef.current.on('stopTyping', (user) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) setUsername(inputName.trim());
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const msgObj = {
      sender: username,
      message,
      timestamp: Date.now(),
      private: !!privateChatUser,
      to: privateChatUser || null,
      room: currentRoom,
    };

    if (privateChatUser) {
      socketRef.current.emit('privateMessage', { to: privateChatUser, message });
    } else if (currentRoom) {
      socketRef.current.emit('roomMessage', msgObj);
    } else {
      socketRef.current.emit('message', msgObj);
    }

    setChat((prev) => [...prev, msgObj]);
    setMessage('');
    setUnreadCount(0); // reset on send
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    socketRef.current.emit('typing');

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current.emit('stopTyping');
    }, 1000);
  };

  const joinRoom = (room) => {
    setChat([]);
    setCurrentRoom(room);
    setPrivateChatUser(null);
    socketRef.current.emit('joinRoom', room);
  };

  const startPrivateChat = (user) => {
    setPrivateChatUser(user);
    setCurrentRoom(null);
    setChat([]);
  };

  if (!username) {
    return (
      <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
        <h2>Enter your username to join the chat</h2>
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Username"
            required
            style={{ padding: 10, width: '80%', marginBottom: 10 }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Chat Room {unreadCount > 0 && <span style={{color: 'red'}}>({unreadCount})</span>}</h2>

      <div style={{ marginBottom: 20 }}>
        <h4>Online Users:</h4>
        <ul>
          {onlineUsers
            .filter((u) => u !== username)
            .map((user, idx) => (
              <li
                key={idx}
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => startPrivateChat(user)}
              >
                {user}
              </li>
            ))}
        </ul>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => { setCurrentRoom(null); setPrivateChatUser(null); setChat([]); }}>
          Global Chat
        </button>
        <button onClick={() => joinRoom('room1')}>Join Room 1</button>
        <button onClick={() => joinRoom('room2')}>Join Room 2</button>
      </div>

      {privateChatUser && <h4>Private chat with {privateChatUser}</h4>}
      {currentRoom && <h4>Room: {currentRoom}</h4>}

      <div>
        {typingUsers.length > 0 && (
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </p>
        )}
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          height: 300,
          overflowY: 'auto',
          padding: 10,
          marginBottom: 10,
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
        }}
      >
        {chat.map((msg, idx) => (
          <p
            key={idx}
            style={{
              padding: '5px 10px',
              backgroundColor: msg.private ? '#ffebee' : '#e0f7fa',
              borderRadius: 4,
            }}
          >
            <strong>{msg.sender}:</strong> {msg.message}{' '}
            <small style={{ float: 'right', fontSize: '0.8em', color: '#555' }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </p>
        ))}
        <div ref={chatEndRef} />
      </div>

      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..."
        style={{ padding: 10, width: '80%', marginRight: 10, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <button
        onClick={handleSendMessage}
        style={{ padding: '10px 20px', borderRadius: 4, backgroundColor: '#007bff', color: '#fff', border: 'none' }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
