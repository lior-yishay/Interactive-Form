import { FEEDBACK_COLLECTION } from "../../../data-access/collections.js";
import { getSceneRecordManager } from "../../scenes-managers/recordManager.js";

const feedbackSceneManager = getSceneRecordManager(FEEDBACK_COLLECTION);

export const saveFeedbackRecord = feedbackSceneManager.saveRecord;
export const getFeedbackRecords = feedbackSceneManager.getRecords;
export const resetFeedbackScene = feedbackSceneManager.resetCollection;
