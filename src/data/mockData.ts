import { Product, Project, CommunityPost } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-esp32',
    name: 'ESP32 Wi-Fi + Bluetooth Dev Module',
    category: 'Microcontrollers',
    price: 350,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: 'Dual-core Tensilica LX6 240MHz processor with integrated Wi-Fi and BLE 4.2. Standard board for smart IoT projects.',
    inStock: true,
    isPopular: true,
    specs: {
      'CPU': 'Dual-core LX6 240MHz',
      'Wireless': 'Wi-Fi 802.11 b/g/n & Bluetooth 4.2',
      'Operating Voltage': '3.3V',
      'SRAM': '520 KB',
      'Flash Memory': '4 MB'
    },
    pinout: ['3V3', 'GND', 'GPIO36 (VP)', 'GPIO39 (VN)', 'GPIO34', 'GPIO35', 'GPIO32', 'GPIO33', 'GPIO25', 'GPIO26', 'GPIO27', 'GPIO14', 'GPIO12', 'GPIO13', 'GND', 'VIN (5V)'],
    detailGuide: {
      whyDoINeedThis: 'The ESP32 acts as the main brain and internet gateway for modern IoT projects. It executes your code and transmits sensor data over Wi-Fi.',
      howDoesItWork: 'It contains micro-transistors running dual 32-bit CPU cores along with an integrated 2.4GHz radio antenna that packages data into standard TCP/IP packets.',
      whatIfIDontUseIt: 'Without a Wi-Fi microcontroller like ESP32, your project will be strictly offline. You would need an external Wi-Fi shield or stick to offline Arduino boards.',
      realLifeApplications: [
        'Smart home hubs and Matter/HomeKit automation controllers',
        'Industrial remote monitoring nodes and asset trackers',
        'Wireless weather stations uploading telemetry to cloud dashboards'
      ],
      alternativeComponents: ['ESP8266 NodeMCU (Cheaper, ₹210)', 'Raspberry Pi Pico W (₹450)']
    }
  },
  {
    id: 'prod-esp8266',
    name: 'ESP8266 NodeMCU V3 Wi-Fi Board',
    category: 'Microcontrollers',
    price: 210,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80',
    description: 'Single-core 80MHz Wi-Fi microcontroller. Budget-friendly alternative to ESP32 for simpler cloud logging.',
    inStock: true,
    specs: {
      'CPU': 'LX106 80MHz',
      'Wireless': 'Wi-Fi 802.11 b/g/n',
      'Operating Voltage': '3.3V',
      'Flash': '4 MB'
    },
    detailGuide: {
      whyDoINeedThis: 'An ultra-budget Wi-Fi microcontroller ideal for basic IoT telemetry when ESP32 dual cores are not required.',
      howDoesItWork: 'Executes single-threaded microcontroller code while managing Wi-Fi stack in background interrupts.',
      whatIfIDontUseIt: 'You can upgrade to ESP32 for Bluetooth support and additional GPIO pins.',
      realLifeApplications: ['Smart Wi-Fi plugs', 'Basic cloud temperature loggers'],
      alternativeComponents: ['ESP32 (₹350)', 'Arduino Nano + ESP-01 (₹300)']
    }
  },
  {
    id: 'prod-mq2',
    name: 'MQ-2 Smoke & Combustible Gas Sensor',
    category: 'Sensors',
    price: 180,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    description: 'Senses LPG, Smoke, Alcohol, Propane, Hydrogen, Methane and Carbon Monoxide concentrations in ambient air.',
    inStock: true,
    isPopular: true,
    specs: {
      'Target Gases': 'LPG, Smoke, Methane, Alcohol',
      'Operating Voltage': '5V DC',
      'Output Type': 'Analog (A0) & Digital (D0 threshold)',
      'Preheat Time': '20 seconds'
    },
    pinout: ['VCC (5V)', 'GND', 'D0 (Digital Out)', 'A0 (Analog Out)'],
    detailGuide: {
      whyDoINeedThis: 'Detects smoke particles and hazardous gas leaks before fire breaks out, providing analog ppm measurements.',
      howDoesItWork: 'Inside is a SnO2 (Tin Dioxide) semiconductor layer heated by an internal coil. Clean air has high electrical resistance. When gas molecules adsorb onto SnO2, conductivity increases, producing higher output voltage.',
      whatIfIDontUseIt: 'Your system cannot sense smoke or gas leaks automatically.',
      realLifeApplications: [
        'Home fire alarms and kitchen safety monitors',
        'Industrial boiler leak detection systems',
        'Smart kitchen gas cutoff valves'
      ],
      alternativeComponents: ['MQ-135 Air Quality Sensor (₹190)', 'MQ-7 CO Sensor (₹200)']
    }
  },
  {
    id: 'prod-dht11',
    name: 'DHT11 Temperature & Humidity Sensor',
    category: 'Sensors',
    price: 120,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    description: 'Calibrated digital output sensor module measuring ambient temperature (0-50°C) and relative humidity (20-90%).',
    inStock: true,
    specs: {
      'Temperature Range': '0 to 50°C (±2°C accuracy)',
      'Humidity Range': '20 to 90% RH (±5% accuracy)',
      'Sampling Rate': '1 Hz (1 reading/sec)',
      'Operating Voltage': '3.3V - 5V'
    },
    detailGuide: {
      whyDoINeedThis: 'Provides reliable climate monitoring for weather stations, HVAC systems, and greenhouse controllers.',
      howDoesItWork: 'Uses a capacitive humidity sensing element and a thermistor (NTC resistor) coupled with an onboard 8-bit microcontroller that outputs a single-wire digital data stream.',
      whatIfIDontUseIt: 'You will lack temperature and humidity telemetry.',
      realLifeApplications: ['Automated climate control in greenhouses', 'Cold storage warehouse monitoring', 'Personal desktop weather displays'],
      alternativeComponents: ['DHT22 High Precision (₹280)', 'BME280 Pressure+Temp+Humidity (₹320)']
    }
  },
  {
    id: 'prod-nano',
    name: 'Arduino Nano V3.0 ATmega328P',
    category: 'Microcontrollers',
    price: 240,
    image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=600&q=80',
    description: 'Compact breadboard-friendly microcontroller with 14 digital I/O pins and 8 analog inputs.',
    inStock: true,
    isPopular: true,
    specs: {
      'Microcontroller': 'ATmega328P',
      'Clock Speed': '16 MHz',
      'Digital I/O': '14 (6 PWM outputs)',
      'Analog Inputs': '8',
      'Flash Memory': '32 KB'
    },
    detailGuide: {
      whyDoINeedThis: 'A rock-solid 5V microcontroller that is extremely reliable for non-Wi-Fi standalone electronics projects.',
      howDoesItWork: 'Runs compiled C/C++ bytecodes directly on an 8-bit AVR architecture chip.',
      whatIfIDontUseIt: 'You would use Arduino Uno or ESP32 instead.',
      realLifeApplications: ['Robotic motor controllers', 'Custom USB gamepads', 'Automated water level switches'],
      alternativeComponents: ['Arduino Uno R3 (₹420)', 'Arduino Pro Mini (₹180)']
    }
  },
  {
    id: 'prod-servo',
    name: 'SG90 Micro Servo Motor 9g',
    category: 'Actuators',
    price: 90,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    description: '180-degree rotation micro servo with high output power and lightweight construction.',
    inStock: true,
    specs: {
      'Operating Voltage': '4.8V to 6.0V',
      'Stall Torque': '1.8 kg/cm',
      'Rotation Range': '180 degrees',
      'Weight': '9 grams'
    },
    detailGuide: {
      whyDoINeedThis: 'Allows precise angular positioning control (0° to 180°) for physical mechanical movement.',
      howDoesItWork: 'Contains a tiny DC motor, gear reduction box, potentiometer position sensor, and internal control circuit that responds to Pulse Width Modulation (PWM) signals.',
      whatIfIDontUseIt: 'You will not be able to physically open valves, turn solar panels, or actuate robotic arms.',
      realLifeApplications: ['Smart door lock deadbolts', 'Solar panel tracking mounts', 'Robotic gripper arms'],
      alternativeComponents: ['MG996R Metal Gear Servo (₹290)']
    }
  },
  {
    id: 'prod-oled',
    name: '0.96 inch I2C OLED Display (128x64)',
    category: 'Displays',
    price: 220,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'High contrast blue/white self-luminous OLED screen with SSD1306 driver chip over 2-wire I2C interface.',
    inStock: true,
    isPopular: true,
    specs: {
      'Resolution': '128 x 64 pixels',
      'Driver IC': 'SSD1306',
      'Interface': 'I2C (Address 0x3C or 0x3D)',
      'Operating Voltage': '3.3V - 5V'
    },
    detailGuide: {
      whyDoINeedThis: 'Displays live telemetry, menus, graphs, and warning icons directly on your project without needing a computer screen.',
      howDoesItWork: 'Organic LEDs emit light individually when voltage is applied to pixel coordinates. Communicates using I2C clock (SCL) and data (SDA) lines.',
      whatIfIDontUseIt: 'You can use serial monitor over USB or 16x2 character LCD display.',
      realLifeApplications: ['Wearable fitness monitors', 'Portable medical meters', 'Smart watch dashboards'],
      alternativeComponents: ['16x2 LCD with I2C (₹190)', '0.96 inch SPI Display (₹210)']
    }
  },
  {
    id: 'prod-ultrasonic',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensors',
    price: 95,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: 'Non-contact distance measurement module providing 2cm to 400cm measurement with high accuracy.',
    inStock: true,
    specs: {
      'Range': '2cm to 400cm',
      'Accuracy': '3mm',
      'Trigger Input': '10us TTL pulse',
      'Echo Output': 'TTL high pulse proportional to distance'
    },
    detailGuide: {
      whyDoINeedThis: 'Measures distance to objects in centimeters by emitting high-frequency sound waves and timing the echo.',
      howDoesItWork: 'Sends a 40kHz ultrasound burst. When sound bounces off an obstacle and hits the receiver transducer, the Echo pin goes HIGH. Distance = (Time HIGH * Speed of Sound) / 2.',
      whatIfIDontUseIt: 'Your project cannot sense distance or liquid level height non-contact.',
      realLifeApplications: ['Automotive reversing sensors', 'Robotic obstacle avoidance', 'Water tank depth monitors'],
      alternativeComponents: ['VL53L0X Laser ToF Sensor (₹260)']
    }
  },
  {
    id: 'prod-breadboard',
    name: 'Solderless Breadboard 830 Points',
    category: 'Power & Accessories',
    price: 120,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80',
    description: 'Reusable solderless prototyping board with 630 tie-point IC circuit area plus two 100 tie-point power rails.',
    inStock: true,
    specs: {
      'Tie Points': '830',
      'Wire Gauge': '21-26 AWG',
      'Bus Strips': '4 power distribution rails'
    },
    detailGuide: {
      whyDoINeedThis: 'Essential tool for plugging in components and jumper wires without soldering.',
      howDoesItWork: 'Contains metal spring clips beneath plastic holes that connect columns of 5 pins together.',
      whatIfIDontUseIt: 'You would have to solder components directly onto a PCB.',
      realLifeApplications: ['Rapid hardware prototyping in R&D labs', 'University electronics experiments'],
      alternativeComponents: ['Mini 400 Tie Point Breadboard (₹70)']
    }
  },
  {
    id: 'prod-jumpers',
    name: 'Male-to-Female Jumper Wires Pack (40 Pcs)',
    category: 'Power & Accessories',
    price: 80,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: '20cm rainbow ribbon jumper cables with standard 2.54mm pitch connectors.',
    inStock: true,
    specs: {
      'Count': '40 Cables',
      'Length': '20cm',
      'Pitch': '2.54mm pin headers'
    },
    detailGuide: {
      whyDoINeedThis: 'Connects sensors, modules, displays, and microcontrollers cleanly on breadboards.',
      howDoesItWork: 'Flexible stranded copper wire insulated with color PVC.',
      whatIfIDontUseIt: 'You cannot wire sensors to board headers without soldering wires.',
      realLifeApplications: ['Breadboard circuits', 'Test benches'],
      alternativeComponents: ['Male-to-Male Wire Pack (₹80)', 'Female-to-Female Wire Pack (₹80)']
    }
  },
  {
    id: 'prod-relay',
    name: '5V Relay Module 1-Channel Optocoupler',
    category: 'Actuators',
    price: 65,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    description: 'Allows 5V microcontroller logic to safely switch high-voltage AC appliances (up to 250V AC 10A).',
    inStock: true,
    specs: {
      'Max Voltage': '250V AC / 30V DC',
      'Max Current': '10A',
      'Isolation': 'Optocoupler optical isolation'
    },
    detailGuide: {
      whyDoINeedThis: 'Acts as an electrically operated switch enabling a low-power microcontroller to switch high-power AC loads like lamps or pumps.',
      howDoesItWork: 'An internal electromagnet pulls a mechanical armature when current flows through its coil, physically bridging high voltage contacts.',
      whatIfIDontUseIt: 'You cannot safely control 230V household appliances or heavy motors directly.',
      realLifeApplications: ['Smart home light switches', 'Automatic AC water pump starters', 'Industrial machine interlocks'],
      alternativeComponents: ['Solid State Relay SSR (₹280)', 'MOSFET Transistor Switch (₹45)']
    }
  },
  {
    id: 'prod-ldr',
    name: 'LDR Light Dependent Resistor Module',
    category: 'Sensors',
    price: 50,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    description: 'Photoresistor sensor module that decreases resistance as ambient light intensity increases.',
    inStock: true,
    specs: {
      'Light Resistance': '10k - 20k Ohm',
      'Dark Resistance': '1M Ohm',
      'Spectral Peak': '540nm'
    },
    detailGuide: {
      whyDoINeedThis: 'Measures sunlight or indoor light levels to trigger dark-activated night lights or solar trackers.',
      howDoesItWork: 'Made from Cadmium Sulfide (CdS). Photons hit the semiconductor, freeing electrons and reducing electrical resistance.',
      whatIfIDontUseIt: 'You cannot detect day/night transitions or ambient light levels.',
      realLifeApplications: ['Automatic street lights', 'Solar tracker panels', 'Camera exposure meters'],
      alternativeComponents: ['BH1750 Digital Lux Sensor (₹140)']
    }
  },
  {
    id: 'prod-lcd1602',
    name: '16x2 Character LCD Module with I2C Backpack',
    category: 'Displays',
    price: 190,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: '16 column by 2 row character LCD with pre-soldered PCF8574 I2C adapter board requiring only 4 wires.',
    inStock: true,
    specs: {
      'Display Lines': '2 lines x 16 characters',
      'I2C Address': '0x27 or 0x3F',
      'Backlight': 'Yellow-Green / Blue LED'
    },
    detailGuide: {
      whyDoINeedThis: 'Robust alphanumeric character screen for indoor and outdoor display readings.',
      howDoesItWork: 'HD44780 parallel controller managed via PCF8574 I2C port expander chip.',
      whatIfIDontUseIt: 'You can swap for 0.96 inch OLED display.',
      realLifeApplications: ['Vending machines', 'Token queues', 'Industrial monitoring panels'],
      alternativeComponents: ['0.96 inch OLED (₹220)', '20x4 Character LCD (₹340)']
    }
  },
  {
    id: 'prod-soil',
    name: 'Capacitive Soil Moisture Sensor V1.2',
    category: 'Sensors',
    price: 110,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    description: 'Corrosion-resistant capacitive moisture sensor providing analog voltage proportional to soil water content.',
    inStock: true,
    specs: {
      'Technology': 'Capacitive (does not corrode like resistive probes)',
      'Operating Voltage': '3.3V - 5.5V',
      'Output Voltage': '1.2V - 2.5V Analog'
    },
    detailGuide: {
      whyDoINeedThis: 'Measures moisture in soil to automatically trigger plant irrigation pumps without rusting inside wet soil.',
      howDoesItWork: 'Uses dielectric permittivity measurement. Soil dielectric constant increases with moisture, altering onboard timer capacitance frequency.',
      whatIfIDontUseIt: 'You cannot measure soil dampness accurately.',
      realLifeApplications: ['Smart agriculture pivot irrigation', 'Automatic indoor potted plant waterer'],
      alternativeComponents: ['Resistive Soil Probe (₹60, lower lifespan)']
    }
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-smoke-detector',
    title: 'Smart Smoke & Gas Leakage Alarm with Cloud Alerts',
    subtitle: 'Build an early fire & LPG gas hazard detector using MQ-2 and ESP32 with OLED visual warnings.',
    difficulty: 'Beginner',
    estimatedHours: 2,
    estimatedBudget: 870,
    domain: 'Sensors',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'This foundational safety project teaches you how to sample gas concentrations in air, calculate threshold PPM levels, output acoustic buzzer alarms, and render warnings on an OLED screen.',
    learningObjectives: [
      'Understand semiconductor gas sensor heating & SnO2 resistance change',
      'Read analog voltage values and convert them to calibrated gas PPM',
      'Program interrupt-based buzzer alarms and threshold state machines',
      'Interface I2C SSD1306 OLED displays using Adafruit libraries'
    ],
    bom: [
      { productId: 'prod-esp32', quantity: 1, alternativeProductId: 'prod-nano' },
      { productId: 'prod-mq2', quantity: 1 },
      { productId: 'prod-oled', quantity: 1, alternativeProductId: 'prod-lcd1602' },
      { productId: 'prod-breadboard', quantity: 1 },
      { productId: 'prod-jumpers', quantity: 1 }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which chemical compound forms the main sensing element inside an MQ-2 smoke sensor?',
        options: ['Tin Dioxide (SnO2)', 'Silicon Oxide (SiO2)', 'Copper Sulfate', 'Aluminum Oxide'],
        correctIndex: 0,
        explanation: 'MQ-2 sensors use Tin Dioxide (SnO2), a semiconductor that drops in resistance when exposed to combustible gases or smoke molecules.'
      },
      {
        id: 'q2',
        question: 'Why does the MQ-2 sensor require a 20-30 second preheat time on power-up?',
        options: [
          'To charge internal battery capacitors',
          'To heat the SnO2 semiconductor element to its working thermal equilibrium',
          'To pair with Wi-Fi network',
          'To format the flash memory'
        ],
        correctIndex: 1,
        explanation: 'An internal micro-heater heats SnO2 to around 200°C so adsorbed gas molecules react properly with oxygen ions.'
      },
      {
        id: 'q3',
        question: 'If the analog pin reads a high voltage near 3.3V on the MQ-2 module, what does it indicate?',
        options: ['Clean pure air', 'High concentration of smoke or gas detected', 'Low battery voltage', 'Broken sensor wire'],
        correctIndex: 1,
        explanation: 'Higher gas concentration reduces SnO2 resistance, increasing the output voltage from the voltage divider circuit.'
      }
    ],
    pinoutTable: [
      { componentName: 'MQ-2 Gas Sensor', componentPin: 'VCC', boardPin: 'VIN (5V)', wireColor: 'Red', note: 'Requires 5V for internal heater' },
      { componentName: 'MQ-2 Gas Sensor', componentPin: 'GND', boardPin: 'GND', wireColor: 'Black' },
      { componentName: 'MQ-2 Gas Sensor', componentPin: 'A0', boardPin: 'GPIO 34', wireColor: 'Yellow', note: 'Analog input pin' },
      { componentName: 'OLED Display 0.96"', componentPin: 'VCC', boardPin: '3V3', wireColor: 'Red' },
      { componentName: 'OLED Display 0.96"', componentPin: 'GND', boardPin: 'GND', wireColor: 'Black' },
      { componentName: 'OLED Display 0.96"', componentPin: 'SCL', boardPin: 'GPIO 22', wireColor: 'Blue', note: 'I2C Clock' },
      { componentName: 'OLED Display 0.96"', componentPin: 'SDA', boardPin: 'GPIO 21', wireColor: 'Green', note: 'I2C Data' }
    ],
    codeSnippet: {
      language: 'cpp',
      filename: 'SmokeDetector_Inception.ino',
      code: `// Inception AI - Smart Smoke & Gas Alarm
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define MQ2_ANALOG_PIN 34
#define BUZZER_PIN 25
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
const int SMOKE_THRESHOLD = 450; // Calibrated PPM ADC threshold

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 OLED allocation failed"));
    for(;;);
  }
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(10, 20);
  display.println("Inception Gas Monitor");
  display.println("Warming up MQ-2...");
  display.display();
  delay(3000);
}

void loop() {
  int sensorValue = analogRead(MQ2_ANALOG_PIN);
  Serial.print("MQ-2 Gas Reading: ");
  Serial.println(sensorValue);

  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.println("INCEPTION AIR MONITOR");
  display.println("---------------------");
  
  display.print("PPM Level: ");
  display.println(sensorValue);

  if (sensorValue > SMOKE_THRESHOLD) {
    display.setTextSize(2);
    display.setCursor(10, 40);
    display.println("!! DANGER !!");
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    display.setCursor(10, 40);
    display.println("Status: SAFE");
    digitalWrite(BUZZER_PIN, LOW);
  }
  
  display.display();
  delay(500);
}`,
      explanation: 'Reads analog pin 34 connected to the MQ-2 voltage divider. Compares against threshold 450. If exceeded, triggers physical buzzer pin 25 and displays OLED warning.'
    },
    simulationConfig: {
      inputs: [
        { id: 'smokePpm', label: 'Smoke / Gas Density (PPM)', min: 100, max: 1000, defaultValue: 250, unit: 'PPM' }
      ],
      outputs: [
        { id: 'oledDisplay', label: 'OLED Display (128x64)', type: 'display', activeConditionText: 'SAFE (PPM < 450)' },
        { id: 'buzzerAlert', label: 'Acoustic Alarm Buzzer', type: 'buzzer', activeConditionText: 'OFF' },
        { id: 'statusLed', label: 'Safety LED Indicator', type: 'led', activeConditionText: 'GREEN (Normal Air)' }
      ],
      initialLogs: [
        '[BOOT] Inception Gas Monitor initializing...',
        '[SENSOR] MQ-2 snO2 element preheating...',
        '[STATUS] Air status: SAFE (Reading 250 PPM)'
      ],
      simulationCode: (inputs) => {
        const ppm = inputs.smokePpm || 250;
        const isHazard = ppm > 450;
        return {
          outputsState: {
            oledDisplay: isHazard ? '⚠️ SMOKE DETECTED! PPM: ' + ppm : 'SAFE - PPM: ' + ppm,
            buzzerAlert: isHazard,
            statusLed: isHazard ? 'RED_ALERT' : 'GREEN_SAFE'
          },
          logMessage: isHazard
            ? `[ALERT] Smoke level ${ppm} PPM exceeded 450 PPM threshold! Buzzer triggered.`
            : `[NORMAL] Gas level ${ppm} PPM is within safe limits.`
        };
      }
    },
    facultyApproved: true,
    instructorName: 'Dr. R. K. Sharma (Head of ECE)',
    eWasteScore: {
      reusablePercent: 90,
      recyclablePackaging: true,
      carbonFootprint: 'Low'
    }
  },
  {
    id: 'proj-plant-watering',
    title: 'Automated Smart Plant Watering & Irrigation System',
    subtitle: 'Never over-water plants again! Uses capacitive soil moisture sensor + relay pump + ESP32.',
    difficulty: 'Beginner',
    estimatedHours: 2.5,
    estimatedBudget: 725,
    domain: 'Automation',
    heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    description: 'Build an automated smart irrigation controller that monitors soil dampness and energizes a 5V water pump via a relay when soil moisture drops below 30%.',
    learningObjectives: [
      'Learn capacitive vs resistive soil moisture sensing principles',
      'Understand relay optocoupler switching logic and high-current isolation',
      'Code automatic hysteresis loops to prevent rapid pump toggling',
      'Calibrate sensor readings in dry soil vs water'
    ],
    bom: [
      { productId: 'prod-esp32', quantity: 1, alternativeProductId: 'prod-nano' },
      { productId: 'prod-soil', quantity: 1 },
      { productId: 'prod-relay', quantity: 1 },
      { productId: 'prod-breadboard', quantity: 1 },
      { productId: 'prod-jumpers', quantity: 1 }
    ],
    quiz: [
      {
        id: 'pq1',
        question: 'Why is a capacitive soil moisture sensor preferred over old resistive metallic probe sensors?',
        options: [
          'Capacitive sensors are cheaper to make',
          'Resistive probes suffer rapid metallic corrosion due to electrolysis in wet soil',
          'Resistive probes use too much Wi-Fi bandwidth',
          'Capacitive sensors require no microcontroller'
        ],
        correctIndex: 1,
        explanation: 'Direct current through metal soil probes causes electrolysis, rusting probes within weeks. Capacitive sensors have an insulated PCB layer with zero electrolysis.'
      },
      {
        id: 'pq2',
        question: 'What is the purpose of an optocoupler inside a relay module?',
        options: [
          'To generate light for plants',
          'To optically isolate low-voltage microcontroller logic from electrical spikes on the pump load',
          'To measure distance to water tank',
          'To step down 220V AC to 5V DC'
        ],
        correctIndex: 1,
        explanation: 'Optocouplers use an LED and phototransistor inside an IC to pass signal via light, preventing inductive voltage spikes from damaging microcontrollers.'
      }
    ],
    pinoutTable: [
      { componentName: 'Capacitive Soil Sensor', componentPin: 'VCC', boardPin: '3V3', wireColor: 'Red' },
      { componentName: 'Capacitive Soil Sensor', componentPin: 'GND', boardPin: 'GND', wireColor: 'Black' },
      { componentName: 'Capacitive Soil Sensor', componentPin: 'AOUT', boardPin: 'GPIO 32', wireColor: 'Yellow' },
      { componentName: 'Relay Module', componentPin: 'VCC', boardPin: 'VIN (5V)', wireColor: 'Red' },
      { componentName: 'Relay Module', componentPin: 'IN', boardPin: 'GPIO 26', wireColor: 'Blue' },
      { componentName: 'Relay Module', componentPin: 'GND', boardPin: 'GND', wireColor: 'Black' }
    ],
    codeSnippet: {
      language: 'cpp',
      filename: 'SmartWatering_Inception.ino',
      code: `// Inception AI - Smart Irrigation Controller
#define SOIL_PIN 32
#define RELAY_PIN 26

const int DRY_SOIL_ADC = 3100; // Sensor value in dry air
const int WET_SOIL_ADC = 1200; // Sensor value in water

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Relay OFF (Active LOW)
}

void loop() {
  int rawADC = analogRead(SOIL_PIN);
  int moisturePercent = map(rawADC, DRY_SOIL_ADC, WET_SOIL_ADC, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  Serial.print("Soil Moisture: ");
  Serial.print(moisturePercent);
  Serial.println("%");

  if (moisturePercent < 30) {
    Serial.println("Soil is Dry! Activating Water Pump...");
    digitalWrite(RELAY_PIN, LOW); // Relay ON
  } else if (moisturePercent > 65) {
    Serial.println("Soil Moisture Optimal. Stopping Pump.");
    digitalWrite(RELAY_PIN, HIGH); // Relay OFF
  }

  delay(2000);
}`,
      explanation: 'Maps raw capacitive sensor ADC to 0-100% moisture. When moisture drops below 30%, activates Relay (Pin 26 LOW). Stops pump when moisture reaches 65%.'
    },
    simulationConfig: {
      inputs: [
        { id: 'moistureLevel', label: 'Soil Moisture Level (%)', min: 0, max: 100, defaultValue: 20, unit: '%' }
      ],
      outputs: [
        { id: 'relayState', label: '5V Water Pump Relay', type: 'relay', activeConditionText: 'PUMP ENERGIZED' },
        { id: 'moistureStatus', label: 'Soil Hydration Indicator', type: 'led', activeConditionText: 'DRY SOIL (<30%)' }
      ],
      initialLogs: [
        '[SYSTEM] Irrigation System Active',
        '[READING] Soil Moisture: 20% (Dry)',
        '[ACTION] Relay ENERGIZED -> Water Pump ON'
      ],
      simulationCode: (inputs) => {
        const moisture = inputs.moistureLevel ?? 20;
        const isDry = moisture < 30;
        return {
          outputsState: {
            relayState: isDry,
            moistureStatus: isDry ? 'DRY_NEED_WATER' : 'HYDRATED'
          },
          logMessage: isDry
            ? `[IRRIGATION] Soil dry at ${moisture}%. Water pump relay ACTIVATED.`
            : `[IRRIGATION] Soil hydrated at ${moisture}%. Water pump OFF.`
        };
      }
    },
    facultyApproved: true,
    instructorName: 'Prof. Ananya Sen (Dept of Agri-Tech)',
    eWasteScore: {
      reusablePercent: 95,
      recyclablePackaging: true,
      carbonFootprint: 'Low'
    }
  },
  {
    id: 'proj-weather-station',
    title: 'IoT Weather Station with Real-time Cloud Telemetry',
    subtitle: 'Log temperature, humidity, and atmospheric data to IoT cloud dashboards using DHT11 & ESP32.',
    difficulty: 'Intermediate',
    estimatedHours: 4,
    estimatedBudget: 870,
    domain: 'IoT & Cloud',
    heroImage: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80',
    description: 'Build a fully connected weather node uploading live temperature and humidity metrics every 15 seconds to ThingSpeak / Blynk / Adafruit IO MQTT brokers.',
    learningObjectives: [
      'Master HTTP POST & MQTT protocol transmission from microcontrollers',
      'Read DHT11 single-wire digital pulse streams',
      'Format JSON payloads for cloud API endpoints',
      'Build desktop widget dashboards for remote monitoring'
    ],
    bom: [
      { productId: 'prod-esp32', quantity: 1, alternativeProductId: 'prod-esp8266' },
      { productId: 'prod-dht11', quantity: 1 },
      { productId: 'prod-oled', quantity: 1 },
      { productId: 'prod-breadboard', quantity: 1 },
      { productId: 'prod-jumpers', quantity: 1 }
    ],
    quiz: [
      {
        id: 'wq1',
        question: 'Which communication protocol is lightweight and widely used for IoT sensor node cloud telemetry?',
        options: ['MQTT (Message Queuing Telemetry Transport)', 'FTP', 'Telnet', 'POP3'],
        correctIndex: 0,
        explanation: 'MQTT is a pub/sub protocol with minimal packet headers, ideal for constrained battery-powered microcontrollers.'
      },
      {
        id: 'wq2',
        question: 'What is the maximum recommended sampling frequency for the DHT11 sensor?',
        options: ['1 Hz (once per second)', '100 Hz', '1 kHz', 'Once every 10 microseconds'],
        correctIndex: 0,
        explanation: 'The DHT11 requires at least 1 second between readings for internal humidity condensation recovery.'
      }
    ],
    pinoutTable: [
      { componentName: 'DHT11 Sensor', componentPin: 'VCC', boardPin: '3V3', wireColor: 'Red' },
      { componentName: 'DHT11 Sensor', componentPin: 'DATA', boardPin: 'GPIO 15', wireColor: 'Yellow' },
      { componentName: 'DHT11 Sensor', componentPin: 'GND', boardPin: 'GND', wireColor: 'Black' },
      { componentName: 'OLED Display', componentPin: 'SCL', boardPin: 'GPIO 22', wireColor: 'Blue' },
      { componentName: 'OLED Display', componentPin: 'SDA', boardPin: 'GPIO 21', wireColor: 'Green' }
    ],
    codeSnippet: {
      language: 'cpp',
      filename: 'IoTWeatherStation_Inception.ino',
      code: `// Inception AI - Cloud Weather Station
#include <WiFi.h>
#include <DHT.h>

#define DHTPIN 15
#define DHTTYPE DHT11

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASS";

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Connected! IP: " + WiFi.localIP().toString());
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.printf("Temp: %.1f°C | Humidity: %.1f%%\n", temp, hum);
  // Upload to Cloud API Endpoint...
  delay(15000); // 15 sec telemetry interval
}`,
      explanation: 'Connects ESP32 to local Wi-Fi, reads DHT11 temperature/humidity every 15s, prints to Serial and posts telemetry to IoT server.'
    },
    simulationConfig: {
      inputs: [
        { id: 'tempValue', label: 'Ambient Temperature (°C)', min: 10, max: 50, defaultValue: 28, unit: '°C' },
        { id: 'humidityValue', label: 'Relative Humidity (%)', min: 20, max: 95, defaultValue: 65, unit: '%' }
      ],
      outputs: [
        { id: 'cloudTelemetry', label: 'Cloud MQTT Log Stream', type: 'cloud_log', activeConditionText: 'CONNECTED TO BROKER' },
        { id: 'oledDisplay', label: 'Desktop OLED Screen', type: 'display', activeConditionText: 'DISPLAYING TEMP/HUM' }
      ],
      initialLogs: [
        '[WIFI] Connecting to campus Wi-Fi network...',
        '[CLOUD] MQTT Client ID: Inception_Node_01 connected',
        '[DATA] Published Payload: {"temp": 28.0, "hum": 65.0}'
      ],
      simulationCode: (inputs) => {
        const t = inputs.tempValue ?? 28;
        const h = inputs.humidityValue ?? 65;
        return {
          outputsState: {
            cloudTelemetry: `[MQTT ACK] Payload Sent: Temp ${t}°C | Humidity ${h}%`,
            oledDisplay: `TEMP: ${t}°C  HUM: ${h}%`
          },
          logMessage: `[TELEMETRY] Sensor node published T=${t}°C, H=${h}% to cloud MQTT server.`
        };
      }
    },
    facultyApproved: true,
    instructorName: 'Dr. V. N. Murthy',
    eWasteScore: {
      reusablePercent: 92,
      recyclablePackaging: true,
      carbonFootprint: 'Low'
    }
  },
  {
    id: 'proj-light-tracker',
    title: 'Light Intensity Meter & Automated Sun Tracker',
    subtitle: 'Measure ambient light with LDR and position a solar panel motor towards maximum brightness.',
    difficulty: 'Beginner',
    estimatedHours: 1.5,
    estimatedBudget: 320,
    domain: 'Sensors',
    heroImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    description: 'Learn servomotor position control and analog photoresistor feedback loops by building a single-axis solar tracking panel.',
    learningObjectives: [
      'Understand Light Dependent Resistor (LDR) divider networks',
      'Generate PWM signals to control SG90 servo angles',
      'Implement closed-loop proportional tracking algorithms'
    ],
    bom: [
      { productId: 'prod-nano', quantity: 1 },
      { productId: 'prod-ldr', quantity: 2 },
      { productId: 'prod-servo', quantity: 1 },
      { productId: 'prod-breadboard', quantity: 1 },
      { productId: 'prod-jumpers', quantity: 1 }
    ],
    quiz: [
      {
        id: 'lq1',
        question: 'What happens to the resistance of an LDR photoresistor when bright light shines on it?',
        options: ['Resistance drops significantly', 'Resistance increases to infinity', 'Resistance remains constant', 'Current converts to AC'],
        correctIndex: 0,
        explanation: 'Photons hit Cadmium Sulfide (CdS), liberating free valence electrons, which increases electrical conductivity and drops resistance.'
      }
    ],
    pinoutTable: [
      { componentName: 'LDR 1 (Left)', componentPin: 'Out', boardPin: 'A0', wireColor: 'Yellow' },
      { componentName: 'LDR 2 (Right)', componentPin: 'Out', boardPin: 'A1', wireColor: 'Orange' },
      { componentName: 'SG90 Servo', componentPin: 'Signal', boardPin: 'D9', wireColor: 'Orange' },
      { componentName: 'SG90 Servo', componentPin: 'VCC', boardPin: '5V', wireColor: 'Red' },
      { componentName: 'SG90 Servo', componentPin: 'GND', boardPin: 'GND', wireColor: 'Brown' }
    ],
    codeSnippet: {
      language: 'cpp',
      filename: 'SunTracker_Inception.ino',
      code: `// Inception AI - Single Axis Sun Tracker
#include <Servo.h>

Servo trackerServo;
int servoAngle = 90; // Start center

void setup() {
  Serial.begin(9600);
  trackerServo.attach(9);
  trackerServo.write(servoAngle);
}

void loop() {
  int ldrLeft = analogRead(A0);
  int ldrRight = analogRead(A1);

  int diff = ldrLeft - ldrRight;

  if (abs(diff) > 20) { // Tolerance band
    if (diff > 0 && servoAngle > 10) {
      servoAngle -= 2;
    } else if (diff < 0 && servoAngle < 170) {
      servoAngle += 2;
    }
    trackerServo.write(servoAngle);
  }
  delay(50);
}`,
      explanation: 'Compares analog values from left vs right LDR. Adjusts servo angle towards the side receiving brighter ambient light.'
    },
    simulationConfig: {
      inputs: [
        { id: 'leftLux', label: 'Left Light Level (Lux)', min: 10, max: 1000, defaultValue: 600, unit: 'Lux' },
        { id: 'rightLux', label: 'Right Light Level (Lux)', min: 10, max: 1000, defaultValue: 200, unit: 'Lux' }
      ],
      outputs: [
        { id: 'servoPosition', label: 'Servo Panel Angle (°)', type: 'servo', activeConditionText: 'TRACKING SUN' }
      ],
      initialLogs: [
        '[SERVO] Calibrating home position to 90°',
        '[TRACKER] Tracking differential light levels...'
      ],
      simulationCode: (inputs) => {
        const left = inputs.leftLux ?? 600;
        const right = inputs.rightLux ?? 200;
        const diff = left - right;
        let angle = 90;
        if (diff > 100) angle = 30;
        else if (diff < -100) angle = 150;
        else angle = 90;

        return {
          outputsState: {
            servoPosition: `${angle}° Angle`
          },
          logMessage: `[TRACKER] Left: ${left} Lux, Right: ${right} Lux. Adjusted servo arm to ${angle}°.`
        };
      }
    },
    facultyApproved: true,
    instructorName: 'Dr. R. K. Sharma',
    eWasteScore: {
      reusablePercent: 98,
      recyclablePackaging: true,
      carbonFootprint: 'Negligible'
    }
  },
  {
    id: 'proj-radar',
    title: 'Ultrasonic Radar & Object Position Tracker',
    subtitle: 'Sweep an ultrasonic distance sensor using a servo and map nearby objects on a radar screen.',
    difficulty: 'Intermediate',
    estimatedHours: 3.5,
    estimatedBudget: 680,
    domain: 'Robotics',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Build a miniature 180-degree rotating radar station using HC-SR04 ultrasonic distance sensor mounted on an SG90 servo motor.',
    learningObjectives: [
      'Understand pulse timing distance calculation in sound waves',
      'Coordinate rotational motor angles with ultrasonic ping measurements',
      'Stream Polar Coordinate vectors (Angle, Distance) over Serial port'
    ],
    bom: [
      { productId: 'prod-nano', quantity: 1 },
      { productId: 'prod-ultrasonic', quantity: 1 },
      { productId: 'prod-servo', quantity: 1 },
      { productId: 'prod-breadboard', quantity: 1 },
      { productId: 'prod-jumpers', quantity: 1 }
    ],
    quiz: [
      {
        id: 'rq1',
        question: 'What speed value is used to calculate distance from ultrasonic echo duration in air at room temperature?',
        options: ['~340 meters per second (0.034 cm/us)', '~300,000 km per second', '~1500 meters per second', '9.8 m/s^2'],
        correctIndex: 0,
        explanation: 'Sound travels at roughly 340 m/s in air. Distance = (microseconds * 0.034) / 2.'
      }
    ],
    pinoutTable: [
      { componentName: 'HC-SR04 Ultrasonic', componentPin: 'Trig', boardPin: 'D10', wireColor: 'Yellow' },
      { componentName: 'HC-SR04 Ultrasonic', componentPin: 'Echo', boardPin: 'D11', wireColor: 'Blue' },
      { componentName: 'SG90 Servo', componentPin: 'Signal', boardPin: 'D9', wireColor: 'Orange' }
    ],
    codeSnippet: {
      language: 'cpp',
      filename: 'UltrasonicRadar_Inception.ino',
      code: `// Inception AI - Ultrasonic Radar
#include <Servo.h>

#define TRIG_PIN 10
#define ECHO_PIN 11

Servo radarServo;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  radarServo.attach(9);
}

int getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  for (int angle = 15; angle <= 165; angle += 5) {
    radarServo.write(angle);
    delay(30);
    int dist = getDistance();
    Serial.print(angle);
    Serial.print(",");
    Serial.print(dist);
    Serial.println(".");
  }
}`,
      explanation: 'Sweeps servo from 15° to 165°. Measures ultrasonic bounce time to detect obstacle distance at every 5-degree step.'
    },
    simulationConfig: {
      inputs: [
        { id: 'obstacleDist', label: 'Obstacle Distance (cm)', min: 5, max: 200, defaultValue: 45, unit: 'cm' }
      ],
      outputs: [
        { id: 'radarSweep', label: 'Miniature Radar Display', type: 'display', activeConditionText: 'SWEEPING 15°-165°' }
      ],
      initialLogs: [
        '[RADAR] System initializing 180° sweep...',
        '[ECHO] Echo pulse calibrated at 0.034 cm/us'
      ],
      simulationCode: (inputs) => {
        const d = inputs.obstacleDist ?? 45;
        return {
          outputsState: {
            radarSweep: `TARGET DETECTED AT ${d} CM`
          },
          logMessage: `[RADAR] Echo ping received target at ${d} cm distance.`
        };
      }
    },
    facultyApproved: true,
    instructorName: 'Dr. V. N. Murthy',
    eWasteScore: {
      reusablePercent: 95,
      recyclablePackaging: true,
      carbonFootprint: 'Low'
    }
  },
  {
    id: 'proj-voice-automation',
    title: 'Voice-Controlled Home Automation Hub with Cloud MQTT',
    subtitle: 'Control home AC appliances via Google Assistant/Alexa or web interface using 4-channel relay & ESP32.',
    difficulty: 'Advanced',
    estimatedHours: 5,
    estimatedBudget: 1150,
    domain: 'IoT & Cloud',
    heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    description: 'Advanced smart home project interfacing ESP32 over MQTT web sockets to switch lights, fans, and appliances via voice commands.',
    learningObjectives: [
      'Configure Sinric Pro / Blynk Cloud voice integration hooks',
      'Manage multi-channel relay safety switching logic',
      'Program non-volatile EEPROM status memory on power loss'
    ],
    bom: [
      { productId: 'prod-esp32', quantity: 1 },
      { productId: 'prod-relay', quantity: 1 },
      { productId: 'prod-oled', quantity: 1 },
      { productId: 'prod-breadboard', quantity: 1 },
      { productId: 'prod-jumpers', quantity: 1 }
    ],
    quiz: [
      {
        id: 'vq1',
        question: 'How do cloud services like Sinric Pro or Blynk route voice commands from Google Assistant to an ESP32?',
        options: [
          'By using WebSockets/MQTT pub-sub topics linked to device API keys',
          'By sending FM radio signals',
          'By bluetooth pairing directly to the smart speaker',
          'By making telephone voice calls'
        ],
        correctIndex: 0,
        explanation: 'Cloud brokers maintain an open WebSocket/MQTT client connection with the ESP32. When Google Assistant fires an event, the broker pushes a JSON payload instantly.'
      }
    ],
    pinoutTable: [
      { componentName: 'Relay Module IN1', componentPin: 'IN1', boardPin: 'GPIO 26', wireColor: 'Yellow' },
      { componentName: 'Relay Module IN2', componentPin: 'IN2', boardPin: 'GPIO 27', wireColor: 'Blue' }
    ],
    codeSnippet: {
      language: 'cpp',
      filename: 'VoiceHub_Inception.ino',
      code: `// Inception AI - Voice Control Hub
#include <WiFi.h>

#define RELAY_1 26
#define RELAY_2 27

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_1, OUTPUT);
  pinMode(RELAY_2, OUTPUT);
  digitalWrite(RELAY_1, HIGH);
  digitalWrite(RELAY_2, HIGH);
  Serial.println("Inception Voice Automation Ready!");
}

void loop() {
  // Listen for WebSocket voice commands...
  delay(100);
}`,
      explanation: 'Initializes multi-channel relays in inactive HIGH state. Listens for cloud WebSocket payloads to toggle relays.'
    },
    simulationConfig: {
      inputs: [
        { id: 'lightToggle', label: 'Voice Command State', min: 0, max: 1, defaultValue: 1, unit: 'Toggle' }
      ],
      outputs: [
        { id: 'applianceRelay', label: 'Room Light Relay (220V)', type: 'relay', activeConditionText: 'LIGHT ON' }
      ],
      initialLogs: [
        '[VOICE] Sinric Pro cloud service connected...',
        '[WEBSOCKET] Listening for Google Assistant voice commands...'
      ],
      simulationCode: (inputs) => {
        const isOn = inputs.lightToggle === 1;
        return {
          outputsState: {
            applianceRelay: isOn
          },
          logMessage: isOn
            ? '[VOICE COMMAND] "Hey Google, turn ON bedroom light" -> Relay 1 ENERGIZED.'
            : '[VOICE COMMAND] "Hey Google, turn OFF bedroom light" -> Relay 1 DE-ENERGIZED.'
        };
      }
    },
    facultyApproved: true,
    instructorName: 'Dr. R. K. Sharma',
    eWasteScore: {
      reusablePercent: 88,
      recyclablePackaging: true,
      carbonFootprint: 'Low'
    }
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    projectId: 'proj-smoke-detector',
    studentName: 'Priya Sharma',
    studentCollege: 'IIT Bombay - ECE Batch 2026',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'My Smart Kitchen Gas Leak & Fire Detector!',
    description: 'Built this using the MQ-2 sensor and ESP32. Saved ₹240 by marking my existing breadboard as owned in Inception BOM! Added a loud piezo buzzer and OLED graphics.',
    budgetSpent: 630,
    timeTaken: '2 hours 15 mins',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    commentsCount: 9,
    verifiedBuilt: true,
    postedAt: '2 days ago'
  },
  {
    id: 'post-2',
    projectId: 'proj-plant-watering',
    studentName: 'Rahul Verma',
    studentCollege: 'BIT Mesra - Mechanical Engineering',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Self-Watering Hostel Room Plant System',
    description: 'Extremely helpful troubleshooting assistant when my relay was sticking! Turns out I needed a common ground wire between ESP32 and relay board. Works flawlessly now.',
    budgetSpent: 725,
    timeTaken: '3 hours',
    photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    likes: 31,
    commentsCount: 5,
    verifiedBuilt: true,
    postedAt: '4 days ago'
  },
  {
    id: 'post-3',
    projectId: 'proj-weather-station',
    studentName: 'Aarav Patel',
    studentCollege: 'VJTI Mumbai - Computer Science',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    title: 'Campus Weather Station connected to ThingSpeak Cloud',
    description: 'Mounted on my hostel balcony. Streams live temperature and humidity metrics every 15 minutes! Used the Budget Optimizer to swap ESP32 with NodeMCU ESP8266.',
    budgetSpent: 610,
    timeTaken: '4 hours',
    photoUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80',
    likes: 56,
    commentsCount: 14,
    verifiedBuilt: true,
    postedAt: '1 week ago'
  }
];
