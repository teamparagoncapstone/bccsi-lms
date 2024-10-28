import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const moduleTitle = searchParams.get('moduleTitle');
  const studentId = searchParams.get('studentId');

  try {
    // Use absolute URL for internal API request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Update for production
    const response = await fetch(
      `${baseUrl}/api/voice-exercises?moduleTitle=${moduleTitle}&studentId=${studentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching voice exercises:', error);
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
}
