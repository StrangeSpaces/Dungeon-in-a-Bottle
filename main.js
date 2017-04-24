var logicalWidth = 12 * 16;
var logicalHeight = 288;

var leftVel = -0.5;
var rightVel = 0.5;
var leftX = 16;
var rightX = 16;

var renderer = null;
var stage = null;
var mainContainer = null;

var resources = null;

var entities = [];

var currentLevel = 7;

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    if (leftX + rightX >= 12 * 16) {
        leftVel = Math.min(leftVel, 0);
        rightVel = Math.max(rightVel, 0);
    } else {
        if (leftVel < 0.25) {
            leftVel += 0.01;
        }
        if (leftVel >= 0.25) {
            leftVel = 0.25;
        }

        if (rightVel > -0.25) {
            rightVel -= 0.01;
        }
        if (rightVel <= -0.25) {
            rightVel = -0.25;
        }
    }

    leftX += leftVel;
    rightX -= rightVel;

    if (leftX < 16) leftX = 16;
    if (rightX < 16) rightX = 16;

    for (var i = entities.length - 1; i >= 0; i--) {
        entities[i].update();
    }

    renderer.render(stage);
};

function resizeHandler() {
  var scaleFactor = Math.min(
    Math.floor(window.innerWidth / logicalWidth),
    Math.floor(window.innerHeight / logicalHeight)
  ) || 1;
  var newWidth = Math.ceil(logicalWidth * scaleFactor);
  var newHeight = Math.ceil(logicalHeight * scaleFactor);
  
  renderer.view.style.width = `${newWidth}px`;
  renderer.view.style.height = `${newHeight}px`;

  renderer.resize(newWidth, newHeight);
  mainContainer.scale.set(scaleFactor); 
};

function loadLevel() {
    var level = levels[currentLevel];
    var startX = 50;
    var startY = 200;
    var door = [];

    for (var u = level.layers.length - 1; u >= 0; u--) {
        var offset = -3;
        var side;
        if (u == 0) {
            offset = 2;
            side = 'right';
        } else if (u == 1) {
            offset = -8;
            side = 'left';
        }

        for (var i = 0; i < level.layers[u].data.length; i++) {
            var tile = level.layers[u].data[i] - 1;
            if (tile >= 0) {
                var t;
                if ([42, 43, 44, 45].indexOf(tile) != -1) {
                    t = new Spike(i % 18 + offset, Math.floor(i / 18), side);
                } else if ([78,79,92,93].indexOf(tile) != -1) {
                    t = new Torch(i % 18 + offset, Math.floor(i / 18), side);
                    door.push(t);
                } else {
                    t = new Tile(i % 18 + offset, Math.floor(i / 18), side);
                }
                t.setTile(tile);

                if (u != 3) {
                    entities.push(t);
                } else if ([7,8,21,22,35,36].indexOf(tile) != -1) {
                    t.type = 'door';
                    t.size.x = -6;
                    door.push(t);
                } else if ([7,8,21,22,35,36].indexOf(tile - 4) != -1) {
                    t.type = 'enter';
                    t.setTile(tile + 60 + 14 * 3);
                    door.push(t);
                }
                if (tile == 11) {
                    startX = t.pos.x + 8;
                    startY = t.pos.y + 26;
                }
            }
        }

        if (u == 3) {
            var p = new Player();
            p.pos.x = startX || t.pos.x;
            p.pos.y = startY || t.pos.y;
            p.updateGraphics();
            entities.push(p);

            for (var d = door.length - 1; d >= 0; d--) {
                entities.push(door[d]);
            }
        }
    }
}

function start() {
    leftX = 16;
    rightX = 16;
    leftVel = -0.5;
    rightVel = 0.5;

    mainContainer.removeChildren();
    entities.length = 0;

    loadLevel();

    // for (x=0;x<20;x++) {
    //     for (y=0;y<15;y++) {
    //         if (y >= 14 && x != 0 && x != 19) {
    //             entities.push(new Tile(x, y));
    //         }
    //         if (x == 0) {
    //             entities.push(new Tile(x, y, 'left'));
    //         }
    //         if (x == 19) {
    //             entities.push(new Tile(x, y, 'right'));
    //         }
    //     }
    // }

    // entities.push(new Tile(18, 10, 'right'))
};

function init() {
  renderer = PIXI.autoDetectRenderer(logicalWidth, logicalHeight, {
    roundPixels: true,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: 0x350902,
  });
  renderer.view.id = 'pixi-canvas';
  
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  
  stage = new PIXI.Container();
  mainContainer = new PIXI.Container();
  stage.addChild(mainContainer);
  
  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
  
  PIXI.loader.add('pact', 'pact.png')
             .add('tiles', 'tiles.png')
             .add('coin', 'coin.png').load(function (loader, res) {
      resources = res;

      start();

      // kick off the animation loop (defined below)
      animate();
  });
};

init();