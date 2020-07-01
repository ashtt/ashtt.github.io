margin = 4;

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
	
	fn_drawBlock(currentPositionX + (squareSize*(number%3)), currentPositionY + (squareSize * Math.floor(number/3)));
	
}

var fn_drawBlock = function( x, y ){
	
	if(drawStyle){
		ctx.fillRect (x + margin, y + margin, squareSize - margin*2 , squareSize - margin*2);
	} else {
		ctx.beginPath();
		ctx.arc(x + squareSize/2 , y + squareSize/2, squareSize/2 - margin, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
	}
}


/********************
Will comment this bitch later...
*********************/
var checkForRecolorInit = function( fillBoxes){

		for(var number=0; number<9;number++){	
				if ($.inArray(number, fillBoxes) > -1)
				{
					var ImageData = ctx.getImageData(currentPositionX + (squareSize*(number%3)) + squareSize/2, currentPositionY + (squareSize * Math.floor(number/3)) + squareSize/2, 1 , 1).data;
									if ((ImageData[imageDataRed] != 0) || (ImageData[imageDataGreen] != 0) || (ImageData[imageDataBlue] != 0)){
										return false;
										}
			}
	
		}	
return true;
}