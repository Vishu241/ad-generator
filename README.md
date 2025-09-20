# AI Ad Generator

A Node.js application that intelligently generates and inserts contextual advertisements into articles using Google Gemini AI.

## Features

- **AI-Powered Content Analysis**: Leverages Google Gemini 1.5 Flash for intelligent ad generation
- **Web Content Scraping**: Extracts and processes content from any article URL
- **Smart Ad Placement**: Automatically determines optimal positions for ad insertion
- **Multiple Output Formats**: Supports JSON API responses and HTML preview generation
- **Content Summarization**: AI-powered article summaries with key points extraction
- **Responsive Web Interface**: Clean, modern UI for easy interaction

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd textadgenerator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create config.env file with your Gemini API key
   echo "GEMINI_API_KEY=your-api-key-here" > config.env
   echo "PORT=3000" >> config.env
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Access the application:
   ```
   http://localhost:3000/app.html
   ```

## API Documentation

### POST `/api/process`
Processes a URL and returns content with inserted AI-generated ads.

**Request:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "success": true,
  "title": "Article Title",
  "originalSections": 8,
  "adsInserted": 2,
  "content": [...]
}
```

### POST `/api/preview`
Generates an HTML preview of the article with ads inserted.

### POST `/api/summarize`
Creates an AI-powered summary with key points and a contextual advertisement.

### GET `/health`
Health check endpoint for monitoring application status.

## Technical Architecture

### Core Components

1. **Content Scraper**: Uses Axios and Cheerio to extract article content
2. **AI Integration**: Google Gemini API for ad generation and content analysis
3. **Ad Placement Engine**: Strategic insertion algorithm for optimal ad positioning
4. **Web Interface**: Responsive frontend with modern UI/UX

### Project Structure

```
├── app.js           # Main server application
├── package.json     # Project dependencies and scripts
├── public/
│   └── app.html     # Frontend web interface
└── README.md        # Project documentation
```

## Technology Stack

- **Backend**: Node.js with Express.js framework
- **AI/ML**: Google Gemini 1.5 Flash API
- **Web Scraping**: Axios HTTP client, Cheerio HTML parser
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: Environment variable configuration for secure API key management

## Usage Examples

### Basic Ad Generation
```bash
curl -X POST http://localhost:3000/api/process \
  -H "Content-Type: application/json" \
  -d '{"url": "https://techcrunch.com/article"}'
```

### HTML Preview Generation
```bash
curl -X POST http://localhost:3000/api/preview \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/blog-post"}'
```

## Development

### Available Scripts
- `npm start`: Start the production server
- `npm run dev`: Start development server with auto-reload

### Environment Variables
Configuration is managed through `config.env` file:
- `GEMINI_API_KEY`: Required for AI functionality (Google Gemini API key)
- `PORT`: Server port (defaults to 3000)

## License

MIT License - see LICENSE file for details.