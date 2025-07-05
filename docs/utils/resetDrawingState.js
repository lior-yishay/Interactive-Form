export const resetDrawingState = () => {
  angleMode(RADIANS);
  imageMode(CORNER);
  rectMode(CORNER);
  textAlign(LEFT, BASELINE);
  textFont("default");
  stroke(0);
  fill(255);
  strokeWeight(1);
  textSize(12);
  noTint();
};
