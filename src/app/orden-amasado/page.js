"use client";
import React, { useState, useEffect } from "react";
import { useOrdenAmasado } from "../context/OrdenAmasadoContext";
import Torre from "../components/Torre";

const getCurrentData = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    temperature: 22, // Valor genérico
    humidity: 60, // Valor genérico
  };
};

export default function OrdenAmasado() {
  const { bolasAmasado, setBolasAmasado } = useOrdenAmasado();
  // Estado inicial desde localStorage si existe
  const [bolas, setBolas] = useState(() => {
    const saved = localStorage.getItem("amasado_bolas");
    return saved ? JSON.parse(saved) : (bolasAmasado || 0);
  });
  const [orden, setOrden] = useState(() => {
    const saved = localStorage.getItem("amasado_orden");
    return saved ? JSON.parse(saved) : (bolasAmasado > 0 ? { bolas: bolasAmasado } : null);
  });
  const [torres, setTorres] = useState(() => {
    const saved = localStorage.getItem("amasado_torres");
    return saved ? JSON.parse(saved) : [];
  });


  const TORRE_BOLAS = 200;
  const handleSubmit = (e) => {
    e.preventDefault();
    const totalBolas = Number(bolas);
    if (totalBolas > 0) {
      const nuevaOrden = {
        bolas: totalBolas,
        ...getCurrentData(),
      };
      setOrden(nuevaOrden);
      setBolasAmasado(totalBolas);
      // Calcular número de torres (redondeo hacia arriba)
      const numTorres = Math.ceil(totalBolas / TORRE_BOLAS);
      const nuevasTorres = Array.from({ length: numTorres }, (_, idx) => ({ inicio: null, fin: null }));
      setTorres(nuevasTorres);
      // Guardar en localStorage
      localStorage.setItem("amasado_bolas", JSON.stringify(totalBolas));
      localStorage.setItem("amasado_orden", JSON.stringify(nuevaOrden));
      localStorage.setItem("amasado_torres", JSON.stringify(nuevasTorres));
    }
  };


  const handleReset = () => {
    setBolas(0);
    setOrden(null);
    setBolasAmasado(0);
    setTorres([]);
    localStorage.removeItem("amasado_bolas");
    localStorage.removeItem("amasado_orden");
    localStorage.removeItem("amasado_torres");
  };

  // Controlar inicio y fin de cada torre
  const handleTorreStart = (idx) => {
    setTorres((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        inicio: {
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
        },
      };
      localStorage.setItem("amasado_torres", JSON.stringify(updated));
      return updated;
    });
  };

  const handleEnviarProduccion = (idx) => {
    setTorres((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        enviada: true,
      };
      localStorage.setItem("amasado_torres", JSON.stringify(updated));
      return updated;
    });
  };

  const handleTorreFinish = (idx) => {
    setTorres((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        fin: {
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
        },
      };
      localStorage.setItem("amasado_torres", JSON.stringify(updated));
      return updated;
    });
  };
  // Restaurar estado al cargar la página (por si cambia localStorage desde otra pestaña)
  useEffect(() => {
    const onStorage = () => {
      const savedBolas = localStorage.getItem("amasado_bolas");
      const savedOrden = localStorage.getItem("amasado_orden");
      const savedTorres = localStorage.getItem("amasado_torres");
      if (savedBolas) setBolas(JSON.parse(savedBolas));
      if (savedOrden) setOrden(JSON.parse(savedOrden));
      if (savedTorres) setTorres(JSON.parse(savedTorres));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Calcular duración entre inicio y fin
  function calcularDuracion(inicio, fin) {
    try {
      const [h1, m1, s1] = inicio.hora.split(":").map(Number);
      const [h2, m2, s2] = fin.hora.split(":").map(Number);
      const t1 = new Date();
      t1.setHours(h1, m1, s1 || 0, 0);
      const t2 = new Date();
      t2.setHours(h2, m2, s2 || 0, 0);
      let diff = Math.floor((t2 - t1) / 1000);
      if (diff < 0) diff += 24 * 3600; // por si cruza medianoche
      const horas = Math.floor(diff / 3600);
      const minutos = Math.floor((diff % 3600) / 60);
      const segundos = diff % 60;
      return `${horas}h ${minutos}m ${segundos}s`;
    } catch {
      return '-';
    }
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Orden de Amasado de Bolas</h1>
      {(!orden || !orden.bolas) && (
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text">Nº de bolas a amasar</span>
            <input
              type="number"
              className="form-control"
              min="1"
              value={bolas}
              onChange={(e) => setBolas(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              Generar orden
            </button>
          </div>
        </form>
      )}
      {orden && orden.bolas > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="alert alert-warning text-center fw-bold grow mb-0" role="alert">
              Ya existe una orden activa de amasado. Para modificarla, primero resetea la orden actual.
            </div>
            <button className="btn btn-outline-danger ms-3" onClick={handleReset}>
              Resetear orden
            </button>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Orden generada</h5>
              <p className="card-text">
                <strong>Bolas a amasar:</strong> {orden.bolas}
                <br />
                <strong>Fecha:</strong> {orden.date}
                <br />
                <strong>Hora:</strong> {orden.time}
                <br />
                <strong>Temperatura:</strong> {orden.temperature}°C
                <br />
                <strong>Humedad:</strong> {orden.humidity}%
                <br />
                <span className="badge bg-info mt-2">Esta producción es para el día siguiente: {(() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  return d.toLocaleDateString();
                })()}</span>
              </p>
              {/* El botón "Nueva orden" se mantiene para redundancia */}
              <button className="btn btn-danger" onClick={handleReset}>
                Nueva orden
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="mb-3">Torres a bolear</h4>
            <div className="alert alert-info mb-4" role="alert">
              <strong>Nota:</strong> La información de las torres estará disponible en el control de producción de bases de pizza a partir del día siguiente ({(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toLocaleDateString(); })()}).
            </div>
            <div className="row">
              {torres.map((torre, idx) => {
                // Calcular bolas para esta torre
                const totalBolas = orden.bolas;
                const bolasPorTorre = (idx < torres.length - 1)
                  ? TORRE_BOLAS
                  : totalBolas - TORRE_BOLAS * (torres.length - 1);
                return (
                  <div className="col-md-4" key={idx}>
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Torre #{idx + 1}</h5>
                        <div className="mb-2">
                          <span className="badge bg-secondary mb-2">{bolasPorTorre} bolas de 160g</span>
                        </div>
                        <div className="mb-2">
                          <button
                            className="btn btn-success me-2"
                            onClick={() => handleTorreStart(idx)}
                            disabled={!!torre.inicio}
                          >
                            Iniciar boleado
                          </button>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => handleTorreFinish(idx)}
                            disabled={!torre.inicio || !!torre.fin}
                          >
                            Finalizar boleado
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEnviarProduccion(idx)}
                            disabled={!torre.fin || torre.enviada}
                          >
                            {torre.enviada ? 'Enviada a producción' : 'Enviar a producción'}
                          </button>
                        </div>
                        <div>
                          {torre.inicio && (
                            <span className="badge bg-info text-dark mb-1">Inicio: {torre.inicio.fecha} {torre.inicio.hora}</span>
                          )}
                          {torre.fin && (
                            <span className="badge bg-success mb-1 ms-2">Fin: {torre.fin.fecha} {torre.fin.hora}</span>
                          )}
                        </div>
                        {torre.fin && (
                          <div className="mt-2 p-2 border rounded bg-light text-dark">
                            <strong>Duración:</strong> {torre.inicio && torre.fin ? calcularDuracion(torre.inicio, torre.fin) : '-'}<br/>
                            <strong>Fecha de producción (para estirado):</strong> {(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toLocaleDateString(); })()}
                          </div>
                        )}
                        {torre.enviada && (
                          <div className="mt-2 fw-bold text-warning">⚡ Torre enviada a producción antes de la fecha prevista.</div>
                        )}
                        {torre.fin && !torre.enviada && (
                          <div className="mt-2 fw-bold text-success">✔ Torre finalizada. Información registrada en pantalla.</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
