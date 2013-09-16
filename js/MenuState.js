/* Keep socket external for reconnection */
var socket;
var mode;

/* Title screen menu state, sets up the network link */
function MenuState() {
  this.setup = function() {
    preventKeys("down", "right", "left", "right", "space");
    this.background = new Sprite("assets/img/bg.png", -8, 0);
    this.background.y = -1590 + 480 + 10;
    this.title = new Sprite("assets/img/title.png", context.width / 2 - 308 / 2, 100);
    this.receivedMouseDown = false;
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

    currentFont = "Bold 20px Arial";
    drawString("Touch anywhere to play", context.width / 2, 360, "#FFF", "center");

    this.title.draw();
    this.background.draw();
  };
}
