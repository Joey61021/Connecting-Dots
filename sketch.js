let boxWidth;
let boxHeight;

let points = [];
const pointSpeed = 0.1;
const pointAmount = 125;
const pointSize = 1;
const lineSize = 1;
const maxRadius = 150;

let forceField = undefined;
const forceFieldSize = 175;

function setup() {
  boxWidth = windowWidth;
  boxHeight = windowHeight;

  createCanvas(boxWidth, boxHeight);
  strokeWeight(0);
  fill(255);
  stroke(255);
  strokeWeight(lineSize);

  for (let i = 0; i < pointAmount; i++) {
    createPoint();
  }
}

function draw() {
  background(0);

  forceFieldHandler();

  for (const point of points) {
    if (point.link !== undefined) {
      point.link = undefined;
    }

    if (outOfBounds(point.sprite)) {
      removePoint(point.sprite);
      createPoint();
    }

    if (points.length <= 1) {
      continue;
    }

    let closest = getClosestPoint(point.sprite);
    if (closest !== undefined) {
      closest.link = point;
      point.link = closest;
      line(closest.x, closest.y, point.sprite.x, point.sprite.y);
    }
  }
}

function outOfBounds(point) {
  return point.x > boxWidth || point.x < 0 || point.y > boxHeight || point.y < 0;
}

function removePoint(value) {
  points = points.filter(point => point.sprite !== value);
  value.remove();
}

function createPoint() {
  let point = new Sprite();

  point.x = random(0, boxWidth);
  point.y = random(0, boxHeight);
  
  point.color = 0;
  point.size = pointSize;
  point.diameter = pointSize;

  point.direction = float(random(0, 360));
  point.speed = pointSpeed;

  points.push({ link: undefined, sprite: point });
}

function getClosestPoint(value) {
  let closest = Infinity;
  let closestPoint = undefined;

  for (const point of points) {
    if (value.link !== undefined && point === value.link) {
      continue;
    }

    const distance = dist(value.x, value.y, point.sprite.x, point.sprite.y);
    if (distance > maxRadius) {
      continue;
    }
    if (point.sprite !== value && distance < closest) {
      closest = distance;
      closestPoint = point.sprite;
    }
  }
  return closestPoint;
}

function forceFieldHandler() {
  if (forceField == undefined) {
    createForceField();
  }

  let angle = degrees(atan2(mouseY - forceField.y, mouseX - forceField.x));
  let distance = dist(mouseX, mouseY, forceField.x, forceField.y);
  forceField.vel.x = cos(radians(angle)) * distance;
  forceField.vel.y = sin(radians(angle)) * distance;
}

function createForceField() {
  forceField = new Sprite();

  forceField.color = 0;
  forceField.size = forceFieldSize;
  forceField.diameter = forceFieldSize;

  forceField.x = mouseX;
  forceField.y = mouseY;
}
