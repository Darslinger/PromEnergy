export interface Registro {
  dia: number;
  mes: number;
  kwh: number;
}

export const registros: Registro[] = [];

export function agregarRegistro(r: Registro) {
  const idx = registros.findIndex(x => x.dia === r.dia && x.mes === r.mes);
  if (idx >= 0) {
    registros[idx] = r;
  } else {
    registros.push(r);
  }
  registros.sort((a, b) => a.mes - b.mes || a.dia - b.dia);
}

export function eliminarRegistro(i: number) {
  registros.splice(i, 1);
}

export function limpiarRegistros() {
  registros.splice(0, registros.length);
}

export function calcularPago(kwh: number): number {
  let energia = 0;
  if (kwh <= 50) {
    energia = kwh * 4.40;
  } else {
    energia = (50 * 4.40) + ((kwh - 50) * 5.73);
  }
  return energia + 59.31 + 8.39 + 116.17;
}