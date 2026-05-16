"use client";
import React, { useState } from "react";

const getCurrentData = () => {
  const now = new Date();
  return {
    time: now.toLocaleTimeString(),
    temperature: 22, // Valor genérico
    humidity: 60, // Valor genérico
  };
};



const Torre = ({ index, onCompletada, completada }) => {
  const [status, setStatus] = useState(completada ? "finished" : "pending");
  const [showBar, setShowBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inicio, setInicio] = useState(null);
  const [fin, setFin] = useState(null);

  // Sincroniza el estado visual de la torre si cambia la prop 'completada' o el estado 'status'.
  React.useEffect(() => {
    if (completada && status !== "finished") {
      setStatus("finished");
      setShowBar(false);
      setProgress(100);
    }
  }, [completada, status]);

  const handleStart = () => {
    setStatus("started");
    const now = new Date();
    setInicio({
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
    });
  };

  const handleFinish = () => {
    setStatus("finished");
    setShowBar(true);
    setProgress(0);
    const now = new Date();
    setFin({
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
    });
    let pct = 0;
    const interval = setInterval(() => {
      pct += 20;
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setShowBar(false);
        if (onCompletada) onCompletada();
      }
    }, 60);
  };

  let bgColor = "bg-secondary";
  if (status === "started") bgColor = "bg-warning";
  if (status === "finished") bgColor = "bg-success";

  return (
    <div className={`card mb-3 ${bgColor} text-white`}>
      <div className="card-body">
        <h5 className="card-title">Torre #{index + 1}</h5>
        <div className="mb-2">
          <button
            className="btn btn-light me-2"
            onClick={handleStart}
            disabled={status !== "pending"}
          >
            Comenzar estirado
          </button>
          <button
            className="btn btn-dark"
            onClick={handleFinish}
            disabled={status !== "started" || completada}
          >
            Finalizar estirado
          </button>
        </div>
        <div>
          {status === "pending" && <span>Esperando inicio...</span>}
        </div>
        <div className="mt-2">
          {inicio && (
            <div>
              <span className="badge bg-info text-dark mb-1">Inicio: {inicio.fecha} {inicio.hora}</span>
            </div>
          )}
          {fin && (
            <div>
              <span className="badge bg-success mb-1">Fin: {fin.fecha} {fin.hora}</span>
            </div>
          )}
        </div>
        {showBar && (
          <div className="mt-3">
            <div className="progress" style={{height: "22px", background: "#f8d7da", borderRadius: "8px"}}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%`, background: progress < 100 ? "#ffc107" : "#198754", color: "#222", fontWeight: "bold" }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progress < 100 ? `Procesando... ${progress}%` : "¡Torre lista y validada!"}
              </div>
            </div>
            {progress === 100 && <div className="mt-2 fw-bold text-success">✔ Proceso de torre finalizado correctamente</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Torre;
