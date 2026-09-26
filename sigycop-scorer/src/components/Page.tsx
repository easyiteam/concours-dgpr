import { IonContent, IonPage } from '@ionic/react';
import { PropsWithChildren } from 'react';

export default function Page({ children }: PropsWithChildren) {
  return (
    <IonPage>
      <IonContent fullscreen>{children}</IonContent>
    </IonPage>
  );
}
