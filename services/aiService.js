import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAdHTML } from '../utils/adUtils.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Generate AI ads with retry mechanism
export async function generateAds(content, retryCount = 0) {
  const contentText = content.map(p => p.text).join(' ').substring(0, 500);
  
  const prompt = `Create 2 contextual ads for this content:
"${contentText}"

Format:
AD 1:
Headline: [headline]
Text: [ad text]
CTA: [call to action]

AD 2:
Headline: [headline]  
Text: [ad text]
CTA: [call to action]

Keep ads relevant and professional.`;

  try {
    console.log('🤖 Starting AI ad generation...');
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    console.log('✅ AI response received:', response.substring(0, 100) + '...');
    
    const ads = parseAdsFromResponse(response);
    console.log('📝 Parsed ads count:', ads.length);
    return { success: true, ads: ads.length > 0 ? ads : getDefaultAds(), aiWorking: true };
  } catch (error) {
    console.error('❌ AI generation failed:', error.message);
    console.error('🔍 Full error:', error);
    
    const isOverloaded = error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('Service Unavailable');
    
    if (isOverloaded && retryCount < 2) {
      console.log(`🔄 Retrying AI request... (attempt ${retryCount + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return generateAds(content, retryCount + 1);
    }
    
    return { 
      success: false, 
      ads: getDefaultAds(), 
      aiWorking: false, 
      error: isOverloaded ? 'AI service is currently overloaded. Using fallback content.' : 'AI service temporarily unavailable. Using fallback content.'
    };
  }
}

// Generate AI summary with single ad and retry mechanism
export async function generateSummaryWithAd(content, title, retryCount = 0) {
  const contentText = content.map(p => p.text).join(' ').substring(0, 1000);
  
  const prompt = `Analyze this article and provide:
1. A concise summary (2-3 sentences)
2. Key points (3-4 bullet points)
3. One contextual advertisement

Article: "${title}"
Content: "${contentText}"

Format your response as:
SUMMARY:
[2-3 sentence summary]

KEY POINTS:
• [point 1]
• [point 2]
• [point 3]
• [point 4]

ADVERTISEMENT:
Headline: [relevant headline]
Text: [compelling ad text]
CTA: [call to action]

Keep everything concise and relevant.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    const parsed = parseSummaryResponse(response);
    return { ...parsed, aiWorking: true, error: null };
  } catch (error) {
    console.error('AI summary generation failed:', error.message);
    
    const isOverloaded = error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('Service Unavailable');
    
    if (isOverloaded && retryCount < 2) {
      console.log(`🔄 Retrying AI summary request... (attempt ${retryCount + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return generateSummaryWithAd(content, title, retryCount + 1);
    }
    
    const fallback = getDefaultSummary(title, content);
    return { 
      ...fallback, 
      aiWorking: false, 
      error: isOverloaded ? 'AI service is currently overloaded. Showing fallback summary.' : 'AI service temporarily unavailable. Showing fallback summary.'
    };
  }
}

// Parse AI response into ad objects
function parseAdsFromResponse(response) {
  const ads = [];
  const adBlocks = response.split(/AD \d+:/);
  
  adBlocks.forEach((block, index) => {
    if (index === 0) return;
    
    const headlineMatch = block.match(/Headline:\s*(.+)/);
    const textMatch = block.match(/Text:\s*(.+)/);
    const ctaMatch = block.match(/CTA:\s*(.+)/);
    
    if (headlineMatch && textMatch && ctaMatch) {
      const adType = index % 2 === 1 ? 'banner' : 'inline';
      ads.push({
        type: adType,
        headline: headlineMatch[1].trim(),
        text: textMatch[1].trim(),
        cta: ctaMatch[1].trim(),
        html: createAdHTML(adType, headlineMatch[1].trim(), textMatch[1].trim(), ctaMatch[1].trim())
      });
    }
  });
  
  return ads;
}

// Parse AI summary response
function parseSummaryResponse(response) {
  const summaryMatch = response.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|ADVERTISEMENT:|$)/);
  const keyPointsMatch = response.match(/KEY POINTS:\s*([\s\S]*?)(?=ADVERTISEMENT:|$)/);
  const adMatch = response.match(/ADVERTISEMENT:\s*([\s\S]*?)$/);
  
  let summary = summaryMatch ? summaryMatch[1].trim() : 'AI-generated summary not available.';
  let keyPoints = [];
  let ad = null;
  
  // Parse key points
  if (keyPointsMatch) {
    keyPoints = keyPointsMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.replace('•', '').trim())
      .filter(point => point.length > 0);
  }
  
  // Parse advertisement
  if (adMatch) {
    const adText = adMatch[1];
    const headlineMatch = adText.match(/Headline:\s*(.+)/);
    const textMatch = adText.match(/Text:\s*(.+)/);
    const ctaMatch = adText.match(/CTA:\s*(.+)/);
    
    if (headlineMatch && textMatch && ctaMatch) {
      ad = {
        headline: headlineMatch[1].trim(),
        text: textMatch[1].trim(),
        cta: ctaMatch[1].trim(),
        html: createAdHTML('banner', headlineMatch[1].trim(), textMatch[1].trim(), ctaMatch[1].trim())
      };
    }
  }
  
  return {
    summary,
    keyPoints,
    ad: ad || {
      headline: 'Discover More Content',
      text: 'Explore related articles and insights.',
      cta: 'Read More',
      html: createAdHTML('banner', 'Discover More Content', 'Explore related articles and insights.', 'Read More')
    }
  };
}

// Default ads fallback
function getDefaultAds() {
  return [{
    type: 'banner',
    headline: 'Discover Amazing Products',
    text: 'Find what you need with our curated selection.',
    cta: 'Shop Now',
    html: createAdHTML('banner', 'Discover Amazing Products', 'Find what you need with our curated selection.', 'Shop Now')
  }];
}

// Enhanced default summary fallback
function getDefaultSummary(title, content) {
  const firstParagraph = content.find(p => p.type === 'p')?.text || 'Content summary not available.';
  const contentLength = content.length;
  
  // Extract key topics from headings
  const headings = content.filter(p => ['h1', 'h2', 'h3'].includes(p.type)).map(h => h.text);
  const topics = headings.length > 0 ? headings.slice(0, 3) : ['Main topic discussed', 'Key information provided', 'Important insights shared'];
  
  return {
    summary: `This article "${title}" contains ${contentLength} sections covering various topics. ${firstParagraph.substring(0, 180)}${firstParagraph.length > 180 ? '...' : ''}`,
    keyPoints: [
      ...topics.map(topic => `${topic.substring(0, 80)}${topic.length > 80 ? '...' : ''}`),
      'Additional insights and information provided'
    ].slice(0, 4),
    ad: {
      headline: 'Discover More Content',
      text: 'Explore related articles and insights on similar topics.',
      cta: 'Read More',
      html: createAdHTML('banner', 'Discover More Content', 'Explore related articles and insights on similar topics.', 'Read More')
    }
  };
}
