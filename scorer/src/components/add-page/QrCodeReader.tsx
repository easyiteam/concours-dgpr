import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useEffect, useState } from 'react';

type Props = {
  message?: string;
  onChange: (value: string) => void;
};

export default function QrCodeReader({
  onChange,
  message = 'Cliquez pour scanner',
}: Props) {
  const [msg, setMsg] = useState(message);

  useEffect(() => {
    (document.querySelector('body') as HTMLBodyElement).classList.add(
      'scanner-active',
    );

    return () => {
      (document.querySelector('body') as HTMLBodyElement).classList.remove(
        'scanner-active',
      );
    };
  }, []);

  useEffect(() => {
    setMsg(message);
  }, [message]);

  const startScan = async () => {
    await BarcodeScanner.checkPermission({ force: true });

    document.body.style.opacity = '0';
    document.body.style.background = 'transparent';

    //   BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      document.body.style.opacity = '1';
      document.body.style.background = '';
      onChange(result.content ?? '');
      setMsg(result.content ?? '');
    }
  };

  return (
    <div
      className="w-full h-full flex justify-center items-center text-[#999]"
      onClick={() => startScan()}>
      {msg}
    </div>
  );
}
