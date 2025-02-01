let cellSize;
let distributions = [];

function setup() {
  createCanvas(800, 800);
  cellSize = width / 20;
  noLoop();
  angleMode(DEGREES);
  
  // Generate parameters for each cell
  for (let i = 0; i < 20; i++) {
    distributions[i] = [];
    for (let j = 0; j < 20; j++) {
      distributions[i][j] = {
        mean: map(i, 0, 19, 0, 1),    // Row determines mean (0 to 1)
        sd: map(j, 0, 19, 0.1, 0.5),  // Column determines standard deviation
        values: []
      };
      
      // Generate distribution values
      for (let x = -2; x <= 2; x += 0.1) {
        let y = normalDistribution(x, distributions[i][j].mean, distributions[i][j].sd);
        distributions[i][j].values.push(y);
      }
    }
  }
}

function draw() {
  background(255);
  
  // Draw grid cells
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      const x = j * cellSize;
      const y = i * cellSize;
      
      // Draw distribution curve with random rotation
      drawDistribution(x, y, distributions[i][j]);
    }
  }
}

function drawDistribution(x, y, dist) {
  push();
  translate(x + cellSize/2, y + cellSize/2);
  
  // Add random rotation from specified angles
  const rotations = [0, 45, -45, 90, -90];
  rotate(random(rotations));
  
  scale(1, -1); // Flip y-axis
  
  noFill();
  stroke(0);
  beginShape();
  
  // Adjusted scaling factors
  const scaleX = cellSize / 4; // Keep same x-scaling
  const maxY = Math.max(...dist.values); // Find peak value
  const scaleY = (cellSize/2 * 0.8) / maxY; // Dynamic y-scaling based on peak
  
  for (let i = 0; i < dist.values.length; i++) {
    const xVal = map(i, 0, dist.values.length-1, -2, 2);
    const yVal = dist.values[i];
    
    // Remove the fixed 1000 multiplier and use dynamic scaling
    vertex(xVal * scaleX, yVal * scaleY);
  }
  
  endShape();
  pop();
}

function normalDistribution(x, mean, sd) {
  return (1 / (sd * sqrt(2 * Math.PI))) * 
         Math.exp(-0.5 * Math.pow((x - mean)/sd, 2));
} 