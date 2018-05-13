import { Car } from './car';
import { Controller, convertToRange } from './controller';

const ControllerAxisConfig = {
  xMove: 0,
  leftTrigger: 5,
  rightTrigger: 4,
};

const ControllerButtonConfig = {
  leftButton:4,
  rightButton: 5
}

class Loop {
  constructor() {
    this.car = new Car('/dev/ttyACM0');
    this.controller = new Controller(
      this.controllerUpdate.bind(this),
      ControllerAxisConfig,
      ControllerButtonConfig
    );

    this.controller.init();
  }

  startSerial(timeout = 200) {
    // stop any serial sending happening first
    this.stopSerial();
    // Send data at a set interval
    this._serialCallId = setInterval(() => {
      this.car.sendData();
    }, timeout);
  }

  stopSerial() {
    if (this._serialCallId) {
      clearInterval(this._serialCallId);
      this._serialCallId = null;
    }
  }

  controllerUpdate(evtName, value) {
    switch (evtName) {
      case 'xMove':
        const steer = convertToRange(value, 120, 0, -128, 128);
        // console.log(value, steer);
        this.car.setSteering(steer);
        break;
      case 'rightTrigger':
        const accel = convertToRange(value, 0, 100, 0, 255);
        // console.log(accel, value);
        this.car.setAcceleration(accel);
        break;
      case 'leftTrigger':
        const brakes = convertToRange(value, 0, 100, 0, 255);
        this.car.setBrakes(brakes);
        break;
      case 'leftButton':
        this.car.setGear();
        break;
      case 'rightButton':
        this.car.setGear(true);
        break;
      default:
        console.log(`[CONTROLLER]: ${evtName} - ${value}`);
        break;
    }
  }
}

const mainLoop = new Loop();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Are you ready? ', (answer) => {
  // TODO: Log the answer in a database
  console.log('Lets get started!!!');
  rl.close();
  mainLoop.startSerial();
});