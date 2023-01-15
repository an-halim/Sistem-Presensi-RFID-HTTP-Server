#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <HTTPClient.h>
#include <WiFi.h>
 
int relPin;
int state=0;
byte  COD[10];
byte  AUX[10];
int k=0;

//RFID PORT
#define RST_PIN 9
#define SS_PIN 10
MFRC522 rfid(SS_PIN, RST_PIN); 
MFRC522::MIFARE_Key key;
 
//LCD
LiquidCrystal_I2C  lcd(0x27,16,2);
 
//KEYPAD
const byte numRows= 4;  
const byte numCols= 4; 
 
char keymap[numRows][numCols]=
{
{'1', '2', '3', 'A'},
{'4', '5', '6', 'B'},
{'7', '8', '9', 'C'},
{'*', '0', '#', 'D'}
};
 
//Code that shows the the keypad connections to the arduino terminals
byte rowPins[numRows] = {2,3,4,5};    
byte colPins[numCols] = {A0,7,8,9};   
 
//initializes an instance of the Keypad class
Keypad myKeypad= Keypad(makeKeymap(keymap), rowPins, colPins, numRows, numCols);
 
// save key state
char state

//  rfid code store
byte readCard[4]; 

const char* ssid = "Wokwi-GUEST";
const char* password = "";

// server url
String saverfID = "http://localhost:3000/rfid/do?rfid="; // save new rfid
String presensi = "http://localhost:3000/presensi/do?rfid="; // do presensi
String apiKey = "&apiKey=alm4ihus78fsjgd";

void setup() {
  pinMode(A0,OUTPUT);
  digitalWrite(A0,HIGH);

  //RFID
  Serial.begin(9600);  // Initialize serial communications with the PC
  while (!Serial);     // Do nothing if no serial port is opened
  SPI.begin();         // Init SPI bus
  rfid.PCD_Init();  // Init MFRC522 card
 
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  
  HTTPClient http;

  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("OK! IP=");
  Serial.println(WiFi.localIP());
  
  lcd.begin();
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.clear();
  lcd.print( "Ready" );

}
 
int getRFID() //Get RFID tag Number
{
  if ( ! rfid.PICC_IsNewCardPresent()) { //If a new PICC placed to RFID reader continue
    return 0;
  }
  if ( ! rfid.PICC_ReadCardSerial()) {   //Since a PICC placed get Serial and continue
    return 0;
  }

  for ( uint8_t i = 0; i < 4; i++)
  {
    readCard[i] = rfid.uid.uidByte[i];
  }
  rfid.PICC_HaltA(); // Stop reading
  return 1;
}
 
 
 
void loop() {
  state = myKeypad.getKey();
  getRFID();
   
  switch(state){
    case 0: {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Read RFID");
      // read and send rfid data
      if (getRFID()) {
        Serial.print("RFID: ");
        
        for (uint8_t i = 0; i < 4; i++) {
          Serial.print(readCard[i], HEX);
          Serial.print(" ");
        }
        Serial.println();
        String url = saverfID;
        for (uint8_t i = 0; i < 4; i++) {
          url += String(readCard[i], HEX);
        }
        url += apiKey;

        http.begin(url);

        int httpResponseCode = http.GET();
        if (httpResponseCode > 0) {
          Serial.print("HTTP ");
          Serial.println(httpResponseCode);
          String payload = http.getString();
          Serial.println();
          Serial.println(payload);
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode);
          Serial.println(":-(");
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
      }
      break;
    }
    case 1: {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Presensi");
      // read and send rfid data
      if (getRFID()) {
        Serial.print("RFID: ");
        for (uint8_t i = 0; i < 4; i++) {
          Serial.print(readCard[i], HEX);
          Serial.print(" ");
        }
        Serial.println();
        String url = presensi;
        for (uint8_t i = 0; i < 4; i++) {
          url += String(readCard[i], HEX);
        }
        url += "&status=1";
        url += apiKey;

        http.begin(url);

        int httpResponseCode = http.GET();
        if (httpResponseCode > 0) {
          Serial.print("HTTP ");
          Serial.println(httpResponseCode);
          String payload = http.getString();
          Serial.println();
          Serial.println(payload);
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode);
          Serial.println(":-(");
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
      }
      break;
    }
    case 2: {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Istirahat");
      // read and send rfid data
      if (getRFID()) {
        Serial.print("RFID: ");
        for (uint8_t i = 0; i < 4; i++) {
          Serial.print(readCard[i], HEX);
          Serial.print(" ");
        }
        Serial.println();
        String url = presensi;
        for (uint8_t i = 0; i < 4; i++) {
          url += String(readCard[i], HEX);
        }
        url += "&status=2";
        url += apiKey;

        http.begin(url);

        int httpResponseCode = http.GET();
        if (httpResponseCode > 0) {
          Serial.print("HTTP ");
          Serial.println(httpResponseCode);
          String payload = http.getString();
          Serial.println();
          Serial.println(payload);
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode);
          Serial.println(":-(");
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
      }
      break;
    }
    case 3: {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Kembali");
      // read and send rfid data
      if (getRFID()) {
        Serial.print("RFID: ");
        for (uint8_t i = 0; i < 4; i++) {
          Serial.print(readCard[i], HEX);
          Serial.print(" ");
        }
        Serial.println();
        String url = saverfID;
        for (uint8_t i = 0; i < 4; i++) {
          url += String(readCard[i], HEX);
        }
        url += "&status=3";
        url += apiKey;

        http.begin(url);

        int httpResponseCode = http.GET();
        if (httpResponseCode > 0) {
          Serial.print("HTTP ");
          Serial.println(httpResponseCode);
          String payload = http.getString();
          Serial.println();
          Serial.println(payload);
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode);
          Serial.println(":-(");
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
      }
      break;
    }
    case 3: {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Pulang");
      // read and send rfid data
      if (getRFID()) {
        Serial.print("RFID: ");
        for (uint8_t i = 0; i < 4; i++) {
          Serial.print(readCard[i], HEX);
          Serial.print(" ");
        }
        Serial.println();
        String url = saverfID;
        for (uint8_t i = 0; i < 4; i++) {
          url += String(readCard[i], HEX);
        }
        url += "&status=3";
        url += apiKey;

        http.begin(url);

        int httpResponseCode = http.GET();
        if (httpResponseCode > 0) {
          Serial.print("HTTP ");
          Serial.println(httpResponseCode);
          String payload = http.getString();
          Serial.println();
          Serial.println(payload);
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
        else {
          Serial.print("Error code: ");
          Serial.println(httpResponseCode);
          Serial.println(":-(");
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print(payload);
        }
      }
      break;
    }
  }
}