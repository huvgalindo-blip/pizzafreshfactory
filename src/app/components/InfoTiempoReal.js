"use client";
import React, { useEffect, useState } from "react";

export default function InfoTiempoReal() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(60);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
      // Aquí podrías actualizar temperature y humidity si tienes sensores o API
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alert alert-info d-flex flex-wrap gap-3 justify-content-center align-items-center mb-4" role="alert">
      <span><strong>Fecha:</strong> {date}</span>
      <span><strong>Hora:</strong> {time}</span>
      <span><strong>Temperatura:</strong> {temperature}°C</span>
      <span><strong>Humedad:</strong> {humidity}%</span>
    </div>
  );
}
