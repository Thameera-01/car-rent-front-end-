import { NextResponse } from 'next/server';
import { pool } from '../../lib/db';

// කාර් දත්ත ලබා ගැනීම
// කාර් දත්ත ලබා ගැනීම (ආරක්ෂිත ක්‍රමය)
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM cars ORDER BY id DESC');
    // rows යනු Array එකක් බව තහවුරු කර ගැනීම
    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error("Database Error:", error);
    // ඩේටාබේස් කනෙක්ෂන් එකේ අවුලක් තිබුණත් හිස් Array එකක් යැවීම මඟින් Frontend එක කඩා වැටීම වළක්වයි
    return NextResponse.json([], { status: 200 }); 
  }
}

// අලුත් කාර් එකක් Database එකට දැමීම
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, type, image, seats, transmission, ac, price, badge } = body;

    const query = `
      INSERT INTO cars (name, category, type, image, seats, transmission, ac, price, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, category, type, image, seats, transmission, ac, price, badge];

    await pool.query(query, values);
    
    return NextResponse.json({ success: true, message: 'Car added successfully!' }, { status: 201 });
  } catch (error) {
    console.error("Error adding car:", error);
    return NextResponse.json({ error: 'Failed to add the car' }, { status: 500 });
  }
}
// කාර් එකක් ඉවත් කිරීම (DELETE Request)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM cars WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Car deleted successfully!' });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ error: 'Failed to delete the car' }, { status: 500 });
  }
}
