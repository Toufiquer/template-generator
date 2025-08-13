// app/api/generate-model/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    //  !  create api
    const { content: contentApi, folderName } = await request.json();

    if (!contentApi || typeof contentApi !== 'string') {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    // Define the path where you want to create the file
    const filePathApi = path.join(process.cwd(), `src/app/generate/${folderName}/model.ts`);

    // Ensure the directory exists
    const dirPathApi = path.dirname(filePathApi);
    if (!fs.existsSync(dirPathApi)) {
      fs.mkdirSync(dirPathApi, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePathApi, contentApi, 'utf8');

    //  !  create page
    const contentPage = `
                          const Page = () => {
                            return <main>Page Render </main>;
                          };

                          export default Page;
                          
                        `;
    const filePathPage = path.join(process.cwd(), `src/app/generate/${folderName}/page.tsx`);
    const dirPathPage = path.dirname(filePathApi);
    if (!fs.existsSync(dirPathPage)) {
      fs.mkdirSync(dirPathPage, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePathPage, contentPage, 'utf8');

    return NextResponse.json({
      message: 'File created successfully',
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
