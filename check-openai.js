const openai = require('openai');
console.log('OpenAI exports:', Object.keys(openai));
console.log('AzureOpenAI available:', !!openai.AzureOpenAI);
if (openai.AzureOpenAI) {
    console.log('AzureOpenAI is:', typeof openai.AzureOpenAI);
}
