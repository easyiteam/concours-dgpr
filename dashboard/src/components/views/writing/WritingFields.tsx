import { useParams } from 'react-router-dom';
import { fieldApi } from '../../../api/field.api';
import { useConfirm } from '../../../hooks/useConfirm';
import { CloseModalProps, useModal } from '../../actions/modal/constants';
import { Field } from '../../../api/typings';
import { Button } from '../../buttons/Button';
import { fieldsCols } from '../../../data/fields.cols';
import { useState } from 'react';
import { Form } from '../../form-fields/Form';
import { Input } from '../../form-fields/Input';
import { Table } from '../../table/Table';
import { useFetch } from '../../../hooks/useFetch';

const event = 'fields.update';

export const WritingFields = () => {
  const { id } = useParams();

  const confirm = useConfirm();
  const { openModal, closeModal } = useModal();

  const { data } = useFetch({
    cb: () => fieldApi.findAllByExam(id),
    event,
  });

  const archive = async (row: Field) => {
    confirm({
      message: 'Etes-vous sûr de vouloir effectuer cette action ?',
      onConfirm: async () => {
        await fieldApi.archiveOne(row.id);
      },
    });
  };

  const openFieldForm = () => {
    openModal({
      header: <div>Ajouter une matière</div>,
      children: (
        <RegisterField
          id={id ?? ''}
          onClose={() => {
            closeModal();
          }}
        />
      ),
      closable: true,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-8">
        <Button
          className="text-xs"
          icon="add_circle"
          onClick={openFieldForm}>
          Ajouter une matière
        </Button>
      </div>

      <div className="mt-4 bg-white">
        <Table
          cols={fieldsCols(archive)}
          rows={data?.values ?? []}
        />
      </div>
    </div>
  );
};

const defaultField = {
  code: '',
  label: '',
  coefficient: 1,
};

function RegisterField({ onClose, id }: CloseModalProps & { id: string }) {
  const [field, setField] = useState<Omit<Field, 'id' | 'exam'>>({
    ...defaultField,
    examId: id,
  });

  const handleSubmit = async () => {
    await fieldApi.create(field);
    setField({ ...defaultField, examId: id });
    if (onClose) onClose();
  };

  return (
    <div className="w-full">
      <Form
        className="flex flex-col gap-6 w-[90vw] md:w-[40vw] p-8"
        onSubmit={handleSubmit}>
        <Input
          label="Code de la matière (*)"
          name="code"
          value={field.code}
          onChange={(e) =>
            setField({ ...field, code: e.target.value.toUpperCase() })
          }
        />

        <Input
          label="Intitulé de la matière (*)"
          name="label"
          value={field.label}
          onChange={(e) =>
            setField({ ...field, label: e.target.value.toUpperCase() })
          }
        />

        <Input
          type="number"
          min={1}
          label="Coefficient (*)"
          name="coefficient"
          value={field.coefficient}
          onChange={(e) => setField({ ...field, coefficient: +e.target.value })}
        />

        <Button>Créer la matière</Button>
      </Form>
    </div>
  );
}
