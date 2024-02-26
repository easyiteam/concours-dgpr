import { useParams } from 'react-router-dom';
import { Table } from '../../table/Table';
import { centerCols } from '../../../data/writing.cols';
import { examApi } from '../../../api/exam.api';
import { useFindAll } from '../../../hooks/useFindAll';
import { Input } from '../../form-fields/Input';
import { Button } from '../../buttons/Button';
import { useState } from 'react';

export const WritingCenter = () => {
  const { id } = useParams();

  const [label, setLabel] = useState('');

  const { rows } = useFindAll(
    () => examApi.getCenters(id ?? ''),
    [],
    'exams.update',
  );

  const addCenter = async () => {
    if (label) {
      await examApi.createCenter({ label, examId: id ?? '' });
      setLabel('');
      return;
    }
  };

  return (
    <div>
      <div className="bg-white my-4 p-6 rounded flex items-end gap-3">
        <Input
          label="Ajouter un centre"
          placeholder="Libellé du centre"
          value={label}
          onChange={(e) => setLabel(e.target.value.toUpperCase())}
        />
        <div>
          <Button
            onClick={addCenter}
            className="text-sm bg-gray-700">
            Ajouter
          </Button>
        </div>
      </div>

      <div className="bg-white">
        <Table
          cols={centerCols(id ?? '')}
          rows={rows}
        />
      </div>
    </div>
  );
};
