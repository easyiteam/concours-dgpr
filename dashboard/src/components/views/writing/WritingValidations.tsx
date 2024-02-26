import { useEffect, useState } from 'react';
import { validatorApi } from '../../../api/validator.api';
import { Icon } from '../../display/Icon';
import { addPushEventListener } from '@asaje/sse-push-event-client';
import { ValidatorValidation } from '../../../api/typings';
import { useIdGen } from '../../../hooks/useIdGen';
import { DisplayValidationStatus } from '../../display/DisplayValidationStatus';

const validationIdKey = '__validation_id__';

type Props = {
  closeModal: () => void;
  onFinish: () => void;
};

export const WritingValidations = ({ closeModal, onFinish }: Props) => {
  const [validators, setValidators] = useState<ValidatorValidation[]>([]);
  const genId = useIdGen();

  useEffect(() => {
    const load = async () => {
      let _id = localStorage.getItem(validationIdKey);
      if (!_id) {
        const validation = await validatorApi.initValidation();
        if (validation) localStorage.setItem(validationIdKey, validation.id);
        _id = validation?.id ?? '';
      }

      const result = await validatorApi.getValidationStatus(_id);
      setValidators(result?.validators ?? []);
      if (result?.success) {
        closeModal();
        onFinish();
      }
    };
    load();
    addPushEventListener('validators.update', load);
  }, []);

  console.log(validators);

  return (
    <div className="min-w-[90vw] lg:min-w-[40vw] px-8 py-3">
      <div className="border border-blue-200 bg-blue-50 flex items-center gap-4 p-4 rounded text-blue-800">
        <Icon
          name="info"
          size={24}
        />
        <div>
          Une demande de validation a été envoyée aux validateurs par email.
        </div>
      </div>

      <div className="my-6">
        {validators.map((validator) => (
          <div
            className="flex items-end justify-between border my-4 p-2 rounded"
            key={genId(validator.validator.id)}>
            <div>
              <div className="font-bold">{validator.validator.fullname}</div>
              <div className="text-xs">{validator.validator.fonction}</div>
            </div>
            <div>
              <DisplayValidationStatus status={validator.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
