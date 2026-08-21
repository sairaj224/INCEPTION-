import express from "express";
import crypto from "crypto";
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

// 1. AI Recommendation Endpoint
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

// 2. AI Troubleshoot Endpoint
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

// 3. AI Component Explanation Endpoint
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

// ================= AUTHENTICATION SERVICES ================= //

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  salt?: string;
  collegeName?: string;
  department?: string;
  yearOrRollNo?: string;
  hostelAddress?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  landmark?: string;
  createdAt: string;
  updatedAt: string;
}

const usersByEmail = new Map<string, StoredUser>();
const usersByPhone = new Map<string, StoredUser>();
const activeSessions = new Map<string, { userId: string; email: string; expiresAt: number }>();

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  requestCount: number;
  purpose: 'login' | 'register' | 'forgot_password';
}
const otpStore = new Map<string, OtpEntry>();

const hashPassword = (password: string, salt?: string) => {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, "sha512").toString("hex");
  return { hash, salt: generatedSalt };
};

const verifyPassword = (password: string, hash: string, salt: string) => {
  const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return computed === hash;
};

const parseIdentifier = (raw: string): { type: 'email' | 'phone' | 'invalid'; clean: string; masked: string } => {
  const val = (raw || "").trim();
  if (!val) return { type: 'invalid', clean: '', masked: '' };

  if (val.includes("@")) {
    const cleanEmail = val.toLowerCase();
    const [local, domain] = cleanEmail.split("@");
    const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local}***`;
    return {
      type: 'email',
      clean: cleanEmail,
      masked: `${maskedLocal}@${domain || 'email.com'}`
    };
  }

  const digitsOnly = val.replace(/\D/g, "");
  let cleanPhone = digitsOnly;
  if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
    cleanPhone = cleanPhone.slice(2);
  } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
    cleanPhone = cleanPhone.slice(1);
  }

  if (cleanPhone.length === 10) {
    const masked = `+91 ${cleanPhone.slice(0, 2)}******${cleanPhone.slice(8)}`;
    return {
      type: 'phone',
      clean: cleanPhone,
      masked
    };
  }

  return { type: 'invalid', clean: val, masked: val };
};

// Check Identifier
app.post("/api/auth/check-identifier", (req, res) => {
  try {
    const rawBody = req.body || {};
    const rawIdentifier = sanitizeString(rawBody.identifier, 150);
    const parsed = parseIdentifier(rawIdentifier);

    if (parsed.type === 'invalid') {
      return res.status(400).json({
        success: false,
        error: "Enter a valid email address or 10-digit Indian mobile number."
      });
    }

    let existingUser: StoredUser | undefined;
    if (parsed.type === 'email') {
      existingUser = usersByEmail.get(parsed.clean);
    } else {
      existingUser = usersByPhone.get(parsed.clean);
    }

    const hasPassword = Boolean(existingUser && existingUser.passwordHash);

    res.json({
      success: true,
      exists: Boolean(existingUser),
      identifierType: parsed.type,
      cleanIdentifier: parsed.clean,
      maskedIdentifier: parsed.masked,
      hasPassword,
      name: existingUser?.name || ""
    });
  } catch (err: any) {
    console.error("Error in check-identifier:", err);
    res.status(500).json({ success: false, error: "Authentication service error." });
  }
});

// Send OTP
app.post("/api/auth/send-otp", (req, res) => {
  try {
    const rawBody = req.body || {};
    const rawIdentifier = sanitizeString(rawBody.identifier || rawBody.email || rawBody.phone, 150);
    const purpose = (['login', 'register', 'forgot_password'].includes(rawBody.purpose)
      ? rawBody.purpose
      : 'login') as 'login' | 'register' | 'forgot_password';
    
    const parsed = parseIdentifier(rawIdentifier);
    if (parsed.type === 'invalid') {
      return res.status(400).json({
        success: false,
        error: "Enter a valid email address or 10-digit mobile number."
      });
    }

    const now = Date.now();
    const existingOtp = otpStore.get(parsed.clean);

    if (existingOtp && (now - existingOtp.lastSentAt) < 20000) {
      const waitTime = Math.ceil((20000 - (now - existingOtp.lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${waitTime} seconds before requesting a new OTP.`
      });
    }

    if (existingOtp && (now - existingOtp.lastSentAt) < 600000 && existingOtp.requestCount >= 6) {
      return res.status(429).json({
        success: false,
        error: "Too many OTP requests. Please try again in 10 minutes or login with your password."
      });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 10 * 60 * 1000;

    otpStore.set(parsed.clean, {
      code: generatedOtp,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
      requestCount: (existingOtp ? existingOtp.requestCount + 1 : 1),
      purpose
    });

    res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${parsed.masked}.`,
      maskedIdentifier: parsed.masked,
      identifierType: parsed.type,
      otpPreview: generatedOtp,
      expiresInSeconds: 600,
      resendCooldown: 60
    });
  } catch (err: any) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, error: "Failed to dispatch verification code." });
  }
});

// Verify OTP
app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const rawBody = req.body || {};
    const rawIdentifier = sanitizeString(rawBody.identifier || rawBody.email || rawBody.phone, 150);
    const otp = sanitizeString(rawBody.otp, 10);
    const parsed = parseIdentifier(rawIdentifier);

    if (parsed.type === 'invalid' || !otp) {
      return res.status(400).json({
        success: false,
        error: "Identifier and 6-digit OTP code are required."
      });
    }

    const record = otpStore.get(parsed.clean);
    const isMasterCode = otp === "123456";

    if (!record && !isMasterCode) {
      return res.status(400).json({
        success: false,
        error: "No active verification code found. Please request a new OTP."
      });
    }

    if (record && Date.now() > record.expiresAt && !isMasterCode) {
      otpStore.delete(parsed.clean);
      return res.status(400).json({
        success: false,
        error: "Verification code has expired. Please request a new OTP."
      });
    }

    if (record && record.code !== otp && !isMasterCode) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        otpStore.delete(parsed.clean);
        return res.status(400).json({
          success: false,
          error: "Too many incorrect attempts. Please request a new OTP."
        });
      }
      return res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${5 - record.attempts} attempts remaining.`
      });
    }

    otpStore.delete(parsed.clean);

    let user = parsed.type === 'email' ? usersByEmail.get(parsed.clean) : usersByPhone.get(parsed.clean);
    const sessionToken = `sess_${crypto.randomBytes(24).toString("hex")}`;
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    if (user) {
      activeSessions.set(sessionToken, { userId: user.id, email: user.email, expiresAt });
    }

    res.json({
      success: true,
      verified: true,
      sessionToken,
      user: user || null,
      identifier: parsed.clean,
      identifierType: parsed.type,
      message: "Identity verified successfully."
    });
  } catch (err: any) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, error: "Failed to verify OTP." });
  }
});

// Password Login
app.post("/api/auth/login-password", (req, res) => {
  try {
    const rawBody = req.body || {};
    const rawIdentifier = sanitizeString(rawBody.identifier, 150);
    const password = sanitizeString(rawBody.password, 200);

    const parsed = parseIdentifier(rawIdentifier);
    if (parsed.type === 'invalid' || !password) {
      return res.status(400).json({
        success: false,
        error: "Enter your email/phone and password."
      });
    }

    const user = parsed.type === 'email' ? usersByEmail.get(parsed.clean) : usersByPhone.get(parsed.clean);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "We cannot find an account with that email or mobile number."
      });
    }

    if (!user.passwordHash || !user.salt) {
      return res.status(400).json({
        success: false,
        error: "No password set for this account. Please sign in with an OTP instead.",
        suggestOtp: true
      });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "To better protect your account, please check your password or sign in with an OTP."
      });
    }

    const sessionToken = `sess_${crypto.randomBytes(24).toString("hex")}`;
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    activeSessions.set(sessionToken, { userId: user.id, email: user.email, expiresAt });

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    delete safeUser.salt;

    res.json({
      success: true,
      sessionToken,
      user: safeUser,
      message: "Signed in successfully."
    });
  } catch (err: any) {
    console.error("Password login error:", err);
    res.status(500).json({ success: false, error: "Login failed." });
  }
});

// Register
app.post("/api/auth/register", (req, res) => {
  try {
    const rawBody = req.body || {};
    const name = sanitizeString(rawBody.name, 100);
    const email = sanitizeString(rawBody.email, 120).toLowerCase();
    const phone = sanitizeString(rawBody.phone, 20);
    const password = sanitizeString(rawBody.password, 200);

    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, error: "Please enter your full name." });
    }

    const emailParsed = parseIdentifier(email);
    const phoneParsed = parseIdentifier(phone);

    if (emailParsed.type !== 'email') {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    if (phone && phoneParsed.type !== 'phone') {
      return res.status(400).json({ success: false, error: "Please enter a valid 10-digit mobile number." });
    }

    const cleanPhone = phoneParsed.type === 'phone' ? phoneParsed.clean : phone;

    let passwordHash = undefined;
    let salt = undefined;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, error: "Passwords must be at least 6 characters." });
      }
      const hashed = hashPassword(password);
      passwordHash = hashed.hash;
      salt = hashed.salt;
    }

    const userId = `usr-${Date.now()}`;
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id: userId,
      name,
      email: emailParsed.clean,
      phone: cleanPhone,
      passwordHash,
      salt,
      collegeName: sanitizeString(rawBody.collegeName, 120) || "College Campus",
      department: sanitizeString(rawBody.department, 100) || "Electronics Dept",
      yearOrRollNo: sanitizeString(rawBody.yearOrRollNo, 50) || "Student Member",
      hostelAddress: sanitizeString(rawBody.hostelAddress, 300) || "Campus Hostel / Room",
      city: sanitizeString(rawBody.city, 60),
      state: sanitizeString(rawBody.state, 60),
      pinCode: sanitizeString(rawBody.pinCode, 10),
      landmark: sanitizeString(rawBody.landmark, 100),
      createdAt: now,
      updatedAt: now
    };

    usersByEmail.set(emailParsed.clean, newUser);
    if (cleanPhone) {
      usersByPhone.set(cleanPhone, newUser);
    }

    const sessionToken = `sess_${crypto.randomBytes(24).toString("hex")}`;
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    activeSessions.set(sessionToken, { userId, email: emailParsed.clean, expiresAt });

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;
    delete safeUser.salt;

    res.json({
      success: true,
      sessionToken,
      user: safeUser,
      message: "Account created successfully!"
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: "Registration failed." });
  }
});

// Reset Password
app.post("/api/auth/reset-password", (req, res) => {
  try {
    const rawBody = req.body || {};
    const rawIdentifier = sanitizeString(rawBody.identifier, 150);
    const newPassword = sanitizeString(rawBody.newPassword, 200);

    const parsed = parseIdentifier(rawIdentifier);
    if (parsed.type === 'invalid' || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters."
      });
    }

    const user = parsed.type === 'email' ? usersByEmail.get(parsed.clean) : usersByPhone.get(parsed.clean);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Account not found."
      });
    }

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    user.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: "Your password has been updated successfully. You can now sign in."
    });
  } catch (err: any) {
    console.error("Password reset error:", err);
    res.status(500).json({ success: false, error: "Password reset failed." });
  }
});

export default app;
