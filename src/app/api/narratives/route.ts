import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, text } = body;

    const center = await sql`SELECT id, region_id FROM centers LIMIT 1;`;
    if (!center || center.length === 0) {
      return NextResponse.json({ error: 'No center found' }, { status: 404 });
    }

    await sql`
      INSERT INTO narratives (
        center_id, 
        region_id, 
        goal_category, 
        reporting_quarter, 
        title, 
        reflection_text, 
        status, 
        is_national_spotlight
      )
      VALUES (
        ${center[0].id}::uuid, 
        ${center[0].region_id}::uuid, 
        'RAJIPO_SEVA_BHAV', 
        '2026-Q3', 
        ${title}, 
        ${text}, 
        'SUBMITTED', 
        true
      );
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
