import React, { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [id, setId] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = () => {
    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(res => {
        if (!res.ok) {
          throw Error('Invalid username or password');
        }
        return res.json();
      })
      .then(data => {
        setToken(data.token);
        setId(data.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        setError('');
        window.location.href = '/profile';
      })
      .catch(err => {
        setError(err.message);
      });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedId = localStorage.getItem('id');
    if (storedToken && storedId) {
      setToken(storedToken);
      setId(storedId);
      fetch(`https://dummyjson.com/users/${storedId}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
        })
        .catch(err => console.log(err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setToken('');
    setId('');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div>
      {token ? (
        <div>
          <h2>Welcome, {user && user.username}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <div>
            <h3>User Details:</h3>
            {user && (
              <div>
                <p>ID: {user.id}</p>
                <p>Email: {user.email}</p>
                <p>Name: {user.name}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <div>
            <label>Username: </label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password: </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default App;