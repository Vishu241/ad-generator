import axios from 'axios';
import * as cheerio from 'cheerio';

// Scrape content from URL
export async function scrapeContent(url) {
  try {
    console.log('🌐 Attempting to scrape:', url);
    
    const response = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; AdGenerator/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      },
      timeout: 15000,
      maxRedirects: 5
    });
    
    console.log('✅ HTTP response received:', response.status, response.statusText);
    
    const $ = cheerio.load(response.data);
    $('script, style, nav, header, footer, .advertisement, .ads, .social-share').remove();
    
    const content = [];
    $('p, h1, h2, h3, h4, h5, h6').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) {
        content.push({
          type: el.tagName.toLowerCase(),
          text: text,
          wordCount: text.split(/\s+/).length
        });
      }
    });
    
    console.log('📄 Content extracted:', content.length, 'sections');
    
    if (content.length === 0) {
      console.log('⚠️ No content found, trying alternative selectors...');
      // Try alternative content selectors
      $('div[class*="content"], div[class*="article"], div[class*="post"], div[class*="story"]').find('p, h1, h2, h3').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 20) {
          content.push({
            type: el.tagName.toLowerCase(),
            text: text,
            wordCount: text.split(/\s+/).length
          });
        }
      });
    }
    
    if (content.length === 0) {
      return { success: false, error: 'No readable content found on this page. The page might be behind a paywall or use dynamic content loading.' };
    }
    
    return {
      success: true,
      title: $('title').text().trim() || $('h1').first().text().trim() || 'Article',
      content: content.slice(0, 20)
    };
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    console.error('🔍 Error details:', error.code, error.response?.status, error.response?.statusText);
    
    let errorMessage = 'Failed to fetch content from URL';
    
    if (error.code === 'ENOTFOUND') {
      errorMessage = 'URL not found or unreachable';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused by server';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Request timed out - server took too long to respond';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access forbidden - website blocked our request';
    } else if (error.response?.status === 404) {
      errorMessage = 'Page not found (404)';
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error on target website';
    }
    
    return { success: false, error: errorMessage };
  }
}
