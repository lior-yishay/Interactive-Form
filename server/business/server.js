import cors from 'cors';
import express from 'express';
import { getAllGenderCounts, incrementGenderByOne as incrementGenderCount } from './scenes-logic/gender-balls/api.js';
import { closeConnection } from '../data-access/db.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.route('/api/gender-balls')
  .post(async (req, res) => {
    const gender = req.body.gender;
    console.log('Received gender:', gender);

    try {
      await incrementGenderCount(gender);
      res.json({ status: 'OK', received: gender });
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      const data = await getAllGenderCounts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  });


app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await closeConnection()
  process.exit(0);
});