window.addEventListener('load', function(){

	var tableSideLength;

	while( !tableSideLength || isNaN(tableSideLength) || tableSideLength < 5 || tableSideLength > 15){

		tableSideLength = prompt('Welcome on Robot Table 3000, Please enter a number between 5 and 15 in order to specify the table length.', 5);

	}

	document.getElementById('table').appendChild(buildGrid(tableSideLength));

});

function buildGrid(size){

	var container = document.createElement('div'),
	 	ul = document.createElement('ul'),
		li = document.createElement('li');

	for(let i = 0; i < size; i++){

		ul.appendChild(li.cloneNode());

	}

	for(let i = 0; i < size; i++){

		container.appendChild(ul.cloneNode(true));
		
	}

	return container;

}