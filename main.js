var logicalWidth = 320;
var logicalHeight = 240;

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

    for (var i = 0; i < entities.length; i++) {
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

function init() {
  renderer = PIXI.autoDetectRenderer(logicalWidth, logicalHeight, {
    roundPixels: true,
    resolution: window.devicePixelRatio || 1
  });
  renderer.view.id = 'pixi-canvas';
  
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  
  stage = new PIXI.Container();
  mainContainer = new PIXI.Container();
  stage.addChild(mainContainer);
  
  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
  
  renderer.backgroundColor = 0xFFFFFF;
  
  PIXI.loader.add('bunny', 'test.png').load(function (loader, res) {
      resources = res;
      entities.push(new Player());

      for (x=0;x<20;x++) {
        for (y=0;y<15;y++) {
          if (y >= 14 || x == 0 || x == 19) {
            entities.push(new Tile(x, y));
          }
        }
      }

      // kick off the animation loop (defined below)
      animate();
  });
};

init();