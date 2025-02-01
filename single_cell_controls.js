let gui;
let controls = {
  numCurves: 5,
  angle: 7.2,
  scale: 1.0,
  colors: {
    top: '#ff0000',    // Default red for top
    bottom: '#0000ff', // Default blue for bottom
  },
  curveRange: {
    firstMin: -2,
    firstMax: 2,
    lastMin: -2,
    lastMax: 2
  },
  sd: { 
    isRange: false,
    start: 0.2,
    end: 0.9
  },
  mean: {
    isRange: false,
    start: 0,
    end: 1
  },
  offset: {
    mode: 'none',
    startX: 0,
    startY: 0,
    endX: 1,
    endY: 1,
    centerX: 0.5,
    centerY: 0.5,
    radius: 0.4,
    rotationRange: 360  // New parameter for circular rotation range
  }
};

let exportSVG = false;

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent('canvas-container');
  gui = select('#controls');

  // Basic controls
  createSliderControl('numCurves', 1, 100, 5, 'Number of Curves', true);
  createSliderControl('angle', 0.1, 15, 7.2, 'Angle');
  
  // Color controls
  const colorDiv = createDiv().style('margin-top', '20px').parent(gui);
  createSpan('Colors:').parent(colorDiv);
  
  // Top color picker
  createDiv('Top Color:').style('margin-top', '10px').parent(gui);
  createInput(controls.colors.top, 'color')
    .input(function() {
      controls.colors.top = this.value();
      redraw();
    })
    .parent(gui);
    
  // Bottom color picker
  createDiv('Bottom Color:').style('margin-top', '10px').parent(gui);
  createInput(controls.colors.bottom, 'color')
    .input(function() {
      controls.colors.bottom = this.value();
      redraw();
    })
    .parent(gui);

  // Curve range controls
  const rangeDiv = createDiv().style('margin-top', '20px').parent(gui);
  createSpan('Curve Range:').parent(rangeDiv);
  
  // First curve range
  createDiv('First Curve:').style('margin-top', '10px').parent(gui);
  createSliderControl('curveRange.firstMin', -5, 0, -2, 'Min X');
  createSliderControl('curveRange.firstMax', 0, 5, 2, 'Max X');
  
  // Last curve range
  createDiv('Last Curve:').style('margin-top', '10px').parent(gui);
  createSliderControl('curveRange.lastMin', -5, 0, -2, 'Min X');
  createSliderControl('curveRange.lastMax', 0, 5, 2, 'Max X');

  // SD controls with range option
  const sdDiv = createDiv().style('margin-top', '20px').parent(gui);
  createSpan('Standard Deviation: ').parent(sdDiv);
  createCheckbox('Range', false)
    .changed(e => {
      controls.sd.isRange = e.target.checked;
      updateSDControls();
      redraw();
    })
    .parent(sdDiv);
  
  createDiv().id('sdControls').parent(gui);
  updateSDControls();

  // Mean controls with range option
  const meanDiv = createDiv().style('margin-top', '20px').parent(gui);
  createSpan('Mean: ').parent(meanDiv);
  createCheckbox('Range', false)
    .changed(e => {
      controls.mean.isRange = e.target.checked;
      updateMeanControls();
      redraw();
    })
    .parent(meanDiv);
  
  createDiv().id('meanControls').parent(gui);
  updateMeanControls();

  // Offset mode selector
  const modeDiv = createDiv().style('margin', '20px 0').parent(gui);
  createSpan('Offset Mode: ').parent(modeDiv);
  const modeSelect = createSelect()
    .parent(modeDiv)
    .style('margin-left', '10px');
  
  modeSelect.option('None', 'none');
  modeSelect.option('Linear', 'linear');
  modeSelect.option('Circular', 'circular');
  modeSelect.option('Rotate Left', 'rotateLeft');
  modeSelect.option('Rotate Right', 'rotateRight');
  modeSelect.value('none');
  modeSelect.changed(() => {
    controls.offset.mode = modeSelect.value();
    updateOffsetControls();
    redraw();
  });

  // Container for offset controls
  createDiv().id('offsetControls').parent(gui);

  // Add scale control after basic controls
  createSliderControl('scale', 0.1, 5, 1, 'Scale');

  // Modify the Export button
  createButton('Export SVG')
    .mousePressed(() => {
      // Create a new SVG renderer
      let svgCanvas = createGraphics(width, height, SVG);
      
      // Draw on SVG canvas
      svgCanvas.background(255);
      svgCanvas.push();
      drawCell(svgCanvas, true);
      svgCanvas.pop();
      
      // Save SVG
      const timestamp = year() + nf(month(), 2) + nf(day(), 2) + "_" + 
                       nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
      svgCanvas.save("gaussian_pattern_" + timestamp + ".svg");
      
      // Clean up
      svgCanvas.remove();
      redraw();
    })
    .parent(gui);

  updateOffsetControls();
}

function createSliderControl(property, min, max, value, label, isInteger = false) {
  const div = createDiv().style('margin', '10px 0').parent(gui);
  createSpan(`${label}: `).style('width', '80px').parent(div);
  
  const valueSpan = createSpan(value.toFixed(isInteger ? 0 : 1)).parent(div);
  
  const slider = createSlider(min, max, value, isInteger ? 1 : 0.001)
    .parent(div);
    
  slider.input(() => {
    let newValue = isInteger ? 
      parseInt(slider.value()) : 
      parseFloat(slider.value());
    
    if (property.includes('.')) {
      const [obj, prop] = property.split('.');
      controls[obj][prop] = newValue;
    } else {
      controls[property] = newValue;
    }
    
    valueSpan.html(newValue.toFixed(isInteger ? 0 : 1));
    redraw();
  });
}

function updateOffsetControls() {
  const container = select('#offsetControls');
  container.html('');

  if (controls.offset.mode === 'linear') {
    createSliderControl('offset.startX', 0, 1, controls.offset.startX, 'Start X', false);
    createSliderControl('offset.startY', 0, 1, controls.offset.startY, 'Start Y', false);
    createSliderControl('offset.endX', 0, 1, controls.offset.endX, 'End X', false);
    createSliderControl('offset.endY', 0, 1, controls.offset.endY, 'End Y', false);
  } else if (controls.offset.mode === 'circular') {
    createSliderControl('offset.centerX', 0, 1, controls.offset.centerX, 'Center X', false);
    createSliderControl('offset.centerY', 0, 1, controls.offset.centerY, 'Center Y', false);
    createSliderControl('offset.radius', 0, 2, controls.offset.radius, 'Radius', false);
    createSliderControl('offset.rotationRange', 0, 360, 360, 'Rotation Range', true);
  } else if (controls.offset.mode === 'rotateLeft' || controls.offset.mode === 'rotateRight') {
    createSliderControl('offset.radius', 0, 1, controls.offset.radius, 'Rotation Amount', false);
  }
}

function updateSDControls() {
  const container = select('#sdControls');
  container.html('');
  
  if (controls.sd.isRange) {
    createSliderControl('sd.start', 0.1, 2, controls.sd.start, 'Start SD', false, container);
    createSliderControl('sd.end', 0.1, 2, controls.sd.end, 'End SD', false, container);
  } else {
    createSliderControl('sd.start', 0.1, 2, controls.sd.start, 'SD', false, container);
  }
}

function updateMeanControls() {
  const container = select('#meanControls');
  container.html('');
  
  if (controls.mean.isRange) {
    createSliderControl('mean.start', -1, 1, controls.mean.start, 'Start Mean', false, container);
    createSliderControl('mean.end', -1, 1, controls.mean.end, 'End Mean', false, container);
  } else {
    createSliderControl('mean.start', -1, 1, controls.mean.start, 'Mean', false, container);
  }
}

function draw() {
  if (!exportSVG) {
    background(51);  // Dark background for screen only
  } else {
    background(255);  // White background for SVG
  }
  drawCell(this, exportSVG);
}

function drawCell(renderer = null, isSVG = false) {
  const ctx = renderer || this;
  const size = min(width, height) * 0.6 * controls.scale;
  
  // Calculate the bounds of all curves to center them
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  // First pass: calculate bounds
  for (let i = 0; i < controls.numCurves; i++) {
    const t = i / (controls.numCurves - 1);
    let x = 0, y = 0;
    
    // Calculate curve range for this position
    const curveMinX = lerp(controls.curveRange.firstMin, controls.curveRange.lastMin, t);
    const curveMaxX = lerp(controls.curveRange.firstMax, controls.curveRange.lastMax, t);
    
    switch(controls.offset.mode) {
      case 'linear':
        x = lerp(-size/2, size/2, controls.offset.startX) + 
            lerp(0, size, t) * (controls.offset.endX - controls.offset.startX);
        y = lerp(-size/2, size/2, controls.offset.startY) + 
            lerp(0, size, t) * (controls.offset.endY - controls.offset.startY);
        break;
      case 'circular':
        // Convert rotation range to radians and calculate angle
        const maxAngle = radians(controls.offset.rotationRange);
        const angle = t * maxAngle;
        const centerX = lerp(-size/2, size/2, controls.offset.centerX);
        const centerY = lerp(-size/2, size/2, controls.offset.centerY);
        x = centerX + cos(angle) * (controls.offset.radius * size);
        y = centerY + sin(angle) * (controls.offset.radius * size);
        break;
      case 'rotateLeft':
        // Start at the left endpoint of the curve
        x = -size/2 + map(curveMinX, -5, 5, -size/2, size/2);
        y = 0;
        break;
      case 'rotateRight':
        // Start at the right endpoint of the curve
        x = -size/2 + map(curveMaxX, -5, 5, -size/2, size/2);
        y = 0;
        break;
    }
    
    minX = min(minX, x - size/2);
    maxX = max(maxX, x + size/2);
    minY = min(minY, y - size/2);
    maxY = max(maxY, y + size/2);
  }
  
  // Calculate center offset to keep pattern centered
  const centerOffsetX = -(maxX + minX) / 2;
  const centerOffsetY = -(maxY + minY) / 2;
  
  ctx.push();
  ctx.translate(width/2 + centerOffsetX, height/2 + centerOffsetY);
  ctx.noFill();
  
  // Set stroke properties based on export mode
  if(isSVG) {
    ctx.stroke(0);
    ctx.strokeWeight(1);
  } else {
    ctx.strokeWeight(2);
  }

  // Second pass: draw curves
  for (let i = 0; i < controls.numCurves; i++) {
    const t = i / (controls.numCurves - 1);
    
    const sd = controls.sd.isRange ? 
      lerp(controls.sd.start, controls.sd.end, t) : 
      controls.sd.start;
    
    const mean = controls.mean.isRange ? 
      lerp(controls.mean.start, controls.mean.end, t) : 
      controls.mean.start;

    // Calculate curve range for this position
    const curveMinX = lerp(controls.curveRange.firstMin, controls.curveRange.lastMin, t);
    const curveMaxX = lerp(controls.curveRange.firstMax, controls.curveRange.lastMax, t);

    let x = 0, y = 0;
    let rotation = radians(i * controls.angle); // Base rotation from angle control
    
    switch(controls.offset.mode) {
      case 'linear':
        x = lerp(-size/2, size/2, controls.offset.startX) + 
            lerp(0, size, t) * (controls.offset.endX - controls.offset.startX);
        y = lerp(-size/2, size/2, controls.offset.startY) + 
            lerp(0, size, t) * (controls.offset.endY - controls.offset.startY);
        break;
      case 'circular':
        // Convert rotation range to radians and calculate angle
        const maxAngle = radians(controls.offset.rotationRange);
        const angle = t * maxAngle;
        const centerX = lerp(-size/2, size/2, controls.offset.centerX);
        const centerY = lerp(-size/2, size/2, controls.offset.centerY);
        x = centerX + cos(angle) * (controls.offset.radius * size);
        y = centerY + sin(angle) * (controls.offset.radius * size);
        break;
      case 'rotateLeft':
        // Start at the left endpoint of the curve
        x = -size/2 + map(curveMinX, -5, 5, -size/2, size/2);
        y = 0;
        // Add rotation from both angle control and offset
        rotation += t * TWO_PI * controls.offset.radius;
        break;
      case 'rotateRight':
        // Start at the right endpoint of the curve
        x = -size/2 + map(curveMaxX, -5, 5, -size/2, size/2);
        y = 0;
        // Add rotation from both angle control and offset
        rotation += t * TWO_PI * controls.offset.radius;
        break;
    }

    ctx.push();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    drawGaussianCurve(ctx, 0, 0, size * 0.3, sd, mean, t, isSVG);
    ctx.pop();
  }
  ctx.pop();
}

function drawGaussianCurve(ctx, x, y, size, sd, mean, t, isSVG = false) {
  if (isSVG) {
    ctx.beginShape();
    const minX = lerp(controls.curveRange.firstMin, controls.curveRange.lastMin, t);
    const maxX = lerp(controls.curveRange.firstMax, controls.curveRange.lastMax, t);
    const step = (maxX - minX) / 100;
    
    for (let i = minX; i <= maxX; i += step) {
      const xPos = x + i * size;
      const exponent = -pow((i - mean)/sd, 2)/2;
      const yOffset = (size/2) * exp(exponent);
      ctx.vertex(xPos, y - yOffset);
    }
    ctx.endShape();
  } else {
    // Normal gradient drawing for screen display
    const amplitude = size/2;
    const scaledSD = sd * size;
    const scaledMean = mean * size;
    
    const minX = lerp(controls.curveRange.firstMin, controls.curveRange.lastMin, t);
    const maxX = lerp(controls.curveRange.firstMax, controls.curveRange.lastMax, t);
    const midX = (minX + maxX) / 2;
    
    const step = (maxX - minX) / 100;
    
    for (let i = minX; i <= maxX - step; i += step) {
      const xPos1 = x + i * size;
      const xPos2 = x + (i + step) * size;
      
      const exponent1 = -pow((i - mean)/sd, 2)/2;
      const exponent2 = -pow((i + step - mean)/sd, 2)/2;
      
      const yOffset1 = amplitude * exp(exponent1);
      const yOffset2 = amplitude * exp(exponent2);
      
      let colorT1, colorT2;
      
      if (i <= midX) {
        colorT1 = map(i, minX, midX, 0, 1);
      } else {
        colorT1 = map(i, midX, maxX, 1, 0);
      }
      
      if (i + step <= midX) {
        colorT2 = map(i + step, minX, midX, 0, 1);
      } else {
        colorT2 = map(i + step, midX, maxX, 1, 0);
      }
      
      const c1 = lerpColor(
        color(controls.colors.bottom),
        color(controls.colors.top),
        colorT1
      );
      
      const c2 = lerpColor(
        color(controls.colors.bottom),
        color(controls.colors.top),
        colorT2
      );
      
      drawGradientLine(ctx, xPos1, y - yOffset1, xPos2, y - yOffset2, c1, c2);
    }
  }
}

// Helper function to draw a gradient line
function drawGradientLine(ctx, x1, y1, x2, y2, c1, c2) {
  // Create a linear gradient
  const gradient = ctx.drawingContext.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, c1.toString());
  gradient.addColorStop(1, c2.toString());
  
  // Apply gradient
  ctx.drawingContext.strokeStyle = gradient;
  
  // Draw line segment
  ctx.beginShape();
  ctx.vertex(x1, y1);
  ctx.vertex(x2, y2);
  ctx.endShape();
}

// Helper function to rotate a point around an origin
function rotatePoint(x, y, originX, originY, angle) {
  const dx = x - originX;
  const dy = y - originY;
  return {
    x: dx * cos(angle) - dy * sin(angle),
    y: dx * sin(angle) + dy * cos(angle)
  };
} 