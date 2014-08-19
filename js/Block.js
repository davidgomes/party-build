var blockTypes = ["assets/img/block_lattice.png",
                  "assets/img/block_brick.png",
                  "assets/img/block_wood.png"];

/* Basic construction piece */
Block = (function () {
  function constructor(x, y, width, height, type) {
    this.sprite = new penta.Sprite(null, x, y);

    if (type == null) {
      type = getRandomInt(0, blockTypes.length - 1);
    }

    this.type = type;
    this.width = width;
    this.height = height;

    //this.sprite.makeGraphic(width + 2, height + 2, color);
    //this.sprite.internalctx.clearRect(1, 1, width - 2, height - 2);

    if (this.type >= 0) {
      if (width > height) {
        for (var x = 1; x <= width; x += 30) {
          this.sprite.stampImage(x, 1, blockTypes[this.type]);
        }
      } else {
        for (var y = 1; y <= height; y += 30) {
          this.sprite.stampImage(1, y, blockTypes[this.type]);
        }
      }
    }

    this.sprite.offset.x += width / 2;
    this.sprite.offset.y += height / 2;
  }

  constructor.prototype = {
    update: function() {

    }
  };

  return constructor;
})();
