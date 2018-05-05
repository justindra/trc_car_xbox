/*
  Turns on the led using serial
 */
 
// Pin 13 has an LED connected on most Arduino boards.
// give it a name:
int led = 13;
int blue = 9;
int green = 10;
int red = 11;

// INITIALIZE Ints
int jetson_stop;
int jetson_steer;
int jetson_throttle;
int jetson_brake;


// the setup routine runs once when you press reset:
void setup() {                
  // initialize the digital pin as an output.
  pinMode(led, OUTPUT);
  pinMode(blue, OUTPUT);
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  Serial.begin(9600);
}

// the loop routine runs over and over again forever:
void loop() {
//  digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
//  delay(1000);               // wait for a second
//  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
//  delay(1000);               // wait for a second

  if (Serial.read() == 0xFF) {    
    while (!(Serial.available() > 3)) Serial.println("wait");
    jetson_stop = Serial.read();
    jetson_steer = Serial.read();
    jetson_throttle = Serial.read();
    jetson_brake = Serial.read();
//    char sendBuffer[4];
//    sprintf(sendBuffer, "%d%d%d%d", jetson_stop, jetson_steer, jetson_throttle, jetson_brake);
    analogWrite(blue, jetson_steer);
    analogWrite(green, jetson_throttle);
    analogWrite(red, jetson_brake);
//    Serial.println(sendBuffer);
    
    
    
  }
}
