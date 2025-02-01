let curves = [];
let angle = 0;

function setup() {
  createCanvas(800, 800);
  // Create 100 curves with different properties
  for (let i = 0; i < 100; i++) {
    curves.push({
      sd: map(i, 0, 100, 100, 10), // Standard deviation decreases from 100 to 10
      rotation: (360 / 100) * i,    // Evenly distribute rotations
      color: map(i, 0, 100, 0, 255) // Color gradient
    });
  }
}

function draw() {
  background(0);
  translate(width/2, height/2); // Move to center
  
  // Draw each curve
  for (let curve of curves) {
    push();
    rotate(radians(curve.rotation + angle));
    
    // Set color with alpha for nice overlay effect
    stroke(curve.color, 100, 255, 50);
    noFill();
    
    // Draw the normal distribution curve
    beginShape();
    for (let x = -300; x < 300; x += 1) {
      let y = normalDistribution(x, 0, curve.sd);
      // Scale y to make it visible
      y = y * 1000;
      vertex(x, y);
    }
    endShape();
    pop();
  }
  
  // Increment rotation angle
  angle += 0.5;
}

// Function to calculate normal distribution
function normalDistribution(x, mean, sd) {
  const e = 2.71828;
  const pi = 3.14159;
  
  return (1 / (sd * sqrt(2 * pi))) * 
         pow(e, -0.5 * pow((x - mean) / sd, 2));
} 