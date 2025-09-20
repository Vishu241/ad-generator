import axios from 'axios';
import * as cheerio from 'cheerio';

// Scrape content from URL
export async function scrapeContent(url) {
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AdGenerator/1.0)' },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    $('script, style, nav, header, footer').remove();
    
    const content = [];
    $('p, h1, h2, h3').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 30) {
        content.push({
          type: el.tagName.toLowerCase(),
          text: text,
          wordCount: text.split(/\s+/).length
        });
      }
    });
    
    return {
      success: true,
      title: $('title').text().trim() || 'Article',
      content: content.slice(0, 20)
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
