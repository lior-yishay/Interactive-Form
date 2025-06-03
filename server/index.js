import cors from 'cors';
import express from 'express';

import { closeConnection, connectToScenesDB } from './data-access/db.js';

import dotenv from 'dotenv';
import { getAllAgeCounts, incrementAgeByOne } from './business/scenes-logic/age/api.js';
import { getAllAiCounts, incrementAiByOne } from './business/scenes-logic/ai/api.js';
import { getAllGenderCounts, incrementGenderByOne } from './business/scenes-logic/gender/api.js';
import { getAllFlavorsCounts, incrementFlavorByOne } from './business/scenes-logic/ice-cream-sandwich/api.js';
import { getAllLivingHereRecords, postLivingHerePick } from './business/scenes-logic/living-here/api.js';
import { getNameHistory, postName } from './business/scenes-logic/name/api.js';
import { getAllPoliticalSideCounts, incrementPoliticalSideByOne } from './business/scenes-logic/politics/api.js';
import { getSmileLeaderboard, getTotalSmileTime, insertSmile } from './business/scenes-logic/smile/api.js';
import { logger } from './logger/logger.js';
import { AGE, AI, GENDERS, ICE_CREAM_SANDWICH, LIVING_HERE, NAME, POLITICS, SMILE, SMILE_LEADERBOARD, SMILE_TIME, EVENTS, I_BELIEVE_IN } from './routes/routes.js';
import { createRoute } from './utils/AppRouteHandler.js';
import { addSubscriber } from './utils/broadcast.js';
import { getMagnetPositions, saveMagnetPositions } from './business/scenes-logic/i belive in/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get(EVENTS, (req, res) => {
  addSubscriber(res);
});

app.route(GENDERS).all(createRoute({
  methodHandlers: {
    post: (req) => incrementGenderByOne(req.body.gender),
    get: () => getAllGenderCounts(),
  },
}));

app.route(POLITICS).all(createRoute({
  methodHandlers: {
    post: (req) => incrementPoliticalSideByOne(req.body.side),
    get: () => getAllPoliticalSideCounts(),
  },
}));

app.route(LIVING_HERE).all(createRoute({
  methodHandlers: {
    post: (req) => {
      const { x, y, pick } = req.body;
      return postLivingHerePick(x, y, pick);
    },
    get: () => getAllLivingHereRecords(),
  },
}));

app.route(ICE_CREAM_SANDWICH).all(createRoute({
  methodHandlers: {
    post: (req) => incrementFlavorByOne(req.body.flavor),
    get: () => getAllFlavorsCounts(),
  },
}));

app.route(NAME).all(createRoute({
  methodHandlers: {
    post: (req) => postName(req.body.strokes),
    get: (req) => getNameHistory(Number(req.query.top)),
  },
  broadcast: true
}));

app.route(SMILE).all(createRoute({
  methodHandlers: {
    post: (req) => insertSmile(req.body.duration, req.body.image),
  },
}));

app.route(SMILE_LEADERBOARD).all(createRoute({
  methodHandlers: {
    get: (req) => getSmileLeaderboard(Number(req.query.top)),
  },
}));

app.route(SMILE_TIME).all(createRoute({
  methodHandlers: {
    get: () => getTotalSmileTime(),
  },
}));

app.route(AI).all(createRoute({
  methodHandlers: {
    post: (req) => incrementAiByOne(req.body.ai),
    get: () => getAllAiCounts(),
  },
}));

app.route(AGE).all(createRoute({
  methodHandlers: {
    post: (req) => incrementAgeByOne(req.body.age),
    get: () => getAllAgeCounts(),
  }
}));

app.route(I_BELIEVE_IN).all(createRoute({
  methodHandlers: {
    post: (req) => saveMagnetPositions(req.body.magnets),
    get: (req) => getMagnetPositions(Number(req.query.top))
  }
}))

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  connectToScenesDB();
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});
