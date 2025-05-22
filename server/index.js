import cors from 'cors';
import express, { application } from 'express';
import { getAllGenderCounts, incrementGenderByOne as incrementGenderCount } from './business/scenes-logic/gender/api.js';
import { closeConnection, connectToScenesDB } from './data-access/db.js';
import { getAllPoliticalSideCounts, incrementPoliticalSideByOne } from './business/scenes-logic/politics/api.js';
import { getAllLivingHereRecords, postLivingHerePick } from './business/scenes-logic/living-here/api.js';
import { getAllFlavorsCounts, incrementFlavorByOne } from './business/scenes-logic/ice-cream-sandwich/api.js';
import { getNameHistory, postName as insertName } from './business/scenes-logic/name/api.js';
import { getSmileLeaderboard, getTotalSmileTime, insertSmile } from './business/scenes-logic/smile/api.js';
import { getAllAiCounts, incrementAiByOne } from './business/scenes-logic/ai/api.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.route('/api/genders')
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

  app.route('/api/name')
    .post(async (req, res) => {
      const {strokes} = req.body
      try {
        await insertName(strokes);
        res.json({ status: 'OK', received: strokes });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', message: err.message });
    }
    })
    .get(async (req, res) => {
      const {top} = req.query
      console.log('Recived name top:', top)

      try {
        const nameHistory = await getNameHistory(Number(top));
        res.json(nameHistory);
      } catch (err) {
        res.status(500).json({ status: 'ERROR', message: err.message });
      }
    })

  app.route('/api/smile')
    .post(async (req, res) => {
      const {duration, image} = req.body
      try {
        await insertSmile(duration, image);
        res.json({ status: 'OK', received: {duration, image} });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', message: err.message });
    }
    })
  app.route('/api/smile/leaderboard')
    .get(async (req, res) => {
      const {top} = req.query
      console.log('Recived smile top:', top)

      try {
        const smileLeaderBoard = await getSmileLeaderboard(Number(top));
        res.json(smileLeaderBoard);
      } catch (err) {
        res.status(500).json({ status: 'ERROR', message: err.message });
      }
    })
  app.route('/api/smile/time')
    .get(async (req, res) => {
      try {
        const totalDuration = await getTotalSmileTime();
        res.json(totalDuration);
      } catch (err) {
        res.status(500).json({ status: 'ERROR', message: err.message });
      }
    })

  app.route('/api/age')
  .post(async (req, res) => {
    const {age} = req.body;
    console.log('Received age:', age);

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

  app.route('/api/ai')
  .post(async (req, res) => {
    const {ai} = req.body;
    console.log('Received ai:', ai);

    try {
      await incrementAiByOne(ai);
      res.json({ status: 'OK', received: ai });
    } catch (err) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      const data = await getAllAiCounts();
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