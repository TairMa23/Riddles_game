import express from 'express';
import playersRouter from './routes/players.js';
import riddlesRouter from './routes/riddles.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/players', playersRouter);
app.use('/api/riddles', riddlesRouter);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});