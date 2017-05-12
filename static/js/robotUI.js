var robotBuilder = require('./robot.js'),
	$dom = require('./fluentDom.js');


function robotUI(){

	var tableStng = {
			minLength: 5,
			maxLength: 15	
		},
		robotStng = {
			pos: {
				initial: 0,
				unit: 100
			},
			facing: {
				n: 180,
				e: 90,
				s: 0,
				w: 270
			},
			actualDeg: undefined
		},
		Robot = robotBuilder(promptTableLength()),
		$robot;
		commandsArray = [
			//buildCommandHTML('place', place),
			buildCommandHTML('move', move),
			buildCommandHTML('left', turn.bind(null, 'left')),
			buildCommandHTML('right', turn.bind(null, 'right'))
		];

	// Init
	init();
	

	function init(){

		buildStageHTML();

	}

	function promptTableLength(){

		var tableSideLength;

		while( !tableSideLength || isNaN(tableSideLength) || tableSideLength < 5 || tableSideLength > 15){

			tableSideLength = prompt('Welcome on iRobot, Please enter a number between ' + tableStng.minLength + ' and ' + tableStng.maxLength + ' in order to specify the table length.', tableStng.minLength);

		}

		return tableSideLength;

	}


	// HTML build - Start
	function buildTableHTML(size){

		var table = $dom.create('div').attr('id','table').on('click', place).append(

						$dom.create('ul', size).append(

							$dom.create('li', size)

						)
					);

		// Add robot svg object
		$robot = $dom.create('object').attr('data','https://cdn.rawgit.com/lvkino/IRobot/master/static/img/robot.svg').attr('type','image/svg+xml').cls('robot-image');

		$dom(table.toDom().children[0].children[0]).append(
			$robot
		)
		
		return table;

	}

	function buildCommandHTML (label, fn){

		return $dom.create('button').cls('btn btn-default').text(label).on('click', fn);

	} 

	function buildCommandsHTML(){

		return $dom.create('div').attr('id','commands').append(
			
					$dom.create('div').id('message-box').attr('style','display:none').cls('alert alert-dismissible alert-danger').append(
						$dom.create('button').cls('close').attr('data-dismiss','alert').text('×').on('click', hideMessageBox)
					).append(
						$dom.create('span').text('...')
					)
					
				).append(
					$dom.create('div').cls('btn-group').append(
						commandsArray
					)
				)

	}	

	function buildStageHTML(){

		$dom(document.body).append(
			$dom.create('div').id('robot-table-container').append(
				$dom.create('section').id('section-commands').cls('col-xs-12').append(
					buildCommandsHTML()
				)
			).append(
				$dom.create('section').id('section-table').cls('col-xs-12').append(
					buildTableHTML( Robot.tableLength )
				)
			)
		);

	}
	// HTML build - End

	// Commands - Start
	function place(e){

		if((e.target && e.target.tagName !== 'LI') || !e.target) {
			e.stopPropagation();
			return;
		}

		if(!Robot.getCoordinates().f){
			$robot.toDom().style.transition = 'none';
			$robot.toDom().style.display = 'block';
		} else {
			$robot.toDom().style.transition = '';
		}

		var x = Array.from(e.target.parentNode.children).indexOf(e.target),
			y = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode),
			res = Robot.place(x,y, Robot.getCoordinates().f || 'n');

		if(!res.error){

			robotStng.actualDeg = robotStng.actualDeg == undefined ? robotStng.facing.n : robotStng.actualDeg;
			placeRobot(x,y);

		} else {
			showMessageBox(res.msg);
		}

		// askForFacing(function cb(f){
		// 	Robot.place(x,y,f);
		// });

	}

	function move(){

		var res = Robot.move();

		if(!res.error){
			var x = Robot.getCoordinates().x,
				y = Robot.getCoordinates().y;

			placeRobot(x,y);

		} else {

			showMessageBox(res.msg);

		}

	}

	function turn(direction){

		var res = direction === 'left' ? Robot.left() : Robot.right();

		if(!res.error){
			
			robotStng.actualDeg += direction === 'left' ? 90  : - 90;
			$robot.toDom().style.transform = 'rotate(' + robotStng.actualDeg + 'deg)';

		} else {

			showMessageBox(res.msg);

		}
	}
	// Commands - End

	function placeRobot(x,y){

		$robot.toDom().style.left = robotStng.pos.initial + (x * robotStng.pos.unit) + '%';
		$robot.toDom().style.top = robotStng.pos.initial + (y * robotStng.pos.unit) + '%';
		$robot.toDom().style.transform = 'rotate(' + robotStng.actualDeg +'deg)';
		$robot.toDom().style.transition = '';

	}

	function getNewRobotStyle(){
		var coordinates = Robot.getCoordinates();

		return ''
	}

	//function askForFacing(cb){
		
		// Show facing select
		// On select execute cb(f)

	//}

	// Listeners - Start
	function hideMessageBox(){

		var msgBox = document.getElementById('message-box');
		msgBox.style.display = 'none';


	}
	function showMessageBox(msg){

		var msgBox = document.getElementById('message-box'),
			span = msgBox.getElementsByTagName('span')[0];
		
		span.innerText = msg;
		msgBox.style.display = 'block';


	}
	// Listeners - End


}

// The following try/catch is useful in order to avoid error writing when the code is not executed by node (console clean movement :-))
try {
    module.exports = robotUI;
}
catch (ex)
{}