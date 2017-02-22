var assert = require('assert'),
	robot = require('./../static/robot.js');


describe('Place and move the robot', function() {
	it('should return "0,1,NORTH"', function() {
		var r = robot();
	  	r.place(0,0,'n');
	  	r.move();
	  	
	  	assert.equal('0,1,NORTH', r.report());
	});
});

describe('Place and turn left', function() {
	it('should return "0,0,WEST"', function() {
		var r = robot();
	  	r.place(0,0,'n');
	  	r.left();
	  	
	  	assert.equal('0,0,WEST', r.report());
	});
});

describe('Place the robot, move, move, left and move', function() {
	it('should return "3,3,NORTH"', function() {
		var r = robot();
  		r.place(1,2,'e');
	  	r.move();
	  	r.move();
	  	r.left();
	  	r.move();
	  	
	  	assert.equal('3,3,NORTH', r.report());
	});
});

describe('Place the robot in a 3x3 table and move, move, right and move', function() {
	it('should return "2,1,SOUTH"', function() {
		var r = robot(3);
  		r.place(1,2,'e');
	  	r.move();
	  	r.move();
	  	r.right();
	  	r.move();
	  	
	  	assert.equal('2,1,SOUTH', r.report());
	});
});
