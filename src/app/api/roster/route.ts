import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const students = await sql`
      SELECT id, first_name, last_name, wing, enrollment_date
      FROM students
      WHERE is_active = true
      ORDER BY first_name ASC;
    `;
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
