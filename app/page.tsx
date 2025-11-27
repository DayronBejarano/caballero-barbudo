"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [barberos, setBarberos] = useState<any[]>([]);

  // Cargar barberos desde la Base de Datos al iniciar
  useEffect(() => {
    fetch('/api/barberos')
      .then(res => res.json())
      .then(data => setBarberos(data));
  }, []);

  return (
    <main className="min-h-screen bg-dark-radial text-gray-300 font-slab">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 border-b border-gold-muted/30 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <Image src="/img/logo.png" alt="Logo" width={50} height={50} className="rounded-full border-2 border-gold-base" />
            <span className="text-gold-base font-vintage text-xl hidden md:block">Caballero Barbudo</span>
        </div>
        <div className="flex gap-4">
            <Link href="/mis-citas" className="px-4 py-2 border border-gold-muted text-gold-base hover:bg-gold-base hover:text-black transition-colors rounded text-sm uppercase font-bold">
               Soy Cliente
            </Link>
            <Link href="/admin" className="px-4 py-2 bg-dark-input text-gray-400 hover:text-white transition-colors rounded text-sm uppercase font-bold">
               Staff Login
            </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-vintage text-transparent bg-clip-text bg-gold-gradient drop-shadow-lg mb-4 animate-bounce-in">
           Estilo Legendario
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
           Elige a tu maestro y vive la experiencia clásica.
        </p>
      </section>

      {/* GALERÍA DINÁMICA DE BARBEROS */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center">
            
            {barberos.length === 0 && <p className="text-center text-gold-base w-full col-span-3">Cargando maestros...</p>}

            {barberos.map((barbero) => (
                <div key={barbero.id} className="bg-dark-card border border-gold-muted/30 rounded-xl overflow-hidden group hover:shadow-gold-glow transition-all duration-500 transform hover:-translate-y-2 flex flex-col">
                    
                    {/* Foto de Perfil del Barbero */}
                    <div className="h-64 overflow-hidden relative bg-black flex items-center justify-center">
                        <Image 
                           src={barbero.fotoUrl || '/img/logo.png'} 
                           alt={barbero.nombre}
                           width={400} 
                           height={400}
                           className="object-cover h-full w-full opacity-90 group-hover:opacity-100 transition-all" 
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent h-24 p-4 flex items-end">
                           <div>
                             <h3 className="text-2xl font-vintage text-white">{barbero.nombre}</h3>
                             <p className="text-gold-base text-xs">{barbero.rol === 'ADMIN' ? 'Master Barber' : 'Barber Pro'}</p>
                           </div>
                        </div>
                    </div>

                    {/* Muestra de su trabajo (Portafolio Mini) */}
                    <div className="p-4 bg-black/40 flex gap-2 overflow-x-auto h-24">
                        {barbero.portafolio.length > 0 ? (
                           barbero.portafolio.map((item: any) => (
                             <div key={item.id} className="min-w-[80px] h-full rounded overflow-hidden border border-gray-800 relative">
                                <Image src={item.imagenUrl} alt={item.titulo} width={80} height={80} className="object-cover h-full w-full" />
                             </div>
                           ))
                        ) : (
                           <p className="text-xs text-gray-600 self-center w-full text-center italic">Sin fotos aún</p>
                        )}
                    </div>

                    <div className="p-6 mt-auto">
                        <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">{barbero.bio || "Listo para darte el mejor estilo."}</p>
                        <Link href={`/reservar/${barbero.id}`} className="block w-full py-4 bg-gold-gradient text-black text-center font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded">
                            Reservar Turno
                        </Link>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </main>
  );
}