import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STUB: Database disabled - return mock document
    return NextResponse.json({
      id: params.id,
      fileName: 'document.pdf',
      fileSize: '1024',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signatures: []
    });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STUB: Database disabled - return mock success
    return NextResponse.json({
      message: 'Document deleted (simulated)',
      id: params.id
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
