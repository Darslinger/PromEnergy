import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonInput, IonButton, IonIcon
} from '@ionic/react';
import { calendarOutline, flashOutline, addCircleOutline, calculatorOutline } from 'ionicons/icons';
import { agregarRegistro } from '../data/store';
import './Tab1.css';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS = Array.from({ length: 31 }, (_, i) => i + 1);

function calcularPago(kwh: number): number {
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

const Tab1: React.FC = () => {
  const hoy = new Date();
  const [vista, setVista] = useState<'menu' | 'diario' | 'rapido'>('menu');

  // Registro diario
  const [dia, setDia] = useState<number>(hoy.getDate());
  const [mes, setMes] = useState<number>(hoy.getMonth() + 1);
  const [kwh, setKwh] = useState<string>('');
  const [msg, setMsg] = useState<string>('');

  // Cálculo rápido
  const [kwhTotal, setKwhTotal] = useState<string>('');
  const [resultado, setResultado] = useState<number | null>(null);

  const guardar = () => {
    const valor = parseFloat(kwh);
    if (isNaN(valor) || valor <= 0) return;
    agregarRegistro({ dia, mes, kwh: valor });
    setKwh('');
    setMsg(`✅ Guardado: ${valor} kWh — ${MESES[mes-1]} ${dia}`);
    setTimeout(() => setMsg(''), 3000);
  };

  const calcularRapido = () => {
    const valor = parseFloat(kwhTotal);
    if (isNaN(valor) || valor <= 0) return;
    setResultado(calcularPago(valor));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            {vista === 'menu' ? 'Inicio'
             : vista === 'diario' ? 'Registro Diario'
             : 'Cálculo Rápido'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* ── MENÚ PRINCIPAL ── */}
        {vista === 'menu' && (
          <>
            <p className="bienvenida">¿Qué deseas hacer?</p>

            <IonCard className="menu-card" onClick={() => setVista('diario')}>
              <IonCardContent className="menu-card-content">
                <IonIcon icon={calendarOutline} className="menu-icon" />
                <div>
                  <h2 className="menu-titulo">Registro Diario</h2>
                  <p className="menu-desc">Ingresa los kWh consumidos cada día y calcula tu promedio mensual</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="menu-card" onClick={() => setVista('rapido')}>
              <IonCardContent className="menu-card-content">
                <IonIcon icon={flashOutline} className="menu-icon menu-icon-yellow" />
                <div>
                  <h2 className="menu-titulo">Cálculo Rápido</h2>
                  <p className="menu-desc">Ingresa el total de kWh del mes y calcula cuánto vas a pagar</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard color="success" style={{ marginTop: 16 }}>
              <IonCardContent>
                <p className="tarifa-title">Tarifas ENEE vigentes (L/kWh)</p>
                <div className="tarifa-row"><span>0 – 100 kWh</span><span>L 1.4907</span></div>
                <div className="tarifa-row"><span>101 – 300 kWh</span><span>L 2.5152</span></div>
                <div className="tarifa-row"><span>301 – 500 kWh</span><span>L 3.8760</span></div>
                <div className="tarifa-row"><span>Más de 500 kWh</span><span>L 5.2500</span></div>
                <p className="tarifa-nota">Cargo fijo: L 25.00</p>
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── REGISTRO DIARIO ── */}
        {vista === 'diario' && (
          <>
            <IonButton fill="clear" onClick={() => setVista('menu')}>
              ← Volver
            </IonButton>
            <IonCard>
              <IonCardContent>
                <IonItem>
                  <IonLabel position="stacked">Día</IonLabel>
                  <IonSelect value={dia} onIonChange={e => setDia(e.detail.value)}>
                    {DIAS.map(d => (
                      <IonSelectOption key={d} value={d}>Día {d}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Mes</IonLabel>
                  <IonSelect value={mes} onIonChange={e => setMes(e.detail.value)}>
                    {MESES.map((m, i) => (
                      <IonSelectOption key={i} value={i + 1}>{m}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Kilowatts consumidos (kWh)</IonLabel>
                  <IonInput
                    type="number"
                    value={kwh}
                    placeholder="ej. 8.5"
                    onIonChange={e => setKwh(e.detail.value!)}
                  />
                </IonItem>
                <IonButton
                  expand="block"
                  className="ion-margin-top"
                  onClick={guardar}
                  disabled={!kwh || parseFloat(kwh) <= 0}
                >
                  <IonIcon slot="start" icon={addCircleOutline} />
                  Agregar registro
                </IonButton>
                {msg && <p className="msg-ok">{msg}</p>}
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── CÁLCULO RÁPIDO ── */}
        {vista === 'rapido' && (
          <>
            <IonButton fill="clear" onClick={() => { setVista('menu'); setResultado(null); setKwhTotal(''); }}>
              ← Volver
            </IonButton>
            <IonCard>
              <IonCardContent>
                <IonItem>
                  <IonLabel position="stacked">Total kWh consumidos en el mes</IonLabel>
                  <IonInput
                    type="number"
                    value={kwhTotal}
                    placeholder="ej. 500"
                    onIonChange={e => { setKwhTotal(e.detail.value!); setResultado(null); }}
                  />
                </IonItem>
                <IonButton
                  expand="block"
                  className="ion-margin-top"
                  color="warning"
                  onClick={calcularRapido}
                  disabled={!kwhTotal || parseFloat(kwhTotal) <= 0}
                >
                  <IonIcon slot="start" icon={calculatorOutline} />
                  Calcular pago
                </IonButton>
              </IonCardContent>
            </IonCard>

            {resultado !== null && (
              <IonCard color="primary">
                <IonCardContent style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 13, opacity: 0.85, margin: 0, color: 'white' }}>
                    Por {kwhTotal} kWh consumidos pagarás aproximadamente
                  </p>
                  <p style={{ fontSize: 40, fontWeight: 700, margin: '8px 0', color: 'white' }}>
                    L {resultado.toFixed(2)}
                  </p>
                  <p style={{ fontSize: 11, opacity: 0.75, margin: 0, color: 'white' }}>
                    Incluye cargo fijo L 25.00 — Tarifas ENEE
                  </p>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Tab1;