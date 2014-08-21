/* Set up localStorage for the high score */
var highScore = 0;
var currentScore = 0;

localStorage.clear();

if (!localStorage["highScore"]) {
  localStorage["highScore"] = "0";
  highScore = 0;
} else {
  highScore = parseInt(localStorage["highScore"]);
}

/* Populate array audios */
var audios = [];
var audio_paths = ["assets/sfx/metal_on_metal",
                   "assets/sfx/brick_on_brick",
                   "assets/sfx/wood_on_wood"];

/* Disable finger swipe scrolling on mobile devices */
document.ontouchmove = function(e) {
  e.preventDefault();
};

/* Start Pentagine with the title screen state */
penta.setup({ width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight,
              desiredFPS: 60,
              firstState: new MenuState() });
