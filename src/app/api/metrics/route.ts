import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId') || null;

    const result = await sql`
      SELECT get_dashboard_metrics(${regionId}::uuid) AS data;
    `;

    return NextResponse.json(result[0]?.data || {});
  } catch (error: any) {
    console.error('Metrics fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
