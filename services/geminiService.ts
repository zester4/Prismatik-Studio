import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { AspectRatio, StoryScene, AdCopy, ArticleBlock, BrandIdentity, PodcastScriptLine } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * A centralized error handler to provide more user-friendly messages.
 * @param error The catched error.
 * @param context The generation context (e.g., 'image', 'video').
 * @returns A user-friendly error string.
 */
const getFriendlyErrorMessage = (error: unknown, context: 'image' | 'video' | 'story' | 'logo' | 'ad' | 'article' | 'campaign' | 'podcast'): string => {
  console.error(`Error during ${context} generation:`, error);
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('api key not valid')) {
      return `[API Key Error] Your API key is invalid or missing. Please ensure it's configured correctly in the environment.`;
    }
    if (message.includes('safety') || message.includes('blocked')) {
      return `[Prompt Issue] Your prompt may have violated the safety guidelines. Please modify your prompt and try again.`;
    }
    if (message.includes('quota')) {
      return `[Quota Exceeded] You have exceeded your API usage quota for the day. Please check your Google AI Studio account.`;
    }
    if (message.includes('network') || message.includes('fetch')) {
      return `[Network Error] A network problem occurred. Please check your connection and try again.`;
    }
    if (message.includes('400 bad request')) {
        return `[Bad Request] The model could not process your request. This might be due to an unsupported parameter or a malformed prompt.`;
    }
     if (message.includes('500 internal server error') || message.includes('503 service unavailable')) {
        return `[Server Error] The AI service is currently experiencing issues. Please try again in a few moments.`;
    }
    
    // Return the original message if it's somewhat user-friendly and not caught by specific checks
    return `An error occurred: ${error.message}`;
  }

  return `An unexpected error occurred during ${context} generation. Please see the developer console for more details.`;
};


export const generateImages = async (
  prompt: string, 
  numberOfImages: number, 
  aspectRatio: AspectRatio, 
  style: string, 
  model: string,
  negativePrompt?: string,
  systemInstruction?: string
): Promise<string[]> => {
  try {
    let finalPrompt = style && style !== 'none'
      ? `${prompt.trim()}, in the style of ${style}`
      : prompt.trim();
      
    // Add a quality booster for detailed styles on Imagen models
    if (model.startsWith('imagen-') && style !== 'none') {
        finalPrompt += ', high quality, 8k resolution, cinematic lighting, highly detailed';
    }

    // For Imagen, which doesn't support systemInstruction directly, prepend it to the prompt.
    if (systemInstruction && model.startsWith('imagen-')) {
        finalPrompt = `${systemInstruction}. ${finalPrompt}`;
    }

    if (model.startsWith('imagen-')) {
      const response = await ai.models.generateImages({
        model: model,
        prompt: finalPrompt,
        config: {
          numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio,
          negativePrompt: negativePrompt?.trim() || undefined,
        },
      });
      return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    }

    if (model === 'gemini-2.5-flash-image-preview') {
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: finalPrompt }] },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
          systemInstruction: systemInstruction || undefined,
        },
      });

      const images: string[] = [];
      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            images.push(`data:image/png;base64,${base64ImageBytes}`);
          }
        }
      }
      return images;
    }

    throw new Error(`Unsupported image model: ${model}`);

  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'image'));
  }
};

export const editImage = async (
  prompt: string,
  image: { mimeType: string; data: string },
  systemInstruction?: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image-preview';
    const response = await ai.models.generateContent({
      model: model,
      contents: { 
        parts: [
          { text: prompt }, 
          { inlineData: { mimeType: image.mimeType, data: image.data } }
        ] 
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        systemInstruction: systemInstruction || undefined,
      },
    });

    const imagePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    } else {
      const textPart = response.candidates?.[0]?.content.parts.find(p => p.text);
      if (textPart?.text) {
          throw new Error(`Image editing failed. Model response: ${textPart.text}`);
      }
      throw new Error("Image editing failed to return an image.");
    }
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'image'));
  }
};


export const generateVideo = async (
  prompt: string, 
  aspectRatio: AspectRatio, 
  model: string,
  onProgress: (message: string) => void,
  image?: { mimeType: string; data: string },
  systemInstruction?: string
): Promise<string> => {
  try {
    onProgress("Starting video generation...");

    let finalPrompt = prompt;
    if (systemInstruction) {
        finalPrompt = `${systemInstruction}. ${prompt}`;
    }

    let operation = await ai.models.generateVideos({
      model,
      prompt: finalPrompt,
      image: image ? { 
        imageBytes: image.data,
        mimeType: image.mimeType,
       } : undefined,
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio,
      },
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      onProgress(`Checking status...`);
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    onProgress("Video processing complete. Downloading...");

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation succeeded, but the final video file could not be retrieved. Please try again.");
    }
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download the generated video (${response.statusText}). This might be a temporary network issue.`);
    }
    
    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    onProgress("Video ready!");
    return videoUrl;
  } catch (error) {
    if (error instanceof Error && (error.message.startsWith('Failed to download') || error.message.startsWith('Video generation succeeded'))) {
        throw error;
    }
    throw new Error(getFriendlyErrorMessage(error, 'video'));
  }
};


export const generateStory = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  numberOfScenes: number,
  textLength: 'short' | 'medium' | 'detailed',
  onProgress: (message: string) => void,
  characterImage?: { mimeType: string; data: string },
  systemInstruction?: string
): Promise<StoryScene[]> => {
  try {
    let characterDescription = "";
    if (characterImage) {
      onProgress("Analyzing character image...");
      const descriptionPrompt = "Describe the main character in this image in detail. Focus on key visual features like hair, clothing, and face that can be used to create a consistent character across multiple illustrations. For example: 'A young girl with short, curly red hair, wearing a bright yellow raincoat and blue boots.'";
      
      const descriptionResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { text: descriptionPrompt },
            {
              inlineData: {
                mimeType: characterImage.mimeType,
                data: characterImage.data,
              },
            },
          ],
        },
        config: { systemInstruction: systemInstruction || undefined, }
      });
      characterDescription = descriptionResponse.text.trim();
      onProgress("Character analysis complete.");
    }

    onProgress("Generating story plan...");
    
    let lengthInstruction = "an engaging narrative of 2-4 sentences"; // Default to medium
    if (textLength === 'short') {
        lengthInstruction = "a short, punchy narrative of 1-2 sentences";
    } else if (textLength === 'detailed') {
        lengthInstruction = "a more detailed and descriptive narrative of 4-6 sentences";
    }

    const storyPlannerPrompt = `
      Analyze the user's story idea for its underlying tone (e.g., humorous, mysterious, adventurous) and visual style. Based on this, create a structured plan for a visual story with ${numberOfScenes} scenes.

      **User's Story Idea:** "${prompt}"
      ${characterDescription ? `**Main Character Description:** "${characterDescription}"` : ''}

      For each scene, provide:
      1.  **text**: A narrative portion for the scene. The text for each scene should be ${lengthInstruction}.
      2.  **imagePrompt**: A detailed, descriptive prompt for an AI image generator to create the scene's illustration. This prompt must be in English. It should describe the scene's composition, characters, actions, setting, and mood. If a character description is provided, ensure it is used consistently in every image prompt.

      The response must be a valid JSON array of objects, where each object has "text" and "imagePrompt" string properties. Do not include any other text or markdown formatting outside of the JSON array.

      Example for one scene:
      {
        "text": "The little squirrel, Pip, nervously clutched the ancient map, its tiny paws trembling. The Golden Acorn was said to be at the top of the Whispering Peaks.",
        "imagePrompt": "A small, fluffy squirrel with big, curious eyes stands on a mossy branch, looking up at a towering, misty mountain range in the distance. He is holding a small, rolled-up parchment map. The style is a warm, slightly whimsical digital painting, cinematic lighting, golden hour."
      }
    `;
    
    const plannerResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: storyPlannerPrompt,
      config: {
        systemInstruction: systemInstruction || undefined,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
            },
            required: ['text', 'imagePrompt'],
          },
        },
      },
    });

    onProgress("Story plan generated. Creating scene images...");
    const storyPlan: { text: string; imagePrompt: string }[] = JSON.parse(plannerResponse.text);

    if (!Array.isArray(storyPlan) || storyPlan.length === 0) {
        throw new Error("Failed to generate a valid story plan from the model.");
    }
    
    const scenes: StoryScene[] = [];
    
    for (let i = 0; i < storyPlan.length; i++) {
        const sceneData = storyPlan[i];
        onProgress(`Generating image for scene ${i + 1}/${storyPlan.length}...`);
        
        const imageUrls = await generateImages(sceneData.imagePrompt, 1, aspectRatio, 'cinematic', 'gemini-2.5-flash-image-preview', undefined, systemInstruction);

        if (imageUrls.length === 0) {
          throw new Error(`Failed to generate an image for scene ${i + 1}.`);
        }
        
        scenes.push({
          text: sceneData.text,
          imagePrompt: sceneData.imagePrompt,
          imageUrl: imageUrls[0],
        });
    }

    onProgress("Story generation complete!");
    return scenes;

  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'story'));
  }
};

export const generateLogo = async (
  companyName: string,
  description: string,
  style: string,
  colors: string,
  model: string,
  numberOfConcepts: number,
  slogan?: string,
  systemInstruction?: string,
): Promise<string[]> => {
  try {
    const prompt = `
      Create a professional logo concept for a company named "${companyName}".
      ${slogan ? `Their slogan is: "${slogan}".` : ''}
      Company Description: ${description}.
      Logo Style: ${style}, vector, simple, clean, modern, minimalist, flat design.
      Color Palette: ${colors}.
      The logo should be on a plain white background. Do NOT include any text, letters, or words in the logo itself.
    `.trim();

    const images = await generateImages(prompt, numberOfConcepts, "1:1", 'none', model, undefined, systemInstruction);
    return images;

  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'logo'));
  }
};

export const generateAdCopy = async (
    productName: string,
    description: string,
    audience: string,
    tone: string,
    cta: string,
    systemInstruction?: string
): Promise<AdCopy> => {
    try {
        const adCopyPrompt = `
            Create compelling ad copy for a product.

            Product Name: "${productName}"
            Description: "${description}"
            Target Audience: "${audience}"
            Tone of Voice: "${tone}"
            Call to Action: "${cta}"

            Provide a response in a valid JSON object format with three string properties: "headline", "body", and "cta".
            - headline: A short, attention-grabbing headline (max 10 words).
            - body: A concise and persuasive body text (max 40 words).
            - cta: A clear call to action, which should be the exact CTA provided by the user.
        `;

        const copyResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: adCopyPrompt,
            config: {
                systemInstruction: systemInstruction || undefined,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        body: { type: Type.STRING },
                        cta: { type: Type.STRING },
                    },
                    required: ['headline', 'body', 'cta']
                }
            }
        });

        return JSON.parse(copyResponse.text);
    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'ad'));
    }
};

export const generateAd = async (
    productName: string,
    description: string,
    audience: string,
    tone: string,
    cta: string,
    image?: { mimeType: string; data: string },
    systemInstruction?: string
): Promise<{ mediaUrl: string; adCopy: AdCopy }> => {
    try {
        const adCopy = await generateAdCopy(productName, description, audience, tone, cta, systemInstruction);
        let imageUrl: string;

        if (image) {
            const imageEditPrompt = `
                Analyze this product image. Enhance it to look like a professional, high-quality advertisement.
                Make the lighting cinematic, improve the colors, and place the product in a visually appealing, relevant, but clean and uncluttered setting.
                The focus should be entirely on the product. Do not add any text.
                Ad Copy (for context only, do not add to image):
                Headline: ${adCopy.headline}
                Body: ${adCopy.body}
            `;
            imageUrl = await editImage(imageEditPrompt, image, systemInstruction);

        } else {
            const imageGenPrompt = `
                Create a visually stunning, photorealistic, and professional advertisement image for a product called "${productName}".
                Description: ${description}.
                The image should feature the product prominently in a setting that appeals to ${audience}.
                The style should be high-end, clean, with cinematic lighting. Do not include any text, logos, or watermarks.
                Ad Copy (for context only, do not add to image):
                Headline: ${adCopy.headline}
                Body: ${adCopy.body}
            `;
            const generatedImages = await generateImages(imageGenPrompt, 1, "16:9", 'photorealistic', 'imagen-4.0-generate-001', undefined, systemInstruction);
            if (generatedImages.length === 0) throw new Error("Image generation failed.");
            imageUrl = generatedImages[0];
        }

        return { mediaUrl: imageUrl, adCopy };

    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'ad'));
    }
};

export const generateAdVideo = async (
    productName: string,
    description: string,
    audience: string,
    tone: string,
    cta: string,
    onProgress: (message: string) => void,
    image?: { mimeType: string; data: string },
    systemInstruction?: string
): Promise<{ mediaUrl: string; adCopy: AdCopy }> => {
    try {
        onProgress("Generating ad copy...");
        const adCopy = await generateAdCopy(productName, description, audience, tone, cta, systemInstruction);

        onProgress("Generating video prompt...");
        const videoPrompt = `
            Create a short, dynamic, and high-energy product advertisement video (around 5-10 seconds) for "${productName}".
            Product Description: ${description}.
            Showcase the product in a cinematic way, suitable for ${audience}.
            Focus on beautiful, sweeping shots of the product. The tone should be ${tone}.
            Visual-only prompt; do not add text or sound.
        `;

        const videoUrl = await generateVideo(videoPrompt, "16:9", 'veo-2.0-generate-001', onProgress, image, systemInstruction);
        return { mediaUrl: videoUrl, adCopy };

    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'ad'));
    }
};

export const generateArticle = async (
    topic: string,
    articleType: string,
    writingStyle: string,
    numImages: number,
    onProgress: (message: string) => void,
    systemInstruction?: string
): Promise<{ title: string, content: ArticleBlock[] }> => {
    try {
        // Step 1: Generate the article's text structure with image placeholders
        onProgress("Planning article structure...");
        const articleStructurePrompt = `
            Create a detailed content structure for an article on the topic: "${topic}".
            The article should be a "${articleType}" written in a "${writingStyle}" style.
            Your response must be a single, valid JSON object with two keys:
            1. "title": A compelling title for the article (string).
            2. "content": An array of objects representing the article's flow.

            The "content" array should contain objects with a "type" and "content" property for text blocks, for example:
            { "type": "heading", "content": "This is a Section Title" }
            { "type": "paragraph", "content": "This is a paragraph of text..." }

            Crucially, you must also strategically insert exactly ${numImages} image placeholder objects where a visual would be most impactful.
            An image placeholder object must look like this:
            { "type": "image_placeholder" }

            Do not generate image prompts yet. Just place the placeholders.
        `;

        const structureResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: articleStructurePrompt,
            config: { 
                systemInstruction: systemInstruction || undefined,
                responseMimeType: "application/json"
            }
        });

        // Clean the response to ensure it's valid JSON
        const jsonString = structureResponse.text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/)?.[0]?.replace(/```json\n|```/g, '') || structureResponse.text;
        const articlePlan: { title: string; content: ({ type: 'heading' | 'paragraph', content: string } | { type: 'image_placeholder' })[] } = JSON.parse(jsonString);

        if (!articlePlan.title || !articlePlan.content) {
            throw new Error("Failed to generate a valid article structure.");
        }
        
        onProgress("Article text generated. Creating contextual images...");

        const finalContent: ArticleBlock[] = [];
        let imageCounter = 0;

        // Step 2 & 3: Iterate through the structure, generate prompts and images contextually
        for (let i = 0; i < articlePlan.content.length; i++) {
            const block = articlePlan.content[i];

            if (block.type === 'image_placeholder') {
                imageCounter++;
                onProgress(`Analyzing context for image ${imageCounter}/${numImages}...`);

                // Gather context from surrounding text blocks
                const contextBlocks = articlePlan.content.slice(Math.max(0, i - 2), Math.min(articlePlan.content.length, i + 3));
                const contextText = contextBlocks.map(b => {
                    if (b.type === 'heading' || b.type === 'paragraph') return b.content;
                    return '';
                }).join('\n\n');

                const imagePromptGenPrompt = `
                    Based on the following article excerpt, create a single, detailed, and visually descriptive prompt for an AI image generator. The image should be highly relevant to the surrounding text. The prompt must be in English. Only return the prompt itself, with no extra text or labels.

                    Article Context:
                    ---
                    ${contextText}
                    ---

                    Detailed Image Prompt:
                `;
                
                const promptResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: imagePromptGenPrompt,
                    config: { systemInstruction: systemInstruction || undefined, }
                });
                const imagePrompt = promptResponse.text.trim();

                onProgress(`Generating image ${imageCounter}/${numImages}...`);
                const imageUrls = await generateImages(imagePrompt, 1, '16:9', 'photorealistic', 'gemini-2.5-flash-image-preview', undefined, systemInstruction);

                if (imageUrls.length > 0) {
                    finalContent.push({
                        id: crypto.randomUUID(),
                        type: 'image',
                        imageUrl: imageUrls[0],
                        imagePrompt: imagePrompt
                    });
                }
            } else {
                // It's a heading or paragraph
                finalContent.push({ id: crypto.randomUUID(), ...block });
            }
        }
        
        onProgress("Article generation complete!");
        return { title: articlePlan.title, content: finalContent };

    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'article'));
    }
};

export const proofreadText = async (text: string): Promise<string> => {
  try {
    const proofreadPrompt = `
      Proofread the following text for any spelling, grammar, and punctuation errors.
      Correct the errors and improve the overall clarity and flow, but preserve the original tone and meaning.
      Only return the corrected text. Do not add any commentary, explanations, or markdown formatting.

      Original Text:
      "${text}"

      Corrected Text:
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: proofreadPrompt,
    });
    return response.text.trim();
  } catch (error) {
    // Using 'article' context for error message as it's used there
    throw new Error(getFriendlyErrorMessage(error, 'article'));
  }
};

export const generateCampaign = async (
  brief: string,
  onProgress: (message: string) => void,
  systemInstruction?: string
): Promise<{
  brandIdentity: BrandIdentity;
  logos: string[];
  heroImage: string;
  adCopy: AdCopy;
  socialVideoUrl: string;
}> => {
  try {
    // Step 1: Brand Identity
    onProgress("Establishing brand identity...");
    const brandIdentityPrompt = `
      Based on the following campaign brief, act as a brand strategist to define a core brand identity.
      Your response MUST be a valid JSON object with the following structure: { "companyName": string, "targetAudience": string, "colors": string[], "mood": string[], "keywords": string[] }.
      - companyName: Extract the company or product name from the brief.
      - targetAudience: Describe the primary target audience in a concise phrase.
      - colors: Suggest a palette of 3-4 descriptive, nuanced colors (e.g., "midnight blue", "sun-bleached terracotta", "mint green").
      - mood: Provide 3-4 evocative adjectives that describe the brand's feeling (e.g., "sophisticated", "adventurous", "serene").
      - keywords: List 4-5 specific, relevant keywords for the brand's industry or concept.

      Campaign Brief: "${brief}"
    `;
    
    const identityResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: brandIdentityPrompt,
      config: {
        systemInstruction: systemInstruction || undefined,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
            mood: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['companyName', 'targetAudience', 'colors', 'mood', 'keywords']
        },
      },
    });
    const brandIdentity: BrandIdentity = JSON.parse(identityResponse.text);

    // Step 2: Logos
    onProgress("Generating logo concepts...");
    const logos = await generateLogo(
      brandIdentity.companyName,
      brief,
      'modern',
      brandIdentity.colors.join(', '),
      'imagen-4.0-ultra-generate-001',
      4,
      undefined,
      systemInstruction
    );
    if (logos.length === 0) throw new Error("Logo generation failed.");

    // Step 3: Hero Image
    onProgress("Creating hero image...");
    const heroImagePrompt = `Create a stunning, cinematic, photorealistic hero image for a website for "${brandIdentity.companyName}". The mood is ${brandIdentity.mood.join(', ')}. The campaign is about: ${brief}. The image should be visually captivating and high-quality, suitable for a main banner. Do not include any text.`;
    const heroImages = await generateImages(heroImagePrompt, 1, "16:9", 'cinematic', 'imagen-4.0-generate-001', undefined, systemInstruction);
    if (heroImages.length === 0) throw new Error("Hero image generation failed.");
    const heroImage = heroImages[0];

    // Step 4: Ad Copy
    onProgress("Writing ad copy...");
    const adCopy = await generateAdCopy(
        brandIdentity.companyName, 
        brief, 
        brandIdentity.targetAudience, 
        brandIdentity.mood[0] || 'professional', 
        'Learn More',
        systemInstruction
    );

    // Step 5: Social Video
    onProgress("Producing social media video...");
    const videoPrompt = `Create a short, captivating, and visually engaging video (5-10 seconds) for social media. The video is for "${brandIdentity.companyName}" and should reflect a ${brandIdentity.mood.join(', ')} mood. The theme is: ${brief}. Use dynamic camera motion and cinematic visuals.`;
    // The video generator progress will be passed through via its own onProgress callback
    const socialVideoUrl = await generateVideo(videoPrompt, "9:16", 'veo-2.0-generate-001', onProgress, undefined, systemInstruction);
    
    onProgress("Campaign generation complete!");
    return { brandIdentity, logos, heroImage, adCopy, socialVideoUrl };

  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'campaign'));
  }
};

export const generatePodcastScript = async (topic: string, systemInstruction?: string): Promise<PodcastScriptLine[]> => {
    try {
        const scriptPrompt = `
            You are a podcast script writer. Based on the user's topic, create an engaging podcast script.
            The response must be a valid JSON array of objects, where each object represents a line in the script.
            Each object must have two properties:
            1. "speaker": A string identifying the speaker (e.g., "Narrator", "Host", "Guest 1"). If there's only one speaker, use "Narrator".
            2. "line": A string of the text to be spoken.

            Keep the script concise and conversational.

            User's Topic: "${topic}"
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: scriptPrompt,
            config: {
                systemInstruction: systemInstruction || "You are a creative and engaging scriptwriter for audio content.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            speaker: { type: Type.STRING },
                            line: { type: Type.STRING },
                        },
                        required: ['speaker', 'line'],
                    }
                }
            }
        });

        const script = JSON.parse(response.text);
        if (!Array.isArray(script) || script.length === 0) {
            throw new Error("The AI failed to generate a valid script structure. Please try a different topic.");
        }
        return script;
    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'podcast'));
    }
};

export const generateSpeech = async (text: string, voice: string): Promise<string> => {
  try {
    // NOTE: The @google/genai SDK documentation provided does not explicitly detail a non-streaming
    // Text-to-Speech endpoint. This implementation is based on an extrapolation of the 'live' API's
    // configuration, assuming a similar structure can be used with generateContent for single audio outputs.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Synthesize the following text into speech: "${text}"`,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                // Available voices from Dialog TTS documentation include Zephyr, Puck, Charon, Kore, and Fenrir.
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
            },
        },
    });

    const audioPart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
    if (audioPart?.inlineData && audioPart.inlineData.mimeType.startsWith('audio/')) {
        return audioPart.inlineData.data; // This is the base64 encoded audio string
    } else {
        const textPart = response.candidates?.[0]?.content.parts.find(p => p.text);
        if (textPart?.text) {
          throw new Error(`Speech generation failed. Model response: ${textPart.text}`);
        }
        throw new Error("Speech generation failed to return audio data.");
    }
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'podcast'));
  }
};