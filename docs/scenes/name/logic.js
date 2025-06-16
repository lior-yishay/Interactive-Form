import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { NAME } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

const MAX_ALPHA = 50,
      MIN_ALPHA = 5

const strokes = []
let mergedHistoryBuffer

export const getNameHistory = async (top = 3) => {
  return await get(NAME, {top})
}

export const postName = async () => {
  console.log(strokes)
  await post(NAME, {strokes})
  setSceneAnswer(NAME, {strokes})
}

export const setupNameHistoryBuffer = async (top = 3) => {
  const nameHistory = await getNameHistory(top);
  const total = nameHistory.length;

  const originalBuffers = nameHistory.map(({ strokes }) => {
    const pg = createGraphics(width, height);
    drawStrokesToBuffer(pg, strokes);
    return pg;
  });

  const alphas = originalBuffers.map((_, i) =>
    map(i, 0, total - 1, MAX_ALPHA, MIN_ALPHA)
  );

  mergedHistoryBuffer = mergeBuffersWithTransparency(originalBuffers, alphas);
}


export const drawNameHistoryBuffer = () => {
  if (mergedHistoryBuffer) {
    image(mergedHistoryBuffer, 0, 0);
  }
}

const mergeBuffersWithTransparency = (buffers, alphas) => {
  const merged = createGraphics(width, height);
  merged.imageMode(CORNER);

  for (let i = 0; i < buffers.length; i++) {
    merged.push();
    merged.tint(255, alphas[i]);
    merged.image(buffers[i], 0, 0);
    merged.pop();
  }

  return merged;
};

const drawStrokesToBuffer = (pg, strokes) => {
  for (const stroke of strokes) {
    if (stroke.colorValue) {
      pg.noErase();
      pg.stroke(color(stroke.colorValue));
    } else {
      pg.erase();
    }

    pg.strokeWeight(stroke.weight);
    pg.strokeCap(ROUND);
    pg.line(stroke.from.x, stroke.from.y, stroke.to.x, stroke.to.y);
  }

  pg.noErase();
}








// export const drawNameHistoryToBuffer = async (pg, top = 3) => {
//   const nameHistory = await getNameHistory(top);

//   const MAX_ALPHA = 50;
//   const MIN_ALPHA = 5;

//   const drawLine = ({ from, to, colorValue, alpha, weight }) => {
//     if (colorValue) {
//       pg.noErase();
//       const c = color(colorValue);
//       c.setAlpha(alpha);
//       pg.stroke(c);
//     } else {
//       pg.erase();
//     }

//     pg.strokeWeight(weight);
//     pg.strokeCap(ROUND);
//     pg.line(from.x, from.y, to.x, to.y);
//   };

//   nameHistory.forEach(({ strokes }, index) => {
//     const alpha = ((MAX_ALPHA - MIN_ALPHA) / nameHistory.length) * (nameHistory.length - index) + MIN_ALPHA;
//     strokes.forEach((stroke) => drawLine({ ...stroke, alpha }));
//   });

//   pg.noErase();
// };

export const recordStroke = (from, to, colorValue, weight) => {
    strokes.push({from, to, colorValue, weight})
}