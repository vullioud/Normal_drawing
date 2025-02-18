# Normal Curve Pattern Generator

An interactive tool for creating artistic patterns using normal distribution (Gaussian) curves. Built with p5.js and with the help of deepseek this project allows you to manipulate and arrange multiple normal curves in various configurations.
It is based on a old project I did using R and Julia, with the interactive part on top. 
## Features

- **Interactive Controls**
  - Number of curves (1-100)
  - Rotation angle
  - Scale adjustment
  - Color gradient selection
  - Standard deviation (SD) control
  - Mean position adjustment
  - Curve range customization

- **Offset Modes**
  - None: Basic centered arrangement
  - Linear: Distribute curves along a line
  - Circular: Arrange curves in circular patterns (0-360° range)
  - Rotate Left: Pivot curves from their left endpoints
  - Rotate Right: Pivot curves from their right endpoints


## Usage

1. **Basic Controls**
   - Adjust number of curves
   - Set rotation angle
   - Scale pattern size

2. **Curve Properties**
   - Modify standard deviation (constant or range)
   - Adjust mean position (constant or range)
   - Set curve range (min/max x values)

3. **Offset Options**
   - Linear: Set start and end positions
   - Circular: Define center, radius, and rotation range
   - Rotate Left/Right: Pivot from endpoints

4. **Color Settings**
   - Choose two colors for gradient
   - Colors interpolate based on x-position

## Installation

1. Clone the repository
2. Open `index.html` in a web browser
3. Start creating patterns!

## Dependencies

- [p5.js](https://p5js.org/) (included via CDN)

## Export

- Export your patterns as SVG files
- High-quality vector output for further use

## License

MIT License - Feel free to use and modify! 
