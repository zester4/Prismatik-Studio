import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { AspectRatio, StoryScene, AdCopy, ArticleBlock } from '../types';

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
const getFriendlyErrorMessage = (error: unknown, context: 'image' | 'video' | 'story' | 'logo' | 'ad' | 'article'): string => {
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
  negativePrompt?: string
): Promise<string[]> => {
  try {
    let finalPrompt = style && style !== 'none'
      ? `${prompt.trim()}, in the style of ${style}`
      : prompt.trim();
      
    // Add a quality booster for detailed styles on Imagen models
    if (model.startsWith('imagen-') && style !== 'none') {
        finalPrompt += ', high quality, 8k resolution, cinematic lighting, highly detailed';
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

export const generateVideo = async (
  prompt: string, 
  aspectRatio: AspectRatio, 
  model: string,
  onProgress: (message: string) => void,
  image?: { mimeType: string; data: string }
): Promise<string> => {
  try {
    onProgress("Starting video generation...");
    let operation = await ai.models.generateVideos({
      model,
      prompt,
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
  characterImage?: { mimeType: string; data: string }
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
      Analyze the user's story idea for its underlying tone (e.g., humorous, suspenseful, adventurous, heartwarming).
      Based on the story idea, create a sequence of ${numberOfScenes} scenes that form a cohesive and logical narrative.
      
      ${characterDescription ? `
      !! CRITICAL CHARACTER CONSISTENCY DIRECTIVE !!
      The following description is the absolute, non-negotiable visual blueprint for the main character. You must adhere to it with extreme precision in every single image prompt you generate. Any deviation is a failure.
      - **Character Blueprint:** "${characterDescription}".
      - **Visual Checklist:** For each scene, mentally check off all features from the blueprint (hair, clothing, face, etc.) to ensure a perfect match.
      - **No Deviations:** The character's appearance, clothing, and key features must remain identical unless the narrative explicitly calls for a change (e.g., 'she put on a hat').
      ` : ''}

      For each scene, provide two outputs:
      1. 'image_prompt': A detailed visual prompt for an image generator. This prompt MUST be a direct and faithful visual representation of the action, characters, and setting described in the 'narrative_text'. The image should have an aspect ratio of ${aspectRatio}. It must rigorously follow all consistency directives.
      2. 'narrative_text': A narrative text for the scene. This text must match the story's identified tone, advance the plot, and be ${lengthInstruction}.

      Story Idea: "${prompt}"
    `;
    
    const sceneGenerationResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: storyPlannerPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  image_prompt: { type: Type.STRING, description: "A detailed visual prompt for an image generator." },
                  narrative_text: { type: Type.STRING, description: "A short narrative text for the scene." }
                }
              }
            }
          }
        }
      }
    });

    const storyPlan = JSON.parse(sceneGenerationResponse.text);
    if (!storyPlan.scenes || storyPlan.scenes.length === 0) {
        throw new Error("The AI failed to create a story plan from your prompt. This can happen with very abstract ideas. Please try rephrasing your prompt with more concrete details.");
    }

    const scenes: StoryScene[] = [];
    const totalScenes = storyPlan.scenes.length;

    for (let i = 0; i < totalScenes; i++) {
        const sceneData = storyPlan.scenes[i];
        onProgress(`Generating image for scene ${i + 1} of ${totalScenes}...`);

        const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [{ text: sceneData.image_prompt }] },
            config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        let imageUrl = '';
        if (imageResponse.candidates && imageResponse.candidates.length > 0) {
            for (const part of imageResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                    imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    break;
                }
            }
        }

        if (!imageUrl) {
          throw new Error(`The story plan was created, but image generation failed for scene ${i + 1}. The Gemini model did not return an image. This might be a temporary issue.`);
        }

        scenes.push({
            imageUrl,
            text: sceneData.narrative_text,
            imagePrompt: sceneData.image_prompt,
        });
    }
    
    onProgress("Story ready!");
    return scenes;

  } catch (error) {
    if (error instanceof Error && (error.message.startsWith('The AI failed') || error.message.startsWith('The story plan was created'))) {
        throw error;
    }
    throw new Error(getFriendlyErrorMessage(error, 'story'));
  }
};

export const generateLogo = async (
  companyName: string,
  description: string,
  style: string,
  colors: string,
  model: string,
  numberOfImages: number,
  slogan?: string
): Promise<string[]> => {
  try {
    const sloganPart = slogan ? ` The company's slogan is "${slogan}".` : '';
    const conceptRequest = numberOfImages > 1 
      ? `Generate ${numberOfImages} distinct logo concepts.`
      : `Generate a single logo concept.`;

    const finalPrompt = `
      You are a world-class logo designer and branding expert. Your task is to create a professional, creative, and highly effective logo for a company named "${companyName}".${sloganPart}
      The company is best described as: "${description}".

      **Core Design Principles (NON-NEGOTIABLE):**
      - **Simplicity & Memorability:** The design must be clean, simple, and instantly memorable. Avoid clutter and unnecessary details.
      - **Scalability & Versatility:** The logo must be effective at any size, from a tiny favicon to a large billboard. It must also work perfectly in a single color (monochrome).
      - **Symbolism:** The design should be a powerful symbol of the company's essence, not a literal illustration. Think abstractly about how to represent the brand's values.
      - **Style:** The logo's aesthetic must strictly be **${style}**.
      - **Color Palette:** Strictly use a color palette of **${colors}**.
      - **Format:** The output MUST be a clean, vector-style graphic on a solid white background. DO NOT create photorealistic images, complex scenes, or detailed backgrounds. Avoid text unless it is masterfully integrated into the design.
      
      ${conceptRequest}
    `;

    if (model.startsWith('imagen-')) {
      const response = await ai.models.generateImages({
        model: model,
        prompt: finalPrompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
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
      
      if (images.length === 0) {
        throw new Error("The Gemini model did not return an image. Please try a different prompt or model.");
      }

      return images;
    }
    
    throw new Error(`Unsupported logo model: ${model}`);

  } catch (error) {
     if (error instanceof Error && error.message.startsWith('The Gemini model')) {
        throw error;
    }
    throw new Error(getFriendlyErrorMessage(error, 'logo'));
  }
};


export const generateAd = async (
  productName: string,
  description: string,
  audience: string,
  tone: string,
  cta: string,
  productImage?: { mimeType: string; data: string }
): Promise<{ mediaUrl: string; adCopy: AdCopy }> => {
  try {
    const imageTaskPrompt = productImage
      ? `1.  **Generate a new Image:** Create a visually stunning advertisement image. Take the product from the user-uploaded image and place it in a professional, contextually appropriate setting that aligns with the target audience and tone. The final image should be clean, high-quality, and eye-catching. Do NOT include any text on the image.`
      : `1.  **Generate a new Image:** Create a visually stunning advertisement image from scratch based on the product name and description. The image should be professional, contextually appropriate, and align with the target audience and tone. Imagine what the product looks like and create a lifestyle or studio shot. The final image should be clean, high-quality, and eye-catching. Do NOT include any text on the image.`;

    const prompt = `
      You are an expert advertising creative director. Your task is to generate a complete ad campaign from a product description.

      **Product Information:**
      - Name: ${productName}
      - Description: ${description}
      - Target Audience: ${audience}
      - Desired Tone: ${tone}
      - Call to Action: ${cta}

      **Your Tasks:**

      ${imageTaskPrompt}

      2.  **Generate Ad Copy:** Write compelling ad copy that matches the new image and product details. The copy must be persuasive and effective for the specified target audience.

      **Output Format:**
      You must return TWO parts in your response:
      - The generated advertisement **image**.
      - A **text** part containing a single, valid JSON object with the following structure: { "headline": "string", "body": "string", "cta": "string" }.
    `;
    
    // Fix: Re-structured `parts` initialization to be type-safe. The previous
    // implementation caused a TypeScript error because it tried to add an
    // image part to an array inferred as containing only text parts.
    const parts = [];
    if (productImage) {
        parts.push({
            inlineData: {
                mimeType: productImage.mimeType,
                data: productImage.data,
            },
        });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let mediaUrl = '';
    let adCopy: AdCopy | null = null;
    let rawJson = '';

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          mediaUrl = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          rawJson = part.text;
          try {
            const jsonMatch = rawJson.match(/```json\s*([\s\S]*?)\s*```/);
            const jsonString = jsonMatch ? jsonMatch[1] : rawJson;
            adCopy = JSON.parse(jsonString) as AdCopy;
          } catch (jsonError) {
            console.error("Failed to parse JSON from model response:", rawJson);
          }
        }
      }
    }
    
    if (!mediaUrl || !adCopy) {
      if (!adCopy && rawJson) {
         throw new Error(`The AI generated an image but failed to create valid ad copy JSON. Please try again. Raw output: ${rawJson}`);
      }
       throw new Error("The AI failed to generate a complete ad (image and text). This could be due to a complex request or a temporary model issue. Please try again.");
    }
    
    return { mediaUrl, adCopy };

  } catch (error) {
    if (error instanceof Error && error.message.startsWith('The AI failed')) {
        throw error;
    }
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
  productImage?: { mimeType: string; data: string }
): Promise<{ mediaUrl: string; adCopy: AdCopy }> => {
  try {
    onProgress("Generating video script and ad copy...");

    const videoPromptTask = productImage
      ? `1.  **Generate a Video Prompt:** Create a concise, descriptive prompt for an AI video generator. The prompt should describe a 5-7 second dynamic video that animates or showcases the provided product image in an exciting way. The video should be visually engaging and align with the specified tone and audience. For example: "A cinematic close-up of the HydroFlow bottle, condensation dripping down its side, intercut with quick shots of a hiker drinking from it on a mountain summit at sunrise."`
      : `1.  **Generate a Video Prompt:** Create a concise, descriptive prompt for an AI video generator. Since no product image is provided, the prompt must first vividly describe the product based on its name and description, then detail a 5-7 second dynamic video that showcases it in an exciting way. The video should be visually engaging and align with the specified tone and audience. For example: "A sleek, matte black water bottle (the HydroFlow) with a silver logo. A cinematic close-up of the bottle, condensation dripping down its side, intercut with quick shots of a hiker drinking from it on a mountain summit at sunrise."`;

    const scriptGenPrompt = `
      You are an expert advertising creative director. Your task is to generate a script for a short video ad and the accompanying ad copy.

      **Product Information:**
      - Name: ${productName}
      - Description: ${description}
      - Target Audience: ${audience}
      - Desired Tone: ${tone}
      - Call to Action: ${cta}

      **Your Tasks:**

      ${videoPromptTask}

      2.  **Generate Ad Copy:** Write compelling ad copy that matches the video concept and product details.

      **Output Format:**
      You must return a single, valid JSON object with the following structure: { "video_prompt": "string", "ad_copy": { "headline": "string", "body": "string", "cta": "string" } }.
    `;

    const scriptResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: scriptGenPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            video_prompt: { type: Type.STRING },
            ad_copy: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                body: { type: Type.STRING },
                cta: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const scriptData = JSON.parse(scriptResponse.text);
    if (!scriptData.video_prompt || !scriptData.ad_copy) {
      throw new Error("Failed to generate a valid video script and ad copy.");
    }
    
    const { video_prompt: videoPrompt, ad_copy: adCopy } = scriptData;

    onProgress("Generating video ad...");
    
    const mediaUrl = await generateVideo(
      videoPrompt,
      "16:9",
      'veo-2.0-generate-001',
      onProgress,
      productImage
    );

    return { mediaUrl, adCopy };

  } catch (error) {
    if (error instanceof Error && error.message.startsWith('The AI failed')) {
        throw error;
    }
    throw new Error(getFriendlyErrorMessage(error, 'ad'));
  }
};

export const generateArticle = async (
  topic: string,
  articleType: string,
  writingStyle: string,
  numImages: number,
  onProgress: (message: string) => void
): Promise<{ title: string, content: ArticleBlock[] }> => {
  try {
    onProgress("Generating article outline...");

    const outlinePrompt = `
      You are an expert content strategist. Create a detailed outline for a '${articleType}' about '${topic}'.
      The writing style should be '${writingStyle}'.
      The article should have a clear title and a structured body.
      The body must be composed of a mix of 'heading' and 'paragraph' sections.
      It must also include exactly ${numImages} 'image' sections, strategically placed to be relevant to the surrounding text.
      For each 'image' section, provide a detailed, descriptive prompt for an AI image generator.

      Your output must be a single JSON object.
    `;
    
    const outlineResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: outlinePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Can be 'heading', 'paragraph', or 'image'." },
                  topic: { type: Type.STRING, description: "The topic for the heading or paragraph." },
                  image_prompt: { type: Type.STRING, description: "A prompt for the image generator." }
                }
              }
            }
          }
        }
      }
    });

    const outline = JSON.parse(outlineResponse.text);
    if (!outline.title || !outline.body || outline.body.length === 0) {
      throw new Error("The AI failed to create a valid article outline. Please try a different topic.");
    }

    const content: ArticleBlock[] = [];
    const totalSteps = outline.body.length;

    for (let i = 0; i < totalSteps; i++) {
      const item = outline.body[i];
      onProgress(`Processing section ${i + 1} of ${totalSteps}...`);

      if (item.type === 'heading' || item.type === 'paragraph') {
        const textPrompt = `Write a ${item.type} for a '${articleType}' about '${topic}'. The writing style must be '${writingStyle}'. The specific topic for this section is: '${item.topic}'.`;
        const textResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: textPrompt,
        });
        content.push({
          id: crypto.randomUUID(),
          type: item.type,
          content: textResponse.text.trim(),
        });
      } else if (item.type === 'image' && item.image_prompt) {
        onProgress(`Generating image ${content.filter(c => c.type === 'image').length + 1} of ${numImages}...`);
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image-preview',
          contents: { parts: [{ text: item.image_prompt }] },
          config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
        });
        
        let imageUrl = '';
        if (imageResponse.candidates && imageResponse.candidates.length > 0) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }
        if (!imageUrl) {
            console.warn(`Image generation failed for prompt: "${item.image_prompt}". Skipping.`);
            continue; // Skip adding the image block if generation fails
        }
        content.push({
          id: crypto.randomUUID(),
          type: 'image',
          imageUrl,
          imagePrompt: item.image_prompt,
        });
      }
    }
    
    onProgress("Article ready!");
    return { title: outline.title, content };

  } catch (error) {
     if (error instanceof Error && error.message.startsWith('The AI failed')) {
        throw error;
    }
    throw new Error(getFriendlyErrorMessage(error, 'article'));
  }
};