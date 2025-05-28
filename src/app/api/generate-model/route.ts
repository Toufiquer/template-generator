// app/api/generate-model/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { content, folderName } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    // Define the path where you want to create the file
    const filePath = path.join(process.cwd(), `src/app/generate/${folderName}/model.ts`);

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePath, content, 'utf8');

    return NextResponse.json({
      message: 'File created successfully',
      filePath: 'src/app/generate-output/model.ts',
    });
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json(
      {
        message: 'Error creating file',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
