import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonIcon, IonLabel, IonRouterOutlet,
  IonTabBar, IonTabButton, IonTabs, setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircleOutline, listOutline, barChartOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/registrar" component={Tab1} />
          <Route exact path="/historial" component={Tab2} />
          <Route exact path="/resumen"   component={Tab3} />
          <Route exact path="/">
            <Redirect to="/registrar" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="registrar" href="/registrar">
            <IonIcon icon={addCircleOutline} />
            <IonLabel>Registrar</IonLabel>
          </IonTabButton>
          <IonTabButton tab="historial" href="/historial">
            <IonIcon icon={listOutline} />
            <IonLabel>Historial</IonLabel>
          </IonTabButton>
          <IonTabButton tab="resumen" href="/resumen">
            <IonIcon icon={barChartOutline} />
            <IonLabel>Resumen</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;