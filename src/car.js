const SerialPort = require('serialport');
const Struct = require('struct');

/**
 * The Communications to the car
 * @param {string} portPath The path to the serial port
 */
export class Car {
  constructor(portPath = '') {
    // Initialize the serial port
    this._port = new SerialPort(portPath, {
      baudRate: 9600
    });

    // Initialize the data structure to be sent to the arduino
    this._data = Struct()
      .word8Sle('start')
      .word8Sle('stop')
      .word8Sle('steer')
      .word8Sle('acceleration')
      .word8Sle('brakes');
    this._data.allocate();
    this._dataProxy = this._data.fields;
    // Start bit is always 0xFF
    this._dataProxy.start = 0xFF;
  }

  sendData() {
    const buffer = this._data.buffer();
    this._port.write(buffer, function (err) {
      if (err) return console.log('Error on write: ', err.message);
    });
  }

  /**
   * Set the steering angle
   * @param {number} steerAngle 
   */
  setSteering(steerAngle = 0) {
    this._dataProxy.steer = parseInt(steerAngle);
  }

  /**
   * Set the acceleration
   * @param {number} acceleration 
   */
  setAcceleration(acceleration = 0) {
    this._dataProxy.acceleration = acceleration;
  }

  /**
   * Set the brakes
   * @param {number} brakes 
   */
  setBrakes(brakes = 0) {
    this._dataProxy.brakes = brakes;
  }
}
