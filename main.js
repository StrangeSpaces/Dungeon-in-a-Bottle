var logicalWidth = 640;
var logicalHeight = 480;

var renderer = null;
var stage = null;
var mainContainer = null;

var resources = null;

var entities = [];

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    for (var i = entities.length - 1; i >= 0; i--) {
        entities[i].update();
    }

    renderer.render(stage);
};

function resizeHandler() {
  var scaleFactor = Math.min(
    window.innerWidth / logicalWidth,
    window.innerHeight / logicalHeight
  );
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

      // kick off the animation loop (defined below)
      animate();
  });
};

init();