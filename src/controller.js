const gamepad = require("gamepad");

const DEFAULT_AXIS_CONFIG = {
  xMove: 0,
  yMove: 1,
  x2Move: 2,
  y2Move: 3,
  rTrigger: 4,
  lTrigger: 5,
  xArrow: 6,
  yArrow: 7
};

const DEFAULT_BUTTON_CONFIG = {
  aButton: 0,
  bButton: 1,
  xButton: 2,
  yButton: 3,
  leftButton:4,
  rightButton: 5,
  dispButton: 6,
  startButton: 7,
  leftJoystickButton: 8,
  rightJoystickButton: 9
}

function defaultCallback(evtName, value) {
  console.log(`${evtName}: ${value}`);
}

export class Controller {
  constructor(
    callback = defaultCallback,
    axisConfig = DEFAULT_AXIS_CONFIG,
    buttonConfig = DEFAULT_BUTTON_CONFIG
  ) {
    this._cb = callback;
    this._axisConfig = axisConfig;
    this._buttonConfig = buttonConfig;
    this._gamepad = gamepad;
  }

  init() {
    this._gamepad.init();
    this._gamepad.on('move', this._moveHandler.bind(this));
    this._gamepad.on('down', this._downHandler.bind(this));
    // Create a game loop and poll for events
    setInterval(this._gamepad.processEvents, 16);
  }

  /**
   * Handles the move event from the gamepad 
   * @param {number} sessionId
   * @param {number} axis
   * @param {number} value 
   */
  _moveHandler(sessionId, axis, value) {
    if (typeof axis === 'undefined') return;

    let evtName = getObjectKeyFromValue(this._axisConfig, axis);
    // If the button is not defined, then just ignore it
    if (!evtName) return;

    let realValue;
    if ((axis === this._axisConfig.xMove) || 
        (axis === this._axisConfig.yMove)) {
      realValue = convertToRange(value, -128, 128);
    } else {
      realValue = convertToRange(value);
    }
    this._cb(evtName, parseInt(realValue));
  }

  _downHandler(sessionId, buttonId) {
    if(typeof buttonId === 'undefined') return;

    let evtName = getObjectKeyFromValue(this._buttonConfig, buttonId);
    // If the button is not defined, then just ignore it
    if (!evtName) return;
    this._cb(evtName, 1);
  }
}

/**
 * convert to a different range
 * Defaults to turn to 0:255 from -1:1
 * @param {number} value
 * @param {number} outRangeMin
 * @param {number} outRangeMax
 * @param {number} inRangeMin
 * @param {number} inRangeMax
 */
export function convertToRange(value, outRangeMin = 0, outRangeMax = 255, inRangeMin = -1, inRangeMax = 1) {
  return (((outRangeMax - outRangeMin)/ (inRangeMax - inRangeMin)) * (value - inRangeMin)) + outRangeMin;
  // return (value + 1) * 255 / 2;
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