let balls = [];

let genderCounts = []
axios.get('http://localhost:8000/api/gender-balls')
    .then(response => {
      console.log('Server responded:', response.data);
      genderCounts = response.data
    })
    .catch(error => {
      console.error('POST error:', error);
    });

let labels = [
  "Agender", "Bigender", "Cisgender", "Genderfluid", "Intersex", "Non-binary", "Transgender",
  "Two-Spirit", "Xenogender", "Demiboy", "Demigirl", "Androgynous", "Maverique", "Pangender",
  "Trigender", "Polygender", "Hijra", "Butch", "Femme", "Neutrois", "Genderqueer", "Genderflux",
  "Aporagender", "Autigender", "MTF", "FTM", "Cis man", "Cis woman", "Trans man", "Trans woman",
  "Abinary", "Agenderflux", "Androgyne", "Bakla", "Bissu", "Calabai", "Calalai", "Demiflux",
  "Genderblank", "Genderfree", "Gender gifted", "Gender nonconforming", "Gender questioning",
  "Gender variant", "Graygender", "Intergender", "Ipsogender", "Kathoey", "Māhū", "Meta-gender",
  "Muxe", "Omnigender", "Sekhet", "Third gender", "Transfeminine", "Transmasculine", "Transsexual",
  "Travesti", "Tumtum", "Vakasalewalewa", "Waria", "Winkte", "X-gender", "X-jendā"
];

function setupScene1() {
  balls = []
  createCanvas(windowWidth, windowHeight);
  textSize(14);
  for (let i = 0; i < labels.length; i++) {
    let label = labels[i];
    let labelWidth = textWidth(label);
    let r = max(25, labelWidth / 1.6);
    let x = random(r, width - r);
    let y = random(r, height - r);
    let vx = random(-1, 1);
    let vy = random(-1, 1);
    balls.push(new Ball(x, y, r, label, vx, vy));
  }
}

function drawScene1() {
  background(20);
  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(32);
  text("What is your gender?", width / 2, 20);

  for (let ball of balls) {
    ball.move();
    ball.collide(balls);
    ball.update();
    ball.display();
  }
}

function mousePressedScene1() {
  for (let ball of balls) {
    if (ball.contains(mouseX, mouseY)) {
      ball.grow();
      
      axios.post('http://localhost:8000/api/gender-balls', {
        gender: ball.label
      })
      .then(response => {
        console.log('Server responded:', response.data);
      })
      .catch(error => {
        console.error('POST error:', error);
      });

      currentScene = "scene2";
      setupScene2();
    }
  }
}

class Ball {
  constructor(x, y, r, label, vx, vy) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.r = r;
    this.label = label;
  }

  move() {
    this.pos.add(this.vel);
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    }
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    }
  }

  update() {}

  display() {
    fill(100, 160, 255);
    stroke(255);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text(this.label, this.pos.x, this.pos.y);
  }

  contains(mx, my) {
    return dist(mx, my, this.pos.x, this.pos.y) < this.r;
  }

  grow() {
    this.r += 8;
  }

  collide(others) {
    for (let other of others) {
      if (other !== this) {
        let dir = p5.Vector.sub(this.pos, other.pos);
        let d = dir.mag();
        let minDist = this.r + other.r;
        if (d < minDist && d > 0) {
          let overlap = minDist - d;
          dir.normalize();
          dir.mult(overlap / 2);
          this.pos.add(dir);
          other.pos.sub(dir);
          this.vel.add(dir.copy().mult(0.02));
          other.vel.sub(dir.copy().mult(0.02));
        }
      }
    }
  }
}
