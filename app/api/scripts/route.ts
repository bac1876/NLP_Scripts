import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const scriptsDirectory = path.join(process.cwd(), 'public', 'scripts');

    // Ensure directory exists
    try {
      await fs.access(scriptsDirectory);
    } catch {
      return NextResponse.json({ scripts: [] });
    }

    const files = await fs.readdir(scriptsDirectory);

    // Filter for PDF files only
    const pdfFiles = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        name: file.replace('.pdf', ''),
        filename: file,
        path: `/scripts/${file}`
      }));

    return NextResponse.json({ scripts: pdfFiles });
  } catch (error) {
    console.error('Error reading scripts:', error);
    return NextResponse.json({ scripts: [] }, { status: 500 });
  }
}
