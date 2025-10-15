import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { AspectRatio, StoryScene, AdCopy, ArticleBlock, BrandIdentity, PodcastScriptLine, HistoryItemCampaign } from '../types';

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
const getFriendlyErrorMessage = (error: unknown, context: 'image' | 'video' | 'story' | 'logo' | 'ad' | 'article' | 'campaign' | 'podcast' | 'text'): string => {
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

    // For Gemini, which doesn't support negativePrompt directly, append an instruction.
    if (negativePrompt && model.startsWith('gemini-')) {
        finalPrompt = `${finalPrompt}. Do not include: ${negativePrompt}`;
    }

    // For Gemini, which doesn't support negativePrompt directly, prepend it.
    if (negativePrompt && model.startsWith('gemini-')) {
        finalPrompt = `${finalPrompt}. Do not include: ${negativePrompt}`;
    }

    // For Gemini, which doesn't support negativePrompt directly, prepend it.
    if (negativePrompt && model.startsWith('gemini-')) {
        finalPrompt = `${finalPrompt}. Do not include: ${negativePrompt}`;
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
      if (images.length === 0) {
          throw new Error("The model did not return an image. It might have responded with text instead. Check the safety settings or refine your prompt.");
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
    const model = 'gemini-2.5-flash-image';
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
      2.  **imagePrompt**: A detailed, descriptive prompt for an AI image generator to create the scene's illustration. This prompt must be in English. It should describe the scene's composition, characters, actions, environment, and mood. Crucially, if a main character description is provided, ensure it is integrated into every single image prompt to maintain character consistency. The overall style should be consistent across all prompts.
    `;
    
    const response = await ai.models.generateContent({
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
                    text: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING },
                  },
                  required: ["text", "imagePrompt"],
                },
              },
            },
            required: ["scenes"],
          },
          systemInstruction: systemInstruction || undefined,
        },
    });

    const storyPlan = JSON.parse(response.text);
    const scenesToGenerate = storyPlan.scenes as { text: string; imagePrompt: string }[];
    const finalScenes: StoryScene[] = [];

    onProgress(`Story plan created. Generating ${scenesToGenerate.length} scene images...`);

    for (let i = 0; i < scenesToGenerate.length; i++) {
        const scene = scenesToGenerate[i];
        onProgress(`Generating image for scene ${i + 1}/${scenesToGenerate.length}...`);
        
        const imageUrls = await generateImages(
            scene.imagePrompt, 
            1, 
            aspectRatio, 
            'none',
            'gemini-2.5-flash-image-preview',
            undefined,
            systemInstruction
        );

        if (imageUrls.length === 0) {
            throw new Error(`Failed to generate an image for scene ${i + 1}.`);
        }
        
        finalScenes.push({
            imageUrl: imageUrls[0],
            text: scene.text,
            imagePrompt: scene.imagePrompt,
        });
    }

    onProgress("Story generation complete!");
    return finalScenes;

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
      Create a professional, text-free logo concept for a company named "${companyName}".
      ${slogan ? `Their slogan is "${slogan}".` : ''}
      Company Description: "${description}".
      The logo must be in a "${style}" style.
      The primary color palette should be: ${colors}.
      The logo should be clean, iconic, and suitable for a modern brand. Do not include any text or letters in the logo itself. Focus on a symbolic or abstract mark.
    `;

    const images = await generateImages(
      prompt,
      numberOfConcepts,
      "1:1",
      'none',
      model,
      model.startsWith('imagen-') ? "text, letters, words, font, blurry, signature" : undefined,
      systemInstruction,
    );
    return images;

  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'logo'));
  }
};

export const generateAd = async (
    productName: string,
    description: string,
    audience: string,
    tone: string,
    cta: string,
    image?: { mimeType: string; data: string },
    systemInstruction?: string,
): Promise<{ mediaUrl: string; adCopy: AdCopy; }> => {
    try {
        const adCopyPrompt = `
            Generate ad copy for a product. The tone should be ${tone}.
            - Product Name: ${productName}
            - Description: ${description}
            - Target Audience: ${audience}
            - Call to Action: ${cta}
        `;
        const copyResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: adCopyPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        body: { type: Type.STRING },
                        cta: { type: Type.STRING },
                    },
                    required: ["headline", "body", "cta"],
                },
                systemInstruction: systemInstruction || "You are a professional marketing copywriter.",
            }
        });
        const adCopy: AdCopy = JSON.parse(copyResponse.text);

        let mediaUrl: string;
        const imagePrompt = `
            Create a professional, high-quality advertisement image for "${productName}".
            The ad's headline is "${adCopy.headline}".
            The target audience is ${audience}.
            The overall mood should be ${tone}.
            The image should be visually appealing and showcase the product or its benefits as described: ${description}.
            This is for a social media ad, so it should be eye-catching. No text on the image.
        `;

        if (image) {
            const editPrompt = `
                Turn this user-provided image into a professional advertisement for "${productName}".
                The ad's headline is "${adCopy.headline}".
                The target audience is ${audience}.
                The overall mood should be ${tone}.
                Enhance the lighting, composition, and background to make it look like a high-quality product ad. Do not add any text.
            `;
            mediaUrl = await editImage(editPrompt, image, systemInstruction);
        } else {
            const images = await generateImages(imagePrompt, 1, "16:9", 'photorealistic', 'imagen-4.0-generate-001', 'text, words, letters', systemInstruction);
            if (images.length === 0) throw new Error("Failed to generate ad image.");
            mediaUrl = images[0];
        }

        return { mediaUrl, adCopy };
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
    systemInstruction?: string,
): Promise<{ mediaUrl: string; adCopy: AdCopy; }> => {
    try {
        onProgress("Generating ad copy...");
         const adCopyPrompt = `
            Generate ad copy for a product. The tone should be ${tone}.
            - Product Name: ${productName}
            - Description: ${description}
            - Target Audience: ${audience}
            - Call to Action: ${cta}
        `;
        const copyResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: adCopyPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        body: { type: Type.STRING },
                        cta: { type: Type.STRING },
                    },
                    required: ["headline", "body", "cta"],
                },
                systemInstruction: systemInstruction || "You are a professional marketing copywriter.",
            }
        });
        const adCopy: AdCopy = JSON.parse(copyResponse.text);

        onProgress("Generating video prompt...");
        const videoPrompt = `
            Create a short, dynamic, 5-second video advertisement for "${productName}".
            The ad's headline is "${adCopy.headline}".
            The target audience is ${audience}.
            The overall mood should be ${tone}.
            The video should be cinematic and visually engaging, highlighting the product's key features or benefits: ${description}.
        `;

        const mediaUrl = await generateVideo(videoPrompt, "16:9", 'veo-2.0-generate-001', onProgress, image, systemInstruction);

        return { mediaUrl, adCopy };
    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'ad'));
    }
};

export const generateArticle = async (
  prompt: string,
  articleType: string,
  writingStyle: string,
  numImages: number,
  onProgress: (message: string) => void,
  systemInstruction?: string,
): Promise<{ title: string; content: ArticleBlock[] }> => {
  try {
    onProgress("Creating article plan...");
    const planPrompt = `
      Create a plan for an article about "${prompt}".
      The article type is "${articleType}".
      The writing style should be "${writingStyle}".
      The plan should include:
      1. A compelling title for the article.
      2. A list of 3-5 section headings.
      3. For each of the ${numImages} images, provide a detailed, descriptive prompt for an AI image generator that is contextually relevant to the article's sections.
    `;
    const planResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: planPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              headings: { type: Type.ARRAY, items: { type: Type.STRING } },
              imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["title", "headings", "imagePrompts"],
          },
          systemInstruction: systemInstruction || undefined,
        },
    });
    const plan = JSON.parse(planResponse.text);

    const content: ArticleBlock[] = [];
    
    onProgress(`Writing introduction...`);
    const introPrompt = `Write the introduction (2-3 paragraphs) for an article titled "${plan.title}" about "${prompt}". The style is "${writingStyle}". Do not include the title in your response.`;
    const introResponse = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: introPrompt, config: { systemInstruction: systemInstruction || undefined }});
    content.push({ id: crypto.randomUUID(), type: 'paragraph', content: introResponse.text });
    
    for (const heading of plan.headings) {
        onProgress(`Writing section: "${heading}"...`);
        const sectionPrompt = `Write the content (2-4 paragraphs) for the section titled "${heading}" in an article about "${prompt}". The main title is "${plan.title}". Style: "${writingStyle}". Do not repeat the heading.`;
        const sectionResponse = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: sectionPrompt, config: { systemInstruction: systemInstruction || undefined }});
        content.push({ id: crypto.randomUUID(), type: 'heading', content: heading });
        content.push({ id: crypto.randomUUID(), type: 'paragraph', content: sectionResponse.text });
    }

    if (plan.imagePrompts && plan.imagePrompts.length > 0) {
        const imageInsertInterval = Math.max(1, Math.floor(content.filter(b => b.type !== 'image').length / plan.imagePrompts.length));
        let contentIndex = 0;
        for (const imagePrompt of plan.imagePrompts) {
            onProgress(`Generating image: "${imagePrompt.substring(0, 40)}..."`);
            const imageUrls = await generateImages(imagePrompt, 1, "16:9", 'photorealistic', 'imagen-4.0-generate-001', undefined, systemInstruction);
            if (imageUrls.length > 0) {
                const imageBlock: ArticleBlock = { id: crypto.randomUUID(), type: 'image', imageUrl: imageUrls[0], imagePrompt };
                contentIndex += imageInsertInterval;
                content.splice(contentIndex, 0, imageBlock);
                contentIndex++;
            }
        }
    }

    onProgress("Article generation complete!");
    return { title: plan.title, content };
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'article'));
  }
};

export const proofreadText = async (
  text: string,
): Promise<string> => {
    try {
        const prompt = `
            Please proofread the following text for any spelling and grammar errors.
            Only return the corrected text, without any commentary or explanations.

            Text to proofread:
            ---
            ${text}
            ---
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'text'));
    }
};

export const generateCampaign = async (
  prompt: string,
  onProgress: (message: string) => void,
  systemInstruction?: string,
): Promise<Omit<HistoryItemCampaign, 'id' | 'timestamp' | 'type' | 'prompt'>> => {
  try {
    onProgress("Developing brand strategy...");
    const planPrompt = `
      Based on the user's brief, generate a complete brand identity and initial ad copy.
      User Brief: "${prompt}"
    `;
    const planResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: planPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brandIdentity: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                mood: { type: Type.ARRAY, items: { type: Type.STRING } },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetAudience: { type: Type.STRING },
              },
              required: ["companyName", "colors", "mood", "keywords", "targetAudience"],
            },
            adCopy: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                body: { type: Type.STRING },
                cta: { type: Type.STRING },
              },
              required: ["headline", "body", "cta"],
            },
          },
          required: ["brandIdentity", "adCopy"],
        },
        systemInstruction: systemInstruction || "You are a creative director and brand strategist.",
      },
    });
    const plan = JSON.parse(planResponse.text) as { brandIdentity: BrandIdentity; adCopy: AdCopy; };

    onProgress("Designing logo concepts...");
    const logos = await generateLogo(
      plan.brandIdentity.companyName,
      `A company with these keywords: ${plan.brandIdentity.keywords.join(', ')} and mood: ${plan.brandIdentity.mood.join(', ')}.`,
      'modern',
      plan.brandIdentity.colors.join(', '),
      'imagen-4.0-generate-001',
      4,
      undefined,
      systemInstruction
    );

    onProgress("Creating hero image...");
    const heroImagePrompt = `Create a high-quality, photorealistic hero image for the website of "${plan.brandIdentity.companyName}". The image should reflect the brand's mood (${plan.brandIdentity.mood.join(', ')}) and appeal to its target audience (${plan.brandIdentity.targetAudience}). Use the color palette: ${plan.brandIdentity.colors.join(', ')}.`;
    const heroImages = await generateImages(heroImagePrompt, 1, "16:9", 'photorealistic', 'imagen-4.0-generate-001', undefined, systemInstruction);
    if (heroImages.length === 0) throw new Error("Failed to generate hero image.");
    const heroImage = heroImages[0];
    
    onProgress("Producing social media video...");
    const videoPrompt = `Create a short, 5-second, eye-catching video for social media for "${plan.brandIdentity.companyName}". It should be dynamic, visually interesting, and aligned with the brand's mood (${plan.brandIdentity.mood.join(', ')}).`;
    const socialVideoUrl = await generateVideo(videoPrompt, "9:16", 'veo-2.0-generate-001', onProgress, undefined, systemInstruction);

    onProgress("Campaign generation complete!");
    return {
      brandIdentity: plan.brandIdentity,
      adCopy: plan.adCopy,
      logos,
      heroImage,
      socialVideoUrl,
    };
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'campaign'));
  }
};

export const generatePodcastScript = async (
    prompt: string,
    speakerNames: string[],
    format: string,
    tone: string,
    duration: string,
    systemInstruction?: string,
): Promise<PodcastScriptLine[]> => {
    try {
        const scriptPrompt = `
            Generate a podcast script with a target duration of approximately ${duration}.
            The format should be a ${format}.
            The tone of the podcast should be ${tone}.
            The script should be formatted with each line as "Speaker Name: Dialogue text".
            The available speakers are: ${speakerNames.join(', ')}.
            Topic: "${prompt}"
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: scriptPrompt,
            config: { systemInstruction: systemInstruction || "You are a professional podcast scriptwriter." },
        });

        const parsedScript = response.text.split('\n').filter(line => line.trim()).map(line => {
            const parts = line.split(':');
            if (parts.length > 1) {
                const speaker = parts[0].trim();
                const lineContent = parts.slice(1).join(':').trim();
                return { speaker, line: lineContent };
            }
            return { speaker: speakerNames[0] || 'Narrator', line: line.trim() };
        });

        // Ensure at least one line is returned
        if (parsedScript.length === 0 && response.text.trim()) {
            return [{ speaker: speakerNames[0] || 'Narrator', line: response.text.trim() }];
        }
        return parsedScript;


    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'podcast'));
    }
};

export const synthesizePodcast = async (
    script: PodcastScriptLine[],
    voiceAssignments: { [speaker: string]: string },
): Promise<string> => {
    try {
        const fullScriptText = script.map(line => `${line.speaker}: ${line.line}`).join('\n');
        
        const uniqueSpeakers = [...new Set(script.map(line => line.speaker))];
        
        if (uniqueSpeakers.length < 2) {
             const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: fullScriptText }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voiceAssignments[uniqueSpeakers[0]] || 'Zephyr' },
                        },
                    },
                },
            });

            const audioPart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
            if (audioPart?.inlineData) {
                return audioPart.inlineData.data;
            } else {
                throw new Error("Single-speaker audio synthesis failed to return audio data.");
            }
        }
        
        const speakerVoiceConfigs = uniqueSpeakers.map(speakerName => ({
            speaker: speakerName,
            voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceAssignments[speakerName] || 'Zephyr' }
            }
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: fullScriptText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: speakerVoiceConfigs
                    }
                }
            }
        });

        const audioPart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
        if (audioPart?.inlineData) {
            return audioPart.inlineData.data;
        } else {
            throw new Error("Multi-speaker audio synthesis failed to return audio data.");
        }
    } catch (error) {
        throw new Error(getFriendlyErrorMessage(error, 'podcast'));
    }
};