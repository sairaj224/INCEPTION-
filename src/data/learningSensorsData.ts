import { SensorTopic } from '../types';

export const SENSOR_TOPICS: SensorTopic[] = [
  {
    id: 'dht22-temp-humidity',
    name: 'DHT22 / AM2302 Digital Temperature & Humidity Sensor',
    modelNumber: 'DHT22 (AM2302)',
    category: 'Temperature & Humidity',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    summary: 'High-precision capacitive humidity and thermistor sensor delivering calibrated digital output via a single-bus digital protocol.',
    whatItMeasures: 'Ambient air temperature (-40°C to 80°C) and relative humidity (0% to 100% RH) with 0.1°C / 0.1% resolution.',
    howItWorks: 'Uses a capacitive humidity sensing element and an NTC temperature thermistor connected to an onboard 8-bit microcontroller that computes calibration coefficients and outputs a 40-bit digital pulse train.',
    specs: {
      operatingVoltage: '3.3V to 5.5V DC',
      currentConsumption: '1.5mA (measuring), 40μA (standby)',
      measurementRange: 'Humidity: 0-100% RH; Temperature: -40°C to +80°C',
      accuracy: '±2% RH, ±0.5°C',
      outputType: 'Single-bus Digital Signal (Custom 1-Wire Protocol)',
      responseSpeed: 'Sampling period: 2 seconds (0.5 Hz rate)',
      interfacePinsCount: 4,
    },
    applications: [
      'Greenhouses & hydroponics climate control',
      'HVAC automated climate automation',
      'IoT weather stations & home automation',
      'Server room environmental monitoring',
    ],
    pinoutGuide: [
      { pinNumber: 1, pinName: 'VCC', function: 'Power Supply Input', voltage: '3.3V - 5V', recommendedConnection: 'Connect to 3.3V or 5V rail (3.3V for ESP32/Pico, 5V for Arduino Uno)' },
      { pinNumber: 2, pinName: 'DATA / OUT', function: 'Bidirectional Serial Data', voltage: 'Logic Level (Matches VCC)', recommendedConnection: 'Connect to any digital GPIO with a 4.7kΩ–10kΩ pull-up resistor to VCC' },
      { pinNumber: 3, pinName: 'NC', function: 'Not Connected / Null', voltage: 'N/A', recommendedConnection: 'Leave disconnected (unconnected in 4-pin packages)' },
      { pinNumber: 4, pinName: 'GND', function: 'Ground Reference (0V)', voltage: '0V', recommendedConnection: 'Connect to common microcontroller ground' },
    ],
    circuitDiagram: {
      microcontroller: 'ESP32 / Arduino Uno',
      wiringSteps: [
        { step: 1, fromComponentPin: 'Pin 1 (VCC)', toBoardPin: '3.3V (ESP32) or 5V (Arduino)', wireColor: 'Red', reason: 'Provides regulated operating power' },
        { step: 2, fromComponentPin: 'Pin 2 (DATA)', toBoardPin: 'GPIO 4 (ESP32) or Digital Pin 2 (Arduino)', wireColor: 'Yellow', reason: 'Single-wire communication bus' },
        { step: 3, fromComponentPin: 'Pin 2 (DATA)', toBoardPin: 'VCC through 10kΩ Resistor', wireColor: 'Orange', reason: 'Pull-up resistor keeps line HIGH during bus idle' },
        { step: 4, fromComponentPin: 'Pin 4 (GND)', toBoardPin: 'GND', wireColor: 'Black', reason: 'Completes the ground circuit loop' },
      ],
      safetyNotes: [
        'Always include a 4.7kΩ–10kΩ pull-up resistor between DATA and VCC unless using a 3-pin breakout board with a built-in resistor.',
        'Do not read the sensor faster than once every 2 seconds (0.5Hz); querying faster returns NaN or cached stale values.',
      ],
    },
    codeExamples: [
      {
        platform: 'Arduino C++',
        title: 'Arduino / ESP32 DHT22 Reader with Adafruit DHT Library',
        librariesRequired: ['DHT sensor library by Adafruit', 'Adafruit Unified Sensor'],
        code: `#include "DHT.h"

#define DHTPIN 4     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT22   // DHT 22 (AM2302)

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  Serial.println("DHT22 Test Initialized!");
  dht.begin();
}

void loop() {
  // Wait at least 2 seconds between measurements
  delay(2000);

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // Celsius

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor! Check wiring & pull-up resistor.");
    return;
  }

  Serial.print("Humidity: ");
  Serial.print(humidity, 1);
  Serial.print("%  |  Temperature: ");
  Serial.print(temperature, 1);
  Serial.println(" °C");
}`,
        explanation: 'Initializes the DHT22 single-wire bus on GPIO 4, queries the calibrated temperature and relative humidity every 2 seconds, and prints formatted output to the Serial Monitor.',
      },
      {
        platform: 'ESP32 MicroPython',
        title: 'MicroPython ESP32 Native DHT Driver',
        librariesRequired: ['dht (built-in in MicroPython firmware)'],
        code: `import dht
from machine import Pin
import time

sensor = dht.DHT22(Pin(4))

print("Starting MicroPython DHT22 Monitor...")

while True:
    try:
        time.sleep(2)
        sensor.measure()
        t = sensor.temperature()
        h = sensor.humidity()
        print(f"Temperature: {t:.1f}°C | Humidity: {h:.1f}%")
    except OSError as e:
        print("Sensor read error:", e)`,
        explanation: 'Uses standard MicroPython dht library. Calls sensor.measure() followed by temperature() and humidity() getters with built-in checksum verification.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Polling the sensor inside a loop without delays (e.g. 100ms)',
        consequence: 'Returns checksum error, timeout, or repeated NaN (Not a Number) readings.',
        fix: 'Insert a minimum delay of 2000ms (2 seconds) between consecutive dht.read() calls.',
      },
      {
        mistake: 'Omitting the external 10kΩ pull-up resistor on bare 4-pin DHT22 packages',
        consequence: 'The digital signal line floats, causing the microcontroller to miss start pulses.',
        fix: 'Add a 4.7kΩ to 10kΩ resistor between Pin 1 (VCC) and Pin 2 (DATA), or enable internal MCU pull-up.',
      },
    ],
    troubleshootingGuide: [
      {
        symptom: 'Serial Monitor always prints "Failed to read from DHT sensor / NaN"',
        probableCause: 'Loose jumper wire on DATA pin, missing pull-up resistor, or wrong GPIO pin number declared in code.',
        stepToFix: 'Verify that DHTPIN in code matches the exact physical GPIO on your board and check for 3.3V continuity.',
      },
      {
        symptom: 'Temperature reading spikes or reads unrealistic 1% humidity',
        probableCause: 'Insufficient supply voltage or heavy electrical noise from nearby motors/relays.',
        stepToFix: 'Add a 100nF decoupling capacitor across VCC and GND pins right next to the sensor module.',
      },
    ],
    miniProjects: [
      {
        title: 'Smart Egg Incubator Climate Regulator',
        difficulty: 'Beginner',
        description: 'Read temperature & humidity continuously; trigger an exhaust fan relay if temperature exceeds 37.5°C and an ultrasonic mister if humidity drops below 55%.',
        keyComponents: ['DHT22', 'ESP32 / Arduino', '5V Relay Module', '16x2 I2C LCD'],
      },
      {
        title: 'IoT Weather Station with Cloud Dashboard',
        difficulty: 'Intermediate',
        description: 'ESP32 sends 5-minute temperature & humidity telemetry to an MQTT broker / Inception cloud dashboard with hostel room alerts.',
        keyComponents: ['DHT22', 'ESP32 DevKit', 'OLED Display SSD1306', 'Wi-Fi Network'],
      },
    ],
    videos: [
      {
        id: 'v-dht22-1',
        title: 'How DHT11 and DHT22 Temperature & Humidity Sensors Work',
        youtubeId: 'bA455gKxJ24',
        channel: 'Electronics Hub & HowToMechatronics',
        duration: '7:42',
        category: 'Sensors',
        summary: 'Deep dive into single-bus pulse length timing, checksum verification, and capacitive humidity dielectric changes.',
        keyTakeaways: ['Single wire protocol uses 80μs low start signals', 'DHT22 is 4x more accurate than basic blue DHT11', '40 bits = 16 bit humidity + 16 bit temperature + 8 bit checksum'],
      },
    ],
    simulation: {
      parameterLabel: 'Ambient Room Temperature & Humidity',
      min: 0,
      max: 60,
      unit: '°C',
      defaultValue: 25,
      outputFormulaText: 'T_out = Raw_NTC_ADC / 10 | RH_out = ΔCapacitance_Pulse_Width',
      step: 1,
      interpretValue: (val: number) => {
        const humidity = Math.min(100, Math.max(15, Math.round(val * 1.8 + 10)));
        const isComfortable = val >= 20 && val <= 26 && humidity >= 40 && humidity <= 60;
        return {
          rawSignal: `0x${((val * 10) & 0xffff).toString(16).toUpperCase().padStart(4, '0')} [40-bit Bitstream OK]`,
          convertedValue: `${val.toFixed(1)}°C | ${humidity}% RH`,
          status: isComfortable ? 'Comfort Zone (Optimal Living)' : val > 35 ? 'High Heat Hazard' : 'Sub-Optimal Climate',
          statusColor: isComfortable ? 'emerald' : val > 35 ? 'rose' : 'amber',
          technicalNote: `Internal 8-bit MCU computed 16-bit Temp Word: ${val * 10} and 16-bit Humidity Word: ${humidity * 10}. Parity Check Passed (0 errors).`,
        };
      },
    },
  },
  {
    id: 'hc-sr04-ultrasonic',
    name: 'HC-SR04 Ultrasonic Distance & Ranging Sensor',
    modelNumber: 'HC-SR04 / HC-SR04P',
    category: 'Distance & Ranging',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    summary: 'Non-contact ultrasonic sonar distance measuring module providing 2cm to 400cm ranging with 3mm precision.',
    whatItMeasures: 'Distance to target objects by measuring time-of-flight of 40 kHz ultrasonic acoustic sound pulses.',
    howItWorks: 'Sending a 10μs HIGH pulse on the TRIG pin causes the transmitter to emit an 8-cycle 40 kHz sonic burst. The ECHO pin goes HIGH and stays HIGH until the reflected wave bounces back. Distance = (Echo Duration × Speed of Sound 0.0343 cm/μs) / 2.',
    specs: {
      operatingVoltage: '5.0V DC (HC-SR04P model supports 3.3V)',
      currentConsumption: '15mA operating, <2mA quiescent',
      measurementRange: '2 cm to 400 cm (0.8" to 157")',
      accuracy: '±3 mm',
      outputType: 'PWM Pulse-Width (Duration of HIGH on Echo pin in microseconds)',
      responseSpeed: 'Measuring cycle: 50 ms (20 Hz burst frequency)',
      interfacePinsCount: 4,
    },
    applications: [
      'Obstacle-avoidance autonomous robotics',
      'Water tank level monitoring & overflow alarms',
      'Smart contactless trash cans & parking sensors',
      'Digital ultrasonic measuring tape',
    ],
    pinoutGuide: [
      { pinNumber: 1, pinName: 'VCC', function: '5V Power Input', voltage: '5.0V DC', recommendedConnection: 'Connect to 5V rail (required for strong 40kHz acoustic transducer excitation)' },
      { pinNumber: 2, pinName: 'TRIG', function: 'Trigger Input Pulse', voltage: 'TTL Logic (3.3V or 5V)', recommendedConnection: 'Connect to any digital output GPIO pin on MCU' },
      { pinNumber: 3, pinName: 'ECHO', function: 'Echo Return Pulse Output', voltage: '5.0V TTL Output', recommendedConnection: 'IMPORTANT: Use a 1kΩ + 2kΩ voltage divider when connecting to 3.3V ESP32/Pico GPIO!' },
      { pinNumber: 4, pinName: 'GND', function: 'Ground (0V)', voltage: '0V', recommendedConnection: 'Connect to common microcontroller ground' },
    ],
    circuitDiagram: {
      microcontroller: 'ESP32 / Arduino Uno',
      wiringSteps: [
        { step: 1, fromComponentPin: 'VCC', toBoardPin: '5V Pin', wireColor: 'Red', reason: 'Transducers require 5V for full acoustic range' },
        { step: 2, fromComponentPin: 'TRIG', toBoardPin: 'GPIO 5 (or D9)', wireColor: 'Yellow', reason: 'MCU sends 10μs start triggers' },
        { step: 3, fromComponentPin: 'ECHO', toBoardPin: 'GPIO 18 through Voltage Divider', wireColor: 'Blue', reason: 'Drops 5V echo pulse down to safe 3.3V level for ESP32' },
        { step: 4, fromComponentPin: 'GND', toBoardPin: 'GND', wireColor: 'Black', reason: 'Common reference ground' },
      ],
      safetyNotes: [
        'CRITICAL FOR ESP32 / PICO USERS: The standard HC-SR04 ECHO pin outputs 5V TTL logic! Direct connection to a 3.3V microcontroller pin can permanently degrade or burn the GPIO pin. Always use a voltage divider (1kΩ series + 2kΩ to GND) or a logic level shifter.',
      ],
    },
    codeExamples: [
      {
        platform: 'Arduino C++',
        title: 'Direct Microsecond Echo Pulse Measurement',
        librariesRequired: ['None (Uses native pulseIn function)'],
        code: `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.println("HC-SR04 Ultrasonic Distance Sensor Ready!");
}

void loop() {
  // Clear the trigger pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Send a 10 microsecond HIGH pulse to fire 8 acoustic bursts
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read echo travel time in microseconds
  long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout (~5 meters max)

  if (duration == 0) {
    Serial.println("Out of Range / No Echo Received");
  } else {
    // Distance = (Duration * Speed of Sound 0.0343 cm/us) / 2
    float distanceCm = (duration * 0.0343) / 2.0;
    Serial.print("Distance: ");
    Serial.print(distanceCm, 1);
    Serial.println(" cm");
  }

  delay(100); // 10Hz sampling
}`,
        explanation: 'Fires a 10-microsecond pulse on TRIG, records the duration of the return reflection via pulseIn(), and calculates distance in centimeters using the speed of sound at 20°C (343 m/s).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Connecting ECHO pin directly to ESP32 without a voltage divider',
        consequence: 'Sends 5.0V into a 3.3V maximum rated GPIO, damaging internal input clamping diodes.',
        fix: 'Add two resistors: 1kΩ between ECHO and GPIO, and 2kΩ between GPIO and GND to scale 5V down to 3.33V.',
      },
      {
        mistake: 'Attempting to measure acoustic sound bouncing off soft cloth, foam, or angled surfaces',
        consequence: 'Sound waves are absorbed or deflected away, giving false maximum distance timeouts.',
        fix: 'Ensure sound reflects against rigid, flat perpendicular surfaces like walls, metal, plastic, or water.',
      },
    ],
    troubleshootingGuide: [
      {
        symptom: 'Returns constant 0cm or 3000cm timeout',
        probableCause: 'ECHO and TRIG wires swapped, or VCC is below 4.5V on standard 5V model.',
        stepToFix: 'Verify TRIG is an OUTPUT and ECHO is an INPUT in code; check that VCC is connected to the 5V/VIN pin.',
      },
    ],
    miniProjects: [
      {
        title: 'Obstacle Avoiding 2WD Rover',
        difficulty: 'Beginner',
        description: 'Mount HC-SR04 on a SG90 micro servo. Robot looks left and right when distance is less than 20cm and turns away from obstacles.',
        keyComponents: ['HC-SR04', 'L298N Motor Driver', '2x DC Gear Motors', 'Arduino Uno'],
      },
      {
        title: 'Non-Contact Water Tank Level Indicator with LED Bar',
        difficulty: 'Intermediate',
        description: 'Monitors overhead hostel tank water height and illuminates an 8-LED bar graph with audible buzzer overflow alert.',
        keyComponents: ['HC-SR04', 'ESP8266 / ESP32', 'Active Buzzer', 'LED Bar'],
      },
    ],
    videos: [
      {
        id: 'v-hcsr04-1',
        title: 'Ultrasonic Sensor HC-SR04 Deep Dive & Oscilloscope Traces',
        youtubeId: 'ZejQOX69K5M',
        channel: 'HowToMechatronics',
        duration: '6:15',
        category: 'Sensors',
        summary: 'Visual oscilloscope analysis showing the 10μs trigger pulse, 40kHz sound waves, and echo pulse width proportional to target distance.',
        keyTakeaways: ['Sound travels at 343 m/s (0.0343 cm/μs)', 'Division by 2 accounts for forward and return travel', 'Measuring angle cone is approx 15 degrees'],
      },
    ],
    simulation: {
      parameterLabel: 'Target Object Distance from Transducers',
      min: 2,
      max: 300,
      unit: 'cm',
      defaultValue: 35,
      outputFormulaText: 'Echo_Time_μs = (Distance_cm * 2) / 0.0343',
      step: 1,
      interpretValue: (val: number) => {
        const timeUs = Math.round((val * 2) / 0.0343);
        const isCollisionImminent = val <= 15;
        return {
          rawSignal: `ECHO HIGH for ${timeUs} μs (${(timeUs / 1000).toFixed(2)} ms)`,
          convertedValue: `${val} cm (${(val / 2.54).toFixed(1)} inches)`,
          status: isCollisionImminent ? 'CRITICAL PROXIMITY ALERT' : val < 50 ? 'Object in Detection Zone' : 'Clear Path',
          statusColor: isCollisionImminent ? 'rose' : val < 50 ? 'amber' : 'emerald',
          technicalNote: `Speed of sound calculated at 20°C: 343.2 m/s. Return acoustic signal amplitude: ${Math.max(10, 100 - val * 0.3).toFixed(0)}%.`,
        };
      },
    },
  },
  {
    id: 'mq2-gas-smoke-sensor',
    name: 'MQ-2 Flammable Gas, Smoke, LPG & Methane Sensor',
    modelNumber: 'MQ-2 Gas Sensor Module',
    category: 'Environmental & Gas',
    heroImage: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
    summary: 'Metal oxide semiconductor gas sensor highly sensitive to Liquefied Petroleum Gas (LPG), Propane, Hydrogen, Methane, and Smoke.',
    whatItMeasures: 'Concentration of combustible gases and smoke particles in air from 300 ppm to 10,000 ppm.',
    howItWorks: 'Contains a SnO2 (Tin Dioxide) sensitive layer heated by an internal micro-coil to ~300°C. When combustible gas molecules touch the hot surface, they react with adsorbed oxygen, releasing electrons and lowering the electrical resistance (Rs). The resistance change is read as an analog voltage.',
    specs: {
      operatingVoltage: '5.0V DC (Heater requires 5V to maintain thermal equilibrium)',
      currentConsumption: '150mA (Heater power dissipation ~800mW)',
      measurementRange: '300 ppm to 10,000 ppm combustible gas',
      accuracy: 'Relative sensitivity curve (Rs/Ro ratio calibration required)',
      outputType: 'Dual Output: Analog Voltage (AO: 0V–5V) + Digital Threshold (DO: TTL)',
      responseSpeed: 'Response time: <10s; Recovery time: <30s; Pre-heat burn-in: 24-48 hrs',
      interfacePinsCount: 4,
    },
    applications: [
      'Domestic LPG cylinder leakage alarms',
      'Hostel kitchen & lab fire smoke detection',
      'Industrial gas leak monitoring systems',
      'Automatic exhaust fan triggering systems',
    ],
    pinoutGuide: [
      { pinNumber: 1, pinName: 'VCC', function: '5V Power Supply (Heater + Circuit)', voltage: '5.0V DC ±0.1V', recommendedConnection: 'Connect to dedicated 5V power supply (Needs 150mA continuous current)' },
      { pinNumber: 2, pinName: 'GND', function: 'Ground (0V)', voltage: '0V', recommendedConnection: 'Common ground with MCU' },
      { pinNumber: 3, pinName: 'DO (Digital Out)', function: 'Comparator Threshold Output', voltage: 'TTL 0V / 5V', recommendedConnection: 'Connect to digital interrupt pin; triggers LOW/HIGH when gas exceeds potentiometer setpoint' },
      { pinNumber: 4, pinName: 'AO (Analog Out)', function: 'Variable Gas Concentration Voltage', voltage: '0.1V to 4.8V', recommendedConnection: 'Connect to ADC input pin (use voltage divider for 3.3V MCUs)' },
    ],
    circuitDiagram: {
      microcontroller: 'ESP32 / Arduino Uno',
      wiringSteps: [
        { step: 1, fromComponentPin: 'VCC', toBoardPin: '5V Pin', wireColor: 'Red', reason: 'Internal ceramic heater requires 5V to reach 300°C' },
        { step: 2, fromComponentPin: 'GND', toBoardPin: 'GND', wireColor: 'Black', reason: 'Ground loop completion' },
        { step: 3, fromComponentPin: 'AO', toBoardPin: 'A0 (Arduino) or GPIO 34 (ESP32 via 1k/2k divider)', wireColor: 'Orange', reason: 'Continuous analog gas density voltage' },
        { step: 4, fromComponentPin: 'DO', toBoardPin: 'D2 / GPIO 19', wireColor: 'Yellow', reason: 'Immediate digital hazard interrupt' },
      ],
      safetyNotes: [
        'The metal mesh on top of the MQ-2 will become noticeably warm to the touch. This is NORMAL because the internal heating element must reach 300°C to activate the chemical SnO2 catalyst.',
        'Never power the MQ-2 module directly from weak 3.3V microcontroller pins; the heater will not reach operating temperature and will produce incorrect readings.',
      ],
    },
    codeExamples: [
      {
        platform: 'Arduino C++',
        title: 'Calibrated Smoke & Gas Detection with Buzzer Alert',
        librariesRequired: ['None (Standard ADC analogRead)'],
        code: `const int gasAnalogPin = A0;
const int gasDigitalPin = 2;
const int buzzerPin = 8;

const int GAS_THRESHOLD = 400; // Calibrate in clean air first

void setup() {
  Serial.begin(115200);
  pinMode(gasDigitalPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.println("MQ-2 Gas Sensor Initialized. Allow 2-3 minutes for heater warmup.");
}

void loop() {
  int rawADC = analogRead(gasAnalogPin);
  int digitalAlert = digitalRead(gasDigitalPin);

  float voltage = rawADC * (5.0 / 1023.0);

  Serial.print("Raw Gas Value: ");
  Serial.print(rawADC);
  Serial.print(" | Sensor Voltage: ");
  Serial.print(voltage, 2);
  Serial.println("V");

  if (rawADC > GAS_THRESHOLD || digitalAlert == LOW) {
    Serial.println("WARNING: HIGH GAS / SMOKE CONCENTRATION DETECTED!");
    digitalWrite(buzzerPin, HIGH);
  } else {
    digitalWrite(buzzerPin, LOW);
  }

  delay(500);
}`,
        explanation: 'Reads analog concentration from A0, prints the measured voltage, and triggers an audio alarm if concentration exceeds the calibrated clean air threshold.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Reading sensor values immediately after plugging it in without pre-heating',
        consequence: 'Readings will wildly drift for the first 2 minutes until the SnO2 layer reaches thermal equilibrium.',
        fix: 'Allow 2 to 5 minutes of warmup after power-on before recording calibration baselines.',
      },
      {
        mistake: 'Assuming raw ADC value equals exact PPM without computing Rs/Ro curve',
        consequence: 'Inaccurate absolute gas quantification.',
        fix: 'Use logarithmic regression equations provided in the MQ-2 datasheet with clean air Ro calibration.',
      },
    ],
    troubleshootingGuide: [
      {
        symptom: 'Analog reading is permanently stuck near 0V or 5V',
        probableCause: 'Power supply voltage below 4.5V preventing the heating coil from warming up.',
        stepToFix: 'Measure voltage across VCC and GND pins with a digital multimeter to confirm steady 5.0V supply.',
      },
    ],
    miniProjects: [
      {
        title: 'Hostel Smart LPG Gas Leakage Auto-Shutoff System',
        difficulty: 'Intermediate',
        description: 'Detects LPG gas leakage, turns on an exhaust fan, sounds a 90dB siren, and drives a high-torque servo motor to physically shut the cylinder gas valve.',
        keyComponents: ['MQ-2 Sensor', 'MG996R Metal Gear Servo', 'Relay Module', 'ESP32'],
      },
    ],
    videos: [
      {
        id: 'v-mq2-1',
        title: 'MQ-2 Gas Sensor Working Principle, Calibration & Circuit',
        youtubeId: '7X1g5l6vJ_8',
        channel: 'DroneBot Workshop',
        duration: '11:20',
        category: 'Sensors',
        summary: 'Comprehensive tutorial on heating coils, SnO2 semiconductor physics, potentiometer threshold tuning, and analog calibration.',
        keyTakeaways: ['Heater draws ~150mA at 5V', 'Rs/Ro ratio matches specific gases like LPG vs Smoke', 'DO pin uses onboard LM393 comparator'],
      },
    ],
    simulation: {
      parameterLabel: 'Gas / Smoke Concentration Level',
      min: 0,
      max: 1000,
      unit: 'PPM',
      defaultValue: 80,
      outputFormulaText: 'V_out = 5.0 * (R_load / (R_sensor(PPM) + R_load))',
      step: 10,
      interpretValue: (val: number) => {
        const voltage = 0.4 + (val / 1000) * 4.2;
        const isHazardous = val >= 350;
        return {
          rawSignal: `ADC: ${(voltage * 204.6).toFixed(0)} / 1023 (AO = ${voltage.toFixed(2)}V)`,
          convertedValue: `${val} PPM Equivalent (${val < 150 ? 'Clean Air' : val < 350 ? 'Mild Smoke / Odor' : 'CRITICAL GAS LEAK'})`,
          status: isHazardous ? 'ALARM: EVACUATE & VENTILATE' : val > 150 ? 'Elevated Concentration' : 'Normal Clean Air',
          statusColor: isHazardous ? 'rose' : val > 150 ? 'amber' : 'emerald',
          technicalNote: `Sensor internal resistance Rs dropped to ${(20000 / (val + 10)).toFixed(0)} Ω. LM393 Digital Comparator DO Output: ${isHazardous ? 'LOW (Active Trigger)' : 'HIGH (Safe)'}.`,
        };
      },
    },
  },
  {
    id: 'mpu6050-gyro-accel',
    name: 'MPU-6050 6-Axis Gyroscope & Accelerometer Module',
    modelNumber: 'MPU-6050 (GY-521 Breakout)',
    category: 'Motion & Inertia',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    summary: '6-Degrees-of-Freedom motion tracking device combining a 3-axis MEMS accelerometer, 3-axis MEMS gyroscope, and Digital Motion Processor (DMP) communicating over I2C.',
    whatItMeasures: 'Linear acceleration along X, Y, Z axes (±2g, ±4g, ±8g, ±16g) and rotational angular velocity (±250°/s to ±2000°/s).',
    howItWorks: 'Uses microscopic silicon proof masses suspended on capacitive springs to detect gravitational acceleration and Coriolis forces for angular rotation. An onboard 16-bit ADC digitizes all 6 channels simultaneously.',
    specs: {
      operatingVoltage: '3.3V to 5.0V (GY-521 includes onboard 3.3V low-dropout voltage regulator)',
      currentConsumption: '3.8mA (gyro + accel active), 5μA (sleep mode)',
      measurementRange: 'Accel: ±2g, ±4g, ±8g, ±16g; Gyro: ±250, ±500, ±1000, ±2000 °/s',
      accuracy: '16-bit ADC resolution (65,536 quantization levels per channel)',
      outputType: 'I2C Serial Digital Bus (Standard 100kHz / Fast 400kHz)',
      responseSpeed: 'Programmable output rate up to 1000 Hz',
      interfacePinsCount: 8,
    },
    applications: [
      'Self-balancing two-wheeled robots',
      'Quadcopter & drone flight stabilization controllers',
      'Gesture-controlled gaming gloves & robotics',
      'Earthquake vibration and vehicle rollover detectors',
    ],
    pinoutGuide: [
      { pinNumber: 1, pinName: 'VCC', function: 'Power Supply Input', voltage: '3.3V - 5V', recommendedConnection: 'Connect to 3.3V or 5V (GY-521 has an onboard 662K 3.3V regulator)' },
      { pinNumber: 2, pinName: 'GND', function: 'Ground (0V)', voltage: '0V', recommendedConnection: 'Connect to common microcontroller ground' },
      { pinNumber: 3, pinName: 'SCL', function: 'I2C Serial Clock', voltage: '3.3V Logic', recommendedConnection: 'Connect to MCU I2C SCL (e.g. GPIO 22 on ESP32, A5 on Arduino Uno)' },
      { pinNumber: 4, pinName: 'SDA', function: 'I2C Serial Data', voltage: '3.3V Logic', recommendedConnection: 'Connect to MCU I2C SDA (e.g. GPIO 21 on ESP32, A4 on Arduino Uno)' },
      { pinNumber: 5, pinName: 'XDA / AUX_DA', function: 'Auxiliary I2C Data', voltage: '3.3V', recommendedConnection: 'Used to connect secondary external magnetometer (e.g. HMC5883L)' },
      { pinNumber: 6, pinName: 'XCL / AUX_CL', function: 'Auxiliary I2C Clock', voltage: '3.3V', recommendedConnection: 'Auxiliary I2C clock master line' },
      { pinNumber: 7, pinName: 'AD0', function: 'I2C Address Bit Selector', voltage: '0V or 3.3V', recommendedConnection: 'Tie to GND for I2C address 0x68; tie to 3.3V for address 0x69' },
      { pinNumber: 8, pinName: 'INT', function: 'Data Ready / Motion Interrupt', voltage: '3.3V Digital', recommendedConnection: 'Optional: Connect to MCU hardware interrupt pin for fast FIFO processing' },
    ],
    circuitDiagram: {
      microcontroller: 'ESP32 / Arduino Uno',
      wiringSteps: [
        { step: 1, fromComponentPin: 'VCC', toBoardPin: '3.3V (ESP32) or 5V (Arduino)', wireColor: 'Red', reason: 'Provides regulated power to MPU6050' },
        { step: 2, fromComponentPin: 'GND', toBoardPin: 'GND', wireColor: 'Black', reason: 'Ground reference' },
        { step: 3, fromComponentPin: 'SCL', toBoardPin: 'GPIO 22 (ESP32) or A5 (Arduino Uno)', wireColor: 'Yellow', reason: 'I2C Clock line' },
        { step: 4, fromComponentPin: 'SDA', toBoardPin: 'GPIO 21 (ESP32) or A4 (Arduino Uno)', wireColor: 'Blue', reason: 'I2C Data line' },
      ],
      safetyNotes: [
        'Always ensure AD0 is pulled to GND or VCC so the I2C address does not float between 0x68 and 0x69.',
        'To prevent gyroscope drift over time, compute calibration offsets (averaging 500 samples at rest) during setup.',
      ],
    },
    codeExamples: [
      {
        platform: 'Arduino C++',
        title: 'Pitch and Roll Angle Calculation with Adafruit MPU6050 Library',
        librariesRequired: ['Adafruit MPU6050', 'Adafruit Unified Sensor', 'Wire.h'],
        code: `#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;

void setup(void) {
  Serial.begin(115200);
  Wire.begin();

  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip! Check I2C wiring (SDA/SCL) and AD0 pin.");
    while (1) { delay(10); }
  }

  Serial.println("MPU6050 Found and Initialized!");
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Compute Pitch & Roll tilt angles in degrees
  float pitch = atan2(a.acceleration.y, sqrt(a.acceleration.x * a.acceleration.x + a.acceleration.z * a.acceleration.z)) * 180.0 / PI;
  float roll = atan2(-a.acceleration.x, a.acceleration.z) * 180.0 / PI;

  Serial.print("Pitch: ");
  Serial.print(pitch, 1);
  Serial.print("° | Roll: ");
  Serial.print(roll, 1);
  Serial.print("° | Gyro Z: ");
  Serial.print(g.gyro.z, 2);
  Serial.println(" rad/s");

  delay(100);
}`,
        explanation: 'Initializes the I2C hardware bus at address 0x68, configures digital low-pass filtering at 21Hz, and applies trigonometric atan2 formulas to compute real-time pitch and roll tilt angles.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Relying solely on integrated gyroscope values without accelerometer fusion (Complementary / Kalman filter)',
        consequence: 'Small numerical errors accumulate over seconds, resulting in severe angle drift.',
        fix: 'Fuse high-speed gyro responsiveness with low-frequency gravity vector tilt using a Complementary Filter: Angle = 0.98*(Angle + Gyro*dt) + 0.02*AccelAngle.',
      },
    ],
    troubleshootingGuide: [
      {
        symptom: 'I2C error: "Device not found at 0x68"',
        probableCause: 'AD0 is floating or pulled HIGH to 3.3V (switching address to 0x69) or SDA/SCL lines reversed.',
        stepToFix: 'Run an I2C scanner sketch to confirm device address (0x68 or 0x69) and verify SDA/SCL pin assignments.',
      },
    ],
    miniProjects: [
      {
        title: 'Two-Wheeled PID Self-Balancing Inverted Pendulum Robot',
        difficulty: 'Advanced',
        description: 'Uses MPU6050 fused angles running at 100Hz PID loop to drive high-speed stepper or DC motors to keep the chassis upright.',
        keyComponents: ['MPU-6050', 'ESP32 / Arduino Nano', '2x NEMA 17 Stepper Motors', 'A4988 Drivers'],
      },
    ],
    videos: [
      {
        id: 'v-mpu6050-1',
        title: 'MPU6050 6-Axis Sensor & Kalman Filtering Guide',
        youtubeId: '7X1g5l6vJ_8',
        channel: 'Curio / Phil\'s Lab',
        duration: '14:30',
        category: 'Sensors',
        summary: 'Mathematical explanation of Coriolis acceleration, MEMS vibratory rings, I2C register maps, and complementary filtering.',
        keyTakeaways: ['Gyros drift; Accelerometers are noisy with vibration', 'Complementary filter fuses both for rock-solid tilt tracking', 'Default I2C address is 0x68 with AD0=GND'],
      },
    ],
    simulation: {
      parameterLabel: 'Chassis Tilt Angle (Pitch)',
      min: -90,
      max: 90,
      unit: 'Degrees (°)',
      defaultValue: 15,
      outputFormulaText: 'A_y = g * sin(θ) | A_z = g * cos(θ)',
      step: 1,
      interpretValue: (val: number) => {
        const rad = (val * Math.PI) / 180;
        const ay = 9.81 * Math.sin(rad);
        const az = 9.81 * Math.cos(rad);
        const isTilted = Math.abs(val) > 45;
        return {
          rawSignal: `Accel Y: ${ay.toFixed(2)} m/s² | Accel Z: ${az.toFixed(2)} m/s²`,
          convertedValue: `Calculated Pitch: ${val.toFixed(1)}° (${val > 0 ? 'Forward Tilt' : val < 0 ? 'Backward Tilt' : 'Level Flat'})`,
          status: isTilted ? 'Excessive Tilt / Rollover Hazard' : Math.abs(val) < 5 ? 'Perfect Balance (Level)' : 'Stable Incline',
          statusColor: isTilted ? 'rose' : Math.abs(val) < 5 ? 'emerald' : 'blue',
          technicalNote: `16-bit Registers: ACCEL_YOUT=0x${Math.round(ay * 8192).toString(16)} | ACCEL_ZOUT=0x${Math.round(az * 8192).toString(16)}. Filtered angle computed.`,
        };
      },
    },
  },
  {
    id: 'ldr-photoresistor',
    name: 'LDR Photoresistor & Light Intensity Sensor',
    modelNumber: 'GL5528 5mm LDR',
    category: 'Optical & Light',
    heroImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    summary: 'Cadmium Sulfide (CdS) photoconductive optical sensor whose electrical resistance decreases non-linearly with increasing ambient light intensity (Lux).',
    whatItMeasures: 'Ambient illuminance from dark night (<1 Lux, ~1 MΩ) to bright direct sunlight (>10,000 Lux, ~100 Ω).',
    howItWorks: 'Photons with energy greater than the bandgap strike the CdS semiconductor substrate, exciting valence electrons into the conduction band and drastically increasing conductivity.',
    specs: {
      operatingVoltage: '0V to 30V DC (Passive variable resistor)',
      currentConsumption: '<1mA (Determined by series divider resistor)',
      measurementRange: '1 Lux to 10,000+ Lux',
      accuracy: 'Spectral response peak at 540nm (Closely matches human eye vision)',
      outputType: 'Analog Resistance (Used in a voltage divider to create 0–VCC analog output)',
      responseSpeed: 'Response time: 20ms–30ms',
      interfacePinsCount: 2,
    },
    applications: [
      'Automatic solar street lights that switch on at dusk',
      'Display backlight auto-brightness adjustment',
      'Laser tripwire security alarm systems',
      'Solar panel dual-axis sun tracker mechanisms',
    ],
    pinoutGuide: [
      { pinNumber: 1, pinName: 'Terminal 1', function: 'Resistor Leg 1 (Non-polarized)', voltage: 'Connected to VCC (3.3V or 5V)', recommendedConnection: 'Connect to 3.3V / 5V rail' },
      { pinNumber: 2, pinName: 'Terminal 2', function: 'Resistor Leg 2 (Divider Node)', voltage: 'Analog Voltage (0V–VCC)', recommendedConnection: 'Connect to MCU ADC Pin and connect a 10kΩ resistor from this node to GND' },
    ],
    circuitDiagram: {
      microcontroller: 'ESP32 / Arduino Uno',
      wiringSteps: [
        { step: 1, fromComponentPin: 'LDR Leg 1', toBoardPin: '5V / 3.3V', wireColor: 'Red', reason: 'Supplies voltage to divider' },
        { step: 2, fromComponentPin: 'LDR Leg 2', toBoardPin: 'A0 (or GPIO 34)', wireColor: 'Yellow', reason: 'Analog voltage tap between LDR and 10kΩ resistor' },
        { step: 3, fromComponentPin: 'LDR Leg 2', toBoardPin: 'GND through 10kΩ Resistor', wireColor: 'Black', reason: 'Fixed bottom resistor of voltage divider' },
      ],
      safetyNotes: [
        'An LDR is a passive 2-terminal resistor and is NOT polarized—it can be inserted into the circuit in either direction.',
      ],
    },
    codeExamples: [
      {
        platform: 'Arduino C++',
        title: 'Automatic Night Lamp Controller',
        librariesRequired: ['None'],
        code: `const int ldrPin = A0;
const int relayPin = 7;
const int NIGHT_THRESHOLD = 300; // Calibrate for room darkness

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
}

void loop() {
  int lightLevel = analogRead(ldrPin);
  Serial.print("Ambient Light Level: ");
  Serial.println(lightLevel);

  if (lightLevel < NIGHT_THRESHOLD) {
    Serial.println("Night Detected -> Turning Lamp ON");
    digitalWrite(relayPin, HIGH);
  } else {
    digitalWrite(relayPin, LOW);
  }

  delay(200);
}`,
        explanation: 'Reads analog voltage from divider node. When ambient light drops below threshold, triggers relay to turn on night light.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Connecting the LDR directly between VCC and ADC pin without a fixed reference resistor (e.g. 10kΩ)',
        consequence: 'ADC reads solid 5V regardless of light level because there is no voltage divider ratio.',
        fix: 'Always build a 2-resistor voltage divider: Vout = VCC * (R_fixed / (R_LDR + R_fixed)).',
      },
    ],
    troubleshootingGuide: [
      {
        symptom: 'Analog reading does not change when shining a flashlight on LDR',
        probableCause: 'Loose connection or short circuit around the 10kΩ divider resistor.',
        stepToFix: 'Measure the resistance of the LDR with a multimeter while covering it with your thumb to confirm resistance changes from 1kΩ to >100kΩ.',
      },
    ],
    miniProjects: [
      {
        title: 'Dual-Axis Solar Tracker with 4 LDRs and 2 Servos',
        difficulty: 'Intermediate',
        description: 'Compares light intensity across top/bottom and left/right LDR pairs to rotate a solar panel perpendicular to sunlight for 35% higher energy harvest.',
        keyComponents: ['4x LDRs', '2x SG90 Micro Servos', 'Arduino Uno', 'Mini Solar Panel'],
      },
    ],
    videos: [
      {
        id: 'v-ldr-1',
        title: 'LDR Photoresistor & Voltage Divider Circuit Explained',
        youtubeId: 'bA455gKxJ24',
        channel: 'Afrotechmods',
        duration: '5:10',
        category: 'Sensors',
        summary: 'Crystal clear tutorial on Cadmium Sulfide photoresistors, Ohm\'s law in voltage dividers, and hysteresis to prevent lamp flickering.',
        keyTakeaways: ['Light increases electron-hole pairs', 'More light = lower resistance = higher voltage across bottom resistor'],
      },
    ],
    simulation: {
      parameterLabel: 'Ambient Light Level (Illuminance)',
      min: 1,
      max: 1000,
      unit: 'Lux',
      defaultValue: 350,
      outputFormulaText: 'R_LDR = 500 / Lux_kΩ | V_out = 5.0 * (10k / (R_LDR + 10k))',
      step: 10,
      interpretValue: (val: number) => {
        const rLdrKohm = Math.max(0.1, 500 / val);
        const vOut = 5.0 * (10 / (rLdrKohm + 10));
        const isNight = val < 50;
        return {
          rawSignal: `LDR Resistance: ${rLdrKohm > 1 ? rLdrKohm.toFixed(1) + ' kΩ' : (rLdrKohm * 1000).toFixed(0) + ' Ω'} (V_out: ${vOut.toFixed(2)}V)`,
          convertedValue: `${val} Lux (${isNight ? 'Dark Night / Shaded' : val > 500 ? 'Direct Sunlight / Bright Lab' : 'Indoor Office Light'})`,
          status: isNight ? 'Streetlight Relay Triggered (ON)' : 'Daytime Mode (Lamp OFF)',
          statusColor: isNight ? 'amber' : 'emerald',
          technicalNote: `ADC Input Node: ${(vOut * 204.6).toFixed(0)}/1023. Daylight hysteresis threshold satisfied.`,
        };
      },
    },
  },
];
