import { useState } from 'react';
import { Input } from '../../components/form-fields/Input';
import { Button } from '../../components/buttons/Button';

type Props = {
  onSubmit: (data: never) => Promise<void>;
};

export const ReasonForm = ({ onSubmit }: Props) => {
  const [reason, setReason] = useState('');

  return (
    <div className="p-4 w-[90vw] lg:w-[35vw] flex flex-col gap-4">
      <Input
        label="Motif du rejet"
        value={reason}
        name="reason"
        onChange={(e) => {
          console.log(e.target.value);
          setReason(e.target.value);
        }}
        area
      />
      <Button
        className="text-sm w-full !bg-red-500"
        onClick={() => onSubmit(reason as never)}>
        Rejeter la candidature
      </Button>
    </div>
  );
};
