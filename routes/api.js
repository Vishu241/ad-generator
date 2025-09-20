import express from 'express';
import { scrapeContent } from '../services/scrapeService.js';
import { generateAds, generateSummaryWithAd } from '../services/aiService.js';
import { insertAds } from '../utils/adUtils.js';
import { generatePreviewHTML } from '../utils/htmlUtils.js';

const router = express.Router();

// Process URL and insert ads
router.post('/process', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  try {
    const scraped = await scrapeContent(url);
    if (!scraped.success) {
      return res.status(400).json({ error: scraped.error });
    }
    
    const adsResult = await generateAds(scraped.content);
    const processedContent = insertAds(scraped.content, adsResult.ads);
    
    res.json({
      success: true,
      title: scraped.title,
      originalSections: scraped.content.length,
      adsInserted: adsResult.ads.length,
      content: processedContent,
      aiWorking: adsResult.aiWorking,
      warning: adsResult.error || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate preview (POST)
router.post('/preview', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  try {
    const scraped = await scrapeContent(url);
    if (!scraped.success) {
      return res.status(400).json({ error: scraped.error });
    }
    
    const adsResult = await generateAds(scraped.content);
    const processedContent = insertAds(scraped.content, adsResult.ads);
    
    // Convert content to HTML format for inline display
    const formattedContent = processedContent.map(item => {
      if (item.isAd) {
        return {
          type: 'ad',
          html: item.html
        };
      } else {
        return {
          type: 'content',
          html: `<${item.type}>${item.text}</${item.type}>`
        };
      }
    });
    
    res.json({
      success: true,
      title: scraped.title,
      content: formattedContent,
      originalSections: scraped.content.length,
      adsInserted: adsResult.ads.length,
      aiWorking: adsResult.aiWorking,
      warning: adsResult.error || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate preview (GET)
router.get('/preview', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html><head><title>Error</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>❌ URL Required</h2>
        <p>Please provide a URL parameter: <code>/api/preview?url=https://example.com</code></p>
      </body></html>
    `);
  }
  
  try {
    const scraped = await scrapeContent(url);
    if (!scraped.success) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html><head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>❌ Scraping Failed</h2>
          <p>Error: ${scraped.error}</p>
        </body></html>
      `);
    }
    
    const ads = await generateAds(scraped.content);
    const processedContent = insertAds(scraped.content, ads.ads);
    
    const html = generatePreviewHTML(scraped.title, processedContent);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html><head><title>Error</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>❌ Server Error</h2>
        <p>Error: ${error.message}</p>
      </body></html>
    `);
  }
});

// Generate AI summary with ad
router.post('/summarize', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  try {
    const scraped = await scrapeContent(url);
    if (!scraped.success) {
      return res.status(400).json({ error: scraped.error });
    }
    
    const summaryData = await generateSummaryWithAd(scraped.content, scraped.title);
    
    res.json({
      success: true,
      title: scraped.title,
      summary: summaryData.summary,
      keyPoints: summaryData.keyPoints,
      ad: summaryData.ad,
      originalSections: scraped.content.length,
      aiWorking: summaryData.aiWorking,
      warning: summaryData.error || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', ai: 'Gemini 1.5 Flash' });
});

export default router;
