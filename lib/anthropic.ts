import Anthropic from "@anthropic-ai/sdk";

// Singleton — instantiated once, reused across requests in the same worker
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
