import { Car } from './car';
import { Controller, convertToRange } from './controller';

const ControllerAxisConfig = {
  xMove: 0,
  leftTrigger: 5,
  rightTrigger: 4
};

class Loop {
  constructor() {
    this.car = new Car('/dev/ttyUSB0');
    this.controller = new Controller(
      this.controllerUpdate.bind(this),
      ControllerAxisConfig
    );

    this.controller.init();
  }

  startSerial(timeout = 50) {
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
        const steer = convertToRange(value, -60, 60);
        this.car.setSteering(steer);
        break;
      case 'rightTrigger':
        this.car.setAcceleration(value);
        break;
      case 'leftTrigger':
        this.car.setBrakes(value);
        break;
      default:
        console.log(`[CONTROLLER]: ${evtName} - ${value}`);
        break;
    }
  }
}

const mainLoop = new Loop();
mainLoop.startSerial();