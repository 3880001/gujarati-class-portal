import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { score } = body;

    const q = await sql`
      SELECT q.id as question_id, q.survey_id, c.id as center_id, c.region_id
      FROM pulse_questions q
      JOIN pulse_surveys s ON q.survey_id = s.id
      CROSS JOIN (SELECT id, region_id FROM centers LIMIT 1) c
      WHERE s.is_active = true
      LIMIT 1;
    `;

    if (!q || q.length === 0) {
      return NextResponse.json({ error: 'No active pulse survey found' }, { status: 404 });
    }

    const { question_id, survey_id, center_id, region_id } = q[0];
    const responseHash = crypto.randomUUID();

    await sql`
      INSERT INTO pulse_responses (
        survey_id, 
        question_id, 
        region_id, 
        center_id, 
        score, 
        response_hash
      )
      VALUES (
        ${survey_id}::uuid, 
        ${question_id}::uuid, 
        ${region_id}::uuid, 
        ${center_id}::uuid, 
        ${score}, 
        ${responseHash}
      );
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
