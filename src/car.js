const SerialPort = require('serialport');
const Readline = require('parser-readline');
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

    // Read data back from arduino
    const parser = this._port.pipe(new Readline({ delimiter: '\n' }));
    parser.on('data', function (data) {
      var buff = new Buffer(data, 'utf8');
      const str = buff.toString();
      if (!str.includes('wait')) {
        console.log('[CAR SERIAL]:', str);
      }
    });

    // Initialize the data structure to be sent to the arduino
    this._data = Struct()
      .word8Sle('start')
      .word8Sle('steer')        // 0 -> 120
      .word8Sle('acceleration') // 0 -> 100
      .word8Sle('brakes')       // 0 -> 100
      .chars('gear', 1);        // P D R N
    this._data.allocate();
    this._dataProxy = this._data.fields;
    // Start bit is always 0xFF
    this._dataProxy.start = 0xFF;
    // Set initial values
    this._dataProxy.steer = 60;
    this._dataProxy.acceleration = 0;
    this._dataProxy.brakes = 0;
    this._dataProxy.gear = 'P';
  }

  sendData() {
    const buffer = this._data.buffer();
    this._port.write(buffer, function (err) {
      if (err) return console.log('Error on write: ', err.message);
      console.log(buffer);
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
    this._dataProxy.acceleration = parseInt(acceleration);
  }

  /**
   * Set the brakes
   * @param {number} brakes 
   */
  setBrakes(brakes = 0) {
    this._dataProxy.brakes = parseInt(brakes);
  }

  /**
   * Set the gears up or down
   * @param {boolean} up
   * @param {string} gear 
   */
  setGear(up = false, gear) {
    if (gear) {
      this._dataProxy.gear = gear.toUppercase();
      return;
    }
    const gearList = ['P', 'R', 'N', 'D'];
    const curGear = this._dataProxy.gear;
    const idx = gearList.indexOf(curGear);
    let newGear;
    if (up) {
      newGear = gearList[idx + 1] || gearList[3];
    } else {
      newGear = gearList[idx - 1] || gearList[0];
    }

    this._dataProxy.gear = newGear;
  }
}
