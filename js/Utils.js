/* Utils */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playSound(path) {
  /*for (var i = 0; i < audio_paths.length; i++) {
    if (path == audio_paths[i]) {
      audios[i].play();
    }
  }*/

  var audioElement = document.createElement("audio");
  audioElement.setAttribute("src", path + ".ogg");
  audioElement.play();
}

function uniqueID() {
  return ((new Date()).getTime()).toString(16) + getRandomInt(0, 8000000).toString(16);
}
