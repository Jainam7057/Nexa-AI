import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Promt from "../model/promt.models.js";

dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ Simple rate limiter (5 requests per minute)
let lastRequestTime = 0;

const waitIfNeeded = async () => {
  const now = Date.now();
  const diff = now - lastRequestTime;

  // 5 RPM → 1 request every 12 seconds
  if (diff < 12000) {
    await new Promise((res) => setTimeout(res, 12000 - diff));
  }

  lastRequestTime = Date.now();
};

const sendPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId=req.userId;

    // ✅ Validation
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required." });
    }

    // ✅ Prevent rate limit
    await waitIfNeeded();

    // ✅ Call Gemini API
    const response = await genAI.models.generateContent({
      model: "models/gemini-2.5-flash", // ✅ WORKING MODEL
      contents: [
        {
          role: "user",
          parts: [{ text:`You are a friendly chatbot. Always include emojis in your answers. 

User: ${prompt}`}],
        },
      ],
    });

    // ✅ Safe result extraction
    const result =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    // ✅ Save user prompt
    await Promt.create({
      userId,
      role: "user",
      content: prompt,
    });

    // ✅ Save AI response
    await Promt.create({
      userId,
      role: "assistant",
      content: result,
    });

    // ✅ Send response
    return res.status(200).json({ result });

  } catch (error) {
    console.error("ERROR:", error);

    // ✅ Handle quota / rate limit
    if (error.status === 429) {
      return res.status(429).json({
        message: "Limit exceeded. Please wait and try again.",
      });
    }

    // ✅ Handle model error
    if (error.status === 404) {
      return res.status(404).json({
        message: "Model not found or not supported.",
      });
    }

    return res.status(500).json({ message: "Server error!" });
  }
};

export { sendPrompt };





// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";
// import Promt from "../model/promt.models.js";

// dotenv.config();

// const genAI = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const sendPrompt = async (req, res) => {
//   try {
//     const { prompt } = req.body;
    

//     if (!prompt || prompt.trim() === "") {
//       return res.status(400).json({ message: "Prompt is required." });
//     }

//     // Use a supported model directly
//     const response = await genAI.models.generateContent({
//       model:  "models/gemini-2.0-flash",
//       contents: prompt,
//     });

//     const promptEntry = new Promt({
//       role: "user",
//       content: prompt,
//     });
//     await promptEntry.save();

//     const responseEntry = new Promt({
//       role: "assistant",
//       content: response.text,
//     });
//     await responseEntry.save();

//     return res.status(200).json({ result: response.text });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error!" });
//   }
// };

// export { sendPrompt };