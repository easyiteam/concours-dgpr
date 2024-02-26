import { useNavigate } from 'react-router-dom';
import { validatorApi } from '../api/validator.api';
import { useConfirm } from '../hooks/useConfirm';
import { Validator } from '../api/typings';
import { useEffect, useState } from 'react';
import { addPushEventListener } from '@asaje/sse-push-event-client';
import { H1 } from '../components/display/H1';
import { Button } from '../components/buttons/Button';
import { Table } from '../components/table/Table';
import { validatorsCols } from '../data/validators.cols';

export const Validators = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const confirm = useConfirm();
  const navigate = useNavigate();

  const load = async () => {
    const validators = await validatorApi.findAll();
    setValidators(validators ?? []);
  };

  useEffect(() => {
    load();

    addPushEventListener('validators.update', () => {
      load();
    });
  }, []);

  const archive = async (row: Validator) => {
    confirm({
      message: 'Etes-vous sûr de vouloir effectuer cette action ?',
      onConfirm: async () => {
        await validatorApi.revocate(row.id);
      },
    });
  };

  const openValidatorForm = () => {
    navigate('/default/register-validator');
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <H1>Validateurs</H1>

        <Button
          className="text-sm"
          icon="add_circle"
          onClick={openValidatorForm}>
          Ajouter un validateur
        </Button>
      </div>

      <div className="mt-10 bg-white">
        <Table
          cols={validatorsCols(archive)}
          rows={validators}
        />
      </div>
    </div>
  );
};
