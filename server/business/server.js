import cors from 'cors';
import express from 'express';
import { getAllGenderCounts, incrementGenderByOne as incrementGenderCount } from './scenes-logic/gender-balls/api.js';
import { closeConnection, connectToScenesDB } from '../data-access/db.js';
import { getAllPoliticalSideCounts, incrementPoliticalSideByOne } from './scenes-logic/politics/api.js';
import { getAllLivingHereRecords, postLivingHerePick } from './scenes-logic/living-here/api.js';
import { getAllFlavorsCounts, incrementFlavorByOne } from './scenes-logic/ice-cream-sandwich/api.js';

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

app.route('/api/politics')
  .post(async (req, res) => {
    const side = req.body.side
    console.log('Received side:', side);

    try {
      await incrementPoliticalSideByOne(side);
      res.json({ status: 'OK', received: side });
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }

  })
  .get(async (req, res) => {
    try {
      const data = await getAllPoliticalSideCounts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  })

app.route('/api/living-here')
  .post(async (req, res) => {
    const {x, y, pick} = req.body
    console.log('Received pick:', pick, 'at x:', x, 'y: ', y);
    
    try {
      await postLivingHerePick(x, y ,pick);
      res.json({ status: 'OK', received: pick });
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }

  })
  .get(async (req, res) => {
    try {
      const data = await getAllLivingHereRecords();
      res.json(data);
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  })

  app.route('/api/ice-cream-sandwich')
  .post(async (req, res) => {
    const flavor = req.body.flavor;
    console.log('Received flavor:', flavor);

    try {
      await incrementFlavorByOne(flavor);
      res.json({ status: 'OK', received: flavor });
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      const data = await getAllFlavorsCounts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  });

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  connectToScenesDB()
});

process.on("SIGINT", async () => {
  await closeConnection()
  process.exit(0);
});