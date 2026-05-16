"use client";
import React, { useEffect, useState } from "react";

// Utilidad para obtener las torres desde localStorage
function getTorresParaProduccion() {
  const data = localStorage.getItem("torresAmasado");
  if (!data) return [];
  const torres = JSON.parse(data);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return torres.filter((torre) => {
    if (torre.enviada) return true;
    if (!torre.fechaAmasado) return false;
    const fechaAmasado = new Date(torre.fechaAmasado);
    fechaAmasado.setHours(0, 0, 0, 0);
    // Mostrar si la fecha de amasado es anterior al día actual (día siguiente)
    return fechaAmasado < hoy;
  });
}

export default function ControlProduccionBases() {
  const [torres, setTorres] = useState([]);

  useEffect(() => {
    setTorres(getTorresParaProduccion());
    // Escuchar cambios en localStorage (por si se actualiza desde otra pestaña)
    const onStorage = () => setTorres(getTorresParaProduccion());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Control de Producción de Bases de Pizza</h1>
      {torres.length === 0 ? (
        <div className="alert alert-info">No hay torres disponibles para producción hoy.</div>
      ) : (
        <div className="row">
          {torres.map((torre, idx) => (
            <div className="col-md-4" key={torre.id || idx}>
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
                    <div className="mt-2 fw-bold text-warning">⚡ Torre enviada a producción anticipadamente.</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
