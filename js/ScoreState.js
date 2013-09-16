function ScoreState() {
  this.setup = function() {
    this.background = new Sprite("assets/img/bg.png", -2, 0);
    this.background.y = -1590 + 480 + 10;
    this.receivedMouseDown = false;

    /* Handle high score */
    if (currentScore > highScore) {
      highScore = currentScore;
      localStorage["highScore"] = highScore.toString();
    }
  };

  this.update = function() {
    if (isMouseDown("left")) {
      this.receivedMouseDown = true;
    } else {
      if (this.receivedMouseDown) {
        switchState(new PlayState());
      }
    }
  };

  this.draw = function() {
    clearCanvas();

    currentFont = "Bold 40px Arial";
    drawString("Score", context.width / 2, 150, "#FFF", "center");

    currentFont = "30px Arial";
    if (currentScore == highScore) {
      drawString(currentScore.toString(), context.width / 2, 190, "#F00", "center");
    } else {
      drawString(currentScore.toString(), context.width / 2, 190, "#FFF", "center");
    }

    currentFont = "Bold 40px Arial";
    drawString("High Score", context.width / 2, 280, "#FFF", "center");

    currentFont = "30px Arial";
    drawString(highScore.toString(), context.width / 2, 320, "#FFF", "center");

    this.background.draw();
  };
}
