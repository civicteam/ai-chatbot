import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";
import { anthropic } from "@ai-sdk/anthropic";

const chatModel = process.env.ANTHROPIC_API_KEY ?
    anthropic("claude-sonnet-4-5")
    :
    gateway.languageModel("anthropic/claude-sonnet-4")

const titleModel = process.env.ANTHROPIC_API_KEY ?
    anthropic("claude-3-5-haiku-latest")
    :
    gateway.languageModel("openai/gpt-4o-mini")

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": wrapLanguageModel({
          model: chatModel,
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": titleModel,
        "artifact-model": titleModel,
      },
    });
