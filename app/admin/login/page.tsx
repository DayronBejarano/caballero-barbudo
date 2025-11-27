// app/admin/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      if (res.ok) {
        window.location.href = '/admin';      // Refrescamos para que el middleware detecte la cookie
      } else {
        setError('Usuario o contraseña incorrectos');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-radial flex flex-col items-center justify-center p-4">
      
      <div className="mb-8 animate-bounce-in">
         <Image src="/img/logo.png" alt="Logo" width={120} height={120} className="rounded-full border-4 border-gold-base shadow-gold-glow" />
      </div>

      <div className="w-full max-w-sm bg-dark-card border border-gold-muted/30 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-80"></div>

        <h1 className="text-3xl font-vintage text-gold-base text-center mb-6 uppercase tracking-widest">Acceso Staff</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs text-gold-base uppercase font-bold mb-2">Usuario</label>
            <input 
              type="text" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-black border border-gold-muted/50 p-3 rounded text-white focus:border-gold-base focus:outline-none transition-colors"
              placeholder="kelvin"
            />
          </div>

          <div>
            <label className="block text-xs text-gold-base uppercase font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gold-muted/50 p-3 rounded text-white focus:border-gold-base focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-950/30 p-2 rounded border border-red-900">
              ⚠️ {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gold-gradient text-black font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all rounded shadow-lg"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 text-xs hover:text-white underline">Volver al sitio público</a>
        </div>
      </div>
    </main>
  );
}