// Force load environment variables for Railway
const getOpenRouterKey = () => {
  // Try multiple ways to get the key
  const key = process.env.OPENROUTER_API_KEY || 
              process.env['OPENROUTER_API_KEY'] ||
              process.env.openrouter_api_key;
  
  if (!key) {
    console.error('OpenRouter API key not found in any format');
    console.error('All env keys:', Object.keys(process.env).join(', '));
  }
  
  return key;
};

export const OPENROUTER_API_KEY = getOpenRouterKey();
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'; 