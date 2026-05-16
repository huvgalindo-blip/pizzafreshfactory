
"use client";
import React, { useState } from "react";
import Header from "./components/Header";
import Torre from "./components/Torre";
import InfoTiempoReal from "./components/InfoTiempoReal";
import Link from "next/link";
import { useOrdenAmasado } from "./context/OrdenAmasadoContext";

export default function Home() {
  const { bolasAmasado, setBolasAmasado } = useOrdenAmasado();
  const [torres, setTorres] = useState([]);
  const [torresRestantes, setTorresRestantes] = useState(0);
  const temperatura = 22;
  const humedad = 60;

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
      </div>
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
