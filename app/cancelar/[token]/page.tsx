// app/cancelar/[token]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import Image from "next/image"; 

export default function CancelarPage() {
  const params = useParams();
  const token = params.token;

  const [estado, setEstado] = useState<'CONFIRMAR' | 'PROCESANDO' | 'EXITO' | 'ERROR'>('CONFIRMAR');
  const [mensaje, setMensaje] = useState('');

  const procesarCancelacion = async () => {
    setEstado('PROCESANDO');
    try {
      const res = await fetch('/api/cancelar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (res.ok) {
        setEstado('EXITO');
      } else {
        setEstado('ERROR');
        setMensaje('No pudimos encontrar esta reserva o ya fue cancelada.');
      }
    } catch (error) {
      setEstado('ERROR');
    }
  };

  return (
    <main className="min-h-screen bg-dark-radial text-gray-300 font-slab flex flex-col items-center justify-center p-4">
      
      {/* LOGO */}
      <div className="mb-8">
        <div className="rounded-full border-4 border-gold-base p-1 shadow-gold-glow bg-black">
             <div className="w-[120px] h-[120px] rounded-full bg-black flex items-center justify-center overflow-hidden">
                <Image src="/img/logo.png" alt="Logo" width={120} height={120} className="object-cover" />
             </div>
        </div>
      </div>

      <div className="w-full max-w-md bg-dark-card border border-gold-muted/30 rounded-xl p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Borde superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-80"></div>

        {estado === 'CONFIRMAR' && (
          <>
            <h1 className="text-3xl font-vintage text-gold-base mb-4 uppercase">¿Cancelar Cita?</h1>
            <p className="text-gray-400 mb-8">
              Estás a punto de cancelar tu turno. Esta acción liberará el horario para otro caballero.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={procesarCancelacion}
                className="w-full py-4 rounded-lg font-vintage uppercase tracking-widest text-black bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all font-bold"
              >
                Sí, Cancelar Cita
              </button>
              <a href="/" className="block py-3 text-gold-base hover:text-white underline text-sm uppercase font-bold tracking-wider">
                Volver al Inicio
              </a>
            </div>
          </>
        )}

        {estado === 'PROCESANDO' && (
           <div className="py-10">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-base mx-auto mb-4"></div>
             <p className="text-gold-base font-vintage animate-pulse">Procesando solicitud...</p>
           </div>
        )}

        {estado === 'EXITO' && (
          <div className="animate-bounce-in">
            <h1 className="text-3xl font-vintage text-green-500 mb-4 uppercase">Cita Cancelada</h1>
            <p className="text-gray-400 mb-8">
              Tu turno ha sido liberado exitosamente. Esperamos verte en otra ocasión.
            </p>
            <a href="/" className="inline-block px-8 py-3 rounded border border-gold-base text-gold-base hover:bg-gold-base hover:text-black transition-colors font-bold uppercase tracking-wider">
              Agendar Nueva Cita
            </a>
          </div>
        )}

        {estado === 'ERROR' && (
          <div>
            <h1 className="text-3xl font-vintage text-gold-base mb-4 uppercase">Ocurrió un Error</h1>
            <p className="text-red-400 mb-8">{mensaje || 'El enlace no es válido.'}</p>
            <a href="/" className="text-gray-400 underline">Volver al inicio</a>
          </div>
        )}

      </div>
    </main>
  );
}