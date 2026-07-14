import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, IonIcon
} from '@ionic/react';
import { calendarOutline, flashOutline, addCircleOutline, calculatorOutline, speedometerOutline, sunny } from 'ionicons/icons';
import { agregarRegistro } from '../data/store';
import './Tab1.css';
import AsistenteIA from '../components/AsistenteIA';
import EscaneoFoto from '../components/EscaneoFoto';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const Tab1: React.FC = () => {
  const hoy = new Date();
  const [vista, setVista] = useState<'menu' | 'diario' | 'rapido' | 'control'>('menu');

  // Registro diario
  const [dia, setDia] = useState<number>(hoy.getDate());
  const [mes, setMes] = useState<number>(hoy.getMonth() + 1);
  const [kwh, setKwh] = useState<string>('');
  const [hora, setHora] = useState<string>('');
  const [minuto, setMinuto] = useState<string>('00');
  const [periodo, setPeriodo] = useState<string>(hoy.getHours() < 12 ? 'AM' : 'PM');
  const [msg, setMsg] = useState<string>('');

  // Cálculo rápido
  const [kwhTotal, setKwhTotal] = useState<string>('');
  const [resultado, setResultado] = useState<number | null>(null);
  const [desglose, setDesglose] = useState<{energia: number, total: number} | null>(null);

  // Control de consumo
  const [lecturaAntes, setLecturaAntes] = useState<string>('');
  const [lecturaDespues, setLecturaDespues] = useState<string>('');
  const [horaAntes, setHoraAntes] = useState<string>('');
  const [minutoAntes, setMinutoAntes] = useState<string>('00');
  const [periodoAntes, setPeriodoAntes] = useState<string>('AM');
  const [horaDespues, setHoraDespues] = useState<string>('');
  const [minutoDespues, setMinutoDespues] = useState<string>('00');
  const [periodoDespues, setPeriodoDespues] = useState<string>('AM');
  const [resultadoControl, setResultadoControl] = useState<{
    kwh: number;
    horas: number;
    pago: number;
    kwhPorHora: number;
  } | null>(null);

  const guardar = () => {
    const valor = parseFloat(kwh);
    if (isNaN(valor) || valor <= 0) return;
    agregarRegistro({ dia, mes, kwh: valor });
    setKwh('');
    setMsg(`✅ Guardado: ${valor} kWh — ${MESES[mes-1]} ${dia}${hora ? ` a las ${hora}:${minuto.padStart(2,'0')} ${periodo}` : ''}`);
    setTimeout(() => setMsg(''), 3000);
  };

  const calcularRapido = () => {
    const valor = parseFloat(kwhTotal);
    if (isNaN(valor) || valor <= 0) return;
    let energia = 0;
    if (valor <= 50) {
      energia = valor * 4.409;
    } else {
      energia = (50 * 4.409) + ((valor - 50) * 5.7372);
    }
    const total = energia + 59.31 + 8.39 + 116.17;
    setResultado(total);
    setDesglose({ energia, total });
  };

  const calcularControl = () => {
    const antes = parseFloat(lecturaAntes);
    const despues = parseFloat(lecturaDespues);
    if (isNaN(antes) || isNaN(despues) || despues < antes) return;
    const kwhConsumidos = despues - antes;

    let horas = 0;
    let kwhPorHora = 0;
    if (horaAntes && horaDespues) {
      let h1 = parseInt(horaAntes);
      let h2 = parseInt(horaDespues);
      const m1 = parseInt(minutoAntes) || 0;
      const m2 = parseInt(minutoDespues) || 0;
      if (periodoAntes === 'PM' && h1 !== 12) h1 += 12;
      if (periodoAntes === 'AM' && h1 === 12) h1 = 0;
      if (periodoDespues === 'PM' && h2 !== 12) h2 += 12;
      if (periodoDespues === 'AM' && h2 === 12) h2 = 0;
      let minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (minutos < 0) minutos += 24 * 60;
      horas = minutos / 60;
      kwhPorHora = horas > 0 ? kwhConsumidos / horas : 0;
    }

    let energia = 0;
    if (kwhConsumidos <= 50) {
      energia = kwhConsumidos * 4.409;
    } else {
      energia = (50 * 4.409) + ((kwhConsumidos - 50) * 5.7372);
    }
    setResultadoControl({ kwh: kwhConsumidos, horas, pago: energia, kwhPorHora });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            {vista === 'menu' ? 'Inicio'
             : vista === 'diario' ? 'Registro Diario'
             : vista === 'rapido' ? 'Cálculo Rápido'
             : 'Control de Consumo'}
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

            <IonCard className="menu-card" onClick={() => setVista('control')}>
              <IonCardContent className="menu-card-content">
                <IonIcon icon={speedometerOutline} className="menu-icon menu-icon-purple" />
                <div>
                  <h2 className="menu-titulo">Control de Consumo</h2>
                  <p className="menu-desc">Registra dos lecturas del medidor y calcula cuánto consumes por hora</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard color="success">
              <IonCardContent>
                <p className="tarifa-title">Tarifas ENEE vigentes (L/kWh)</p>
                <div className="tarifa-row"><span>0 – 50 kWh</span><span>L 4.40</span></div>
                <div className="tarifa-row"><span>Más de 50 kWh</span><span>L 5.73</span></div>
                <div className="tarifa-row"><span>Comercialización</span><span>L 59.31</span></div>
                <div className="tarifa-row"><span>Regulación</span><span>L 8.39</span></div>
                <div className="tarifa-row"><span>Alumbrado público</span><span>L 116.17</span></div>
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
                  <IonInput type="number" value={dia} onIonChange={e => setDia(parseInt(e.detail.value!))} />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Mes</IonLabel>
                  <IonInput type="number" value={mes} onIonChange={e => setMes(parseInt(e.detail.value!))} />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Hora del registro</IonLabel>
                  <div className="hora-container">
                    <IonInput
                      type="number"
                      value={hora}
                      placeholder="HH"
                      min="1"
                      max="12"
                      onIonChange={e => setHora(e.detail.value!)}
                      className="hora-input"
                    />
                    <span className="hora-separador">:</span>
                    <IonInput
                      type="number"
                      value={minuto}
                      placeholder="MM"
                      min="0"
                      max="59"
                      onIonChange={e => setMinuto(e.detail.value!)}
                      className="hora-input"
                    />
                    <div className="ampm-container">
                      <IonButton size="small" fill={periodo === 'AM' ? 'solid' : 'outline'} color="primary" onClick={() => setPeriodo('AM')}>AM</IonButton>
                      <IonButton size="small" fill={periodo === 'PM' ? 'solid' : 'outline'} color="primary" onClick={() => setPeriodo('PM')}>PM</IonButton>
                    </div>
                  </div>
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

                {/* ── ESCANEO DE FOTOS ── */}
                <div style={{ marginTop: 12, marginBottom: 4 }}>
                  <p style={{ fontSize: 12, color: 'var(--ion-color-medium)', marginBottom: 4 }}>
                    O escanea tu recibo y contador:
                  </p>
                  <EscaneoFoto
                    onResultado={(recibo, contador) => {
                      setKwh(recibo.toString());
                      setMsg(`✅ Escaneado: ${recibo} kWh del recibo — contador en ${contador} kWh`);
                      setTimeout(() => setMsg(''), 5000);
                    }}
                  />
                </div>

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
            <IonButton fill="clear" onClick={() => { setVista('menu'); setResultado(null); setKwhTotal(''); setDesglose(null); }}>
              ← Volver
            </IonButton>
            <IonCard>
              <IonCardContent>
                <IonItem>
                  <IonLabel position="stacked">Total kWh consumidos en el mes</IonLabel>
                  <IonInput
                    type="number"
                    value={kwhTotal}
                    placeholder="ej. 566"
                    onIonChange={e => { setKwhTotal(e.detail.value!); setResultado(null); setDesglose(null); }}
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

            {resultado !== null && desglose !== null && (
              <>
                <IonCard color="primary">
                  <IonCardContent style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, opacity: 0.85, margin: 0, color: 'white' }}>
                      Por {kwhTotal} kWh consumidos pagarás aproximadamente
                    </p>
                    <p style={{ fontSize: 40, fontWeight: 700, margin: '8px 0', color: 'white' }}>
                      L {resultado.toFixed(2)}
                    </p>
                    <p style={{ fontSize: 11, opacity: 0.75, margin: 0, color: 'white' }}>
                      Comercialización L59.31 + Regulación L8.39 + Alumbrado L116.17
                    </p>
                  </IonCardContent>
                </IonCard>
                <IonCard>
                  <IonCardContent>
                    <p className="tarifa-title" style={{ color: 'var(--ion-color-dark)' }}>Desglose del pago</p>
                    <div className="tarifa-row"><span>Energía consumida</span><span>L {desglose.energia.toFixed(2)}</span></div>
                    <div className="tarifa-row"><span>Comercialización</span><span>L 59.31</span></div>
                    <div className="tarifa-row"><span>Regulación</span><span>L 8.39</span></div>
                    <div className="tarifa-row"><span>Alumbrado público</span><span>L 116.17</span></div>
                    <div className="tarifa-row" style={{ fontWeight: 600, borderTop: '1px solid #ddd', marginTop: 8, paddingTop: 8 }}>
                      <span>Total a pagar</span><span>L {resultado.toFixed(2)}</span>
                    </div>
                  </IonCardContent>
                </IonCard>
              </>
            )}
          </>
        )}

        {/* ── CONTROL DE CONSUMO ── */}
        {vista === 'control' && (
          <>
            <IonButton fill="clear" onClick={() => { setVista('menu'); setResultadoControl(null); setLecturaAntes(''); setLecturaDespues(''); setHoraAntes(''); setHoraDespues(''); }}>
              ← Volver
            </IonButton>

            <IonCard>
              <IonCardContent>
                <div className="control-header">
                  <IonIcon icon={speedometerOutline} style={{ fontSize: 24, color: '#7c3aed' }} />
                  <p className="control-label">Lectura inicial</p>
                </div>
                <IonItem>
                  <IonLabel position="stacked">Lectura del medidor (kWh)</IonLabel>
                  <IonInput
                    type="number"
                    value={lecturaAntes}
                    placeholder="ej. 999"
                    onIonChange={e => { setLecturaAntes(e.detail.value!); setResultadoControl(null); }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Hora</IonLabel>
                  <div className="hora-container">
                    <IonInput
                      type="number"
                      value={horaAntes}
                      placeholder="HH"
                      min="1"
                      max="12"
                      onIonChange={e => setHoraAntes(e.detail.value!)}
                      className="hora-input"
                    />
                    <span className="hora-separador">:</span>
                    <IonInput
                      type="number"
                      value={minutoAntes}
                      placeholder="MM"
                      min="0"
                      max="59"
                      onIonChange={e => setMinutoAntes(e.detail.value!)}
                      className="hora-input"
                    />
                    <div className="ampm-container">
                      <IonButton size="small" fill={periodoAntes === 'AM' ? 'solid' : 'outline'} color="primary" onClick={() => setPeriodoAntes('AM')}>AM</IonButton>
                      <IonButton size="small" fill={periodoAntes === 'PM' ? 'solid' : 'outline'} color="primary" onClick={() => setPeriodoAntes('PM')}>PM</IonButton>
                    </div>
                  </div>
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent>
                <div className="control-header">
                  <IonIcon icon={sunny} style={{ fontSize: 24, color: '#1a56a0' }} />
                  <p className="control-label">Lectura final</p>
                </div>
                <IonItem>
                  <IonLabel position="stacked">Lectura del medidor (kWh)</IonLabel>
                  <IonInput
                    type="number"
                    value={lecturaDespues}
                    placeholder="ej. 1007"
                    onIonChange={e => { setLecturaDespues(e.detail.value!); setResultadoControl(null); }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Hora</IonLabel>
                  <div className="hora-container">
                    <IonInput
                      type="number"
                      value={horaDespues}
                      placeholder="HH"
                      min="1"
                      max="12"
                      onIonChange={e => setHoraDespues(e.detail.value!)}
                      className="hora-input"
                    />
                    <span className="hora-separador">:</span>
                    <IonInput
                      type="number"
                      value={minutoDespues}
                      placeholder="MM"
                      min="0"
                      max="59"
                      onIonChange={e => setMinutoDespues(e.detail.value!)}
                      className="hora-input"
                    />
                    <div className="ampm-container">
                      <IonButton size="small" fill={periodoDespues === 'AM' ? 'solid' : 'outline'} color="primary" onClick={() => setPeriodoDespues('AM')}>AM</IonButton>
                      <IonButton size="small" fill={periodoDespues === 'PM' ? 'solid' : 'outline'} color="primary" onClick={() => setPeriodoDespues('PM')}>PM</IonButton>
                    </div>
                  </div>
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonButton
              expand="block"
              color="tertiary"
              onClick={calcularControl}
              disabled={!lecturaAntes || !lecturaDespues || parseFloat(lecturaDespues) < parseFloat(lecturaAntes)}
            >
              <IonIcon slot="start" icon={calculatorOutline} />
              Calcular consumo
            </IonButton>

            {resultadoControl !== null && (
              <>
                <IonCard color="primary" style={{ marginTop: 12 }}>
                  <IonCardContent style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, opacity: 0.85, margin: 0, color: 'white' }}>
                      Total consumido en {resultadoControl.horas > 0 ? `${resultadoControl.horas.toFixed(1)} horas` : 'ese período'}
                    </p>
                    <p style={{ fontSize: 40, fontWeight: 700, margin: '8px 0', color: 'white' }}>
                      {resultadoControl.kwh.toFixed(2)} kWh
                    </p>
                    <p style={{ fontSize: 16, margin: '4px 0', color: 'white' }}>
                      Costo aproximado: L {resultadoControl.pago.toFixed(2)}
                    </p>
                  </IonCardContent>
                </IonCard>

                {resultadoControl.kwhPorHora > 0 && (
                  <IonCard style={{ marginTop: 8 }}>
                    <IonCardContent>
                      <p className="tarifa-title" style={{ color: 'var(--ion-color-dark)' }}>Consumo por hora</p>
                      <div className="tarifa-row">
                        <span>kWh por hora</span>
                        <span>{resultadoControl.kwhPorHora.toFixed(3)} kWh/h</span>
                      </div>
                      <div className="tarifa-row">
                        <span>Costo por hora</span>
                        <span>L {(resultadoControl.pago / resultadoControl.horas).toFixed(2)}/h</span>
                      </div>
                      <div className="tarifa-row">
                        <span>Proyección 24 horas</span>
                        <span>{(resultadoControl.kwhPorHora * 24).toFixed(2)} kWh</span>
                      </div>
                      <div className="tarifa-row" style={{ fontWeight: 600, borderTop: '1px solid #ddd', marginTop: 8, paddingTop: 8 }}>
                        <span>Costo estimado al día</span>
                        <span>L {((resultadoControl.pago / resultadoControl.horas) * 24).toFixed(2)}</span>
                      </div>
                    </IonCardContent>
                  </IonCard>
                )}
              </>
            )}
          </>
        )}

      </IonContent>
      <AsistenteIA />
    </IonPage>
  );
};

export default Tab1;