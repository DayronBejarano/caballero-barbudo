"use client";
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function AdminPage() {
  const [citas, setCitas] = useState<any[]>([]);
  const [barberos, setBarberos] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // Datos del usuario actual
  const [miId, setMiId] = useState<number>(0);
  const [miRol, setMiRol] = useState<string>('');

  // Formularios
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaPass, setNuevaPass] = useState('');
  
  const [fotoTitulo, setFotoTitulo] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  // --- LECTURA DE COOKIE ---
  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )admin_session=([^;]+)'));
    if (match) {
        const valores = decodeURIComponent(match[2]).split(','); // "1,ADMIN"
        setMiId(parseInt(valores[0]));
        setMiRol(valores[1]);

        cargarAgenda();
        if (valores[1] === 'ADMIN') {
            cargarBarberos();
            cargarStats();
        }
    }
  }, []);

  // --- CARGA DE DATOS ---
  const cargarAgenda = () => fetch('/api/admin-citas').then(r => r.json()).then(setCitas);
  const cargarBarberos = () => fetch('/api/admin/barberos').then(r => r.json()).then(setBarberos);
  const cargarStats = () => fetch('/api/admin/stats').then(r => r.json()).then(setStats);

  // --- ACCIONES ---
  const crearBarbero = async (e: any) => {
    e.preventDefault();
    await fetch('/api/admin/barberos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre: nuevoNombre, password: nuevaPass, bio: 'Nuevo talento' })
    });
    setNuevoNombre(''); setNuevaPass(''); cargarBarberos();
  };

  const subirFoto = async (e: any) => {
    e.preventDefault();
    await fetch('/api/admin/barberos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            accion: 'subir_foto',
            titulo: fotoTitulo,
            imagenUrl: fotoUrl, 
            barberoId: miId 
        })
    });
    alert("Foto agregada a tu portafolio!");
    setFotoTitulo(''); setFotoUrl('');
  };

  // NUEVA FUNCIÓN: Cancelar Cita (Faltaba en tu código anterior)
  const cancelarCitaAdmin = async (id: string, nombreCliente: string) => {
    const confirmar = window.confirm(`¿Seguro que quieres cancelar la cita de ${nombreCliente}?`);
    if (confirmar) {
        try {
            const res = await fetch('/api/admin-cancelar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }) 
            });
            if (res.ok) cargarAgenda();
            else alert("Error al cancelar.");
        } catch (error) { alert("Error de conexión."); }
    }
  };

  const cerrarSesion = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = "/admin/login";
  };

  return (
    <main className="min-h-screen bg-black text-gray-300 font-slab p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-8 border-b border-gold-muted/50 pb-4">
          <div>
              <h1 className="text-3xl font-vintage text-gold-base">
                Panel de Control {miRol === 'ADMIN' ? '👑' : '✂️'}
              </h1>
              <p className="text-xs text-gray-500">Usuario ID: {miId} | Rol: {miRol}</p>
          </div>
          <button onClick={cerrarSesion} className="text-red-400 hover:text-red-300 underline text-sm font-bold uppercase">
            Cerrar Sesión
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA 1: GESTIÓN (Solo Admin) O PORTAFOLIO (Todos) */}
            <div className="space-y-8">
                {/* Panel de Kelvin: Crear Empleados */}
                {miRol === 'ADMIN' && (
                    <div className="bg-dark-card border border-gold-base p-6 rounded-xl">
                        <h2 className="text-xl font-vintage text-white mb-4">Equipo & Finanzas</h2>
                        {stats && (
                            <div className="mb-4 p-3 bg-black rounded border border-green-900">
                                <p className="text-gray-400 text-xs">Caja Mes</p>
                                <p className="text-2xl text-green-400 font-mono">${stats.dineroMes.toLocaleString()}</p>
                            </div>
                        )}
                        <form onSubmit={crearBarbero} className="flex flex-col gap-2">
                            <input placeholder="Nombre Barbero" className="bg-black border border-gray-700 p-2 rounded text-white text-sm" value={nuevoNombre} onChange={e=>setNuevoNombre(e.target.value)} required/>
                            <input placeholder="Contraseña" className="bg-black border border-gray-700 p-2 rounded text-white text-sm" value={nuevaPass} onChange={e=>setNuevaPass(e.target.value)} required/>
                            <button className="bg-gold-base text-black font-bold py-2 rounded hover:brightness-110">CONTRATAR</button>
                        </form>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                            {barberos.map(b => b.rol !== 'ADMIN' && (
                                <span key={b.id} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{b.nombre}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Panel de Portafolio (Para TODOS) */}
                <div className="bg-dark-card border border-gray-700 p-6 rounded-xl">
                    <h2 className="text-xl font-vintage text-white mb-4">Mi Portafolio</h2>
                    <p className="text-xs text-gray-500 mb-4">Sube evidencias de tus cortes para que salgan en el inicio.</p>
                    <form onSubmit={subirFoto} className="flex flex-col gap-2">
                        <input placeholder="Título (Ej: Fade Medio)" className="bg-black border border-gray-700 p-2 rounded text-white text-sm" value={fotoTitulo} onChange={e=>setFotoTitulo(e.target.value)} required/>
                        <input placeholder="Ruta imagen (Ej: /img/corte1.jpg)" className="bg-black border border-gray-700 p-2 rounded text-white text-sm" value={fotoUrl} onChange={e=>setFotoUrl(e.target.value)} required/>
                        <button className="bg-gray-700 text-white font-bold py-2 rounded hover:bg-gold-base hover:text-black transition-colors">SUBIR EVIDENCIA</button>
                    </form>
                </div>
            </div>

            {/* COLUMNA 2 y 3: AGENDA (Ocupa más espacio) */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-vintage text-white">Citas Confirmadas</h2>
                    <button onClick={cargarAgenda} className="text-xs bg-gold-muted px-3 py-1 text-black rounded font-bold">ACTUALIZAR</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {citas.map((cita: any) => (
                        <div key={cita.id} className={`p-4 rounded border transition-colors flex justify-between items-center ${
                            cita.estado === 'CANCELADA' 
                            ? 'bg-red-950/20 border-red-900 opacity-60' // Estilo cancelado
                            : 'bg-dark-card border-gray-800 hover:border-gold-muted'
                        }`}>
                            <div>
                                <span className={`text-xl font-bold font-vintage block ${cita.estado === 'CANCELADA' ? 'text-red-400 line-through' : 'text-white'}`}>
                                    {format(new Date(cita.fecha), 'hh:mm aa')}
                                </span>
                                <p className={`font-bold uppercase text-sm ${cita.estado === 'CANCELADA' ? 'text-gray-500' : 'text-gold-base'}`}>
                                    {cita.clienteNombre}
                                </p>
                                <p className="text-gray-500 text-xs">📞 {cita.clienteTelefono}</p>
                            </div>
                            
                            <div className="text-right flex flex-col items-end gap-2">
                                <span className={`text-[10px] px-2 py-1 rounded border ${
                                    cita.estado === 'CANCELADA' 
                                    ? 'border-red-900 text-red-500 bg-red-900/20' 
                                    : 'border-green-900 text-green-400 bg-green-900/30'
                                }`}>
                                    {cita.estado === 'CANCELADA' ? 'CANCELADA' : `$ ${cita.precio?.toLocaleString()}`}
                                </span>
                                
                                {/* BOTÓN CANCELAR */}
                                {cita.estado !== 'CANCELADA' && (
                                    <button 
                                        onClick={() => cancelarCitaAdmin(cita.id, cita.clienteNombre)}
                                        className="text-xs text-red-500 hover:text-white bg-black/50 px-2 py-1 rounded border border-red-900/50 hover:bg-red-900 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {citas.length === 0 && <p className="text-gray-500 italic">Agenda libre.</p>}
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}