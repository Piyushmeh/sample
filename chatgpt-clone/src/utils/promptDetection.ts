export function isImagePrompt(prompt: string): boolean {
  const imageKeywords = [
    'generate image',
    'create image',
    'draw',
    'picture of',
    'image of',
    'photo of',
    'visualize',
    'show me',
    'make an image',
    'create a picture',
    'generate a picture',
    'draw me',
    'show me a picture',
    'create a visual',
    'generate a visual'
  ];
  
  const lowerPrompt = prompt.toLowerCase();
  return imageKeywords.some(keyword => lowerPrompt.includes(keyword));
}
