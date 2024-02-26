import { useState } from 'react';

type Props = {
  updateView: (value: number) => void;
  sendScore: (value: string) => Promise<boolean>;
};

export default function AddValue({ updateView, sendScore }: Props) {
  const [value, setValue] = useState('');

  const submit = async () => {
    const isOk = await sendScore(value);
    if (isOk) {
      setValue('');
      updateView(1);
      return;
    }
    alert('QrCode incorrect');
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full px-8">
        <div className="font-bold text-2xl my-4 text-center">
          Veuillez saisir la note
        </div>
        <input
          className="w-full outline-0 border rounded px-3 py-3 my-2"
          type="number"
          value={value}
          onChange={(e) => {
            const v = setValue(e.target.value);
            if (+v < 0 || +v > 20) return;
            setValue(e.target.value);
          }}
          placeholder="Saisir le code"
        />
        {+value >= 0 && +value <= 20 ? (
          <button
            onClick={submit}
            className="border border-[#183661] bg-[#183661] text-white font-bold w-full py-3 rounded">
            Envoyer
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
