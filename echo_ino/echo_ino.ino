void setup() {
 // put your setup code here, to run once:
 Serial.begin(9600);   // debug serial
 //Serial1.begin(9600);  // Jetson serial
}

void loop() {
 int in = Serial.read();
 if (in >= 0) {
   Serial.write(in);
  }
}
