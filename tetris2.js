/********************
Some configurations
*********************/
var initPosX = 100;
var initPosY = 100;
var squareSize = 20;
var isLoggingEnabled = false;


/********************
Put colors here
*********************/
colorEnum =  [
	"rgb(200,0,0)", // red
	"rgb(0,200,0)", // green
	"rgb(0,0,200)"  //blue
]


/********************
I am lost, who am I ? where am I ?!?!
*********************/
locEnum =  {
	
	down : 0,
	left : 1,
	right : 2
}

/********************
Put patterns to be painted here..

They will be painted in this order..
 0 1 2
 3 4 5
 6 7 8
 
for eg. -- 

[1,3,4,5], //smallT
 
 . 1 .
 3 4 5
 . . .
 
 [1,4,6,7,8],  //bigT
 
 . 1 .
 . 4 .
 6 7 8
 
 [1,3,4,5,7],  // +
 
 . 1 .
 3 4 5
 . 7 .

got it ??
*********************/
fillBoxes =  [
	 [1,3,4,5], //smallT
	 [1,4,6,7,8],  //bigT
	 [1,4,7],  // I
	 [1,4,6,7], // J
	 [1,4,7,8],  // L
	 //[0,1,3,4],  // O , box
	 [1,4,5],  // small L
	 [1,3,4],  // small L
	 [1,3,4,5,6,7],  // Bomb left
	 [1,3,4,5,7,8],  // Bomb right
	 [1,3,4,5,7],  // +
	 [0,1,2,3,4,6],  // F
	 [1,3,4,5,6],  // wierd 1
	 [1,3,4,5,8]  //  wierd 2
	 
	 // This pattern halts the game on moving the pattern right. ~infinite loop~
	 // [0,2,6,8]  //  super-bug
	 
]

/********************
This starts the game on document.ready
*********************/
var handler = function() {
	saveMyAss($('#canv'));
	canv = $('#canv')[0];
	if (canv.getContext) {
        ctx = canv.getContext("2d");
	}
	
	currentColor = colorEnum[Math.floor(Math.random()*colorEnum.length)]
	currentPattern =fillBoxes[Math.floor(Math.random()*fillBoxes.length)];
	saveMyAss("current pattern is " + currentPattern);
	refreshIntervalId = setInterval(goDown, 500);
}

/********************
run hndler when document is ready
*********************/
$(document).ready(handler);


/********************
This fires on document.keyPress
*********************/
var checkKey = function(e){
	
	reColor()
	ctx.fillStyle = "rgb(200,0,0)";
	
	switch(e.keyCode){
		case 97 : //a
		fn_Rotate();
		break;
		case 46 : //.
		fn_right();
		break;
		case 44 : //,
		fn_left();
		break;
		case 32 : //space .. drop
		fn_down();
		break;
		default :
		saveMyAss(e.keyCode)
		break;
	}  
}

/********************
This rotates the pattern , colckwise
*********************/
var fn_Rotate = function(){ 
	
	var temp = [];
	var i = 0;
	var j = 6
	saveMyAss("Current pattern passed in function  is " + currentPattern );
	
	while(i<9){
		
		if ($.inArray(j, currentPattern) > -1)
		{
			temp.push(i)
		}
		i++;
		if((j-3) >=0){
			j -= 3;
		}else{
			j += 7;
		}
	}
	saveMyAss("temp is " + temp );
	clearPrev();
	currentPattern = temp;
	reColor();
}


/********************
This moves the pattern right
*********************/
var fn_right = function(){
	if(checkForEndRight()&& checkForMovementRight()){ 
		clearPrev()
		initPosX += squareSize;
		reColor();
	}
}

/********************
This moves the pattern left
*********************/
var fn_left = function(){
	if(checkForEndLeft() && checkForMovementLeft()){ 
		clearPrev()
		initPosX -= squareSize;
		reColor();
	}
}

/********************
This moves the pattern down
This is fired either via goDown function in each half a second or by press the SPACE-BAR
*********************/
var fn_down = function(){
	if(checkForEndDown() && checkForMovementDown()) { 
		clearPrev()
		initPosY += squareSize;
		reColor();
		}else{
		initPosX = 100;
		initPosY = 100;
		squareSize = squareSize;
		
		currentColor = colorEnum[Math.floor(Math.random()*colorEnum.length)]
		currentPattern =fillBoxes[Math.floor(Math.random()*fillBoxes.length)];
		if (!checkForRecolorInit(currentPattern)){
		
			clearInterval(refreshIntervalId);
			showGameOver();
			$(document).unbind('keypress')
		}
	}
}

/********************
This draws the pattern on each keypress or time-interval for downfall
*********************/
var reColor = function(){
	var color = "rgb(0,200,0)";
	drawPattern(currentColor,currentPattern);
}

/********************
This clears the pattern on each keypress or time-interval for downfall
*********************/
var clearPrev = function(){
	for(var number=0; number<9;number++){
		if ($.inArray(number, currentPattern)  > -1 )
		{
			ctx.clearRect(initPosX + (squareSize*(number%3)), initPosY + (squareSize * Math.floor(number/3)), squareSize , squareSize);
		}
	}
}

/********************
It is fired in every half a second 
*********************/
var goDown = function(){
	reColor();
	fn_down();
}


/********************
Binding the keyPress Event
*********************/
$(document).keypress(checkKey);


/********************
Checks if a pattern can go down or not..
ignore te logic, its stoned
*********************/
checkForMovementDown = function(){
		
		var number=8;
		while (number !=0){
			
			var imageData = ctx.getImageData(initPosX + (squareSize*(number%3)), initPosY + (squareSize * Math.floor(number/3)), squareSize/2 , squareSize/2).data 
			//var imageData = ctx.getImageData( initPosX , initPosY + squareSize , 5, 5).data 
			if ((imageData[0] != 0) || (imageData[1] != 0) || (imageData[2] != 0)) { // box is colored
						if ($.inArray(number, currentPattern) != -1){ //  belongs
							
							var lowerImageData = ctx.getImageData(initPosX + (squareSize*(number%3)), initPosY + (squareSize *(1 +  Math.floor(number/3))), squareSize/2 , squareSize/2).data;
							if ((lowerImageData[0] != 0) || (lowerImageData[1] != 0) || (lowerImageData[2] != 0)) { // lower box is colored
								return false;
							}
							
							if(number % 3 == 0)
							break;
							while(number > 0){
								number = number -3;
							}
							number = number + 8;
							continue;
							
						}	
			}
			if((number-3) >= 0){
				number = number - 3;
				}else{
						number = number + 5;
				}
		
	} 
	return true
}

/********************
Checks if a pattern can go left or not..
ignore te logic, its stoned
*********************/
checkForMovementLeft = function(){
		var returnFlag;
		var number=0;
		while (number < 9){
			
			var imageData = ctx.getImageData(initPosX + (squareSize*(number%3)), initPosY + (squareSize * Math.floor(number/3)), squareSize/2 , squareSize/2).data 
			//var imageData = ctx.getImageData( initPosX , initPosY + squareSize , 5, 5).data 
			if ((imageData[0] != 0) || (imageData[1] != 0) || (imageData[2] != 0)) { // box is colored
						if ($.inArray(number, currentPattern) != -1){ //  belongs
							
							var leftImageData = ctx.getImageData(initPosX + (squareSize*((number%3) -1)), initPosY + (squareSize * Math.floor(number/3)), squareSize/2 , squareSize/2).data;
							if ((leftImageData[0] != 0) || (leftImageData[1] != 0) || (leftImageData[2] != 0)) { // left box is colored
								return false;
							}
							
							if(number >= 6)
							{returnFlag = true;
							break;}
							if(number < 3){
								number = 3;
								continue;
							}
							if(number < 6){
								number = 6;
								continue;
							}
							
							
						}	
				}else{
				returnFlag = true;
			}
			number++;
		}
		
	 return returnFlag

	
}

/********************
Checks if a pattern can go right or not..
ignore te logic, its stoned
*********************/
checkForMovementRight = function(){

		var number=2;
		while (number != 6){
			
			var imageData = ctx.getImageData(initPosX + (squareSize*(number%3)), initPosY + (squareSize * Math.floor(number/3)), squareSize/2 , squareSize/2).data 
			//var imageData = ctx.getImageData( initPosX , initPosY + squareSize , 5, 5).data 
			if ((imageData[0] != 0) || (imageData[1] != 0) || (imageData[2] != 0)) { // box is colored
						if ($.inArray(number, currentPattern) != -1){ //  belongs
							
							var leftImageData = ctx.getImageData(initPosX + (squareSize*((number%3)  + 1)), initPosY + (squareSize * Math.floor(number/3)), squareSize/2 , squareSize/2).data;
							if ((leftImageData[0] != 0) || (leftImageData[1] != 0) || (leftImageData[2] != 0)) { // left box is colored
								return false;
							}
							
							if(number > 5)
							break;
							while((number % 3) > 0){
								number = number - 1;
							}
							number = number + 5;
							continue;
							
						}	
			}
			if((number-1) >= 0){
				number = number - 1;
				}else{
			number = number + 5;
		}
		
	} return true;
}

/********************
Checks if end has come or not
*********************/
var checkForEndDown = function(){
	var returnFlag = true;
	for(i=0; i<9;i++){
		if ($.inArray(i, currentPattern) != -1){ //  belongs
			returnFlag =  ((initPosY + (squareSize * (Math.floor(i/3) + 1) ) ) < canv.height)
		}
	}
	return returnFlag;	
}

/********************
Checks if end has come or not
*********************/
var checkForEndRight = function(){
	var returnFlag = true;
	for(i=0; i<9;i++){
		if ($.inArray(i, currentPattern) != -1){ //  belongs
			returnFlag =  ((initPosX + (squareSize * (Math.floor(i%3) + 1) ) ) < canv.width)
			if(!returnFlag) 
			return returnFlag;
		}
	}
	return returnFlag;	
}

/********************
Checks if end has come or not
*********************/
var checkForEndLeft = function(){
	var returnFlag = true;
		for(i=0; i<9;i++){
			if ($.inArray(i, currentPattern) != -1){ //  belongs
				returnFlag =  ((initPosX + (squareSize * Math.floor(i%3) ) ) > 0);
				if(!returnFlag) 
			return returnFlag;
			}
		}
		return returnFlag;	
}

/********************
This guy owns logging or dumping the shit in console.
*********************/
var saveMyAss = function(message){
if(isLoggingEnabled)
	console.log(message);
}