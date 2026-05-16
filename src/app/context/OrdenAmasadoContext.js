"use client";
import { createContext, useContext, useState } from "react";

const OrdenAmasadoContext = createContext();

export function OrdenAmasadoProvider({ children }) {
  const [bolasAmasado, setBolasAmasado] = useState(0);

  return (
    <OrdenAmasadoContext.Provider value={{ bolasAmasado, setBolasAmasado }}>
      {children}
    </OrdenAmasadoContext.Provider>
  );
}

export function useOrdenAmasado() {
  return useContext(OrdenAmasadoContext);
}
