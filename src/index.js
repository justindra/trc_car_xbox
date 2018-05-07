import { Car } from './car';
import { Controller } from './controller';

const TestCar = new Car('/dev/ttyUSB1');

TestCar.sendData();
TestCar.setSteering(-60);
TestCar.sendData();
TestCar.setAcceleration(50);
TestCar.sendData();
TestCar.setBrakes(20);
TestCar.sendData();
TestCar.setSteering(60);
TestCar.sendData();

const TestController = new Controller();

TestController.init();