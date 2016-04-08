/* debug code */ var debug = true;

/*------------------------------------------------------------------------*/
/*-------------------- HOUSE CONSTRUCTORS AND METHODS --------------------*/
/*------------------------------------------------------------------------*/
var House = function(type,divID,beads){ /* debug code */ if(debug){console.log("House()");}
	this.type = type;
	this.divID = divID;
	this.beads = beads;

	this.clickable = false;
}
House.prototype.makeClickable = function(){ /* debug code */ if(debug){console.log("House.makeClickable() " + this.divID);}
	this.clickable = true;
	var divToChange = document.getElementById(this.divID);
	if (isPlayerTurn){
		divToChange.style.backgroundColor = ACTIVEBLUE;
	} else if (!isPlayerTurn){
		divToChange.style.backgroundColor = ACTIVERED;
	}
}
House.prototype.makeUnclickable = function(){ /* debug code */ if(debug){console.log("House.makeUnclickable() " + this.divID);}
	this.clickable = false;
	var divToChange = document.getElementById(this.divID);
	if (this.type === "playerHouse" || this.type === "playerStore"){
		divToChange.style.backgroundColor = PASSIVEBLUE;
	} else if (this.type === "enemyHouse" || this.type === "enemyStore"){
		divToChange.style.backgroundColor = PASSIVERED;
	} else if (this.type === "hand"){
		divToChange.style.backgroundColor = "white";
	}
}
House.prototype.hasOne = function(){ /* debug code */ if(debug){console.log("House.hasOne() " + this.divID);}
	if(this.beads === 1){
		return true;
	}
	return false;
}
House.prototype.isEmpty = function(){ /* debug code */ if(debug){console.log("House.isEmpty() " + this.divID);}
	if(this.beads === 0){
		return true;
	}
	return false;
}
House.prototype.emptyOut = function(){ /* debug code */ if(debug){console.log("House.emptyOut() " + this.divID);}
	num = this.beads;
	this.beads = 0;

	var divToChange = document.getElementById(this.divID);
	divToChange.textContent = 0;
	divToChange.style.backgroundColor = "black";

	return num;
}
House.prototype.update = function(){ /* debug code */ if(debug){console.log("House.update() " + this.divID)};
	var divToChange = document.getElementById(this.divID);
	divToChange.textContent = this.beads;
}
House.prototype.mark = function(){
	var divToChange = document.getElementById(this.divID);
	divToChange.textContent = this.beads;
	divToChange.style.backgroundColor = "gray";
}
House.prototype.burn = function(){
	this.type = "burned";
	var divToChange = document.getElementById(this.divID);
	divToChange.textContent = "X";
	divToChange.style.backgroundColor = "brown";
}
/*------------------------------------------------------------------------*/
/*-------------------- STATS CONSTRUCTOR AND METHODS --------------------*/
/*------------------------------------------------------------------------*/
var Stats = function(player, maxStep, maxTurn, maxScore, maxBonus) {
	this.player = player;
	this.maxStep = maxStep;
	this.maxTurn = maxTurn;
	this.maxScore = maxScore;
	this.maxBonus = maxBonus;
	this.steps = 0;
	this.turns = 0;
	this.score = 0;
}
Stats.prototype.update = function(){
	var str = "<li>Continuous Steps: " + this.steps + " - Max: " + this.maxStep + "</li>\n"
      		+ "<li>Chained Turns: " + this.turns + " - Max: " + this.maxTurn + "</li>\n"
      		+ "<li>Max Bonus: " + this.maxBonus + "</li>\n"
      		+ "<li>Max Score: " + this.maxScore + "</ul>"
    var divToChange = document.getElementById(this.player + "_stats");
    divToChange.innerHTML = str;
}
Stats.prototype.addStep = function(){
	this.steps++;
	console.log(this.maxStep);
	if(this.steps > this.maxStep){
		this.maxStep = this.steps;
	}
	this.update();
}
Stats.prototype.addTurn = function(){
	this.turns++;
	if(this.turns > this.maxTurn){
		this.maxTurn = this.turns;
	}
	this.update();
}
Stats.prototype.addMaxScore = function(x){
	if(x > this.maxScore){
		this.maxScore = x;
	}
	this.update();
}
Stats.prototype.addMaxBonus = function(x){
	if(x > this.maxBonus){
		this.maxBonus = x;
	}
	this.update();
}


var player1Stats = new Stats("player1", 0, 0, 0, 0);
var player2Stats = new Stats("player2", 0, 0, 0, 0);
var computerStats = new Stats("computer", 0, 0, 0, 0);

/*------------------------------------------------------------------------*/
/*-------------------- GLOBAL VARIABLES --------------------*/
/*------------------------------------------------------------------------*/

// keep track of the player store and enemy store;
var PLAYERSTOREINDEX = 15;
var ENEMYSTOREINDEX = 7;
var STEPDELAY = 200;
var DELAYPADDING = 1;

var ACTIVEBLUE = "blue";
var ACTIVERED = "red";
var PASSIVEBLUE = "lightblue";
var PASSIVERED = "pink";

// create gameboard
var gameboard = [];
for (var i = 0; i < 7; i++){									// populate gameboard with player houses
	gameboard.push(new House("playerHouse", "div_" + i, 7));
}
gameboard.push(new House("enemyStore", "div_7", 0));			// populate gameboard with player store

for (var i = 8; i < 15; i++){
	gameboard.push(new House("enemyHouse", "div_" + i, 7));		// populate gameboard with enemy houses
}
gameboard.push(new House("playerStore", "div_15", 0));

hand = new House("hand", "div_hand", 0);

// Global variables for most conditionals
var isPlayerTurn = true;
var clickSituation = "Start";  // 0-"Disabled", 1-"Start", 2-"Continue", 3-"Bonus", 4-"Extended", 5-"Trigger"
var useComputer = true;
var setIntervalID = undefined;
var index = undefined;

// Dynamic messages for the game
var divTurn = document.getElementById("div_turn");
var divMessage = document.getElementById("div_message");

// Extra info
var liMenu = document.getElementById("div_menu");
var li2Player = document.getElementById("li_two_player");
var liUseComputer = document.getElementById("li_use_computer");

var liStatsMenu = document.getElementById("li_stats_menu");
var liHowToMenu = document.getElementById("li_how_to_menu");
var liAboutMenu = document.getElementById("li_about_menu");

var divStats = document.getElementById("div_stats");
var divHowTo = document.getElementById("div_how_to");

var modalImage = document.getElementById("modal_img");
var modalPage = 1;
var modalPrev = document.getElementById("modal_previous_position");
var modalNext = document.getElementById("modal_next_position");
var modalClose = document.getElementById("modal_close_position");

/*------------------------------------------------------------------------*/
/*-------------------- EVENT HANLDERS --------------------*/
/*------------------------------------------------------------------------*/

// Event listeners.
var enemyRowHandlers = document.getElementById("div_enemy_row");
enemyRowHandlers.addEventListener("click", function(){  /* debug code */ if(debug){console.log(event.target.id + " clicked");}
	handler(event);
})
var playerRowHandlers = document.getElementById("div_player_row");
playerRowHandlers.addEventListener("click", function(){  /* debug code */ if(debug){console.log(event.target.id + " clicked");}
	handler(event);
});
var menuHandlers = document.getElementById("ul_menu");
menuHandlers.addEventListener("click", function(){  /* debug code */ if(debug){console.log(event.target.id + " clicked");}
	handleMenu(event);
});
var extraPlayHandler = document.getElementById("div_hand");
extraPlayHandler.addEventListener("click", function(){  /* debug code */ if(debug){console.log(event.target.id + " clicked");}
	handleMenu(event);
});

var modalHandler = document.getElementById("div_modal");
modalHandler.addEventListener("click", function(){  /* debug code */ if(debug){console.log(event.target.id + " clicked");}
	handleModal(event);
});

// Actual handler
var handler = function(event){ /* debug code */ if(debug){console.log("handler()");}
	indexClicked = identifyHouse(event.target.id);

	if(!gameboard[indexClicked].clickable){
		return;
	}
	else if (clickSituation === "Start" || clickSituation === "Continue") {
		index = indexClicked;
		clearAllowInput();

		hand.beads = gameboard[index].emptyOut();
		hand.update();
		if(clickSituation === "Start") {
			addTurnCurrentPlayer();
		}
		setIntervalID = setInterval(step, STEPDELAY);
	}
	else if (clickSituation === "Bonus") {
		clearAllowInput();

		var winnings = gameboard[index].emptyOut() + gameboard[14 - index].emptyOut();
		divMessage.textContent = "Bonus! You got " + winnings + " extra points! Now it's " + getNextPlayer() + "'s Turn";
		clickSituation = "Start";

		if(isPlayerTurn){
			gameboard[PLAYERSTOREINDEX].beads += winnings;
			player1Stats.addMaxBonus(winnings);
			setTimeout(function(){
				gameboard[PLAYERSTOREINDEX].update();
				switchTurns();
			}, STEPDELAY);
		}
		else {
			gameboard[ENEMYSTOREINDEX].beads += winnings;
			player2Stats.addMaxBonus(winnings);
			setTimeout(function(){
				gameboard[ENEMYSTOREINDEX].update();

				switchTurns();
			}, STEPDELAY);
		}
	}
}
var handleMenu = function(){
	if (event.target.id === "li_two_player"){
		useComputer = false;
		li2Player.className = "selected menu";
		liUseComputer.className = "menu";
		reset();
	}
	else if (event.target.id === "li_use_computer"){
		useComputer = true;
		li2Player.className = "menu";
		liUseComputer.className = "selected menu";
		reset();
	}
	else if (event.target.id === "li_reset"){
		reset();
	}
	else if (event.target.id === "li_stats_menu"){
		liStatsMenu.classList.toggle("selected");
		divStats.classList.toggle("hidden");
		divMessage.classList.toggle("hidden");
	}
	else if (event.target.id === "li_how_to_menu"){
		modalHandler.classList.toggle("hidden");
	}
	else if (event.target.id === "div_hand" && clickSituation === "Extended"){
		refill();
	}
	else if (event.target.id === "div_hand" && clickSituation === "Trigger") {
		clearAllowInput();
		clickSituation = "Start";
		divTurn.textContent = "Computer's Turn";
		divTurn.style.backgroundColor = ACTIVERED;

		setTimeout(computerMove, STEPDELAY);
	}
}

var handleModal = function(){
	if (event.target.id === "modal_next"){
		var currentImage = "ToDo" + (modalPage * 1 + 1) + ".png";
		modalPage++;
		modalImage.src = currentImage;
	}
	else if (event.target.id === "modal_previous"){
		var currentImage = "ToDo" + (modalPage * 1 - 1) + ".png";
		modalPage--;
		modalImage.src = currentImage;
	}
	else if (event.target.id === "modal_close"){
		modalHandler.classList.toggle("hidden");
	}

	if (modalPage === 1){
		modalPrev.className = "hidden";
		modalNext.className = "";
	} else if (modalPage === 5){
		modalPrev.className = "";
		modalNext.className = "hidden";
	} else {
		modalPrev.className = "";
		modalNext.className = "";
	}
}


/*------------------------------------------------------------------------*/
/*-------------------- MAIN GAMEPLAY FUNCTIONS --------------------*/
/*------------------------------------------------------------------------*/

//function for when player hand is empty;
var emptyHand = function(){ /* debug code */ if(debug){console.log("--Calling Function:emptyHand; index = " + index);}	
	var currentStoreIndex;
	var inOwnSide;
	var isTurnEnd = true;
	if(isPlayerTurn) {
		currentStoreIndex = PLAYERSTOREINDEX;
		inOwnSide = (gameboard[index].type === "playerHouse");
	}
	else {
		currentStoreIndex = ENEMYSTOREINDEX;
		inOwnSide = (gameboard[index].type === "enemyHouse");
	}
	// end in your own store
	if(index === currentStoreIndex && isPlayerTurn){
		/* debug code */ if(debug){console.log("Case 1: Get Another Turn");}
		clearInterval(setIntervalID);
		if(isGameOver()){
			endTallyTotal();
			return;
		}
		divMessage.textContent = "Yes! Got another turn!";
		setTimeout(clearAllowInput, STEPDELAY);
		setTimeout(allowPlayerInput, STEPDELAY);
		return;
	}
	else if(index === currentStoreIndex && !isPlayerTurn){
		/* debug code */ if(debug){console.log("Case 2: Get Another Turn2");}
		clearInterval(setIntervalID);

		if(isGameOver()){
			setTimeout(endTallyTotal, STEPDELAY);
			return;
		}
		clickSituation = "Start";

		if(useComputer){
			divMessage.textContent = "Computer got another turn.";
			clearAllowInput();
			addTurnCurrentPlayer();
			setTimeout(computerMove, STEPDELAY);
			return;
		}
		divMessage.textContent = "Yes! " + getCurrentPlayer() + " Got another turn!";
		setTimeout(clearAllowInput, STEPDELAY);
		setTimeout(allowEnemyInput, STEPDELAY + DELAYPADDING);
		return;
	}
	// end in a house that's not empty
	else if(!gameboard[index].hasOne()){
		/* debug code */ if(debug){console.log("Case 3: Continue Turn");}
		clearInterval(setIntervalID);
		clickSituation = "Continue";

		if(useComputer && !isPlayerTurn){
			clearAllowInput();
			setTimeout(computerMove, STEPDELAY);
			return;
		}
		divMessage.textContent = "Keep going! It's still " + getCurrentPlayer() + "'s turn!";
		setTimeout(clearAllowInput, STEPDELAY);
		setTimeout(function(){gameboard[index].makeClickable()}, STEPDELAY + DELAYPADDING);
	}
	// end in your own empty house and the opposite side is empty
	else if(inOwnSide && gameboard[index].hasOne() && gameboard[14 - index].isEmpty()){
		/* debug code */ if(debug){console.log("Case 4: End Turn");}
		if(useComputer && !isPlayerTurn){
			divMessage.textContent = "Computer finished. Now it's Player 1's turn.";
			setTimeout(switchTurns, STEPDELAY);
			return;}
		clearInterval(setIntervalID);
		divMessage.textContent = "Now it's " + getNextPlayer() + "'s turn.";
		setTimeout(switchTurns, STEPDELAY);
		return;
	}
	// end in your own empty house and the opposite side is not empty
	else if(inOwnSide && gameboard[index].hasOne() && !gameboard[14 - index].isEmpty()){
		/* debug code */ if(debug){console.log("Case 5: End Turn with winnings");}
		clearInterval(setIntervalID);
		clickSituation = "Bonus";
		if(useComputer && !isPlayerTurn){
			var winnings = gameboard[index].emptyOut() + gameboard[14 - index].emptyOut();
			divMessage.textContent = "Computer stole " + winnings + " points.";
			gameboard[ENEMYSTOREINDEX].beads += winnings;
			gameboard[ENEMYSTOREINDEX].update();
			clickSituation = "Start";
			computerStats.addMaxBonus(winnings);
			setTimeout(switchTurns, STEPDELAY);
		}
		else {
			gameboard[index].makeClickable();
			gameboard[14 - index].makeClickable();
			divMessage.textContent = "Grab the bonus!";
		}
	}
	// end in enemy's empty house
	else if(!inOwnSide && gameboard[index].hasOne()){
		/* debug code */ if(debug){console.log("Case 6: End Turn2");}
		clearInterval(setIntervalID);
		setTimeout(switchTurns, STEPDELAY);

		if(useComputer && !isPlayerTurn){
			divMessage.textContent = "Computer finished. Now it's Player 1's turn."
		}
		divMessage.textContent = "Bummer. Now it's " + getNextPlayer() + "'s turn.";
	}
	// not a valid situation
	else {
		console.log("!!!Something went wrong: emptyHand!!!");
	}
}
// function for advancing to the next house;
var step = function(){ /* debug code */ if(debug){console.log("--Calling Function:step");}
	if(!checkSum()){
		clearInterval(setIntervalID);
		return;
	}
	addStepCurrentPlayer();
	// move to the next spot
	index--;

	// stay on the board
	if (index === -1 && isPlayerTurn){
		index = 15;
	// enemy skips player's store
	} else if (index === -1 && !isPlayerTurn){
		index = 14;
	// player skips enemy's store
	} else if (index === 7 && isPlayerTurn){
		index = 6;
	}
	while(gameboard[index].type === "burned"){
		index--;
	}
	// drop a shell
	hand.beads--;
	hand.update();
	gameboard[index].beads++;
	gameboard[index].mark();

	// check if there's no more beads;
	if (hand.isEmpty()){
		clearInterval(setIntervalID);
		emptyHand();
	}
}

// function for switching between players
var switchTurns = function(){ /* debug code */ if(debug){console.log("--Calling Function:switchTurns");}
	isPlayerTurn = !isPlayerTurn;
	resetTurnStepCount();
	/* debug code */ if(debug){console.log("isPlayerTurn = " + isPlayerTurn);}
	if(isGameOver()){
		endTallyTotal();
		return;
	}
	// stop player inputs
	if (useComputer && !isPlayerTurn){
		clearAllowInput();
		clickSituation = "Start";
		divTurn.textContent = "Computer's Turn";
		divTurn.style.backgroundColor = ACTIVERED;

		setTimeout(computerMove, STEPDELAY + DELAYPADDING);
		return;
	// no computer-player 2
	} else if (!useComputer && !isPlayerTurn){
		clearAllowInput();
		allowEnemyInput();

		divTurn.textContent = "Player 2's Turn";
		divTurn.style.backgroundColor = ACTIVERED;

		return;
	// back to player 1
	} else if (isPlayerTurn){
		clearAllowInput();
		allowPlayerInput();

		divTurn.textContent = "Player 1's Turn";
		divTurn.style.backgroundColor = ACTIVEBLUE;

		return;
	} else {
		console.log("!!!Something went wrong!!!")
	}
}

// function for deciding the computer move
var computerMove = function(){ /* debug code */ if(debug){console.log("computerMove()");}

	if(clickSituation === "Start"){
		// decide on a move
		computerPick = Math.floor(Math.random() * 7) + 8;

		while(!isValidComputerMove(computerPick)){
			computerPick = Math.floor(Math.random() * 7) + 8;
		}
		index = computerPick;

		/* debug code */ if(debug){console.log("Index is " + computerPick);}
	}
	// fill hand
	hand.beads = gameboard[index].emptyOut();

	// callback to step
	setIntervalID = setInterval(step, STEPDELAY);

	return 
}

/*------------------------------------------------------------------------*/
/*-------------------- HELPER FUNCTIONS --------------------*/
/*------------------------------------------------------------------------*/
var getCurrentPlayer = function(){
	if (isPlayerTurn){
		return "Player 1";
	}
	else if (!isPlayerTurn && useComputer){
		return "Computer";
	}
	else {
		return "Player 2";
	}
}
var getNextPlayer = function(){
	if (isPlayerTurn && useComputer){
		return "Computer";
	}
	else if (isPlayerTurn && !useComputer){
		return "Player 2";
	}
	else{
		return "Player 1";
	}
}
var addTurnCurrentPlayer = function(){
	if (isPlayerTurn){
		player1Stats.addTurn();
	}
	else if (!isPlayerTurn && useComputer){
		computerStats.addTurn();
	}
	else {
		player2Stats.addTurn();
	}
}
var addStepCurrentPlayer = function(){
	if (isPlayerTurn){
		player1Stats.addStep();
	}
	else if (!isPlayerTurn && useComputer){
		computerStats.addStep();
	}
	else {
		player2Stats.addStep();
	}
}
var resetTurnStepCount = function(){
	player1Stats.steps = 0;
	player2Stats.steps = 0;
	computerStats.steps = 0;
	player1Stats.turns = 0;
	player2Stats.turns = 0;
	computerStats.turns = 0;
}
var identifyHouse = function(str){ /* debug code */ if(debug){console.log("identifyHouse()");}
	for (var i = 0; i < gameboard.length; i++){
		if(gameboard[i].divID === str){
			return i;
		}
	}
}
var isValidMove = function(x){ /* debug code */ if(debug){console.log("isValidMove(" + x + ")");}
	// invalid: House is empty
	if(gameboard[x].isEmpty()){
		/* debug code */ if(debug){console.log("Invalid 1");}
		return false;
	}
	// invalid: not player's turn, player's house clicked
	else if(gameboard[x].type === 'playerHouse' && !allowPlayerInput){
		/* debug code */ if(debug){console.log("Invalid 2");}
		return false;
	}
	// invalid: not enemy's turn, enemy house clicked
	else if(gameboard[x].type === 'enemyHouse' && !allowEnemyInput){
		/* debug code */ if(debug){console.log("Invalid 3");}
		return false;
	}
	else {
		/* debug code */ if(debug){console.log("Valid");}
		return true;
	}
}
var isValidComputerMove = function(x){ /* debug code */ if(debug){console.log("isValidComputerMove(" + x + ")");}
	if(gameboard[x].isEmpty()){
		return false;
	}
	else {
		return true;
	}
}
var checkSum = function() { /* debug code */ if(debug){console.log("checkSum()");}
	var sum = 0;
	for(var i = 0; i < gameboard.length; i++){
		sum += gameboard[i].beads;
	}
	sum += hand.beads;

	if(sum == 98){
		if(debug){console.log("CheckSum valid");}
		return true;
	}
	else {
		console.log("!!! CHECKSUM INVALID!!!");
		return false;
	}
}
var clearAllowInput = function() {  /* debug code */ if(debug){console.log("clearAllowInput()");}
	for(var i = 15; i >= 0; i--) {
		gameboard[i].makeUnclickable();
	}
}
var allowPlayerInput = function() { /* debug code */ if(debug){console.log("allowPlayerInput()");}
	for(var i = 15; i >= 0; i--){
		if(!gameboard[i].isEmpty() && gameboard[i].type === "playerHouse") {
			gameboard[i].makeClickable();
		}
		else {
			gameboard[i].makeUnclickable();
		}
	}
	clickSituation = "Start";
}
var allowEnemyInput = function() { /* debug code */ if(debug){console.log("allowEnemyInput()");}
	for(var i = 14; i >= 8; i--){
		if(!gameboard[i].isEmpty()) {
			gameboard[i].makeClickable();
		}
		gameboard[15].makeUnclickable();
		gameboard[7].makeUnclickable();
		makeEmptyUnclickable();
	}
}
var makeEmptyUnclickable = function() {
	for(var i = 0; i < gameboard.length; i++){
		if(gameboard[i].isEmpty() || gameboard[i].type === "playerStore" || gameboard[i].type === "enemyStore") {
			gameboard[i].makeUnclickable();
		}
	}
}
/*------------------------------------------------------------------------*/
/*-------------------- END GAME FUNCTIONS --------------------*/
/*------------------------------------------------------------------------*/
var isGameOver = function() { /* debug code */ if(debug){console.log("isGameOver()");}
	// game over if player can't move on his turn
	if(isPlayerTurn){
		for(var i = 6; i >= 0; i--){
			if(!gameboard[i].isEmpty()){
				return false;
			}
		}
		return true;
	}
	// game over if enemy can't move on their turn
	else {
		for(var i = 14; i >= 8;i--){
			if(!gameboard[i].isEmpty()){
				return false;
			}
		}
		return true;
	}
}
var endTallyTotal = function() { /* debug code */ if(debug){console.log("endTallyTotal()");}
	for(var i = 6; i >= 0; i--){
		gameboard[PLAYERSTOREINDEX].beads += gameboard[i].emptyOut();
	}
	for(var i = 14; i >= 8; i--){
		gameboard[ENEMYSTOREINDEX].beads += gameboard[i].emptyOut();
	}
	gameboard[PLAYERSTOREINDEX].update();
	gameboard[ENEMYSTOREINDEX].update();

	if(gameboard[PLAYERSTOREINDEX].beads === gameboard[ENEMYSTOREINDEX.beads]){
		divTurn.textContent = "Tie";
		divTurn.style.backgroundColor = "gray";
		divMessage.textContent = "Game over. Click Continue or reset."
	}
	else if(gameboard[PLAYERSTOREINDEX].beads > gameboard[ENEMYSTOREINDEX].beads){
		divTurn.textContent = "Player 1 Wins!";
		divTurn.style.backgroundColor = ACTIVEBLUE;
		divMessage.textContent = "Game over. Click Continue or reset."
	}
	else if(gameboard[PLAYERSTOREINDEX].beads < gameboard[ENEMYSTOREINDEX].beads && useComputer){
		divTurn.textContent = "Computer Wins";
		divTurn.style.backgroundColor = ACTIVERED;
		divMessage.textContent = "Game over. Click Continue or reset."
	}
	else if(gameboard[PLAYERSTOREINDEX].beads < gameboard[ENEMYSTOREINDEX].beads && !useComputer){
		divTurn.textContent = "Player 2 Wins";
		divTurn.style.backgroundColor = ACTIVERED;
		divMessage.textContent = "Game over. Click Continue or reset."
	}

	if (gameboard[PLAYERSTOREINDEX].beads >= 7 && gameboard[ENEMYSTOREINDEX].beads >= 7){
		clickSituation = "Extended";
		extraPlayHandler.textContent = "Continue?";
	}
}
var refill = function() {
	var playerPoints = gameboard[PLAYERSTOREINDEX].beads;
	var enemyPoints = gameboard[ENEMYSTOREINDEX].beads;
	player1Stats.addMaxScore(playerPoints);
	if(useComputer){
		computerStats.addMaxScore(enemyPoints);
	}
	else {
		player2Stats.addMaxScore(enemyPoints);
	}

	for (i = 0; i <= 6; i++){
		if(playerPoints >= 7){
			gameboard[i].type = "playerHouse";
			gameboard[i].beads = 7;
			playerPoints -= 7;
			gameboard[i].update();
		}
		else {
			gameboard[i].burn();
		}
	}
	gameboard[PLAYERSTOREINDEX].beads = playerPoints;
	gameboard[PLAYERSTOREINDEX].update();

	for (i = 8; i <= 14; i++){
		if(enemyPoints >= 7){
			gameboard[i].type = "enemyHouse";
			gameboard[i].beads = 7;
			enemyPoints -= 7;
			gameboard[i].update();
		}
		else {
			gameboard[i].burn();
		}
	}
	gameboard[ENEMYSTOREINDEX].beads = enemyPoints;
	gameboard[ENEMYSTOREINDEX].update();

	if(isPlayerTurn){
		clickSituation = "Start";
		extraPlayHandler.textContent = "Start";
		divTurn.textContent = "Player 1's Turn";
		divTurn.style.backgroundColor = ACTIVEBLUE;
		clearAllowInput();
		allowPlayerInput();
	}
	else if (!isPlayerTurn && useComputer){
		clickSituation = "Trigger";
		extraPlayHandler.textContent = "Start";
		divMessage.textContent = "Computer's turn. Click a 'start' to start computer's turn.";
		divTurn.textContent = "Computer's Turn";
		divTurn.style.backgroundColor = ACTIVERED;
		clearAllowInput();
	}
	else {
		clickSituation = "Start";
		extraPlayHandler.textContent = "Start";
		divTurn.textContent = "Player 1's Turn";
		divTurn.style.backgroundColor = ACTIVERED;
		clearAllowInput();
		allowEnemyInput();
	}
	checkSum();
}
var reset = function(){
	clearInterval(setIntervalID);

	for(var i = 0; i <= 6; i++){
		gameboard[i].type = "playerHouse";
		gameboard[i].beads = 7;
		gameboard[i].update();
	}
	gameboard[7].beads = 0;
	gameboard[7].update();

	for(var i = 8; i <= 14; i++){
		gameboard[i].type = "enemyHouse";
		gameboard[i].beads = 7;
		gameboard[i].update();
	}
	gameboard[15].beads = 0;
	gameboard[15].update();

	hand.beads = 0;
	hand.update();

	isPlayerTurn = true;
	divTurn.textContent = "Player 1's Turn";
	divTurn.style.backgroundColor = ACTIVEBLUE;
	divMessage.textContent = "Player 1, click a blue circle to make a move.";
	allowPlayerInput();
}
allowPlayerInput();








