import { useId, useMemo, useState } from 'react';
import { ProfileItem } from '../Section';
import { Input } from '../form-fields/Input';
import { Validator } from '@asaje/form-validator';
import { Select } from '../form-fields/Select';
import { FileUpload } from '../form-fields/FileUpload';
import { Checkout } from '../Checkout';

type FormBuilderProps = {
  value: ProfileItem[];
  form: Record<string, string | number>;
  updateFormValue: (key: string, value: string | number) => void;
  slip?: boolean;
};

type FormFieldProps = {
  profile: ProfileItem;
  form: Record<string, string | number>;
  updateFormValue: (key: string, value: string | number) => void;
  slip?: boolean;
};

export const FormBuilder = ({
  value,
  form,
  updateFormValue,
  slip,
}: FormBuilderProps) => {
  const _id = useId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {value.map((profile, index) => (
        <FormField
          profile={profile}
          form={form}
          updateFormValue={updateFormValue}
          key={`${_id}_${index}`}
          slip={slip}
        />
      ))}
    </div>
  );
};

export const FormField = ({
  profile,
  form,
  updateFormValue,
  slip,
}: FormFieldProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const validations = useMemo(() => {
    const validations = [Validator.required('Ce champs est obligatoire')];
    if (profile.validation.minLength) {
      validations.push(Validator.minLength(+profile.validation.minLength));
    }

    if (profile.validation.maxLength) {
      validations.push(Validator.minLength(+profile.validation.maxLength));
    }

    if (profile.validation.min) {
      validations.push(
        profile.type === 'date'
          ? Validator.minDate(
              profile.validation.min,
              'Doit être plus récent que {min}',
            )
          : Validator.min(+profile.validation.min),
      );
    }

    if (profile.validation.max) {
      validations.push(
        profile.type === 'date'
          ? Validator.maxDate(
              profile.validation.max,
              'Doit être moins récent que {max}',
            )
          : Validator.max(+profile.validation.max),
      );
    }

    if (profile.type === 'email') {
      validations.push(Validator.email("Format d'email non valide"));
    }
    return validations;
  }, [
    profile.type,
    profile.validation.min,
    profile.validation.max,
    profile.validation.minLength,
    profile.validation.maxLength,
  ]);
  const id = useId();
  if (profile.type === 'text') {
    return (
      <div>
        <Input
          label={profile.label + (profile.validation.required ? '*' : '')}
          value={form[profile.key]}
          onChange={(e) =>
            updateFormValue(profile.key, e.target.value.toUpperCase())
          }
          validations={validations}
          onValidationStateChanged={(result) => setErrors(result.messages)}
        />
        <div className="text-red-500 text-xs">
          {errors.map((error, index) => (
            <div key={`${id}_${index}`}>{error}</div>
          ))}
        </div>
      </div>
    );
  }

  if (['number', 'email', 'date'].includes(profile.type)) {
    return (
      <div>
        <Input
          label={profile.label + (profile.validation.required ? '*' : '')}
          value={form[profile.key]}
          type={profile.type}
          onChange={(e) => updateFormValue(profile.key, e.target.value)}
          validations={validations}
          onValidationStateChanged={(result) => setErrors(result.messages)}
        />
        <div className="text-red-500 text-xs">
          {errors.map((error, index) => (
            <div key={`${id}_${index}`}>{error}</div>
          ))}
        </div>
      </div>
    );
  }

  if (profile.type === 'choice') {
    return (
      <Select
        label={profile.label + (profile.validation.required ? '*' : '')}
        options={profile.validation.values?.split(';')}
        defaultValue={form[profile.key]}
        onChange={(v) => updateFormValue(profile.key, v as string)}
      />
    );
  }

  if (profile.type === 'file') {
    return (
      <FileUpload
        label={profile.label + (profile.validation.required ? '*' : '')}
        url={String(form[profile.key])}
        onChange={({ url }) => updateFormValue(profile.key, url)}
      />
    );
  }

  if (profile.type === 'paiement') {
    return (
      <Checkout
        form={form}
        amount={profile.validation.amount ?? 0}
        apiKey={profile.validation.apiKey ?? ''}
        emailKey="email"
        firstnameKey="firstname"
        lastnameKey="lastname"
        onChange={(id: string) => updateFormValue(profile.key, id)}
        slip={slip}
      />
    );
  }
};
