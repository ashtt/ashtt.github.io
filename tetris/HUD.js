var fn_gameOver= function(){
	
	clearInterval(refreshIntervalId);
	clearInterval(timeId);
	$(document).unbind('keydown');
			
	$(".game-over").addClass("done");
	$(".overlay").addClass("done");
	$(".restart-icon").addClass("done");
	
	
}

var fn_resetToDefault = function() {
	
	speedInMS = 500;
	$(".speed").text(speedInMS/100);
	clearInterval(refreshIntervalId);
	refreshIntervalId = setInterval(goDown, speedInMS);
	
	level = 2
	fn_setFillBoxesAsPerLevel(level);
	$(".levels").removeClass("level-1");
	$(".levels").removeClass("level-2");
	$(".levels").removeClass("level-3");
	$(".levels").addClass("level-"+level);
	
	margin = 4;
	drawStyle = drawStyleEnum.squares;
	redrawAll();
}


var fn_reconfigure = function(){
	
	clearInterval(refreshIntervalId);
	clearInterval(timeId);
	score = 0;
	time = 0;
	currentPositionX = beginingPosX;
	currentPositionY = beginingPosY;
	ctx.clearRect(0, 0, canv.width, canv.height);
	$('.score').text(score);
	refreshIntervalId = setInterval(goDown, speedInMS);
	timeId = setInterval(fn_updateTime, 10);
}

var fn_hideOverlay = function(){
	
	$(".game-over").removeClass("done");
	$(".overlay").removeClass("done");
	$(".restart-icon").removeClass("done");
	
}

var fn_restart = function(){

	$(".game-over").removeClass("done");
	$(".overlay").removeClass("done");
	$(".restart-icon").removeClass("done");
	
	fn_reconfigure();
	$(document).unbind('keydown');
	$(document).keydown(checkKey);
	
	isPaused = 0;
	$(".pause").removeClass("disabled");
	$(".resume").addClass("disabled");
	
	$(".pause").removeAttr("onClick");
	$(".resume").removeAttr("onClick");
	$(".pause").attr("onClick", "fn_pause()");
}

var fn_pause = function(){
	isPaused = 1;
	$(document).unbind('keydown');
	$(".pause").toggleClass("disabled");
	$(".resume").toggleClass("disabled");

	
	
	$(".pause").removeAttr("onClick");
	$(".resume").removeAttr("onClick");
	$(".resume").attr("onClick", "fn_resume()");
	
}

var fn_resume = function(){
	isPaused = 0;
	$(document).unbind('keydown');
	$(document).keydown(checkKey);
	$(".pause").toggleClass("disabled");
	$(".resume").toggleClass("disabled");
	
	$(".pause").removeAttr("onClick");
	$(".resume").removeAttr("onClick");
	$(".pause").attr("onClick", "fn_pause()");
}

var decreaseSpeed = function(){
	var existing = parseInt($(".speed").text());
	if(!isNaN(existing) && existing > 1){
		speedInMS += 100
		clearInterval(refreshIntervalId);
		refreshIntervalId = setInterval(goDown, speedInMS);
		$(".speed").text(existing - 1);
	}
}

var increaseSpeed = function(){
	var existing = parseInt($(".speed").text());
	if(!isNaN(existing) && existing < 9){
		speedInMS -= 100
		clearInterval(refreshIntervalId);
		refreshIntervalId = setInterval(goDown, speedInMS);
		$(".speed").text(existing + 1);
	}
}

var decreaseLevel = function(){
	
	if(level > 1){
		level--;
	}
	fn_setFillBoxesAsPerLevel(level);
	
	$(".levels").removeClass("level-1");
	$(".levels").removeClass("level-2");
	$(".levels").removeClass("level-3");
	$(".levels").addClass("level-"+level);
}

var increaseLevel = function(){
	if(level < 3){
		level++;
	}
	fn_setFillBoxesAsPerLevel(level);
	
	$(".levels").removeClass("level-1");
	$(".levels").removeClass("level-2");
	$(".levels").removeClass("level-3");
	$(".levels").addClass("level-"+level);
}

var fn_changeToDot = function(){
	margin = 6;
	drawStyle = drawStyleEnum.dots;
	redrawAll();
}

var fn_changeToSquare = function(){
	margin = 4;
	drawStyle = drawStyleEnum.squares;
	redrawAll();
}

var redrawAll = function(){
	var cordinatesForY;
	var cordinatesForX;
	for( cordinatesForY = canv.height - squareSize ; cordinatesForY > 0; cordinatesForY -= squareSize ){
				for( cordinatesForX = 0 ; cordinatesForX < canv.width; cordinatesForX += squareSize ){
					// check if this block is coloured or not
					var imageData =  ctx.getImageData( cordinatesForX + squareSize/2 , cordinatesForY + squareSize/2 , 1 , 1).data
					if ((imageData[imageDataRed] != 0) || (imageData[imageDataGreen] != 0) || (imageData[imageDataBlue] != 0)) { // box is colored
					
						// this block is coloured, so print the same one line down 
						ctx.fillStyle = "rgb(" + imageData[imageDataRed] + "," + imageData[imageDataGreen] + "," + imageData[imageDataBlue] + ")";
						ctx.strokeStyle = "rgb(" + imageData[imageDataRed] + "," + imageData[imageDataGreen] + "," + imageData[imageDataBlue] + ")";
					
						ctx.clearRect ( cordinatesForX , cordinatesForY  , squareSize  , squareSize );
						fn_drawBlock(cordinatesForX, cordinatesForY);
					}		
				}
	}
}