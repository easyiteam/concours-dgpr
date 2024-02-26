import { useEffect, useState } from 'react';
import { api } from '../../api';
import ScanCode from '../add-page/ScanCode';
import DisplayValue from './DisplayValue';

export default function VerifyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const cb = async () => {
      if (code.length > 0) {
        const response = await api.get('fields/get-score/' + code);
        setValue(response.data.score.value ?? '');
      }
    };
    cb();
  }, [code]);

  return (
    <div>
      {currentStep === 1 ? (
        <ScanCode
          setCode={setCode}
          updateView={setCurrentStep}
        />
      ) : (
        <DisplayValue
          value={value}
          updateView={setCurrentStep}
        />
      )}
    </div>
  );
}
