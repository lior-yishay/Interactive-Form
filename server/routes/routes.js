import { createUrl } from "../utils/createUrl.js";

export const EVENTS = "/events";

export const PREFIX = "/api";
export const NAME = createUrl(PREFIX, "name");
export const GENDERS = createUrl(PREFIX, "genders");
export const SMILE = createUrl(PREFIX, "smile");
export const SMILE_LEADERBOARD = createUrl(SMILE, "leaderboard");
export const SMILE_TIME = createUrl(SMILE, "time");
export const POLITICS = createUrl(PREFIX, "politics");
export const ICE_CREAM_SANDWICH = createUrl(PREFIX, "ice-cream-sandwich");
export const AI = createUrl(PREFIX, "ai");
export const UNREAL = createUrl(PREFIX, "unreal");
export const I_BELIEVE_IN = createUrl(PREFIX, "i-belive-in");
export const USER_NUMBER = createUrl(PREFIX, "user-number");
export const COUNTRY = createUrl(PREFIX, "country");
export const FEEDBACK = createUrl(PREFIX, "feedback");
export const BIG_THING = createUrl(PREFIX, "big-thing");
export const TOILET = createUrl(PREFIX, "toilet");
export const SMILE_OUTSMILED = createUrl(SMILE, "outsmiled");
export const THE_ANSWER = createUrl(PREFIX, "the-answer");
export const BINGO = createUrl(PREFIX, "bingo");
