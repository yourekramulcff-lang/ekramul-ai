import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "শুধু POST request গ্রহণ করা হয়।"
    });
  }

  try {
    const messages = req.body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "কোনো মেসেজ পাওয়া যায়নি।"
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: "তুমি EKRAMUL AI, একজন বন্ধুসুলভ ও বুদ্ধিমান AI সহকারী। ব্যবহারকারীর ভাষায় সহজ ও পরিষ্কারভাবে উত্তর দাও।",
      input: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "")
      }))
    });

    return res.status(200).json({
      reply: response.output_text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।"
    });

  } catch (error) {
    console.error("EKRAMUL AI Error:", error);

    return res.status(500).json({
      error: "AI-এর সঙ্গে যোগাযোগ করা যাচ্ছে না। পরে আবার চেষ্টা করো।"
    });
  }
}
