"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { format } from "date-fns";
import Image from "next/image"; 
import Link from "next/link"; // <--- NO OLVIDES IMPORTAR ESTO

export default function BookingPage() {
  const params = useParams();
  const barberoId = params.id; 

  const [fecha, setFecha] = useState(format(new Date(), "yyyy-MM-dd"));
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [procesandoReserva, setProcesandoReserva] = useState(false);
  
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [reservaExitosa, setReservaExitosa] = useState<any>(null);

  const cargarTurnos = async (fechaSeleccionada: string) => {
    setCargando(true);
    try {
      const res = await fetch(`/api/turnos?fecha=${fechaSeleccionada}&barberoId=${barberoId}`);
      const data = await res.json();
      setTurnos(data);
    } catch (error) { console.error(error); }
    setCargando(false);
  };

  useEffect(() => { cargarTurnos(fecha); }, [fecha]);

  const confirmarReserva = async (e: any) => {
    e.preventDefault();
    if(!horaSeleccionada) return;
    setProcesandoReserva(true); 

    try {
        const res = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, fecha, hora: horaSeleccionada, barberoId: Number(barberoId) })
        });

        const data = await res.json();
        if (res.ok) {
            setReservaExitosa(data);
            setHoraSeleccionada(null);
            cargarTurnos(fecha);
            setNombre("");
            setTelefono("");
        } else {
            alert(data.error || "Hubo un error al reservar.");
        }
    } catch (error) {
        alert("Error de conexión. Intenta nuevamente.");
    }
    setProcesandoReserva(false); 
  };

  return (
    <main className="min-h-screen bg-dark-radial text-gray-300 font-slab flex flex-col items-center relative">
      
      {/* --- BOTÓN NUEVO: VOLVER AL INICIO --- */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2 text-gold-base hover:text-white transition-colors font-bold uppercase tracking-wider text-sm border border-gold-muted/30 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
           ← Volver al Inicio
        </Link>
      </div>

      <header className="text-center mt-12 mb-10 w-full px-4">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full border-4 border-gold-base p-1 shadow-gold-glow bg-black relative">
             <div className="w-[150px] h-[150px] rounded-full bg-black flex items-center justify-center overflow-hidden">
                <Image src="/img/logo.png" alt="Logo" width={150} height={150} className="object-cover" />
             </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold-muted to-transparent w-full max-w-2xl mx-auto mb-6 opacity-50"></div>
        <h1 className="text-4xl md:text-5xl font-vintage uppercase mb-2 text-transparent bg-clip-text bg-gold-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Caballero Barbudo
        </h1>
        <p className="text-gold-base italic tracking-wider">Agendando con Barbero #{barberoId}</p>
         <div className="h-px bg-gradient-to-r from-transparent via-gold-muted to-transparent w-full max-w-2xl mx-auto mt-6 opacity-50"></div>
      </header>

      {/* TICKET DE CONFIRMACIÓN */}
      {reservaExitosa && (
        <div className="bg-green-950/40 border-2 border-green-600/50 p-6 rounded-lg mb-8 max-w-lg text-center shadow-2xl backdrop-blur-sm animate-bounce-in">
          <h3 className="text-2xl font-vintage text-green-400 mb-2 uppercase tracking-wider">¡Reserva Exitosa!</h3>
          <p className="text-gray-300 mb-6">
            Te esperamos el <strong className="text-gold-base">{format(new Date(reservaExitosa.fecha), 'dd/MM/yyyy')}</strong> a las <strong className="text-gold-base">{format(new Date(reservaExitosa.fecha), 'hh:mm aa')}</strong>
          </p>
          <div className="bg-black/60 p-4 rounded border border-dashed border-gold-muted/50 mb-6">
            <p className="text-xs text-gray-400 uppercase mb-2">Tu Código de Seguridad:</p>
            <p className="text-3xl font-mono text-gold-base tracking-[0.5em] font-bold">{reservaExitosa.tokenCancelacion}</p>
            <p className="text-[10px] text-red-400 mt-2">* Guárdalo, lo necesitas para cancelar.</p>
          </div>
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(
              `🗓️ *Reserva Caballero Barbudo*\n\nHola, guardo mi comprobante:\n\n👤 *Barbero:* #${reservaExitosa.barberoId}\n📅 *Fecha:* ${format(new Date(reservaExitosa.fecha), 'dd/MM/yyyy')}\n⏰ *Hora:* ${format(new Date(reservaExitosa.fecha), 'hh:mm aa')}\n\n🔑 *CÓDIGO:* ${reservaExitosa.tokenCancelacion}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded shadow-lg transition-all uppercase tracking-wider mb-4"
          >
            <span className="text-xl">📱</span> Guardar en WhatsApp
          </a>
          <button onClick={() => setReservaExitosa(null)} className="text-gold-base hover:text-gold-light underline text-sm transition-colors font-bold tracking-wider uppercase">Cerrar ventana</button>
        </div>
      )}

      {/* CALENDARIO */}
      <div className="w-full max-w-lg bg-dark-card border border-gold-muted/30 rounded-xl p-8 shadow-2xl mb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-80"></div>
        <h2 className="text-center font-vintage text-3xl text-gold-base mb-8 uppercase tracking-widest drop-shadow-sm">Reservar Cita</h2>
        <div className="mb-8">
          <label className="block text-gold-base mb-3 font-bold uppercase text-sm tracking-wider pl-1">Selecciona Fecha:</label>
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full bg-dark-input text-gray-200 p-4 rounded-lg border border-gold-muted/30 focus:border-gold-base focus:ring-1 focus:ring-gold-base focus:outline-none transition-all font-slab text-lg appearance-none cursor-pointer"
            style={{colorScheme: 'dark'}}
          />
        </div>
        {cargando && <div className="text-center text-gold-base animate-pulse font-vintage tracking-wider">Cargando agenda...</div>}
        <div className="grid grid-cols-3 gap-4">
          {turnos.map((t: any) => (
            <button
              key={t.hora}
              disabled={!t.disponible}
              onClick={() => setHoraSeleccionada(t.hora)}
              className={`
                py-3 px-2 rounded-lg font-vintage tracking-widest text-lg transition-all transform hover:-translate-y-1 relative overflow-hidden group
                ${t.disponible 
                  ? "bg-gold-gradient text-black shadow-gold-glow hover:shadow-[0_0_20px_rgba(179,135,40,0.5)] border border-transparent" 
                  : "bg-dark-input text-gray-600 cursor-not-allowed border border-gold-muted/10"}
              `}
            >
               <span className={`relative z-10 ${!t.disponible && 'line-through opacity-50'}`}>{t.hora}</span>
               {t.disponible && <div className="absolute inset-0 h-full w-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>}
            </button>
          ))}
        </div>
      </div>

      {horaSeleccionada && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-dark-card p-8 rounded-xl border-2 border-gold-base w-full max-w-md shadow-[0_0_30px_rgba(179,135,40,0.2)] relative">
            <h3 className="text-2xl font-vintage text-center text-gold-base mb-6 uppercase tracking-wider">
              Confirmar Turno: <span className="text-white block text-4xl mt-2 drop-shadow-md">{horaSeleccionada}</span>
            </h3>
            <form onSubmit={confirmarReserva}>
              <div className="mb-5">
                <label className="block text-gold-base text-sm mb-2 font-bold uppercase tracking-wider">Nombre del Caballero</label>
                <input required type="text" value={nombre} onChange={e => setNombre(e.target.value)} 
                  className="w-full bg-dark-input border border-gold-muted/50 focus:border-gold-base text-white p-4 rounded focus:outline-none transition-colors" placeholder="Tu nombre..." />
              </div>
              <div className="mb-8">
                <label className="block text-gold-base text-sm mb-2 font-bold uppercase tracking-wider">Teléfono</label>
                <input required type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} 
                  className="w-full bg-dark-input border border-gold-muted/50 focus:border-gold-base text-white p-4 rounded focus:outline-none transition-colors" placeholder="Ej: 300 123 4567" />
              </div>
              <div className="flex flex-col gap-3">
                <button type="submit" disabled={procesandoReserva} className={`w-full py-4 rounded-lg font-vintage uppercase tracking-[0.2em] text-black shadow-gold-glow transition-all transform text-lg font-bold relative overflow-hidden group ${procesandoReserva ? 'bg-gray-500 cursor-wait' : 'bg-gold-gradient hover:shadow-[0_0_25px_rgba(179,135,40,0.6)] hover:scale-[1.02]'}`}>
                    <span className="relative z-10">{procesandoReserva ? 'Verificando...' : 'Confirmar Reserva'}</span>
                    {!procesandoReserva && <div className="absolute inset-0 h-full w-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>}
                </button>
                {!procesandoReserva && (
                  <button type="button" onClick={() => setHoraSeleccionada(null)} className="text-gray-400 py-3 rounded hover:text-white transition-colors text-sm uppercase tracking-wider font-bold">Cancelar</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}