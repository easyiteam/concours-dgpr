import { useState } from 'react';
import { api } from '../../api';
import AddValue from './AddValue';
import ScanCode from './ScanCode';

export default function AddPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [code, setCode] = useState('');

  const sendScore = async (value: string) => {
    try {
      await api.post('writings/insert-score', {
        code: code.trim(),
        value: +value,
      });
      return true;
    } catch (e: any) {
      return false;
    }
  };

  return (
    <div className="w-full">
      {currentStep === 1 ? (
        <ScanCode
          setCode={setCode}
          updateView={setCurrentStep}
        />
      ) : (
        <AddValue
          sendScore={sendScore}
          updateView={setCurrentStep}
        />
      )}
    </div>
  );
}
