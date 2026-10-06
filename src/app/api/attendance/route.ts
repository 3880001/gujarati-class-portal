import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, studentId, parentCount, isExtraParticipation, deviceSyncId } = body;

    const result = await sql`
      INSERT INTO attendance_records (
        event_id, 
        student_id, 
        parent_count, 
        is_extra_participation, 
        device_sync_id
      )
      VALUES (
        ${eventId}::uuid, 
        ${studentId}::uuid, 
        ${parentCount || 0}, 
        ${isExtraParticipation || false}, 
        ${deviceSyncId}
      )
      ON CONFLICT (device_sync_id) DO NOTHING
      RETURNING id;
    `;

    return NextResponse.json({ success: true, record: result[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
