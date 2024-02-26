import { useMemo } from 'react';
import { Step } from '../../../api/typings';
import { useIdGen } from '../../../hooks/useIdGen';
import { Icon } from '../../display/Icon';
import { Row } from '../../table/Table';
import { useConfirm } from '../../../hooks/useConfirm';
import { stepApi } from '../../../api/step.api';
import { Button } from '../../buttons/Button';

type StepsListProps = {
  data: Row[];
};

export const StepsList = ({ data }: StepsListProps) => {
  const genId = useIdGen();
  const confirm = useConfirm();

  const steps = useMemo(() => {
    return data.sort(
      (a, b) => (a as unknown as Step).order - (b as unknown as Step).order,
    ) as unknown as Step[];
  }, [data]);

  const removeItem = (id: string) => {
    confirm({
      message: 'Etes-vous sûr de vouloir supprimer cette étape ?',
      onConfirm: async () => {
        await stepApi.archiveOne(id);
      },
    });
  };

  const activateStep = async (id: string) => {
    await stepApi.activateStep(id);
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold">Liste des étapes</div>

      <div className="mt-8">
        {steps.map((step, index) => (
          <div
            className="text-sm py-4 px-2 flex justify-between items-center hover:bg-gray-50"
            key={genId(index)}>
            <div
              className={[
                'flex items-center gap-4',
                step.active ? 'text-primary' : '',
              ].join(' ')}>
              <Icon name="nearby" />
              <div>{step.label}</div>
            </div>
            <div className="flex items-center gap-4">
              {!step.active && (
                <Button
                  onClick={() => activateStep(step.id)}
                  className="text-xs !bg-primary">
                  Activer
                </Button>
              )}
              <div onClick={() => removeItem(step.id)}>
                <Icon
                  name="delete"
                  className="text-red-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
