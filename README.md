# Project1-Sungka_game

Technologies Used:
	HTML5 (requirement for localStorage)
	Javascript (requirement for DOM manipulation)
	CSS
	Font Awesome CSS library (requirement for those cool fonts)

Technologies not used
	JQuery (used DOM manipulation instead)
	JQueryUI
	Bootstrap

Approach Taken
	I wanted to do a game that would be unique (at least in our class), and that would speak about me. I loved playing Sungka as a kid and still have a sungkaan (gameboard) somewhere...

	When I first decided on the game, I discussed it with the instructors Erin, Sean, and Steve. They did not know the game and suggested I write down the rules. The rules were very mathematical and became the basis of my javascript. Objects really helped, since the rules were basically based on the houses' beads, position, and ownership. I was also easily able to create a simple UI using a random number generator since choices are limited to 7 or less possibilities.

	After the scripting was finished, I created a simple gameboard which I stylized with css into the shape of the board. I used element IDs that I knew I could cycle through with for loops (e.g. div_0 through div_15). This allowed me to do DOM manipulation in a cyclical way.

	The next problem was showing the user the steps of the game. At the time, it went too quickly and didn't show how points were being earned. I broke down my code to allow more input from players with more situational click handling. I also extra setTimeout delays, and animation.

	Features that were added after the main game was working include (and in order, I think):
		Turn indicator
		Switch between 1 and 2 players (already scripted but not available without console at first)
		Extra game featuring burned houses.
		Reset
		Link to the Wikipedia page (it's such a culturally specific game, I had to educate people about it)
		Statistics (using objects)
		Tutorial with pictures
		localStorage

Installation instructions
	As a website based game, it should not require anything more than a web browser that supports HTML5. Many of the colors used were browser specific, so they may not look the same across browsers. I was using Chrome.

Unsolved Problems
	The biggest unsolved problem was in how the beads were displayed. I would have preferred showing actual "coffee-bean" shells or at least beads. Animations would have nice, too.

	Another issue is vertical small browser window support; it won't show up correctly on a phone browser that's showing it vertically. Other than creating a whole new webpage for it, I don't see any elegant solution to this.

	In a real game of Sungka, the first move of the first game is played with both players starting at the same time. I don't know how to approach this at all.

	As stated above, colors were not specific. I used css terms like "pink", "lightblue", "darkgreen", and "brown" which will not show the same in other browsers. I thought this was low priority, but it is solvable.

	There isn't any "dead code" in my javascript, but I was finding it hard to stay DRY. Including section comments and debug console logs, the whole javascript was almost 900 lines long.

	Doesn't really count as a problem, but I also wanted to make the AI slightly smarter. It can be coded to check for moves that could give it chain turns, play defensively by breaking up its largest stash of beads, or even search for big bonus steals.