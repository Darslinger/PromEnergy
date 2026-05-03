import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonProgressBar
} from '@ionic/react';
import { registros, calcularPago } from '../data/store';

const Tab3: React.FC = () => {
  const total = registros.reduce((s, r) => s + r.kwh, 0);
  const dias = registros.length;
  const promedio = dias > 0 ? total / dias : 0;
  const proyeccion = promedio * 30;
  const pagoEstimado = calcularPago(proyeccion);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Resumen del mes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="stats-grid">
          {[
            { val: dias, label: 'Días registrados' },
            { val: total.toFixed(1), label: 'kWh total mes' },
            { val: promedio.toFixed(1), label: 'Promedio diario (kWh)' },
            { val: proyeccion.toFixed(1), label: 'Proyección 30 días' },
          ].map((s, i) => (
            <IonCard key={i} style={{ margin: 0 }}>
              <IonCardContent style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--ion-color-primary)', margin: 0 }}>{s.val}</p>
                <p style={{ fontSize: 11, color: 'var(--ion-color-medium)', marginTop: 4 }}>{s.label}</p>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <IonCard color="primary" style={{ marginTop: 8 }}>
          <IonCardContent style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, opacity: 0.85, margin: 0, color: 'var(--ion-color-primary-contrast)' }}>Estimado a pagar este mes</p>
            <p style={{ fontSize: 36, fontWeight: 700, margin: '6px 0', color: 'var(--ion-color-primary-contrast)' }}>L {pagoEstimado.toFixed(2)}</p>
            <p style={{ fontSize: 11, opacity: 0.75, margin: 0, color: 'var(--ion-color-primary-contrast)' }}>Tarifas ENEE + cargo fijo L 25</p>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ marginTop: 8 }}>
          <IonCardContent>
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>Consumo proyectado vs bloques ENEE</p>
            <p style={{ fontSize: 12, color: 'var(--ion-color-medium)', margin: '10px 0 4px' }}>Bloque 1 — hasta 100 kWh</p>
            <IonProgressBar value={Math.min(proyeccion / 100, 1)} color="success" />
            <p style={{ fontSize: 12, color: 'var(--ion-color-medium)', margin: '10px 0 4px' }}>Bloque 2 — hasta 300 kWh</p>
            <IonProgressBar value={Math.min(proyeccion / 300, 1)} color="warning" />
            <p style={{ fontSize: 12, color: 'var(--ion-color-medium)', margin: '10px 0 4px' }}>Bloque 3 — hasta 500 kWh</p>
            <IonProgressBar value={Math.min(proyeccion / 500, 1)} color="danger" />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;