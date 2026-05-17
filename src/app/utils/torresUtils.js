/**
 * Utilidades para el manejo de torres en el sistema de producción
 * 
 * Estas funciones permiten filtrar y cargar torres desde localStorage
 * aplicando la lógica de negocio para Control de Producción:
 * - Las torres normales aparecen a partir de las 00:00 del día siguiente
 * - Las torres enviadas aparecen inmediatamente
 */

/**
 * Obtiene las torres disponibles para producción desde localStorage
 * Aplica el filtro de fecha: torres normales esperan al día siguiente,
 * torres enviadas aparecen inmediatamente
 * 
 * @returns {Array} Array de torres filtradas para producción
 */
export function getTorresParaProduccion() {
  const data = localStorage.getItem("torresAmasado");
  if (!data) return [];
  
  const torres = JSON.parse(data);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return torres.filter((torre) => {
    // Las torres enviadas aparecen inmediatamente (excepción a la regla de fecha)
    if (torre.enviada) return true;
    
    // Las torres normales solo aparecen si la fecha de amasado es anterior al día actual
    if (!torre.fechaAmasado) return false;
    
    const fechaAmasado = new Date(torre.fechaAmasado);
    fechaAmasado.setHours(0, 0, 0, 0);
    
    // Mostrar si la fecha de amasado es anterior al día actual (día siguiente)
    return fechaAmasado < hoy;
  });
}

/**
 * Guarda las torres en localStorage para Control de Producción
 * Transforma el formato interno al formato esperado por Control de Producción
 * 
 * @param {Array} torres - Array de torres en formato interno
 * @param {Object} orden - Objeto con la información de la orden
 * @param {number} TORRE_BOLAS - Constante de bolas por torre
 */
export function guardarTorresParaProduccion(torres, orden, TORRE_BOLAS) {
  const torresParaProduccion = torres.map((torre, idx) => ({
    numeroTorre: idx + 1,
    bolas: idx < torres.length - 1 ? TORRE_BOLAS : orden.bolas - TORRE_BOLAS * (torres.length - 1),
    fechaAmasado: torre.inicio ? torre.inicio.fecha : new Date().toLocaleDateString(),
    enviada: torre.enviada || false,
    fechaEnvio: torre.enviada ? new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() : null,
  }));
  
  localStorage.setItem("torresAmasado", JSON.stringify(torresParaProduccion));
}
