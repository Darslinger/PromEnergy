import React, { useState, useRef } from 'react';
import {
  IonButton, IonIcon, IonModal, IonHeader, IonToolbar,
  IonTitle, IonContent, IonCard, IonCardContent, IonSpinner
} from '@ionic/react';
import { scanOutline, cameraOutline, imagesOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import './EscaneoFoto.css';

interface Props {
  onResultado: (recibo: number, contador: number) => void;
}

const EscaneoFoto: React.FC<Props> = ({ onResultado }) => {
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState<'recibo' | 'contador' | 'resultado'>('recibo');
  const [cargando, setCargando] = useState(false);
  const [valorRecibo, setValorRecibo] = useState<number | null>(null);
  const [valorContador, setValorContador] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const inputReciboCamera = useRef<HTMLInputElement>(null);
  const inputReciboGaleria = useRef<HTMLInputElement>(null);
  const inputContadorCamera = useRef<HTMLInputElement>(null);
  const inputContadorGaleria = useRef<HTMLInputElement>(null);

  const escanearImagen = async (archivo: File, tipo: 'recibo' | 'contador') => {
    setCargando(true);
    setError('');
    try {
      // Comprimir imagen antes de enviar
      const base64 = await new Promise<string>((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();
        img.onload = () => {
          const maxSize = 800;
          let w = img.width;
          let h = img.height;
          if (w > h && w > maxSize) { h = h * maxSize / w; w = maxSize; }
          else if (h > maxSize) { w = w * maxSize / h; h = maxSize; }
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          const data = canvas.toDataURL('image/jpeg', 0.7);
          resolve(data.split(',')[1]);
        };
        img.src = URL.createObjectURL(archivo);
      });

      const response = await fetch('/.netlify/functions/escanear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen: base64, tipo })
      });

      const data = await response.json();

      if (data.error) {
        setError('No se pudo leer la imagen. Intenta con una foto más clara.');
      } else {
        if (tipo === 'recibo') {
          setValorRecibo(data.valor);
          setPaso('contador');
        } else {
          setValorContador(data.valor);
          setPaso('resultado');
        }
      }
    } catch (_e) {
      setError('Error al procesar la imagen. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'recibo' | 'contador') => {
    const archivo = e.target.files?.[0];
    if (archivo) escanearImagen(archivo, tipo);
  };

  const confirmar = () => {
    if (valorRecibo !== null && valorContador !== null) {
      onResultado(valorRecibo, valorContador);
      setAbierto(false);
      resetear();
    }
  };

  const resetear = () => {
    setPaso('recibo');
    setValorRecibo(null);
    setValorContador(null);
    setError('');
  };

  return (
    <>
      <IonButton expand="block" color="tertiary" onClick={() => setAbierto(true)}>
        <IonIcon slot="start" icon={scanOutline} />
        Escanear recibo y contador
      </IonButton>

      <IonModal isOpen={abierto} onDidDismiss={() => { setAbierto(false); resetear(); }}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>📷 Escanear</IonTitle>
            <IonButton slot="end" fill="clear" color="light" onClick={() => { setAbierto(false); resetear(); }}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <div className="pasos-container">
            <div className={`paso ${paso === 'recibo' ? 'paso-activo' : valorRecibo !== null ? 'paso-done' : ''}`}>
              <span>1</span><p>Recibo</p>
            </div>
            <div className="paso-linea" />
            <div className={`paso ${paso === 'contador' ? 'paso-activo' : valorContador !== null ? 'paso-done' : ''}`}>
              <span>2</span><p>Contador</p>
            </div>
            <div className="paso-linea" />
            <div className={`paso ${paso === 'resultado' ? 'paso-activo' : ''}`}>
              <span>3</span><p>Confirmar</p>
            </div>
          </div>

          {/* ── PASO 1: RECIBO ── */}
          {paso === 'recibo' && (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 40 }}>📄</p>
                <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Foto del recibo</h2>
                <p style={{ color: 'var(--ion-color-medium)', fontSize: 14, marginBottom: 16 }}>
                  Toma una foto o selecciona desde tu galería.
                </p>
                {cargando ? (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <IonSpinner name="crescent" />
                    <p style={{ marginTop: 8 }}>Leyendo recibo...</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <IonButton expand="block" onClick={() => inputReciboCamera.current?.click()}>
                      <IonIcon slot="start" icon={cameraOutline} />
                      Tomar foto
                    </IonButton>
                    <IonButton expand="block" fill="outline" onClick={() => inputReciboGaleria.current?.click()}>
                      <IonIcon slot="start" icon={imagesOutline} />
                      Elegir de galería
                    </IonButton>
                  </div>
                )}
                <input ref={inputReciboCamera} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleArchivo(e, 'recibo')} />
                <input ref={inputReciboGaleria} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleArchivo(e, 'recibo')} />
                {error && <p style={{ color: 'red', marginTop: 8, fontSize: 13 }}>{error}</p>}
              </IonCardContent>
            </IonCard>
          )}

          {/* ── PASO 2: CONTADOR ── */}
          {paso === 'contador' && (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center' }}>
                {valorRecibo !== null && (
                  <div style={{ background: '#e8f5e9', borderRadius: 8, padding: 10, marginBottom: 16 }}>
                    <p style={{ fontSize: 13, color: '#2e7d32', margin: 0 }}>✅ Recibo leído</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#2e7d32', margin: '4px 0 0' }}>{valorRecibo} kWh</p>
                  </div>
                )}
                <p style={{ fontSize: 40 }}>⚡</p>
                <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Foto del contador</h2>
                <p style={{ color: 'var(--ion-color-medium)', fontSize: 14, marginBottom: 16 }}>
                  Toma una foto o selecciona desde tu galería.
                </p>
                {cargando ? (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <IonSpinner name="crescent" />
                    <p style={{ marginTop: 8 }}>Leyendo contador...</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <IonButton expand="block" color="warning" onClick={() => inputContadorCamera.current?.click()}>
                      <IonIcon slot="start" icon={cameraOutline} />
                      Tomar foto
                    </IonButton>
                    <IonButton expand="block" fill="outline" color="warning" onClick={() => inputContadorGaleria.current?.click()}>
                      <IonIcon slot="start" icon={imagesOutline} />
                      Elegir de galería
                    </IonButton>
                  </div>
                )}
                <input ref={inputContadorCamera} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleArchivo(e, 'contador')} />
                <input ref={inputContadorGaleria} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleArchivo(e, 'contador')} />
                {error && <p style={{ color: 'red', marginTop: 8, fontSize: 13 }}>{error}</p>}
              </IonCardContent>
            </IonCard>
          )}

          {/* ── PASO 3: RESULTADO ── */}
          {paso === 'resultado' && (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 40 }}>🎉</p>
                <h2 style={{ fontWeight: 600, marginBottom: 16 }}>¡Datos escaneados!</h2>
                <div style={{ background: '#e8f5e9', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <p style={{ fontSize: 13, color: '#2e7d32', margin: 0 }}>📄 Consumo del recibo</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#2e7d32', margin: '4px 0 0' }}>{valorRecibo} kWh</p>
                </div>
                <div style={{ background: '#e3f2fd', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: '#1565c0', margin: 0 }}>⚡ Lectura del contador</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#1565c0', margin: '4px 0 0' }}>{valorContador} kWh</p>
                </div>
                <IonButton expand="block" color="success" onClick={confirmar}>
                  <IonIcon slot="start" icon={checkmarkOutline} />
                  Guardar registros
                </IonButton>
                <IonButton expand="block" fill="outline" color="medium" onClick={resetear} style={{ marginTop: 8 }}>
                  Volver a escanear
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}

        </IonContent>
      </IonModal>
    </>
  );
};

export default EscaneoFoto;