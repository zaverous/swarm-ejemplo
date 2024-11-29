import React, { useState } from 'react';
import Login from '/home/adrian-cimsi/CIMSI/frontend/chat-app/src/Login';
import Chat from '/home/adrian-cimsi/CIMSI/frontend/chat-app/src/Chat';

const App = () => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');

  return (
    <div>
      {!token ? (
        <Login setToken={setToken} setUsername={setUsername} />
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
};

export default App;
