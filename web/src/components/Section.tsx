import { FormBuilder } from './display/FormBuilder';

export type ProfileItem = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'file' | 'choice' | 'paiement';
  validation: {
    min?: number | string;
    max?: number | string;
    minLength?: string;
    maxLength?: string;
    amount?: number;
    values?: string;
    apiKey?: string;
    required?: boolean;
  };
};

type SectionProps = {
  label: string;
  count: number;
  value: ProfileItem[];
  form: Record<string, string | number>;
  updateFormValue: (key: string, value: string | number) => void;
  slip?: boolean;
};

export const Section = ({
  label,
  count,
  value,
  form,
  updateFormValue,
  slip = false,
}: SectionProps) => {
  return (
    <div>
      <div className="mb-2">
        <span className="text-4xl font-bold">{count}.</span>
        <span className="font-semibold text-xl ml-4">{label}</span>
      </div>
      <div className="bg-white rounded-lg p-8">
        <FormBuilder
          form={form}
          updateFormValue={updateFormValue}
          value={value}
          slip={slip}
        />
      </div>
    </div>
  );
};
