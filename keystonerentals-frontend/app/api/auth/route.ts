import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // දැනට සරලව admin සහ admin123 ලෙස මුරපදය ලබා දෙමු 
    // (සැබෑ ව්‍යාපෘතියකදී මේවා Database එකෙන් හෝ .env එකෙන් පරීක්ෂා කෙරේ)
    if (username === 'admin' && password === 'admin123') {
      
      // Cookie එකක් හරහා ලොග් වූ බව සනාථ කිරීම (පැය 24කට වලංගුයි)
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'secure_logged_in_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, 
        path: '/',
      });
      
      return NextResponse.json({ success: true, message: 'Logged in successfully' });
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}