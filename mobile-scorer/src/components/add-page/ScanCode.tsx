import { useState } from 'react';
import QrCodeReader from './QrCodeReader';
type Props = {
  updateView: (value: number) => void;
  setCode: (code: string) => void;
};

export default function ScanCode({ updateView, setCode }: Props) {
  const [code, $setCode] = useState('');

  const [message, setMessage] = useState('Cliquez pour scanner');

  const submit = () => {
    setCode(code);
    $setCode('');
    setMessage('Cliquez pour scanner');
    updateView(2);
  };

  return (
    <div className="w-full h-full flex justify-center items-center px-8">
      <div className="w-full">
        <div className="font-bold text-2xl my-4 text-center">
          Scanner le QrCode
        </div>
        <div className="w-full h-[150px] bg-white">
          <QrCodeReader
            message={message}
            onChange={$setCode}
          />
        </div>
        <input
          className="w-full outline-0 border rounded px-3 py-3 my-2"
          value={code}
          onChange={(e) => $setCode(e.target.value)}
          placeholder="Saisir le code"
        />
        <button
          onClick={submit}
          className="border border-[#183661] bg-[#183661] text-white font-bold w-full py-3 rounded">
          Continuer
        </button>
      </div>
    </div>
  );
}
