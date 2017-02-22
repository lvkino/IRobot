


function initTable(tableSideLength){

	if( !tableSideLength || isNaN(tableSideLength) || tableSideLength <= 0) tableSideLength = 5;

	var cordinates = {
		x: null,
		y: null,
		f: null
	};

	// The order of the possible facings have to be clockwise
	var facing = {
		n: { axe: 'y', op: 1, label: 'north' },
		e: { axe: 'x', op: 1, label: 'east' },
		s: { axe: 'y', op: -1, label: 'south' },
		w: { axe: 'x', op: -1, label: 'west' }
	}

	function log(msg){

		console.log(msg); 

	} 

	function getAxeAndOp(){

		return facing[cordinates.f];

	}

	function place(x, y, f){

		if( isNaN(x) || x < 0 || isNaN(y) || y < 0 || !facing[f]){
			log('- Warning! Please insert valid cordinates, (0-' + tableSideLength + ',0-' + tableSideLength + ',' + Object.keys(facing).toString().replace(/,/g, '/') + ')');
			return;
		}

		if( x >= tableSideLength || y >= tableSideLength ){
			log('- Warning! This cordinates are over the table surface.');
			return;
		}

		cordinates.x = x;
		cordinates.y = y;
		cordinates.f = f;

	}

	function move(){

		if( cordinates.x === null ){

			log('- Warning! You must PLACE the robot on the table before.'); 

		} else {

			var obj = getAxeAndOp(),
			newValue = cordinates[obj.axe] + obj.op;

			if( newValue > -1 && newValue < tableSideLength  ){

				cordinates[obj.axe] = newValue;	

			} else {

				log("-- Warning! You can't move the robot in this direction, it would fall!");
			
			} 

		}

		
	}

	/* 
		This function is agnostic about the number of available facings, 
	    it just select the next or the prev facing in the facing object.
	 */
	function turn(sum){

		if( cordinates.x === null ){

			log('-- Warning! You must PLACE the robot on the table before.'); 

		} else {

			var facingArray = Object.keys(facing),
			facingLength = facingArray.length,
			actualIndex = facingArray.indexOf(cordinates.f),
			nextIndex = actualIndex + sum;

			cordinates.f = nextIndex >= facingLength ? facingArray[0] : nextIndex < 0 ? facingArray[facingLength - 1] : facingArray[nextIndex];

		}

	}

	function report(){

		if( cordinates.x === null ){

			log('-- Warning! You must PLACE the robot on the table before.');
			return false;

		} else {

			log(cordinates.x + ',' + cordinates.y + ',' + facing[cordinates.f].label);
			return cordinates.x + ',' + cordinates.y + ',' + facing[cordinates.f].label.toUpperCase();

		}

		

	}

	return {
		place: place,
		move: move,
		left: turn.bind(this, -1),
		right: turn.bind(this, 1),
		report: report
	}

}

// The following try/catch is useful in order to avoid error writing when the code is not executed by node (console clean movement :-))
try {
    module.exports = initTable;
}
catch (ex)
{}