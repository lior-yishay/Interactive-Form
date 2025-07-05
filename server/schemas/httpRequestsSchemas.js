import z from "zod";

export const feedbackSchema = z.object({
  x: z.number(),
  y: z.number(),
  scale: z.number(),
  rotation: z.number(),
  shapeIndex: z.number(),
  colorIndex: z.number(),
  text: z.string(),
});
