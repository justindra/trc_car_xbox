## Xbox Arduino Controller

This is the code to control an Arduino over serial, in particular controlling the car code [here](https://github.com/hroachewilson/trc_autonomous_vehicle).

The code can be easily modified to talk to any other device over serial. Just simply adjust the data structure set out in [src/car.js].

### Usage

To run the controller and start sending over serial, just run

```
npm start
```

If just trying to see if the controller is working first, run

```
npm run test-controller
```