"use strict";

var levelDesign = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
'use strict';

// CONSTS

var SCREEN_WIDTH = 1280;
var SCREEN_HEIGHT = 840;
var SCALE_FACTOR = 1;
var TILE_SIZE = 32;
var NUM_SCREEN_TILES_X = 24;
var NUM_SCREEN_TILES_Y = 24;
var NUM_TILES_X = 7;
var NUM_TILES_Y = 5;
var DEFAULT_SPEED = 1;

var game;
window.onload = function () {
  game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'gameDiv', {
    preload: preload,
    create: create,
    render: render
  });
  game.state.add('game', gs);
  //	game.state.add('menu', menuState);
};
function preload() {
  // SPRITE
  game.load.spritesheet('Tileset', 'assets/images/Tileset2.png', TILE_SIZE, TILE_SIZE);

  // JSON:
  game.load.json('TileMap', 'assets/images/TileMap2.json');
  game.time.advancedTiming = true;
}

var text;

function create() {
  game.stage.backgroundColor = '#182d3b';

  //	You can listen for each of these events from Phaser.Loader
  game.load.onLoadStart.add(loadStart, this);
  game.load.onFileComplete.add(fileComplete, this);
  game.load.onLoadComplete.add(loadComplete, this);
  //	Progress report
  text = game.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, '', { fill: '#ffffff' });

  game.load.start();
}

function start() {}

function loadStart() {
  text.setText("Loading ...");
}

//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
  text.setText('Loading: ' + progress + "%");
  gs.centerText(text);
}

function loadComplete() {
  text.setText("Load Complete");

  // // White Tileset:
  // gs.whiteTileset = game.add.bitmapData(game.cache.getImage('Tileset').width, game.cache.getImage('Tileset').height);
  // gs.whiteTileset.draw(game.cache.getImage('Tileset'));
  // gs.whiteTileset.update();
  // gs.whiteTileset.processPixelRGB(function (pixel) {
  // 	if (pixel.a > 0 || pixel.g > 0 || pixel.b > 0 || pixel.r > 0) {
  // 		pixel.r = 255;
  // 		pixel.g = 255;
  // 		pixel.b = 255;
  // 		pixel.a = 255;
  // 		return pixel;
  // 	}
  //
  // 	return false;
  // }, this);
  //
  // game.cache.addSpriteSheet('WhiteTileset', null, gs.whiteTileset.canvas, 20, 20);

  game.state.start('game');
}
var a = 0;
// GAME_STATE
//******************************************************************************
var gs = {
  pc: null,
  map: null,
  preload: function preload() {
    //CREATE_GROUPS
    //CREATE_GROUPS
    //CREATE_GROUPS
    this.tileMapSpritesGroup = game.add.group();

    gs.createKeys();
    //this.createMapFromArray(levelDesign);
  },
  create: function create() {
    this.loadTileMap("TileMap");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.pc = new PlayerCharacter();
    this.pc.createPlayer();
    this.pc.onKeyPress();
    console.log("Создал игрока");
  },
  update: function update() {
    a++;
    if (a == 60) {
      a = 0;
      if (gs.pc.sprite.angle == 0) {
        gs.pc.sprite.x += 32;
      } else if (gs.pc.sprite.angle == 90) {
        gs.pc.sprite.y += 32;
      } else if (gs.pc.sprite.angle == -180) {
        gs.pc.sprite.x -= 32;
      } else if (gs.pc.sprite.angle == -90) {
        gs.pc.sprite.y -= 32;
      }
    }
    //console.log(a);
  }
  // MAP_GENERATION:
  // ************************************************************************************************
};gs.generateMap = function (levelDesign) {
  this.mapGroup = game.add.group();
};

// CREATE_CLEAR_MAP:
// ************************************************************************************************
gs.createClearMap = function () {
  var x,
      y,


  // Create empty map:
  tileMap = [];
  for (x = 0; x < this.numTilesX; x += 1) {
    tileMap[x] = [];
    for (y = 0; y < this.numTilesY; y += 1) {
      tileMap[x][y] = {
        explored: false,
        visible: true,
        character: null,
        frame: null,
        item: null,
        effect: null,
        object: null,
        isClosed: false,
        tileIndex: {
          x: x,
          y: y
        }
      };
    }
  }

  this.dropWallList = [];
  return tileMap;
};

gs.createMapFromArray = function (array) {
  var x, y;

  this.tileMapSprites = [];
  for (x = 0; x < NUM_SCREEN_TILES_X; x += 1) {
    this.tileMapSprites[x] = [];
    for (y = 0; y < NUM_SCREEN_TILES_Y; y += 1) {
      this.tileMapSprites[x][y] = gs.createTileSprite(x * TILE_SIZE, y * TILE_SIZE, 'Tileset', array[x][y], this.tileMapSpritesGroup);
      this.tileMapSprites[x][y].anchor.x = 0.5;
      this.tileMapSprites[x][y].anchor.y = 0.5;
      this.tileMapSprites[x][y].scale.setTo(SCALE_FACTOR, SCALE_FACTOR);
      this.tileMapSprites[x][y].visible = true;
      this.tileMapSprites[x][y].tileIndex = {
        x: x,
        y: y
      };
    }
  }
};

// LOAD_TILE_MAP:
// Load a tileMap from a static .JSON file
// This function will return a tileTypeMap of the internal file format
// This tileTypeMap is the same internal format as the game saves to and can then be passed to createTileMap to be created
// So the purpose of this function is simply to convert the static .JSON files produced by Tiled into our internal format
// It does not actually do any loading itself.
// ************************************************************************************************
gs.loadTileMap = function (fileName) {
  var tileTypeMap, data, x, y, i, object, frame, area, numTilesX, numTilesY;

  data = game.cache.getJSON(fileName);
  numTilesX = data.width;
  numTilesY = data.height;
  area = {
    type: fileName
  };

  // Create empty map:
  tileTypeMap = [];
  for (x = 0; x < numTilesX; x += 1) {
    tileTypeMap[x] = [];
    for (y = 0; y < numTilesY; y += 1) {
      tileTypeMap[x][y] = {
        frame: null
      };
    }
  }

  // Load map from JSON:
  for (y = 0; y < numTilesY; y += 1) {
    for (x = 0; x < numTilesX; x += 1) {
      frame = data.layers[0].data[y * numTilesX + x] - 1;
      tileTypeMap[x][y].frame = frame;
      tileTypeMap[x][y].tileSprite = gs.createTileSprite(x * TILE_SIZE, y * TILE_SIZE, 'Tileset', tileTypeMap[x][y].frame, this.tileMapSpritesGroup);
      tileTypeMap[x][y].tileSprite.scale.setTo(SCALE_FACTOR, SCALE_FACTOR);
      tileTypeMap[x][y].tileSprite.visible = true;
      tileTypeMap[x][y].tileIndex = {
        x: x,
        y: y
      };
    }
  }

  this.map = tileTypeMap;
};

// CREATE_KEYS
// *****************************************************************************

gs.createKeys = function () {

  this.keys = {
    left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
  };
};

function render() {
  game.debug.text(game.time.fps, 2, 14, "#00ff00");

  this.game.debug.cameraInfo(this.game.camera, 32, 32);
}
'use strict';

gs.forEachType = function (types, func) {
  var key;
  for (key in types) {
    if (types.hasOwnProperty(key)) {
      func(types[key]);
    }
  }
};

//  CREATE_TILE_SPRITE
//******************************************************************************
gs.createTileSprite = function (x, y, key, frame, group) {
  var tileSprite;

  tileSprite = game.add.tileSprite(x, y, TILE_SIZE, TILE_SIZE, key, frame);
  if (group) {
    group.add(tileSprite);
  }
  return tileSprite;
};

// CENTER_TEXT:
// ************************************************************************************************
gs.centerText = function (text) {
  text.anchor.x = Math.round(text.width * 0.5) / text.width;
  text.anchor.y = Math.round(text.height * 0.5) / text.height;

  if (text.anchor.x % 2 === 1) {
    text.anchor.x += 1;
  }
};

// CREATE_SPRITE:
// ************************************************************************************************
gs.createSprite = function (x, y, image, group) {
  var sprite;
  sprite = game.add.sprite(x, y, image);
  sprite.smoothed = false;

  if (group) {
    group.add(sprite);
  }

  if (!this.countSprites) {
    this.countSprites = 1;
  } else {
    this.countSprites += 1;
  }

  return sprite;
};

// CREATE TEXT:
// ************************************************************************************************
gs.createText = function (x, y, textStr, font, group) {
  var text, ref;

  text = game.add.text(x, y, textStr, font);
  text.smoothed = false;

  // Overwrite setText:
  ref = text.setText;

  text.setText = function (str) {
    if (this.text !== str) {
      ref.call(this, str);
    }
  };

  if (group) {
    group.add(text);
  }

  return text;
};

// CREATE_BUTTON:
// ************************************************************************************************
gs.createButton = function (x, y, image, callBack, context, group) {
  var button = game.add.button(x, y, image, callBack, context);
  button.smoothed = false;

  if (group) {
    group.add(button);
  }
  return button;
};

// CREATE_TEXT_BUTTON:
// ************************************************************************************************
gs.createTextButton = function (x, y, text, callBack, context, group) {
  var button = {};

  // Create button group:
  button.group = game.add.group();

  // Create button:
  button.button = game.add.button(x, y, 'Button', callBack, context, 1, 0, 0, 0);
  button.button.scale.setTo(SCALE_FACTOR, SCALE_FACTOR);
  button.button.smoothed = false;
  button.button.anchor.setTo(0.5, 0.5);
  button.group.add(button.button);

  // Create text:
  button.text = game.add.text(x - 1, y + 3, text, LARGE_WHITE_FONT);
  this.centerText(button.text);
  button.group.add(button.text);

  if (group) {
    group.add(button.group);
  }

  return button;
};

// CREATE_BAR:
// ************************************************************************************************
gs.createBar = function (x, y, frame, group) {
  var bar = {},
      sprite;

  bar.group = game.add.group();

  sprite = this.createSprite(x, y, 'Bar', bar.group);
  sprite.scale.setTo(SCALE_FACTOR, SCALE_FACTOR);

  bar.bar = this.createSprite(x + SCALE_FACTOR, y + SCALE_FACTOR, 'Tileset', bar.group);
  bar.bar.scale.setTo(SCALE_FACTOR, SCALE_FACTOR);
  bar.bar.frame = frame;

  bar.text = this.createText(x + 58, y + 12, '', LARGE_WHITE_FONT, bar.group);
  this.centerText(bar.text);

  if (group) {
    group.add(bar.group);
  }
  return bar;
};

// CREATE_ICON_BUTTON:
gs.createIconButton = function (x, y, frame, callBack, context, group) {
  var button;

  this.createSprite(x, y, 'Slot', group);
  button = this.createButton(x + 2, y + 2, 'InterfaceTileset', callBack, context, group);
  button.frame = frame;

  return button;
};

// IN_ARRAY:
// ************************************************************************************************
gs.inArray = function (element, array) {
  var i;
  for (i = 0; i < array.length; i += 1) {
    if (array[i] === element) {
      return true;
    }
  }

  return false;
};

// REMOVE_FROM_ARRAY:
// ************************************************************************************************
gs.removeFromArray = function (element, array) {
  var i;
  for (i = 0; i < array.length; i += 1) {
    if (array[i] === element) {
      array.splice(i, 1);
      return;
    }
  }
};

// RAND_ELEM:
// ************************************************************************************************
gs.randElem = function (list) {
  if (list.length === 0) {
    throw 'list.length === 0';
  }
  if (list.length === 1) {
    return list[0];
  } else {
    return list[game.rnd.integerInRange(0, list.length - 1)];
  }
};

// CHOOSE_RANDOM:
// ************************************************************************************************
gs.chooseRandom = function (table) {
  var sum = table.reduce(function (pV, nV) {
    return pV + nV.percent;
  }, 0),
      percentSum = 0,
      rand = game.rnd.integerInRange(0, sum - 1),
      i;

  for (i = 0; i < table.length; i += 1) {
    percentSum += table[i].percent;
    if (rand < percentSum) {
      return table[i].name;
    }
  }

  return table[table.length - 1].name;
};

// RAND_SUBSET:
// ************************************************************************************************
gs.randSubset = function (list, size) {
  var copyList = list.slice(0),
      subset = [],
      i;

  if (size > list.length) {
    throw 'size > list.length';
  }

  for (i = 0; i < size; i += 1) {
    subset.push(copyList.splice(Math.floor(game.rnd.integerInRange(0, copyList.length - 1)), 1)[0]);
  }
  return subset;
};

// RANDOM_COLOR:
// ************************************************************************************************
gs.randomColor = function () {
  return 'rgb(' + game.rnd.integerInRange(0, 255) + ',' + game.rnd.integerInRange(0, 255) + ',' + game.rnd.integerInRange(0, 255) + ')';
};
"use strict";

function PlayerCharacter() {
  this.type = {
    name: "Player",
    niceName: "Player",
    frame: 2,
    movementSpeed: DEFAULT_SPEED * TILE_SIZE,
    tileIndex: {
      x: 8,
      y: 5
    }
  };
  //

  // GAMESTATS
  this.numDeaths = 0;
  this.level = 1;
  this.gameLevel = 1;

  // Push player character to characterList:
  gs.pc = this;
}

PlayerCharacter.prototype.createPlayer = function () {
  this.sprite = gs.createTileSprite(this.type.tileIndex.x * TILE_SIZE + 16, this.type.tileIndex.y * TILE_SIZE + 16, 'Tileset', this.type.frame);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 0.5;
  this.sprite.visible = true;
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
};

PlayerCharacter.prototype.onKeyPress = function (keyCode) {
  gs.keys.left.onDown.add(function () {
    this.sprite.angle -= 90;
    //console.log(this.sprite.angle)
  }, this);
  gs.keys.right.onDown.add(function () {
    this.sprite.angle += 90;
    //console.log(this.sprite.angle)
  }, this);
};