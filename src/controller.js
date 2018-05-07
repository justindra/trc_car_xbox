const gamepad = require("gamepad");

const DEFAULT_AXIS_CONFIG = {
  xMove: 0,
  yMove: 1,
  lTrigger: 5,
  rTrigger: 4
};

function defaultCallback(evtName, value) {
  console.log(`${evtName}: ${value}`);
}

export class Controller {
  constructor(callback = defaultCallback, axisConfig = DEFAULT_AXIS_CONFIG) {
    this._cb = callback;
    this._config = axisConfig;
    this._gamepad = gamepad;
  }

  init() {
    this._gamepad.init();
    this._gamepad.on('move', this._moveHandler.bind(this));
    // Create a game loop and poll for events
    setInterval(this._gamepad.processEvents, 16);
  }

  /**
   * Handles the move event from the gamepad 
   * @param {number} id 
   * @param {number} axis 
   * @param {number} value 
   */
  _moveHandler(id, axis, value) {
    if (typeof axis === 'undefined') return;

    let evtName;
    let realValue;
    switch (axis) {
      case this._config.xMove: {
        realValue = convertToCenteredRange(value);
        if (realValue < 0) {
          evtName = 'left';
        } else {
          evtName = 'right';
        }
        realValue = Math.abs(realValue);
        break;
      }
      case this._config.yMove: {
        realValue = convertToCenteredRange(value);
        if (realValue < 0) {
          evtName = 'up';
        } else {
          evtName = 'down';
        }
        realValue = Math.abs(realValue);
        break;
      }
      default: {
        evtName = getObjectKeyFromValue(this._config, axis);
        realValue = convertToRange(value);
        break;
      }
    }
    this._cb(evtName, parseInt(realValue));
  }

}

/**
 * convert to a range between 0 and 255
 * from a range of -1 to 1
 * @param {number} value 
 */
function convertToRange(value) {
  return (value + 1) * 255 / 2;
}

/**
 * convert to a range between -128 and 128
 * from a range of -1 to 1
 * @param {number} value 
 */
function convertToCenteredRange(value) {
  return value * 256 / 2;
}

/**
 * Get the key of an object based on the value
 * @param {Object} object 
 * @param {any} value 
 */
function getObjectKeyFromValue(object, value) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value) return prop;
    }
  }
  return null;
}