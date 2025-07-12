import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  getAiCounts,
  incrementAiPick,
} from "./business/scenes-logic/ai/api.js";
import {
  getBigThingCounts,
  incrementBigThingPick,
} from "./business/scenes-logic/big thing/api.js";
import {
  getCountryCounts,
  incrementCountryPicks,
} from "./business/scenes-logic/country/api.js";
import {
  getFeedbackRecords,
  saveFeedbackRecord,
} from "./business/scenes-logic/feedback/api.js";
import {
  getGendersCounts,
  incrementGenderPick,
} from "./business/scenes-logic/gender/api.js";
import {
  getIBelieveInRecords,
  saveIBelieveInRecord,
} from "./business/scenes-logic/i belive in/api.js";
import {
  getIceCreamSandwichCounts,
  incrementIceCreamSandwichPick,
} from "./business/scenes-logic/ice-cream-sandwich/api.js";
import { getNameHistory, postName } from "./business/scenes-logic/name/api.js";
import {
  getPoliticsCounts,
  incrementPoliticsPick,
} from "./business/scenes-logic/politics/api.js";
import {
  getRecordCountWithLessSmileDuration,
  getSmileLeaderboard,
  getTotalSmileTime,
  insertSmile,
} from "./business/scenes-logic/smile/api.js";
import {
  getToiletCounts,
  incrementToiletPick,
} from "./business/scenes-logic/toilet/api.js";
import {
  getUnrealCounts,
  incrementUnrealPicks,
} from "./business/scenes-logic/unreal/api.js";
import { getAndIncrementUserNumber } from "./business/scenes-logic/user-number/api.js";
import { closeConnection, connectToScenesDB } from "./data-access/db.js";
import { logger } from "./logger/logger.js";
import {
  AI,
  BIG_THING,
  COUNTRY,
  EVENTS,
  FEEDBACK,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  SMILE_LEADERBOARD,
  SMILE_OUTSMILED,
  SMILE_TIME,
  THE_ANSWER,
  TOILET,
  UNREAL,
  USER_NUMBER,
} from "./routes/routes.js";
import { feedbackSchema } from "./schemas/httpRequestsSchemas.js";
import { createRoute } from "./utils/AppRouteHandler.js";
import { addSubscriber } from "./utils/broadcast.js";
import {
  getTheAnswerCounts,
  incrementTheAnswerPick,
  resetTheAnswerScene,
} from "./business/scenes-logic/the answer/api.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get(EVENTS, (req, res) => {
  addSubscriber(res);
});

app.route(USER_NUMBER).all(
  createRoute({
    methodHandlers: {
      post: () => getAndIncrementUserNumber(),
    },
  })
);

app.route(GENDERS).all(
  createRoute({
    methodHandlers: {
      post: (req) => incrementGenderPick(req.body.gender),
      get: getGendersCounts,
    },
  })
);

app.route(POLITICS).all(
  createRoute({
    methodHandlers: {
      post: (req) => incrementPoliticsPick(req.body.side),
      get: getPoliticsCounts,
    },
  })
);

app.route(ICE_CREAM_SANDWICH).all(
  createRoute({
    methodHandlers: {
      post: (req) => incrementIceCreamSandwichPick(req.body.flavor),
      get: getIceCreamSandwichCounts,
    },
  })
);

app.route(NAME).all(
  createRoute({
    methodHandlers: {
      post: (req) => postName(req.body.strokes),
      get: (req) => getNameHistory(Number(req.query.top)),
    },
    broadcast: true,
  })
);

app.route(SMILE).all(
  createRoute({
    methodHandlers: {
      post: (req) => insertSmile(req.body.duration, req.body.image),
    },
  })
);

app.route(SMILE_LEADERBOARD).all(
  createRoute({
    methodHandlers: {
      get: (req) => getSmileLeaderboard(Number(req.query.top)),
    },
  })
);

app.route(SMILE_TIME).all(
  createRoute({
    methodHandlers: {
      get: () => getTotalSmileTime(),
    },
  })
);

app.route(AI).all(
  createRoute({
    methodHandlers: {
      post: (req) => incrementAiPick(req.body.ai),
      get: getAiCounts,
    },
  })
);

app.route(I_BELIEVE_IN).all(
  createRoute({
    methodHandlers: {
      post: ({ body }) => saveIBelieveInRecord(body),
      get: ({ query }) => getIBelieveInRecords(Number(query.top)),
    },
  })
);

app.route(UNREAL).all(
  createRoute({
    methodHandlers: {
      post: (req) => incrementUnrealPicks(req.body.picks),
      get: getUnrealCounts,
    },
  })
);

app.route(COUNTRY).all(
  createRoute({
    methodHandlers: {
      post: (req) => incrementCountryPicks(req.body.picks),
      get: getCountryCounts,
    },
  })
);

app.route(FEEDBACK).all(
  createRoute({
    methodHandlers: {
      post: ({ body }) => {
        const parsed = feedbackSchema.safeParse(body);
        if (!parsed.success)
          throw new Error(
            `given data was not in the right format: ${parsed.error.message}`
          );
        saveFeedbackRecord(parsed.data);
      },
      get: ({ query }) => getFeedbackRecords(Number(query.top)),
    },
  })
);

app.route(BIG_THING).all(
  createRoute({
    methodHandlers: {
      post: ({ body }) => incrementBigThingPick(body.pick),
      get: getBigThingCounts,
    },
  })
);

app.route(TOILET).all(
  createRoute({
    methodHandlers: {
      post: ({ body }) => incrementToiletPick(body.pick),
      get: getToiletCounts,
    },
  })
);

app.route(SMILE_OUTSMILED).all(
  createRoute({
    methodHandlers: {
      get: ({ query }) =>
        getRecordCountWithLessSmileDuration(Number(query.duration)),
    },
  })
);

app.route(THE_ANSWER).all(
  createRoute({
    methodHandlers: {
      post: ({ body }) => incrementTheAnswerPick(body.pick),
      get: getTheAnswerCounts,
    },
  })
);

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  connectToScenesDB();
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await resetTheAnswerScene();
  await closeConnection();
  process.exit(0);
});
