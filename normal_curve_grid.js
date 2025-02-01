function setup() {
  createCanvas(1200, 1200);
  noLoop();
}

function draw() {
  background(255);
  noFill();
  stroke(0);

  const cols = 5;
  const rows = 5;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  for (let j = 0; j < rows; j++) {
    // Row-based SD progression (smooth to spiky)
    const rowSD = map(j, 0, rows-1, cellWidth * 0.3, cellWidth * 0.05);
    
    for (let i = 0; i < cols; i++) {
      const x = i * cellWidth;
      const y = j * cellHeight;
      
      // Column-based angle progression (1° to 7.2°)
      const angleStep = map(i, 0, cols-1, 1, 360/50);
      
      drawGaussianCurves(
        x, y, cellWidth, cellHeight,
        cellWidth/2, cellHeight/2,
        angleStep,
        rowSD // Same SD for entire row
      );
    }
  }
}

function drawGaussianCurves(x, y, w, h, centerX, centerY, angleStep, sd) {
  push();
  translate(x + centerX, y + centerY);
  const NUM_CURVES = 50;
  const curveSize = min(w, h) * 0.8;

  for (let i = 0; i < NUM_CURVES; i++) {
    push();
    rotate(radians(i * angleStep));
    drawGaussianCurve(0, 0, curveSize, sd, 0);
    pop();
  }
  pop();
}

function drawGaussianCurve(x, y, size, sd, mean = 0) {
  beginShape();
  for (let i = -size/2; i <= size/2; i += 1) {
    const xPos = x + i;
    // Adjusted Gaussian calculation
    const exponent = -pow((i - mean)/sd, 2) / 2;
    const yPos = y - (size/2) * exp(exponent);
    vertex(xPos, yPos);
  }
  endShape();
}


