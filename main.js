var logicalWidth = 12 * 16;
var logicalHeight = 288;

var leftVel = -0.5;
var rightVel = 0.5;

var leftEnts = [];
var rightEnts = [];

var renderer = null;
var stage = null;
var mainContainer = null;

var resources = null;

var entities = [];

var currentLevel = 0;

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    var bump = false;

    for (var i = leftEnts.length - 1; i >= 0; i--) {
        var lx = leftEnts[i] ? leftEnts[i].pos.x : -10000;
        var rx = rightEnts[i] ? rightEnts[i].pos.x : 10000;

        if (lx - rx >= -16) {
            bump = true;
            break;
        }
    }

    if (bump) {
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

    // if (Math.abs(leftVel) > 0.15 || Math.abs(rightVel) > 0.15) {
    //     if (!wallid) {
    //         wallid = wall.play();
    //     }
    // } else {
    //     wall.pause();
    //     wallid = null;
    // }

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
  upperContainer.scale.set(scaleFactor);
};

function loadLevel() {
    currentContainer = mainContainer;

    if (currentLevel != 17) {
        var level = levels[currentLevel];
        var startX = 6 * 16;
        var startY = -10;
        var door = [];

        leftEnts.length = 0;
        rightEnts.length = 0;

        var l = null;
        var r = null;

        for (var u = level.layers.length - 1; u >= 0; u--) {
            var offset = -3;
            var side;
            if (u == 0) {
                offset = 2;
                side = 'right';
                currentContainer = upperContainer;
            } else if (u == 1) {
                offset = -8;
                side = 'left';
                currentContainer = upperContainer;
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
                        t.size.x = -4;
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

                    if (side == 'left' && (!l || t.pos.x > l.pos.x)) {
                        l = t;
                    } else if (side == 'right' && (!r || t.pos.x < r.pos.x)) {
                        r = t;
                    } 
                }

                if ((i+1) % 18 == 0) {
                    if (side == 'left') {
                        leftEnts.push(l);
                    } else if (side == 'right') {
                        rightEnts.push(r);
                    }
                    l = null;
                    r = null;
                }
            }

            if (u == 3) {
                if (currentLevel == 1) {
                    startX = 32;
                    startY = 200;
                }
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

        if (currentLevel == 0) {
            entities.push(new Money(new Vec(100, 15.5 * 16)));
            entities.push(new Bottle(new Vec(50, 14.5 * 16)));
        }
    } else {
        entities.push(new Title());
    }
}

function start() {
    leftVel = -0.5;
    rightVel = 0.5;

    mainContainer.removeChildren();
    upperContainer.removeChildren();
    entities.length = 0;

    loadLevel();
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
  upperContainer = new PIXI.Container()
  stage.addChild(mainContainer);
  stage.addChild(upperContainer);
  
  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
  
  PIXI.loader.add('pact', 'pact.png')
             .add('tiles', 'tiles.png')
             .add('coin', 'coin.png')
             .add('money', 'TreasureSheet.png')
             .add('bottle', 'MagicBottleSheet.png')
             .add('title', 'title.png').load(function (loader, res) {
      resources = res;

      start();

      // kick off the animation loop (defined below)
      animate();
  });
};

init();