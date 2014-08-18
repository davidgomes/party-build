/* Set up localStorage */
var highScore = 0;
var currentScore = 0;

localStorage.clear();

if (!localStorage["highScore"]) {
  localStorage["highScore"] = "0";
  highScore = 0;
} else {
  highScore = parseInt(localStorage["highScore"]);
  //console.log("High score:" + localStorage["highScore"]);
}

/* Populate array audios */
var audios = [];
var audio_paths = ["assets/sfx/metal_on_metal",
                   "assets/sfx/brick_on_brick",
                   "assets/sfx/wood_on_wood"];

for (var i = 0; i < audio_paths.length; i++) {
  /*var audio = new Audio();
  var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"') != "";
  var path = audio_paths[i];

  if (canPlayOgg) {
    path = path + ".ogg";
  } else {
    path = path + ".mp3";
  }

  audio = new Audio(path);
  audio.load();
  audios.push(audio);*/
}

/* Disable finger swipe scrolling on mobile devices */
document.ontouchmove = function(e) {
  e.preventDefault();
};

/* Start the title screen */
penta.setup({ width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight,
              desiredFPS: 60,
              firstState: new MenuState() });
