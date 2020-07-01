var fn_Rotate_buggy = function(){ // code for rotation will come here
/*	clearPrev()
	for(i=0; i<8;i++){
		if ($.inArray(i, currentPattern) != -1){ //  belongs
			fillRotatedRight(i)
		}
	}
	
*/  var temp = [];
	var i = 0;
	var j = 6
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
	clearPrev();
	currentPattern = temp;
	reColor();


/*
ctx.fillRect (currentPositionX, currentPositionY, squareSize , squareSize);*/
}