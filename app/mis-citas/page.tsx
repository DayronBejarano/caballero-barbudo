"use client";
import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default function ClientDashboard() {
  const [telefono, setTelefono] = useState("");
  const [citas, setCitas] = useState<any[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para cancelar con código
  const [citaACancelar, setCitaACancelar] = useState<string | null>(null);
  const [codigoIngresado, setCodigoIngresado] = useState("");

  const buscarCitas = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setBuscado(false);
    
    const res = await fetch(`/api/mis-citas?telefono=${telefono}`);
    if (res.ok) {
        const data = await res.json();
        setCitas(data);
    } else {
        setCitas([]);
    }
    setLoading(false);
    setBuscado(true);
  };

  // Función para procesar la cancelación SEGURA
  const ejecutarCancelacion = async () => {
    if (!citaACancelar) return;

    try {
        const res = await fetch('/api/cancelar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Enviamos el token que escribió el usuario para verificar
            body: JSON.stringify({ token: codigoIngresado })
        });

        const data = await res.json();

        if (res.ok && !data.error) {
            alert("✅ Cita cancelada exitosamente.");
            setCitaACancelar(null); // Cerrar modal
            setCodigoIngresado("");
            // Refrescar lista
            const btnBuscar = document.getElementById('btn-buscar-citas');
            if(btnBuscar) btnBuscar.click();
        } else {
            alert("⛔ Código incorrecto. No se pudo cancelar.");
        }
    } catch (error) {
        alert("Error de conexión.");
    }
  };

  return (
    <main className="min-h-screen bg-dark-radial text-gray-300 font-slab flex flex-col items-center justify-center p-4 relative">
        {/* --- BOTÓN FLOTANTE --- */}
        <div className="absolute top-4 left-4 z-10">
            <Link href="/" className="flex items-center gap-2 text-gold-base hover:text-white transition-colors font-bold uppercase tracking-wider text-sm border border-gold-muted/30 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
             ← Inicio
            </Link>
        </div>
        <div className="mb-6">
             <Image src="/img/logo.png" alt="Logo" width={80} height={80} className="rounded-full border-2 border-gold-base" />
        </div>

        <div className="w-full max-w-md bg-dark-card border border-gold-muted/30 p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-80"></div>

            <h1 className="text-3xl font-vintage text-gold-base text-center mb-2">Mis Reservas</h1>
            <p className="text-center text-gray-500 text-sm mb-8">Ingresa tu celular para ver tus turnos.</p>
            
            <form onSubmit={buscarCitas} className="mb-8">
                <div className="flex gap-2">
                    <input 
                        type="tel" 
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Ej: 3001234567"
                        className="flex-1 bg-dark-input border border-gold-muted/50 p-3 rounded text-white focus:outline-none focus:border-gold-base transition-colors"
                        required
                    />
                    <button 
                        id="btn-buscar-citas"
                        type="submit" 
                        disabled={loading}
                        className="bg-gold-gradient text-black font-bold px-6 rounded hover:brightness-110 transition-all font-vintage tracking-wider"
                    >
                        {loading ? '...' : 'VER'}
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                {buscado && citas.length === 0 && (
                    <div className="text-center p-4 bg-white/5 rounded border border-white/10">
                        <p className="text-gray-400">No encontramos citas activas.</p>
                    </div>
                )}

                {citas.map((cita) => (
                    <div key={cita.id} className="bg-black/40 p-4 rounded border-l-4 border-gold-base flex justify-between items-center group hover:bg-black/60 transition-colors">
                        <div>
                            <p className="text-white font-bold text-lg font-vintage">
                                {format(new Date(cita.fecha), "hh:mm aa")}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {format(new Date(cita.fecha), "dd 'de' MMMM")}
                            </p>
                        </div>
                        
                        {/* BOTÓN CANCELAR ABRE MODAL */}
                        <button 
                            onClick={() => {
                                setCitaACancelar(cita.id);
                                setCodigoIngresado("");
                            }}
                            className="px-3 py-1 border border-red-900 text-red-400 text-xs rounded hover:bg-red-900 hover:text-white transition-colors uppercase font-bold"
                        >
                            Cancelar
                        </button>
                    </div>
                ))}
            </div>
            
            <Link href="/" className="block text-center mt-8 text-gold-base text-sm hover:text-white transition-colors font-bold uppercase tracking-wider">
                ← Volver al Inicio
            </Link>
        </div>

        {/* MODAL DE SEGURIDAD PARA CANCELAR */}
        {citaACancelar && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                <div className="bg-dark-card border border-gold-base p-6 rounded-lg w-full max-w-sm text-center shadow-gold-glow">
                    <h3 className="text-xl font-vintage text-white mb-4">Seguridad</h3>
                    <p className="text-gray-400 text-sm mb-4">Ingresa el código de 6 caracteres que recibiste al reservar:</p>
                    
                    <input 
                        type="text" 
                        placeholder="Ej: A7X9P2"
                        className="w-full bg-black border border-gray-700 p-3 rounded text-center text-gold-base font-mono text-xl uppercase mb-6 focus:border-gold-base focus:outline-none"
                        value={codigoIngresado}
                        onChange={(e) => setCodigoIngresado(e.target.value.toUpperCase())}
                    />

                    <div className="flex gap-2">
                        <button onClick={() => setCitaACancelar(null)} className="flex-1 py-3 text-gray-500 hover:text-white font-bold">VOLVER</button>
                        <button onClick={ejecutarCancelacion} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded">CONFIRMAR</button>
                    </div>
                </div>
            </div>
        )}

    </main>
  );
}