/* Main game state */

function PlayState() {
  this.setup = function() {
    this.blocks = [];
    this.blockss = new penta.SpriteList();
    this.clouds = new penta.SpriteList();
    this.towerHeight = 0;

    this.accumulator = 0;
    this.timestep = 0.01666666666;

    this.space = new cp.Space();
    this.space.iterations = 20;
    this.space.gravity = new cp.Vect(0, 150);
    this.space.game = this;

    /* Sound */
    var cha = new Audio();
    var canPlayOgg = !!cha.canPlayType && cha.canPlayType('audio/ogg; codecs='vorbis'') != '';
    var lpath = 'assets/sfx/test_loop.ogg';

    if (!canPlayOgg) {
      lpat = 'assets/sfx/test_loop.mp3';
    }

    this.bgloop = new Audio(lpath);

    this.bgloop.loop = true;
    //this.bgloop.play();

    this.space.setDefaultCollisionHandler(null, function(arb, space) {
      if (arb) {
        if ((arb.a.name == 'block' && arb.b.name == 'block') ||
            (arb.a.name == 'base' && arb.b.name == 'block') ||
            (arb.a.name == 'block' && arb.b.name == 'base')) {
          var my = Math.min(arb.a.body.p.y, arb.b.body.p.y);
          space.game.towerHeight = Math.max(space.game.towerHeight, (penta.context.height - 30) - my);

          var soundBlock = arb.a.block;

          if (arb.a.name == 'base') {
            soundBlock = arb.b.block;
          }

          if (soundBlock.playedSfx) {
            soundBlock = arb.b.block;
          }

          if (!soundBlock.playedSfx) {
            if (soundBlock.type == 0) {
              playSound('assets/sfx/metal_on_metal');
            } else if (soundBlock.type == 1) {
              playSound('assets/sfx/brick_on_brick');
            } else if (soundBlock.type == 2) {
              playSound('assets/sfx/wood_on_wood');
            } else {
              playSound('assets/sfx/wood_on_wood');
            }

            soundBlock.playedSfx = true;
          }
        }

        if (arb.a == space.game.ground || arb.b == space.game.ground) {
          if (arb.b.name == 'block' || arb.a.name == 'block') {
            penta.switchState(new ScoreState());
            return true;
          }
        }

        return true;
      }

      return false;
    }, null, null);

    this.ground = new cp.SegmentShape(this.space.staticBody,
                                      new cp.Vect(-2000, penta.context.height),
                                      new cp.Vect(2000, penta.context.height), 0);
    this.ground.name = 'ground';
    this.space.addShape(this.ground);
    this.base = new Block(penta.context.width / 2 - 180 / 2, penta.context.height - 40, 180, 30, 0);
    this.addBlock(this.base);
    this.base.shape.name = 'base';
    this.base.playedSfx = true;
    this.ground.setElasticity(0);
    this.ground.setFriction(1);

    this.background = new penta.Sprite('assets/img/bg.png', -2, 0);
    this.background.y = -1590 + 480 + 10;

    this.hintBlock = { x: 0, y: 0, alpha: 0.5, width: 0, height: 0,

                       draw: function () {
                         penta.context.save();
                         penta.context.globalAlpha = 0.5;
                         
                         penta.drawRectangle(this.x, this.y,
                                             this.width, this.height,
                                             'gray');

                         penta.context.restore();
    } };

    this.canPlaceBlock = true;
    this.receivedMouseDown = false;
    this.nextBlock = { width: getRandomInt(30, 30 * 4), height: getRandomInt(30, 31) };
    this.nextBlock.width = Math.round(this.nextBlock.width / 30) * 30;
    this.nextBlock.height = Math.round(this.nextBlock.height / 30) * 30;

    this.blockMap = {};

    var possibleColors = ['red', 'blue', 'green', 'pink', 'gray', 'blue'];
    this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];

    // preventKeys('down', 'right', 'left', 'right', 'space', 'r');
  };

  this.addBlock = function(block) {
    block.body = this.space.addBody(new cp.Body(1, cp.momentForBox(1, block.width,
                                                                   block.height)));
    block.body.setPos(new cp.Vect(block.sprite.x + block.width / 2,
                                  block.sprite.y + block.height / 2));

    block.shape = this.space.addShape(new cp.BoxShape(block.body, block.width, block.height));
    block.shape.setElasticity(0);
    block.shape.setFriction(1);
    block.shape.name = 'block';
    block.shape.block = block;

    this.blocks.push(block);
    this.blockss.push(block.sprite);
  };

  this.update = function() {
    var numberOfBlocksAboveCameraLine = 0;

    for (var i = this.blockss.sprites.length - 1; i >= 0; i--) {
      if (this.blockss.sprites[i].y - this.camera.y < penta.context.height / 2) {
        numberOfBlocksAboveCameraLine++;

        if (numberOfBlocksAboveCameraLine > 2) {
          this.camera.y -= penta.context.height * this.dt;
          break;
        }
      }
    }

    /* timestep slicing */
    this.accumulator += this.dt;
    while (this.accumulator >= this.timestep) {
      this.space.step(this.timestep);
      this.accumulator -= this.timestep;
    }

    /* update each block position and angle */
    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      block.sprite.x = block.body.p.x - block.width / 2;
      block.sprite.y = block.body.p.y - block.height / 2;
      block.sprite.angle = block.body.a * radToDeg;
    }
    
    /* Handle hint block */
    if (this.hintBlock.nextBlock != this.nextBlock) {
      // this.hintBlock.makeGraphic(this.nextBlock.width, this.nextBlock.height, 'gray');
      this.hintBlock.width = this.nextBlock.width;
      this.hintBlock.height = this.nextBlock.height;
      this.hintBlock.nextBlock = this.nextBlock;
    }

    this.hintBlock.x = penta.mouse.x - this.nextBlock.width / 2;
    this.hintBlock.y = penta.mouse.y - this.nextBlock.height / 2;

    /* Add new blocks */
    if (penta.isMouseDown('left') && this.canPlaceBlock) {
      var hw = this.nextBlock.width / 2;
      var hh = this.nextBlock.height / 2;
      var shape = cp.BoxShape2(this.space.staticBody,
                               new cp.BB(-hw + penta.mouse.x, -hh + penta.mouse.y,
                                         hw + penta.mouse.x, hh + penta.mouse.y));
      shape.sensor = true;
      var colliding = false;

      this.space.shapeQuery(shape, function(a, set) {
        colliding = true;
      });

      colliding = colliding || (penta.mouse.y + this.nextBlock.height / 2 > canvas.height);

      if (!colliding) {
        this.receivedMouseDown = true;
      } else {
        //this.receivedMouseDown = false;
      }
    } else {
      if (this.receivedMouseDown) {
        if (this.hintBlock.lastShape) {
          this.space.staticBody.removeShape(this.hintBlock.lastShape);
        }

        var hw = this.nextBlock.width / 2;
        var hh = this.nextBlock.height / 2;
        var shape = cp.BoxShape2(this.space.staticBody,
                                 new cp.BB(-hw + penta.mouse.x, -hh + penta.mouse.y,
                                           hw + penta.mouse.x, hh + penta.mouse.y));
        shape.sensor = true;
        var colliding = false;
        this.space.shapeQuery(shape, function(a, set) {
          colliding = true;
        });

        this.hintBlock.lastShape = shape;

        var blockPos = { x: penta.mouse.x - this.nextBlock.width / 2,
                         y: penta.mouse.y - this.nextBlock.height / 2 };

        colliding = colliding || (penta.mouse.y + this.nextBlock.height / 2 > canvas.height - 30);

        if (!colliding) {
          var newBlock = new Block(blockPos.x, blockPos.y,
                                   this.nextBlock.width, this.nextBlock.height);

          this.canPlaceBlock = false;
          var playState = this;
          setTimeout(function() {
            playState.canPlaceBlock = true;
          }, 1000);

          newBlock.id = uniqueID();
          this.addBlock(newBlock);
          this.blockMap[newBlock.id] = newBlock;

          this.nextBlock = {width: getRandomInt(30, 30 * 4), height: getRandomInt(30, 31)};

          if (!getRandomInt(0, 3)) {
            var tmp = this.nextBlock.width;
            this.nextBlock.width = this.nextBlock.height;
            this.nextBlock.height = tmp;
          }

          this.nextBlock.width = Math.round(this.nextBlock.width / 30) * 30;
          this.nextBlock.height = Math.round(this.nextBlock.height / 30) * 30;
          this.receivedMouseDown = false;
        }
      }
    }

    /* Clouds! */
    for (var i = 0; i < this.clouds.sprites.length; i++) {
      var cloud = this.clouds.sprites[i];
      cloud.x += cloud.speed * this.dt;

      if (cloud.x < - 70 || cloud.x > (penta.context.width + 70)) {
        this.clouds.remove(cloud);
      }
    }

    if (!getRandomInt(0, 60 * 10)) {
      var x = (getRandomInt(0, 1) * (penta.context.width + 70)) - 70;
      var cloud = new penta.Sprite('assets/img/cloud1.png', x, getRandomInt(0, penta.context.height - 400));
      cloud.speed = getRandomInt(20, 60);

      if (x > 0) {
        cloud.speed *= -1;
      }

      this.clouds.push(cloud);
    }

    currentScore = this.blocks.length - 1;
  };

  this.draw = function() {
    penta.clearCanvas();

    // this.background.draw();
    this.clouds.draw();
    this.blockss.draw();

    if (this.hintBlock && penta.isMouseDown('left') && this.canPlaceBlock) {
      this.hintBlock.draw();
    }

    penta.currentFont = '15px Arial';
    penta.drawString(currentScore.toString(), 5, 15, '#FFF', 'left');
    penta.drawString(highScore.toString(), penta.context.width - 5, 15, '#FFF', 'right');
  };
}
