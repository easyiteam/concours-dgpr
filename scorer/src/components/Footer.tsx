import { IonIcon } from '@ionic/react';
import { addCircleOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { useState } from 'react';

export default function Footer({ setCurrentPage }: any) {
  const [active, setActive] = useState(1);

  return (
    <div className="grid grid-cols-2 bg-white p-2">
      <div
        className={
          active === 1
            ? 'text-center p-1 border rounded font-bold text-[##183661]'
            : 'text-center p-1 border border-white'
        }
        onClick={() => {
          setActive(1);
          setCurrentPage(0);
        }}>
        <IonIcon
          style={{ fontSize: '24px', color: '#636363' }}
          icon={addCircleOutline}
        />
        <div>Saisir les notes</div>
      </div>
      <div
        className={
          active === 2
            ? 'text-center p-1 border rounded font-bold text-[##183661]'
            : 'text-center p-1 border border-white'
        }
        onClick={() => {
          setActive(2);
          setCurrentPage(1);
        }}>
        <IonIcon
          style={{ fontSize: '24px', color: '#636363' }}
          icon={shieldCheckmarkOutline}
        />
        <div>Vérifier un code</div>
      </div>
    </div>
  );
}
