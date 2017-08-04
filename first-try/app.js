'use strict';

// CONSTS

var SCREEN_WIDTH = 1280;
var SCREEN_HEIGHT = 720;
var SCALE_FACTOR = 1;
var TILE_SIZE = 32;
var NUM_SCREEN_TILES_X = 24;
var NUM_SCREEN_TILES_Y = 24;
var NUM_TILES_X = 7;
var NUM_TILES_Y = 5;
var DEFAULT_SPEED = 32;

// CONST FRAME`s
var FRAME_STEP = 5;
var FRAME_PLAYER = 2;

var game;

window.onload = function () {
  game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'gameDiv');
  game.state.add('boot', bs);
  game.state.add('game', gs);
  //	game.state.add('menu', menuState);
  game.state.start('boot');
};
"use strict";

function PlayerCharacter() {
  this.type = {
    name: "Player",
    niceName: "Player",
    frame: FRAME_PLAYER,
    movementSpeed: DEFAULT_SPEED * SCALE_FACTOR
  };
  //
  this.tileIndex = {
    x: 0,
    y: 0
    // GAMESTATS
  };this.numDeaths = 0;
  this.level = 1;
  this.gameLevel = 1;
  this.canMove = true;
  this.isInField = false;
  this.tempX, this.tempY;
  // Push player character to characterList:
  //
  //this.createPlayer();
  //this.onKeyPress();
  gs.pc = this;
}

PlayerCharacter.prototype.createPlayer = function () {
  this.sprite = gs.createTileSprite(this.tileIndex.x * TILE_SIZE * SCALE_FACTOR + SCALE_FACTOR * 16, this.tileIndex.y * TILE_SIZE * SCALE_FACTOR + SCALE_FACTOR * 16, 'Tileset', this.type.frame);
  this.sprite.anchor.setTo(0.5);
  this.sprite.visible = true;
  this.sprite.z = 4;

  this.sprite.scale.set(SCALE_FACTOR, SCALE_FACTOR);
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.collideWorldBounds = true;
  game.camera.follow(this.sprite);
};

PlayerCharacter.prototype.onKeyPress = function () {
  gs.keys.left.onDown.add(function () {
    this.sprite.angle -= 90;
    if (this.isInField && this.tempX !== this.sprite.x && this.tempY !== this.sprite.y) {
      this.createPoint();
    }
  }, this);
  gs.keys.right.onDown.add(function () {
    this.sprite.angle += 90;
    if (this.isInField && this.tempX !== this.sprite.x && this.tempY !== this.sprite.y) {
      this.createPoint();
    }
  }, this);
};
PlayerCharacter.prototype.move = function () {
  if (gs.pc.sprite.angle == 0) {
    gs.pc.sprite.y -= gs.pc.type.movementSpeed;
  } else if (gs.pc.sprite.angle == 90) {
    gs.pc.sprite.x += gs.pc.type.movementSpeed;
  } else if (gs.pc.sprite.angle == -180) {
    gs.pc.sprite.y += gs.pc.type.movementSpeed;
  } else if (gs.pc.sprite.angle == -90) {
    gs.pc.sprite.x -= gs.pc.type.movementSpeed;
  }
};

// MAKE STEP
// *******************************************************************************************************
PlayerCharacter.prototype.makeStep = function () {
  if (!this.isInField) {
    console.log(this.sprite.angle);
    this.createPoint();
  }
  this.isInField = true;
  if (gs.stepsGroup) {
    var step = gs.createTileSprite(this.sprite.x, this.sprite.y, 'Tileset', FRAME_STEP);
    step.anchor.setTo(0.5);
    step.visible = true;
    step.scale.set(SCALE_FACTOR, SCALE_FACTOR);
    gs.stepsGroup.add(step);
  } else {
    gs.stepsGroup = game.add.group();
    var _step = gs.createTileSprite(this.sprite.x, this.sprite.y, 'Tileset', FRAME_STEP);
    _step.anchor.setTo(0.5);
    _step.visible = true;
    _step.scale.set(SCALE_FACTOR, SCALE_FACTOR);
    gs.stepsGroup.add(_step);
  }
};
PlayerCharacter.prototype.createPoint = function () {
  if (this.sprite) {
    if (gs.pc.sprite.angle == 0) {
      gs.polygonForPaint.points.push(this.sprite.x + 16);
      gs.polygonForPaint.points.push(this.sprite.y + 16);
    } else if (gs.pc.sprite.angle == 90) {
      gs.polygonForPaint.points.push(this.sprite.x - 16);
      gs.polygonForPaint.points.push(this.sprite.y - 16);
    } else if (gs.pc.sprite.angle == -180) {
      gs.polygonForPaint.points.push(this.sprite.x - 16);
      gs.polygonForPaint.points.push(this.sprite.y + 16);
    } else if (gs.pc.sprite.angle == -90) {
      gs.polygonForPaint.points.push(this.sprite.x + 16);
      gs.polygonForPaint.points.push(this.sprite.y + 16);
    }
  }
};
'use strict';

// BOOT STATE
//******************************************************************************

var bs = {
  preload: function preload() {
    // SPRITE
    game.load.spritesheet('Tileset', 'assets/images/tileset2.png', TILE_SIZE, TILE_SIZE);
    game.load.tilemap('level3', 'assets/images/TileMap2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset2', 'assets/images/tileset2.png', TILE_SIZE, TILE_SIZE);
    game.load.json('level3JSON', 'assets/images/TileMap2.json');
    // JSON:

    game.time.advancedTiming = true;
  },

  create: function create() {
    //game.stage.backgroundColor = '#182d3b';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //	You can listen for each of these events from Phaser.Loader
    game.load.onLoadStart.add(loadStart, this);
    game.load.onFileComplete.add(fileComplete, this);
    game.load.onLoadComplete.add(loadComplete, this);
    //	Progress report
    text = game.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, '', { fill: '#ffffff' });

    game.load.start();
  },
  render: function render() {}

};
var text;
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
  game.state.start('game');
}
'use strict';

// GAME_STATE
//******************************************************************************
var a = 0;
var gs = {
  polygonForPaint: {
    points: []
  },

  preload: function preload() {
    //CREATE_GROUPS
    //CREATE_GROUPS
    //CREATE_GROUPS
    this.tileMapSpritesGroup = game.add.group();
    this.tileMapStartGroup = game.add.group();
    //this.stepsGroup = game.add.group();
    var b = game.cache.getJSON("level3JSON");

    gs.createKeys();
    //this.createMapFromArray(levelDesign);
  },
  create: function create() {
    //this.generateMap("level3", 'tileset2', "level3JSON");
    this.pc = new PlayerCharacter();

    this.map = game.add.tilemap('level3');
    this.map.addTilesetImage('tileset2');
    this.map.setCollision([1, 5]);

    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();
    this.map.setTileIndexCallback(5, this.pc.makeStep, this.pc, this.layer);
    this.map.setTileIndexCallback(1, this.prepareToPolygon, this);

    this.pc.createPlayer();
    this.pc.onKeyPress();

    //this.loadTileMap("level3JSON");
  },
  update: function update() {
    a++;
    if (a == 80) {
      a = 0;
      game.physics.arcade.collide(this.pc.sprite, this.layer);
      gs.pc.move();
    }

    gs.pc.tileIndex.x = gs.pc.sprite.x;
    gs.pc.tileIndex.y = gs.pc.sprite.y;
  },
  render: function render() {
    if (this.polygon) {
      game.debug.geom(this.polygon);
      game.debug.rectangle(this.polygon);
    }
    //game.debug.pixel(this.pc.sprite.x, this.pc.sprite.y, 'rgb(255,255,255)', 6);
    //game.debug.pixel(this.pc.sprite.x + 16, this.pc.sprite.y, 'rgb(0,255,255)', 6);
    //game.debug.pixel(this.pc.sprite.x, this.pc.sprite.y + 16, 'rgb(255,255,0)', 6);

    //for (var i = 0; i < this.polygonForPaint.points.length; i += 2) {
      //game.debug.pixel(this.polygonForPaint.points[i] - 3, this.polygonForPaint.points[i + 1] - 3, 'rgb(0,255,0)', 6);
    //}
  }
  //console.log(a);

  // CREATE_KEYS
  //****************************************************************************************************
};gs.createKeys = function () {

  this.keys = {
    left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
  };
};

//  Создание полигона
//*******************************************************************************

//  Подготовка к созданию полигона
//*******************************************************************************
gs.prepareToPolygon = function () {
  if (this.pc.isInField) {
    console.log(this.pc.sprite.angle);
    this.pc.createPoint();
  }
  this.pc.isInField = false;
  this.graphics = game.add.graphics(0, 0);

  this.graphics.beginFill(0xebdb00);
  this.graphics.drawPolygon(gs.polygonForPaint.points);
  this.graphics.endFill();
};
'use strict';

// MAP_GENERATION:
// ************************************************************************************************
gs.generateMap = function (level, sprite, JSONfile) {

  //  Start with a small layer only 400x200 and increase it by 100px
  //  each time we click
  console.log(gs.pc);

  //  this.layer.scale.set(SCALE_FACTOR);

  //this.layer.resizeWorld();
};
// LOAD_TILE_MAP
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
      tileTypeMap[x][y] = new Phaser.Tile();
    }
  }

  // Load map from JSON:
  for (y = 0; y < numTilesY; y += 1) {
    for (x = 0; x < numTilesX; x += 1) {
      frame = data.layers[0].data[y * numTilesX + x] - 1;
      tileTypeMap[x][y].frame = frame;
      if (frame == 0) {
        tileTypeMap[x][y].isStartTile = true;
        tileTypeMap[x][y].tileSprite = gs.createTileSprite(x * TILE_SIZE, y * TILE_SIZE, 'Tileset', tileTypeMap[x][y].frame, this.tileMapStartGroup);
      }
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

var levelDesign = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
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

// UNIQUE
//*******************************************************************************
gs.unique = function (arr) {

  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true; // запомнить строку в виде свойства объекта
  }
  return Object.keys(obj); // или собрать ключи перебором для IE8-
};