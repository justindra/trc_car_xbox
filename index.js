var SerialPort = require('serialport');
const Readline = require('parser-readline')
var port = new SerialPort('/dev/ttyUSB1', {
  baudRate: 9600
});

const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', function (data) {
  var buff = new Buffer(data, 'utf8');
  const str = buff.toString();
  if (!str.includes('wait')) {
    console.log('Data:', str);
  }
});

const Struct = require('struct');
  
function sendData(steer, acceleration, brake, cb) {
  const toBeSent = Struct()
    .word8Sle('start')
    .word8Sle('stop')
    .word8Sle('steer')
    .word8Sle('acceleration')
    .word8Sle('brakes');

  toBeSent.allocate();
  buffer = toBeSent.buffer();

  var proxy = toBeSent.fields;
  proxy.start = 0xFF;
  proxy.stop = 0;
  proxy.steer = parseInt(steer);
  proxy.acceleration = parseInt(acceleration);
  proxy.brakes = parseInt(brake);
  // console.log(buffer);
  port.write(buffer, function (err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    if (cb) {
      cb();
    }
  });
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askForAngle() {
  rl.question('Steering Angle? ', (answer) => {
    console.log(`Got angle: ${answer}`);
    sendData(answer, askForAngle);
  });
}

// askForAngle();

var gamepad = require("gamepad");

// Initialize the library
gamepad.init()

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);

steer = 0;
acceleration = 0;
brake = 0;

// Listen for move events on all gamepads
gamepad.on("move", function (id, axis, value) {
  // console.log("move", {
  //   id: id,
  //   axis: axis,
  //   value: value,
  // });
  if (axis === 0) {
    console.log('Steer: ' + value + ', ' + convertToRange(value));
    steer = convertToRange(value);
  }

  if (axis === 4) {
    console.log('Brakes: ' + value + ', ' + convertToRange(value));
    brake = convertToRange(value);
  }

  if (axis === 5) {
    console.log('Acceleration: ' + value + ', ' + convertToRange(value));
    acceleration = convertToRange(value);
  }
  sendData(steer, acceleration, brake);
});

/**
 * convert to a range between 0 and 255
 * from a range of -1 to 1
 * @param {number} value 
 */
function convertToRange(value) {
  return (value + 1) * 255 / 2;
}