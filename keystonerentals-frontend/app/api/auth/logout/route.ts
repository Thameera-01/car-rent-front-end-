import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // 'admin_token' කියන Cookie එක මකා දැමීම
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}