/********************
This is a function to draw a given pattern with a given color
*********************/
var drawPattern = function(color, fillBoxes){
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	
	
	for(i=0; i<9;i++){
		if ($.inArray(i, fillBoxes) > -1)
		{
			fill(i)
		}
	}
	
}

/********************
This is a function to draw a box/elementarySquare , it takes a number from 0-8 :)
*********************/
var fill= function(number){
    ctx.fillRect (initPosX + (squareSize*(number%3)), initPosY + (squareSize * Math.floor(number/3)), squareSize , squareSize);
}


/********************
Will comment this bitch later...
*********************/
var checkForRecolorInit = function( fillBoxes){

		for(var number=0; number<9;number++){	
				if ($.inArray(number, fillBoxes) > -1)
				{
					var ImageData = ctx.getImageData(initPosX + (squareSize*(number%3)), initPosY + (squareSize * Math.floor(number/3)), squareSize/2 , squareSize/2).data;
									if ((ImageData[0] != 0) || (ImageData[1] != 0) || (ImageData[2] != 0)){
										return false;
										}
			}
	
		}	
return true;
}