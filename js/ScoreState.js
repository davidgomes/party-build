function ScoreState() {
  this.setup = function () {
    this.receivedMouseDown = false;

    /* Handle high score */
    if (currentScore > highScore) {
      highScore = currentScore;
      localStorage['highScore'] = highScore.toString();
    }
  };

  this.update = function () {
    if (penta.isMouseDown('left')) {
      this.receivedMouseDown = true;
    } else {
      if (this.receivedMouseDown) {
        penta.switchState(new PlayState());
      }
    }
  };

  this.draw = function () {
    penta.clearCanvas('#81d9ec');

    penta.currentFont = 'Bold 40px Arial';
    penta.drawString('Score', penta.context.width / 2, 150, '#FFF', 'center');

    penta.currentFont = '30px Arial';
    if (currentScore == highScore) {
      penta.drawString(currentScore.toString(), penta.context.width / 2, 190, '#F00', 'center');
    } else {
      penta.drawString(currentScore.toString(), penta.context.width / 2, 190, '#FFF', 'center');
    }

    penta.currentFont = 'Bold 40px Arial';
    penta.drawString('High Score', penta.context.width / 2, 280, '#FFF', 'center');

    penta.currentFont = '30px Arial';
    penta.drawString(highScore.toString(), penta.context.width / 2, 320, '#FFF', 'center');
  };
}
