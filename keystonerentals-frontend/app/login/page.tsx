'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/admin'); // පාස්වර්ඩ් එක හරි නම් Admin පිටුවට යවනවා
      router.refresh();
    } else {
      setError('Invalid Username or Password!');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Admin Security</h1>
        <p className="text-zinc-400 text-center text-sm mb-8">Sign in to manage Keystone Rentals</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-zinc-300 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-red-500 transition" 
              placeholder="Enter username" 
            />
          </div>
          <div>
            <label className="block text-zinc-300 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-red-500 transition" 
              placeholder="Enter password" 
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-4">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}