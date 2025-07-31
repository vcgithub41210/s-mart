import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Only health check first
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
