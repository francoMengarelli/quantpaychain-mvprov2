import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // STUB: File upload disabled - return mock response
    return NextResponse.json({
      message: 'Document upload simulated',
      document: {
        id: 'mock-doc-' + Date.now(),
        fileName: 'document.pdf',
        fileSize: 1024,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
