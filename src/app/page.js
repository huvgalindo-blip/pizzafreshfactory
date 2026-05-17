
"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Torre from "./components/Torre";
import InfoTiempoReal from "./components/InfoTiempoReal";
import Link from "next/link";
import { useOrdenAmasado } from "./context/OrdenAmasadoContext";
import { getTorresParaProduccion } from "./utils/torresUtils";

export default function Home() {
  const { bolasAmasado, setBolasAmasado } = useOrdenAmasado();
  const [torres, setTorres] = useState([]);
  const [torresRestantes, setTorresRestantes] = useState(0);
  const [torresProduccion, setTorresProduccion] = useState([]);
  const temperatura = 22;
  const humedad = 60;

  // Cargar torres desde localStorage con filtro de fecha
  // Las torres normales aparecen a partir de las 00:00 del día siguiente
  // Las torres enviadas aparecen inmediatamente
  useEffect(() => {
    setTorresProduccion(getTorresParaProduccion());
    // Escuchar cambios en localStorage (por si se actualiza desde otra pestaña)
    const onStorage = () => setTorresProduccion(getTorresParaProduccion());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  React.useEffect(() => {
    if (bolasAmasado > 0) {
      const numTorres = Math.ceil(bolasAmasado / 200);
      setTorres(Array(numTorres).fill(false));
      setTorresRestantes(numTorres);
    } else {
      setTorres([]);
      setTorresRestantes(0);
    }
  }, [bolasAmasado]);

  const handleReset = () => {
    setBolasAmasado(0);
    setTorres([]);
    setTorresRestantes(0);
  };

  const handleTorreCompletada = (idx) => {
    if (!torres[idx]) {
      const nuevasTorres = [...torres];
      nuevasTorres[idx] = true;
      setTorres(nuevasTorres);
      setTorresRestantes((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="container py-4">
      <Header temperature={temperatura} humidity={humedad} />
      <InfoTiempoReal />
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button className="btn btn-danger" onClick={handleReset} disabled={bolasAmasado === 0 && torres.length === 0}>
          Resetear valores
        </button>
        <Link href="/orden-amasado" className="btn btn-primary">
          Ir a orden de amasado
        </Link>
        <Link href="/control-produccion-bases" className="btn btn-info">
          Ver todas las torres de producción
        </Link>
      </div>
      
      {/* Mostrar torres disponibles para producción (con filtro de fecha) */}
      <div className="mb-4">
        <h3 className="mb-3">Torres disponibles para producción hoy</h3>
        {torresProduccion.length === 0 ? (
          <div className="alert alert-info">
            No hay torres disponibles para producción hoy. 
            Las torres normales aparecerán a partir de las 00:00 del día siguiente de su amasado.
            Las torres enviadas con el botón "Enviar a producción" aparecerán inmediatamente.
          </div>
        ) : (
          <div className="row">
            {torresProduccion.map((torre, idx) => (
              <div className="col-md-4" key={torre.numeroTorre || idx}>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Torre #{torre.numeroTorre}</h5>
                    <div className="mb-2">
                      <span className="badge bg-secondary mb-2">{torre.bolas} bolas de 160g</span>
                    </div>
                    <div>
                      <span className="badge bg-info text-dark mb-1">Amasado: {torre.fechaAmasado}</span>
                    </div>
                    {torre.enviada && (
                      <div className="mt-2 fw-bold text-warning">
                        ⚡ Torre enviada a producción anticipadamente ({torre.fechaEnvio})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección anterior para crear nuevas torres (opcional, se puede mantener o eliminar) */}
      {bolasAmasado > 0 && (
        <div className="mb-3">
          <strong>Bolas a producir:</strong> {bolasAmasado} <br />
          <strong>Torres totales:</strong> {torres.length} <br />
          <strong>Torres restantes:</strong> {torresRestantes}
          {torres.length > 0 && torresRestantes === 0 && (
            <div className="alert alert-success mt-3 fw-bold text-center" role="alert">
              ¡Todas las torres han sido completadas!
            </div>
          )}
        </div>
      )}
      <div className="row">
        {torres.map((completada, idx) => (
          <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={idx}>
            <Torre index={idx} onCompletada={() => handleTorreCompletada(idx)} completada={completada} />
          </div>
        ))}
      </div>
    </div>
  );
}
