import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Inception AI",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

const sanitizeString = (val: unknown, maxLen = 500): string => {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
};

app.post("/api/ai/recommend", async (req, res) => {
  try {
    const rawBody = req.body || {};
    const budgetNum = Number(rawBody.budget);
    const budget = !isNaN(budgetNum) && budgetNum > 0 ? Math.min(Math.max(budgetNum, 50), 100000) : 500;
    const interest = sanitizeString(rawBody.interest, 150) || "Sensors & Automation";
    const skillLevel = ["Beginner", "Intermediate", "Advanced"].includes(rawBody.skillLevel) ? rawBody.skillLevel : "Beginner";
    const customizedGoal = sanitizeString(rawBody.customizedGoal, 300);

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        recommendations: [
          {
            title: "Light Intensity & Sun Tracker",
            budget: Math.min(budget, 350),
            difficulty: "Beginner",
            timeCommitment: "1.5 hours",
            summary: "Measure ambient light levels using an LDR and servo motor to automatically track light sources.",
            whyRecommended: `Fits well within your target budget of ₹${budget} and introduces core analog sensor reading.`,
            coreComponents: ["LDR Light Sensor", "SG90 Servo Motor", "Arduino Nano", "Resistors"],
            learningOutcome: "Learn analog-to-digital conversion, PWM motor control, and thresholding."
          },
          {
            title: "Smart Water Tank Indicator",
            budget: Math.min(budget, 420),
            difficulty: "Beginner",
            timeCommitment: "2 hours",
            summary: "Build a multi-level water level monitor using conductive probe sensors and LED indicators.",
            whyRecommended: "Practical real-world engineering project with immediate home utility.",
            coreComponents: ["Water Level Sensor", "Buzzer", "Arduino Nano", "LED Kit", "Breadboard"],
            learningOutcome: "Master liquid sensing, GPIO inputs, and acoustic alert logic."
          },
          {
            title: "IR Object & Proximity Detector",
            budget: Math.min(budget, 480),
            difficulty: "Beginner",
            timeCommitment: "2.5 hours",
            summary: "Detect obstacles without contact using infrared reflection and trigger safety alerts.",
            whyRecommended: "Great stepping stone into robotics sensing and interrupt handling.",
            coreComponents: ["IR Sensor Module", "Buzzer", "LCD Display 16x2", "Arduino Nano"],
            learningOutcome: "Understand optical reflection principles and digital signal debouncing."
          }
        ]
      });
    }

    const prompt = `You are the AI Project Guide for "Inception" - an educational IoT & Electronics project assistant for engineering students in India.
Student Query:
- Target Budget: ₹${budget}
- Areas of Interest: ${interest}
- Skill Level: ${skillLevel}
${customizedGoal ? `- Custom Goal: ${customizedGoal}` : ""}

Please generate 3 specific, feasible, exciting electronics/IoT project ideas tailored to this budget and interest.
Return strictly JSON with key "recommendations", which is an array of 3 objects containing:
- title (string)
- budget (number in ₹ INR)
- difficulty ("Beginner" | "Intermediate" | "Advanced")
- timeCommitment (string, e.g. "2 hours")
- summary (string, 2 sentences)
- whyRecommended (string, 1 sentence on why it fits budget and interests)
- coreComponents (array of strings, 3-5 item names)
- learningOutcome (string, 1 sentence on core concept learned)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed || !Array.isArray(parsed.recommendations) || parsed.recommendations.length === 0) {
      throw new Error("Invalid output structure received from Gemini");
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("AI recommend error:", error);
    res.status(500).json({ error: "Recommendation failed", details: error.message || "Failed to generate recommendations" });
  }
});

app.post("/api/ai/troubleshoot", async (req, res) => {
  try {
    const rawBody = req.body || {};
    const problemStatement = sanitizeString(rawBody.problemStatement, 1000);
    const projectTitle = sanitizeString(rawBody.projectTitle, 200) || "IoT Project";

    if (!problemStatement || problemStatement.length < 3) {
      return res.status(400).json({
        error: "Validation Error",
        details: ["problemStatement is required and must be at least 3 characters long"]
      });
    }

    const componentList = Array.isArray(rawBody.componentList)
      ? rawBody.componentList.map((c: unknown) => sanitizeString(c, 100)).filter(Boolean)
      : [];

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        diagnosis: "Basic Hardware & Code Checkup",
        checks: [
          { title: "Power Supply & USB Connection", detail: "Ensure USB cable delivers full 5V logic. Micro-USB cables often lack data lines or current capacity." },
          { title: "Baud Rate & Serial Port", detail: "Verify Arduino IDE Serial Monitor baud rate matches Serial.begin(115200) or 9600 in code." },
          { title: "Pin Polarities (Anode/Cathode)", detail: "Double check LED legs: long leg is positive (Anode) into output pin, short leg to GND." },
          { title: "I2C Address Verification", detail: "Run an I2C scanner code sketch to confirm display/sensor is at 0x27 or 0x3C." }
        ],
        codeFixSuggestion: "// Tip: Add Serial debugging inside loop()\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(\"Booting System...\");\n}"
      });
    }

    const prompt = `You are Inception's Expert Circuit & Embedded C++ Troubleshooting Assistant for university students.
Project: ${projectTitle}
Components used: ${componentList.length > 0 ? componentList.join(", ") : "Arduino/ESP32, Sensors"}
Student's Reported Issue: "${problemStatement}"

Provide an actionable, structured diagnosis with 4 clear troubleshooting checks and a short code fix suggestion if applicable.
Return strictly JSON with:
- diagnosis (short summary of probable root cause)
- checks (array of 4 objects: { title: string, detail: string })
- codeFixSuggestion (string with formatted code or logic correction if relevant)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed || typeof parsed !== "object" || !parsed.diagnosis) {
      throw new Error("Invalid response format received from Gemini troubleshoot model");
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("AI troubleshoot error:", error);
    res.status(500).json({ error: "Troubleshooting failed", details: error.message || "Failed to troubleshoot" });
  }
});

app.post("/api/ai/explain-component", async (req, res) => {
  try {
    const rawBody = req.body || {};
    const componentName = sanitizeString(rawBody.componentName, 200);

    if (!componentName || componentName.length < 2) {
      return res.status(400).json({
        error: "Validation Error",
        details: ["componentName is required and must be a valid string of at least 2 characters"]
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        name: componentName,
        whyDoINeedThis: `The ${componentName} is a critical element for sensing or control in your circuit.`,
        howDoesItWork: "Uses semiconductor materials or physical transducing principles to convert physics into electrical signals.",
        whatIfIDontUseIt: "Your project won't have input feedback or actuation, making automatic decisions impossible.",
        realLifeApplications: "Used in home automation, industrial safety systems, and smart automobiles.",
        alternativeComponents: ["Analog Equivalent", "Digital Sensor Module"]
      });
    }

    const prompt = `Provide a comprehensive educational explanation for the electronics component: "${componentName}".
Follow the Inception Educational Framework for engineering students.
Return strictly JSON with:
- name (string)
- whyDoINeedThis (2-3 sentences explaining its purpose in student projects)
- howDoesItWork (inside mechanics, semiconductor physics or transducer operation explained simply)
- whatIfIDontUseIt (consequences of skipping it or alternative design choices)
- realLifeApplications (2-3 bullet point examples in industry or homes)
- alternativeComponents (array of 2 strings showing cheaper or higher accuracy swaps)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed || typeof parsed !== "object" || !parsed.whyDoINeedThis) {
      throw new Error("Invalid explanation structure received from Gemini model");
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("AI explain error:", error);
    res.status(500).json({ error: "Explanation failed", details: error.message || "Failed to explain component" });
  }
});

export default app;
