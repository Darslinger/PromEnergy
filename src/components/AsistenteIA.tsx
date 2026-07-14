import React, { useState, useRef, useEffect } from 'react';
import {
  IonFab, IonFabButton, IonIcon, IonModal, IonHeader,
  IonToolbar, IonTitle, IonContent, IonFooter,
  IonInput, IonButton, IonSpinner
} from '@ionic/react';
import { chatbubbleEllipsesOutline, sendOutline, closeOutline } from 'ionicons/icons';
import './AsistenteIA.css';

interface Mensaje {
  rol: 'user' | 'assistant';
  texto: string;
}

const AsistenteIA: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { rol: 'assistant', texto: '¡Hola! Soy tu asistente de energía eléctrica. Puedo ayudarte con dudas sobre tu consumo, tarifas ENEE, cómo ahorrar energía y más. ¿En qué te puedo ayudar?' }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300);
    }
  }, [mensajes]);

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || cargando) return;

    const nuevosMensajes: Mensaje[] = [...mensajes, { rol: 'user', texto }];
    setMensajes(nuevosMensajes);
    setInput('');
    setCargando(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Eres un asistente virtual experto en consumo eléctrico residencial en Honduras. 
          Ayudas a los usuarios con dudas sobre:
          - Tarifas de la ENEE (0-50 kWh: L4.40/kWh, más de 50 kWh: L5.73/kWh)
          - Cargos adicionales: Comercialización L59.31, Regulación L8.39, Alumbrado público L116.17
          - Cómo reducir el consumo eléctrico
          - Qué electrodomésticos consumen más
          - Cómo leer el medidor
          - Interpretación de recibos de luz
          Responde siempre en español, de forma clara y concisa.`,
          messages: nuevosMensajes.map(m => ({
            role: m.rol,
            content: m.texto
          }))
        })
      });

      const data = await response.json();
      const respuesta = data.content?.[0]?.text || 'Lo siento, no pude procesar tu pregunta.';
      setMensajes(prev => [...prev, { rol: 'assistant', texto: respuesta }]);
      setMensajes(prev => [...prev, { rol: 'assistant', texto: 'Lo siento, hubo un error al conectar. Intenta de nuevo.' }]);
    } finally {
      setCargando(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') enviar();
  };

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton color="primary" onClick={() => setAbierto(true)} className="fab-ia">
          <IonIcon icon={chatbubbleEllipsesOutline} />
        </IonFabButton>
      </IonFab>

      <IonModal isOpen={abierto} onDidDismiss={() => setAbierto(false)}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>🤖 Asistente IA</IonTitle>
            <IonButton slot="end" fill="clear" color="light" onClick={() => setAbierto(false)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={contentRef} className="chat-content">
          <div className="chat-mensajes">
            {mensajes.map((m, i) => (
              <div key={i} className={`burbuja ${m.rol === 'user' ? 'burbuja-user' : 'burbuja-bot'}`}>
                {m.rol === 'assistant' && <span className="bot-label">⚡ Asistente</span>}
                <p>{m.texto}</p>
              </div>
            ))}
            {cargando && (
              <div className="burbuja burbuja-bot">
                <span className="bot-label">⚡ Asistente</span>
                <div className="typing">
                  <IonSpinner name="dots" />
                </div>
              </div>
            )}
          </div>
        </IonContent>

        <IonFooter>
          <div className="chat-input-container">
            <IonInput
              value={input}
              placeholder="Escribe tu pregunta..."
              onIonChange={e => setInput(e.detail.value!)}
              onKeyDown={handleKey}
              className="chat-input"
            />
            <IonButton
              fill="solid"
              color="primary"
              onClick={enviar}
              disabled={!input.trim() || cargando}
              className="chat-send"
            >
              <IonIcon icon={sendOutline} />
            </IonButton>
          </div>
        </IonFooter>
      </IonModal>
    </>
  );
};

export default AsistenteIA;