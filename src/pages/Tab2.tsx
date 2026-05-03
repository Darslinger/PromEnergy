import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonBadge, IonAlert
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { registros, eliminarRegistro, limpiarRegistros, calcularPago } from '../data/store';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const Tab2: React.FC = () => {
  const [, forceUpdate] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const eliminar = (i: number) => {
    eliminarRegistro(i);
    forceUpdate(n => n + 1);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Historial</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {registros.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 80, color: 'var(--ion-color-medium)' }}>
            <p>Sin registros aún.</p>
            <p>Ve a "Registrar" para agregar tu primer día.</p>
          </div>
        ) : (
          <>
            <IonButton
              fill="outline"
              color="danger"
              expand="block"
              className="ion-margin-bottom"
              onClick={() => setShowAlert(true)}
            >
              Limpiar todos los registros
            </IonButton>
            <IonList>
              {registros.map((r, i) => (
                <IonItem key={i}>
                  <IonLabel>
                    <h2>{MESES[r.mes - 1]} {r.dia}</h2>
                    <p>{r.kwh.toFixed(1)} kWh consumidos</p>
                  </IonLabel>
                  <IonBadge color="primary" slot="end">
                    L {calcularPago(r.kwh).toFixed(2)}
                  </IonBadge>
                  <IonButton fill="clear" color="danger" slot="end" onClick={() => eliminar(i)}>
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="¿Eliminar todo?"
          message="Se borrarán todos los registros."
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', handler: () => { limpiarRegistros(); forceUpdate(n => n + 1); } }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;