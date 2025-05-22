import { drawNameHistory, getNameHistory, postName } from "./logic.js";

let colorPicker, sizeSlider;
let postButton
let strokes = [];

export async function setupNameScene() {

  // create the drawing canvas
  createCanvas(800, 550);
  background(0);

  // — UI CONTROLS —  
  // Color picker
  createSpan('Brush Color: ')
    .position(10, 510)
    .style('color', '#fff')
    .style('font-size', '14px');
  colorPicker = createColorPicker('#000000');
  colorPicker.position(110, 508);

  // Size slider
  createSpan('Brush Size: ')
    .position(250, 510)
    .style('color', '#fff')
    .style('font-size', '14px');
  sizeSlider = createSlider(1, 50, 4, 1);
  sizeSlider.position(340, 508);

  // — DRAW THE NAME TAG —  
  const tagW = 700, tagH = 350;
  const tagX = (width - tagW) / 2;
  const tagY = (height - tagH - 50) / 2; // leave extra bottom for UI
  const cornerRadius = 20;
  const headerH = 140;
  const footerH = 50;

  noStroke();
  fill(220, 60, 50);
  rect(tagX, tagY, tagW, tagH, cornerRadius);

  fill(255);
  rect(tagX, tagY + headerH, tagW, tagH - headerH - footerH);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(72);
  text("Hello", tagX + tagW / 2, tagY + headerH * 0.35);

  textSize(32);
  text("my name is", tagX + tagW / 2, tagY + headerH * 0.70);

  postButton = createButton('click me')
  postButton.mousePressed(() => {console.log(strokes) 
    postName(strokes)})

  await drawNameHistory(3)

}



export function drawNameScene() {
  if (mouseIsPressed && mouseY < height - 50) {
    let colorValue = colorPicker.color().toString('#rrggbb');
    let weight = sizeSlider.value();

    const c = color(colorValue)
    c.setAlpha(200)
    stroke(colorValue);
    strokeWeight(weight);
    line(pmouseX, pmouseY, mouseX, mouseY);

    strokes.push({
      from: { x: pmouseX, y: pmouseY },
      to: { x: mouseX, y: mouseY },
      colorValue, 
      weight
    });
  }
  
}
