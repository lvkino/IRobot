# IRobot
This application allow a robot to roam on a square table, preventing it to fall down

## Installation

In a browser:
```html
<script src="static/robot.js"></script>
```

In Node.js:
```js
// Load the robot library, specifing the table length, deafult value: 5
var r = require('./static/robot.js')(5);

// Place the robot on the table (x, y, facing)
r.place(0,0,'n');

// Move the robot of a unit toward the facing direction
r.move();

// Turn the robot anticlockwise of a cardinal point
// (i.e) from NORTH to WEST
r.left();

// Turn the robot clockwise of a cardinal point 
// (i.e) from NORTH to EST
r.right();

// Report the actual position of the robot on the table
// (i.e) 1,1,NORTH
r.report();
```

## Test
```shell
$ npm install
$ npm test
```
