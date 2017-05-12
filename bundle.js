/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var robotBuilder = __webpack_require__(2),
	$dom = __webpack_require__(1);


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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Fluent DOM Manipulation
 *
 * @author  Tommy Montgomery <http://tommymontgomery.com/>
 * @customizedBy Luca Campanale
 * @license http://sam.zoy.org/wtfpl/
 */

var FluentDom = (function(){
    var FluentDom = function(node) {
        return new FluentDomInternal(node);
    }
    
    FluentDom.create = function(tagName, num) {
        var f = new FluentDomInternal();
        f.create(tagName, num || null);
        return f;
    }
    
    var FluentDomInternal = function(node) {
        var root = node || null;
        
        this.fluentDom = "1.0";
        
        this.append = function(obj) {

            if(root && Array.isArray(root)){
                var rootLength = root.length;
                root = root[0];
                this.append(obj);
                var tempRoot = root;
                root = [];
                for(let i = 0; i < rootLength; i++){
                    root.push(tempRoot.cloneNode(true));
                }
                return this;
            }

            if (!root || !root.appendChild) {
                throw new Error("Cannot append to a non-element");
            }
            
            var type = typeof(obj);
            if (type === "object") {
                if(Array.isArray(obj)){
                    obj.forEach( element => {
                        this.append(element);
                    });
                    return this;
                } 
                if (obj.fluentDom) {
                    if(Array.isArray(obj.toDom())){
                        obj.toDom().forEach( function(element, index) {
                            root.appendChild(element);
                        });
                    } else {
                        root.appendChild(obj.toDom());
                    }                    
                } else if (obj.nodeType) {
                    root.appendChild(obj);
                } else {
                    throw new Error("Invalid argument: not a DOM element or a FluentDom object");
                }
                
            } else if (type === "string" || type === "number") {
                root.appendChild(document.createTextNode(obj));
            } else {
                throw new Error("Invalid argument: not an object (you gave me a " + typeof(obj) + ")");
            }
            
            return this;
        }
        
        this.attr = function(name, value) {
            if (!root || !root.setAttribute) {
                throw new Error("Cannot set an attribute on a non-element");
            }
            
            root.setAttribute(name, value);
            return this;
        }
        
        this.text = function(text) {
            return this.append(text);
        }
        
        this.create = function(tagName, num) {
            if(num){
                for(let i = 0; i < num; i++){
                    this.create(tagName);
                }
            }else{
                var newTag = document.createElement(tagName);
                if(!root){
                    root = newTag;
                } else if(!Array.isArray(root)){
                    root = [root, newTag];
                } else {
                    root.push(newTag)
                }
            }
            return this;
        }
        
        this.id = function(value) {
            return this.attr("id", value);
        }
        
        this.title = function(value) {
            return this.attr("title", value);
        }
        
        this.cls = function(value) {
            return this.attr("class", value);
        }
        
        this.clear = function() {
            root = null;
            return this;
        }
        
        this.toDom = function() {
            return root;
        }
        
        this.href = function(link) {
            return this.attr("href", link);
        }

        this.on = function(event, cb) {
            root.addEventListener(event, cb);
            return this;
        }
        
    };
    
    return FluentDom;

})();

module.exports = FluentDom;

/***/ }),
/* 2 */
/***/ (function(module, exports) {


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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var robotUI = __webpack_require__(0);


window.addEventListener('load', function(){

	var robot = robotUI();

});

/***/ })
/******/ ]);