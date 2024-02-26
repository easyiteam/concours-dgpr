import { useId } from 'react';
import { ProfileItem } from './ParticipantProfileDefinition';
import { Icon } from '../../components/display/Icon';

const keyLabel = (key: string) => {
  if (key === 'values') return 'Valeurs';
  if (key === 'amount') return 'Montant';
  return key;
};

export function RenderProfileItem({
  items,
  remove,
  edit,
}: {
  items: ProfileItem[];
  remove: (key: string) => void;
  edit: (index: number) => void;
}) {
  const _id = useId();

  const genId = (value: string | number) => `${_id}_${value}`;
  return (
    <>
      {items.map((item, index) => (
        <div
          key={genId(index)}
          className="border rounded p-2 flex justify-between">
          <div>
            <div className="flex items-center gap-10">
              <div className="font-semibold text-xs">
                {item.key} ({item.type})
              </div>
              <div className="flex gap-4">
                <div onClick={() => edit(index)}>
                  <Icon
                    name="edit"
                    className="text-blue-700"
                  />
                </div>
                <div onClick={() => remove(item.key)}>
                  <Icon
                    name="delete"
                    className="text-red-700"
                  />
                </div>
              </div>
            </div>
            <div className="font-light">{item.label}</div>
          </div>
          {item && item.validation && (
            <div className="text-red-700 text-xs">
              {Object.entries(item.validation).map(([key, value]) => (
                <div>
                  {keyLabel(key)} : {JSON.stringify(value)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
