import { I_BELIEVE_IN_COLLECTION } from "../../../data-access/collections.js";
import { getSceneRecordManager } from "../../scenes-managers/recordManager.js";

const iBelieveInSceneManager = getSceneRecordManager(I_BELIEVE_IN_COLLECTION);

export const saveIBelieveInRecord = iBelieveInSceneManager.saveRecord;
export const getIBelieveInRecords = iBelieveInSceneManager.getRecords;
export const resetIBelieveInScene = iBelieveInSceneManager.resetCollection;
