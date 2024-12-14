const express = require('express');
const app = express();
const port = 3000;

// Serve static HTML
app.get('/', (req, res) => {
  res.send(`
    <h1>Frontend</h1>
    <p>This is the frontend. Click below to test the backend connection:</p>
    <a href="/api/test">Test Backend</a>
  `);
});

// Proxy request to backend
app.get('/api/test', (req, res) => {
  const backendUrl = process.env.BACKEND_URL || 'http://backend:5000';
  res.redirect(`${backendUrl}/api`);
});

app.listen(port, () => {
  console.log(`Frontend running on port ${port}`);
});

