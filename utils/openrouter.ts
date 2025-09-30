import { useAppStore } from "../store/appStore";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const getCompletion = async (messages: any[]) => {
  const apiKey = useAppStore.getState().settings.openRouterApiKey;

  if (!apiKey) {
    throw new Error("OpenRouter API key not found.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "@preset/soul-sync",
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
