# NLP Scripts Viewer

A Next.js application for searching and viewing PDF scripts using voice or text input.

## Features

- 🎤 Voice search using Web Speech API
- ⌨️ Text search with fuzzy matching
- 📄 In-browser PDF viewing
- 🔍 Smart script matching

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Adding Scripts

Place your PDF script files in the `public/scripts` folder. The application will automatically detect and index them.

## Deployment

### Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Deploy with default settings

## Usage

1. Click the microphone button to use voice search, or type in the search box
2. Say or type the name of the script you're looking for
3. The PDF will display in the browser when found

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- react-pdf for PDF rendering
- Fuse.js for fuzzy search
- Web Speech API for voice input
