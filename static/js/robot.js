
function robotBuilder(tableSideLength){

	if( !tableSideLength || isNaN(tableSideLength) || tableSideLength <= 0) tableSideLength = 5;

	var coordinates = {
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

	function response(msg, error){

		if(msg) console.log(msg);

		return {
			error: !!error,
			msg: msg || ''
		}

	} 

	function getAxeAndOp(){

		return facing[coordinates.f];

	}

	function place(x, y, f){

		if( isNaN(x) || x < 0 || isNaN(y) || y < 0 || !facing[f]){
			
			return response('Please insert valid coordinates, (0-' + tableSideLength + ',0-' + tableSideLength + ',' + Object.keys(facing).toString().replace(/,/g, '/') + ')', true);
		
		}

		if( x >= tableSideLength || y >= tableSideLength ){
			
			return response('This coordinates are over the table surface.', true);

		}

		coordinates.x = x;
		coordinates.y = y;
		coordinates.f = f;

		return response();

	}

	function move(){

		if( coordinates.x === null ){

			return response('You must PLACE the robot on the table before.', true); 

		} else {

			var obj = getAxeAndOp(),
			newValue = coordinates[obj.axe] + obj.op;

			if( newValue > -1 && newValue < tableSideLength  ){

				coordinates[obj.axe] = newValue;


			} else {

				return response("You can't move the robot in this direction, it would fall!", true);
			
			} 

		}

		return response();
		
	}

	/* 
		This function is agnostic about the number of available facings, 
	    it just selects the next or the prev facing in the facing object.
	 */
	function turn(sum){

		if( coordinates.x === null ){

			return response('You must PLACE the robot on the table before.', true); 

		} else {

			var facingArray = Object.keys(facing),
			facingLength = facingArray.length,
			actualIndex = facingArray.indexOf(coordinates.f),
			nextIndex = actualIndex + sum;

			coordinates.f = nextIndex >= facingLength ? facingArray[0] : nextIndex < 0 ? facingArray[facingLength - 1] : facingArray[nextIndex];

		}

		return response();

	}

	function report(){

		if( coordinates.x === null ){

			return response('You must PLACE the robot on the table before.', true);
			
		}
		
		return response(coordinates.x + ',' + coordinates.y + ',' + facing[coordinates.f].label.toUpperCase());

	}

	function getCoordinates(){

		return {
			x: coordinates.x,
			y: coordinates.y,
			f: coordinates.f 
		}

	}

	return {
		place: place,
		move: move,
		left: turn.bind(this, -1),
		right: turn.bind(this, 1),
		report: report,
		tableLength: tableSideLength,
		getCoordinates: getCoordinates
	}

}

// The following try/catch is useful in order to avoid error writing when the code is not executed by node (console clean movement :-))
try {
    module.exports = robotBuilder;
}
catch (ex)
{}