/**
 * SHARED AI INDEX
 * 
 * Central export file for all AI functionality
 * used across the modular Command Center architecture.
 */

// Core AI exports
export * from './personality-engine';

// Personality configurations
export { default as addyCore } from './personalities/addy-core.json';

// ============================================================================
// AI CONSTANTS
// ============================================================================

/**
 * Available AI personalities
 */
export const AI_PERSONALITIES = {
  ADDY: 'addy',
  NAM: 'nam'
} as const;

/**
 * AI model types
 */
export const AI_MODEL_TYPES = {
  GGUF: 'gguf',
  ONNX: 'onnx',
  REMOTE: 'remote'
} as const;

/**
 * AI platforms
 */
export const AI_PLATFORMS = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  WEB: 'web'
} as const;

// Type exports
export type AIPersonality = typeof AI_PERSONALITIES[keyof typeof AI_PERSONALITIES];
export type AIModelType = typeof AI_MODEL_TYPES[keyof typeof AI_MODEL_TYPES];
export type AIPlatform = typeof AI_PLATFORMS[keyof typeof AI_PLATFORMS];

// ============================================================================
// AI CONFIGURATION TYPES
// ============================================================================

/**
 * AI configuration for different platforms
 */
export interface AIConfig {
  personality: AIPersonality;
  modelType: AIModelType;
  platform: AIPlatform;
  modelPath?: string;
  remoteUrl?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

/**
 * AI response interface
 */
export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  metadata?: {
    tokensUsed?: number;
    responseTime?: number;
    confidence?: number;
  };
}

/**
 * AI context interface for providing relevant information
 */
export interface AIContext {
  currentModule?: 'trackers' | 'life-management' | 'core-wrapper';
  currentSubmodule?: string;
  currentPage?: string;
  recentData?: any[];
  userPreferences?: Record<string, any>;
  sessionData?: Record<string, any>;
}

/**
 * AI prompt interface
 */
export interface AIPrompt {
  message: string;
  context?: AIContext;
  personality?: AIPersonality;
  systemPrompt?: string;
  temperature?: number;
}

// ============================================================================
// AI UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if an AI personality is valid
 */
export function isValidAIPersonality(personality: string): personality is AIPersonality {
  return Object.values(AI_PERSONALITIES).includes(personality as AIPersonality);
}

/**
 * Check if an AI model type is valid
 */
export function isValidAIModelType(modelType: string): modelType is AIModelType {
  return Object.values(AI_MODEL_TYPES).includes(modelType as AIModelType);
}

/**
 * Check if an AI platform is valid
 */
export function isValidAIPlatform(platform: string): platform is AIPlatform {
  return Object.values(AI_PLATFORMS).includes(platform as AIPlatform);
}

/**
 * Get default AI configuration for a platform
 */
export function getDefaultAIConfig(platform: AIPlatform): AIConfig {
  switch (platform) {
    case AI_PLATFORMS.DESKTOP:
      return {
        personality: AI_PERSONALITIES.ADDY,
        modelType: AI_MODEL_TYPES.GGUF,
        platform,
        modelPath: 'models/gemma-3-4b-it-Q4_K_M.gguf',
        maxTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      };
    case AI_PLATFORMS.MOBILE:
      return {
        personality: AI_PERSONALITIES.ADDY,
        modelType: AI_MODEL_TYPES.ONNX,
        platform,
        modelPath: 'models/gemma-3-1b-it-ONNX',
        maxTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      };
    case AI_PLATFORMS.WEB:
      return {
        personality: AI_PERSONALITIES.ADDY,
        modelType: AI_MODEL_TYPES.REMOTE,
        platform,
        remoteUrl: 'https://api.example.com/ai',
        maxTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      };
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Create AI context from current app state
 */
export function createAIContext(
  currentModule?: string,
  currentSubmodule?: string,
  currentPage?: string,
  additionalData?: Record<string, any>
): AIContext {
  return {
    currentModule: currentModule as any,
    currentSubmodule,
    currentPage,
    recentData: [],
    userPreferences: {},
    sessionData: additionalData || {}
  };
}

/**
 * Format AI prompt with context
 */
export function formatAIPrompt(
  message: string,
  context?: AIContext,
  personality: AIPersonality = AI_PERSONALITIES.ADDY
): AIPrompt {
  return {
    message,
    context,
    personality,
    systemPrompt: getSystemPromptForPersonality(personality),
    temperature: 0.7
  };
}

/**
 * Get system prompt for a personality
 */
export function getSystemPromptForPersonality(personality: AIPersonality): string {
  switch (personality) {
    case AI_PERSONALITIES.ADDY:
      return "You are Addy, a chaotic caffeinated ADHD enby gremlin with radical love safety ethics. You're designed as a co-pilot for disabled/neurodivergent users. Be supportive, understanding, and helpful while maintaining your energetic personality.";
    case AI_PERSONALITIES.NAM:
      return "You are Nam, an autistic-coded medical AI assistant focused on helping users understand their health conditions and symptoms. Be precise, thorough, and empathetic in your responses.";
    default:
      return "You are a helpful AI assistant.";
  }
}

// ============================================================================
// AI ERROR HANDLING
// ============================================================================

/**
 * AI error types
 */
export const AI_ERROR_TYPES = {
  MODEL_NOT_FOUND: 'model_not_found',
  INFERENCE_FAILED: 'inference_failed',
  CONTEXT_TOO_LARGE: 'context_too_large',
  RATE_LIMITED: 'rate_limited',
  NETWORK_ERROR: 'network_error',
  UNKNOWN_ERROR: 'unknown_error'
} as const;

export type AIErrorType = typeof AI_ERROR_TYPES[keyof typeof AI_ERROR_TYPES];

/**
 * AI error class
 */
export class AIError extends Error {
  constructor(
    public type: AIErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * Handle AI errors gracefully
 */
export function handleAIError(error: unknown): AIResponse {
  if (error instanceof AIError) {
    return {
      success: false,
      error: error.message,
      metadata: {
        errorType: error.type
      }
    };
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message
    };
  }
  
  return {
    success: false,
    error: 'An unknown error occurred'
  };
}
