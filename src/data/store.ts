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
  let pago = 25;
  if (kwh <= 100) {
    pago += kwh * 1.4907;
  } else if (kwh <= 300) {
    pago += 100 * 1.4907 + (kwh - 100) * 2.5152;
  } else if (kwh <= 500) {
    pago += 100 * 1.4907 + 200 * 2.5152 + (kwh - 300) * 3.876;
  } else {
    pago += 100 * 1.4907 + 200 * 2.5152 + 200 * 3.876 + (kwh - 500) * 5.25;
  }
  return pago;
}