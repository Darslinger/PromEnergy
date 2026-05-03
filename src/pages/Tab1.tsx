import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonInput, IonButton, IonIcon
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { agregarRegistro } from '../data/store';
import './Tab1.css';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS = Array.from({ length: 31 }, (_, i) => i + 1);

const Tab1: React.FC = () => {
  const hoy = new Date();
  const [dia, setDia] = useState<number>(hoy.getDate());
  const [mes, setMes] = useState<number>(hoy.getMonth() + 1);
  const [kwh, setKwh] = useState<string>('');
  const [msg, setMsg] = useState<string>('');

  const guardar = () => {
    const valor = parseFloat(kwh);
    if (isNaN(valor) || valor <= 0) return;
    agregarRegistro({ dia, mes, kwh: valor });
    setKwh('');
    setMsg(`✅ Registro guardado: ${valor} kWh el ${MESES[mes-1]} ${dia}`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registrar consumo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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

        <IonCard color="success">
          <IonCardContent>
            <p className="tarifa-title">Tarifas ENEE vigentes (L/kWh)</p>
            <div className="tarifa-row"><span>0 – 100 kWh</span><span>L 1.4907</span></div>
            <div className="tarifa-row"><span>101 – 300 kWh</span><span>L 2.5152</span></div>
            <div className="tarifa-row"><span>301 – 500 kWh</span><span>L 3.8760</span></div>
            <div className="tarifa-row"><span>Más de 500 kWh</span><span>L 5.2500</span></div>
            <p className="tarifa-nota">Cargo fijo: L 25.00</p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;