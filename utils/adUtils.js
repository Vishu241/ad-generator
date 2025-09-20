// Create HTML for ads (natural styling)
export function createAdHTML(type, headline, text, cta) {
  return `<div style="margin: 20px 0; padding: 0;">
    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 18px;">${headline}</h4>
    <p style="margin: 0 0 8px 0; color: #374151; line-height: 1.5;">${text}</p>
    <p style="margin: 0; color: #667eea; font-weight: 500;">${cta}</p>
    <div style="font-size: 11px; margin-top: 5px; color: #9ca3af;">Sponsored</div>
  </div>`;
}

// Insert ads into content
export function insertAds(content, ads) {
  if (content.length < 3) return content;
  
  const result = [...content];
  const positions = [Math.floor(content.length / 3), Math.floor(content.length * 2 / 3)];
  
  // Insert ads in reverse order to maintain indices
  positions.reverse().forEach((pos, index) => {
    if (ads[index]) {
      result.splice(pos, 0, {
        type: 'ad',
        html: ads[index].html,
        isAd: true
      });
    }
  });
  
  return result;
}
