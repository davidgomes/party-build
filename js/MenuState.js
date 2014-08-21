/* Title screen menu state, sets up the network link */
function MenuState() {
  this.setup = function () {
    this.title = new penta.Sprite('assets/img/title.png', penta.context.width / 2 - 308 / 2, 100);
    this.receivedMouseDown = false;
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
    penta.clearCanvas();

    penta.currentFont = 'Bold 20px Arial';
    penta.drawString('Touch anywhere to play', penta.context.width / 2, 360, '#FFF', 'center');

    this.title.draw();
  };
}
