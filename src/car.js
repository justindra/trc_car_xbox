const SerialPort = require('serialport');
const Struct = require('struct');

/**
 * The Communications to the car
 */
export class Car {
  // Private variables
  // _port;
  // _data;
  // _dataProxy;

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

  setSteering(steerAngle = 0) {
    this._dataProxy.steer = parseInt(steerAngle);
  }

  setAcceleration(acceleration = 0) {
    this._dataProxy.acceleration = acceleration;
  }

  setBrakes(brakes = 0) {
    this._dataProxy.brakes = brakes;
  }
}
