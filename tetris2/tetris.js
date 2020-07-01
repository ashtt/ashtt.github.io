/********************
Some configurations
*********************/
var score = 0;
var time = 0;
var beginingPosX = 100
var beginingPosY = 0
var currentPositionX = beginingPosX;
var currentPositionY = beginingPosY;
var squareSize = 20;
var isLoggingEnabled = true;
var speedInMS = 500;
var difficulity = 0;
var drawStyle = 1;
var isPaused = 0;
var level = 2;


/********************
Put colors here
*********************/
colorEnum =  [
	"rgb(240,60,60)", // red
	"rgb(150,240,60)", // green
	"rgb(60,150,240)"  //blue
]

var drawStyleEnum = {
    dots : 0,
    squares : 1
}

/*******************
image data for checking movements (down,right,left)
********************/

imageDataRed = 0;
imageDataGreen = 1;
imageDataBlue = 2;


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

				 [1,4,6,7,8],  //bigT
				 [1,4,7],  // I
				 [1,4,6,7], // J
				 [1,4,7,8],  // L
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

var fn_setFillBoxesAsPerLevel = function(level){
	
	saveMyAss("fn_setFillBoxesAsPerLevel - level - " +  level);
	
	switch(level){
		case 1 : 
			fillBoxes =  [

				 [1,3,4,5], //smallT
				 [1,4,6,7,8],  //bigT
				 [1,4,7],  // I
				 [1,4,6,7], // J
				 [1,4,7,8],  // L
				 [0,1,3,4],  // O , box
				 [1,4,5],  // small L
				 [1,3,4],  // small L
				 
			]
		break;
		case 2 : 
			fillBoxes =  [

				 [1,3,4,5], //smallT
				 [1,4,6,7,8],  //bigT
				 [1,4,7],  // I
				 [1,4,6,7], // J
				 [1,4,7,8],  // L
				 [0,1,3,4],  // O , box
				 [1,4,5],  // small L
				 [1,3,4],  // small L
				 [1,3,4,5,6,7],  // Bomb left
				 [1,3,4,5,7,8],  // Bomb right
				 [1,3,4,5,7],  // +
				 [0,1,2,3,4,6],  // F
				 
				 // This pattern halts the game on moving the pattern right. ~infinite loop~
				 // [0,2,6,8]  //  super-bug
				 
			]
		break;
		case 3 : 
			fillBoxes =  [

				 [1,4,6,7,8],  //bigT
				 [1,4,7],  // I
				 [1,4,6,7], // J
				 [1,4,7,8],  // L
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
		break;
		default :
		break;
	}  
}

/********************
This starts the game on document.ready
*********************/
var handler = function() {
	saveMyAss($('#canv'));
	canv = $('#canv')[0];
	if (canv.getContext) {
        ctx = canv.getContext("2d");
	}
	fn_setFillBoxesAsPerLevel();
	currentColor = colorEnum[Math.floor(Math.random()*colorEnum.length)]
	currentPattern =fillBoxes[Math.floor(Math.random()*fillBoxes.length)];
	saveMyAss("current pattern is " + currentPattern);
	refreshIntervalId = setInterval(goDown, speedInMS);
	timeId = setInterval(fn_updateTime, 10);
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
	
	switch(e.which){
		case 38 : // up arrow
		fn_Rotate();
		break;
		case 39 : //right arrow
		fn_right();
		break;
		case 37 : //left arrow
		fn_left();
		break;
		case 40 : //down arrow
		fn_down();
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
		currentPositionX += squareSize;
		reColor();
	}
}

/********************
This moves the pattern left
*********************/
var fn_left = function(){
	if(checkForEndLeft() && checkForMovementLeft()){ 
		clearPrev()
		currentPositionX -= squareSize;
		reColor();
	}
}

var fn_checkForLine = function(){
	//var bottomLeftBlockImgData =  ctx.getImageData(0, canv.height - squareSize, squareSize/2 , squareSize/2).datacanv.height
	var numberOfLinesFilled = 0;
	var lineFilled = true;
	for( var blockCordinatesY = canv.height - squareSize ; blockCordinatesY > 0; blockCordinatesY -= squareSize ){
		for( var blockCordinatesX = 0 ; blockCordinatesX < canv.width; blockCordinatesX += squareSize ){
			
			var imageData =  ctx.getImageData( blockCordinatesX + squareSize/2 , blockCordinatesY + squareSize/2 , 1 , 1).data
			if ((imageData[imageDataRed] == 0) && (imageData[imageDataGreen] == 0) && (imageData[imageDataBlue] == 0)) { // box is not colored
				lineFilled = false;
			}		
		}
		if(lineFilled){
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.strokeStyle = "rgb(0,0,0)";
			ctx.clearRect (0, blockCordinatesY, canv.width , squareSize);
			fn_addToScore();
			numberOfLinesFilled++;
		}
		lineFilled = true;
	}
	
	while(numberOfLinesFilled > 0)
	{
		fn_shiftUncompletedLinesDown();
		numberOfLinesFilled--;
	}
	
}

var fn_shiftUncompletedLinesDown = function(){
	var lineEmpty = true;
	for( var blockCordinatesY = canv.height - squareSize ; blockCordinatesY > 0; blockCordinatesY -= squareSize ){
		for( var blockCordinatesX = 0 ; blockCordinatesX < canv.width; blockCordinatesX += squareSize ){
			
			var imageData =  ctx.getImageData( blockCordinatesX + squareSize/2 , blockCordinatesY + squareSize/2 , 1 , 1).data
			if ((imageData[imageDataRed] != 0) || (imageData[imageDataGreen] != 0) || (imageData[imageDataBlue] != 0)) { // box is colored
				lineEmpty = false;
			}		
		}
		if(lineEmpty){
				
				var lineShifted = false;
				for( var blockCordinatesX = 0 ; blockCordinatesX < canv.width; blockCordinatesX += squareSize ){
				
					// check for the line above -- blockCordinatesY - squareSize/2
					var imageData =  ctx.getImageData( blockCordinatesX + squareSize/2 , blockCordinatesY - squareSize/2 , 1 , 1).data
					if ((imageData[imageDataRed] != 0) || (imageData[imageDataGreen] != 0) || (imageData[imageDataBlue] != 0)) { // box is colored
					
						// this block is coloured, so print the same one line down 
						ctx.fillStyle = "rgb(" + imageData[imageDataRed] + "," + imageData[imageDataGreen] + "," + imageData[imageDataBlue] + ")";
						ctx.strokeStyle = "rgb(" + imageData[imageDataRed] + "," + imageData[imageDataGreen] + "," + imageData[imageDataBlue] + ")";
						
						fn_drawBlock(blockCordinatesX, blockCordinatesY);
						// empty this box
						ctx.clearRect ( blockCordinatesX + margin, blockCordinatesY - squareSize + margin, squareSize - margin , squareSize - margin);
						lineShifted = true;
					}		
				}
		}
		lineEmpty = true;
	}
}

var fn_addToScore = function(){
	score++;
	$('.score').text(score);
}

var fn_updateTime = function(){
	if(!isPaused) {
		time++;
		var milliSeconds = time%100
		var seconds =  Math.floor(time/100);
		var minutes =  Math.floor(seconds/60);
		$('.time').text(minutes + " : " + seconds%60 + " : " + milliSeconds );
		
		//lines per minute
		var lpm = minutes == 0 ? score: Math.floor(score/minutes);
		$('.lines-per-minute').text(lpm);
	}
}

/********************
This moves the pattern down
This is fired either via goDown function in each half a second or by press the SPACE-BAR
*********************/
var fn_down = function(){
	if(checkForEndDown() && checkForMovementDown()) { 
		clearPrev()
		currentPositionY += squareSize;
		reColor();
		}else{
			
		fn_checkForLine();	
		currentPositionX = beginingPosX;
		currentPositionY = beginingPosY;
		squareSize = squareSize;
		
		currentColor = colorEnum[Math.floor(Math.random()*colorEnum.length)]
		currentPattern =fillBoxes[Math.floor(Math.random()*fillBoxes.length)];
		if (!checkForRecolorInit(currentPattern)){

			fn_gameOver();
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
			ctx.clearRect(currentPositionX + (squareSize*(number%3)), currentPositionY + (squareSize * Math.floor(number/3)), squareSize , squareSize);
		}
	}
}

/********************
It is fired in every half a second 
*********************/
var goDown = function(){
	if(!isPaused) {
		reColor();
		fn_down();
	}
}


/********************
Binding the keydown Event
*********************/
$(document).keydown(checkKey);

var getImageDataForABox = function(number){
	return ctx.getImageData(currentPositionX + (squareSize*(number%3)) + squareSize/2, currentPositionY + (squareSize * Math.floor(number/3)) + squareSize/2, 1 , 1).data;
}

/********************
Checks if a pattern can go down or not..
ignore te logic, its stoned
*********************/
checkForMovementDown = function(){
		
		var number=8;
		while (number !=0){
			
			var imageData = getImageDataForABox(number); 
			if ((imageData[imageDataRed] != 0) || (imageData[imageDataGreen] != 0) || (imageData[imageDataBlue] != 0)) { // box is colored
						if ($.inArray(number, currentPattern) != -1){ //  belongs
							
							var lowerImageData = ctx.getImageData(currentPositionX + (squareSize*(number%3)) + squareSize/2, currentPositionY + (squareSize *(1 +  Math.floor(number/3))) + squareSize/2,  1, 1).data;
							if ((lowerImageData[imageDataRed] != 0) || (lowerImageData[imageDataGreen] != 0) || (lowerImageData[imageDataBlue] != 0)) { // lower box is colored
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
			
			var imageData = getImageDataForABox(number)
			if ((imageData[imageDataRed] != 0) || (imageData[imageDataGreen] != 0) || (imageData[imageDataBlue] != 0)) { // box is colored
						if ($.inArray(number, currentPattern) != -1){ //  belongs
							
							var leftImageData = ctx.getImageData(currentPositionX + (squareSize*((number%3) -1)) + squareSize/2, currentPositionY + (squareSize * Math.floor(number/3)) + squareSize/2, 1 , 1).data;
							if ((leftImageData[imageDataRed] != 0) || (leftImageData[imageDataGreen] != 0) || (leftImageData[imageDataBlue] != 0)) { // left box is colored
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
			
			var imageData = getImageDataForABox(number) 
			if ((imageData[imageDataRed] != 0) || (imageData[imageDataGreen] != 0) || (imageData[imageDataBlue] != 0)) { // box is colored
						if ($.inArray(number, currentPattern) != -1){ //  belongs
							
							var leftImageData = ctx.getImageData(currentPositionX + (squareSize*((number%3)  + 1)) + squareSize/2, currentPositionY + (squareSize * Math.floor(number/3)) + squareSize/2,  1, 1).data;
							if ((leftImageData[imageDataRed] != 0) || (leftImageData[imageDataGreen] != 0) || (leftImageData[imageDataBlue] != 0)) { // left box is colored
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
			returnFlag =  ((currentPositionY + (squareSize * (Math.floor(i/3) + 1) ) ) < canv.height)
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
			returnFlag =  ((currentPositionX + (squareSize * (Math.floor(i%3) + 1) ) ) < canv.width)
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
				returnFlag =  ((currentPositionX + (squareSize * Math.floor(i%3) ) ) > 0);
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