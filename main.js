var logicalWidth = 160;
var logicalHeight = 288;

var leftVel = 0.25;
var rightVel = -0.25;

var renderer = null;
var stage = null;
var mainContainer = null;

var resources = null;

var entities = [];

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

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
    console.error("start");
    for (var u = level.layers.length - 1; u >= 0; u--) {
        var offset = 0;
        var side;
        if (u == 0) {
            offset = 9;
            side = 'right';
        } else if (u == 1) {
            offset = -9;
            side = 'left';
        }

        for (var i = 0; i < level.layers[u].data.length; i++) {
            var tile = level.layers[u].data[i];
            if (tile > 0) {
                var t = new Tile(i % 10 + offset, Math.floor(i / 10), side);
                t.setTile(tile - 1);
                if (u != 3) {
                    entities.push(t);
                }
            }
        }
    }
}

function start() {
    leftVel = 0.25;
    rightVel = -0.25;

    mainContainer.removeChildren();
    entities.length = 0;
    entities.push(new Player());

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
  
  PIXI.loader.add('bunny', 'test.png')
             .add('pact', 'pact.png')
             .add('tiles', 'tiles.png').load(function (loader, res) {
      resources = res;

      start();

      // kick off the animation loop (defined below)
      animate();
  });
};

init();