/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { ProfileItem } from './ParticipantProfileDefinition';
import { Input } from '../../components/form-fields/Input';
import { Select } from '../../components/form-fields/Select';
import { Button } from '../../components/buttons/Button';
import { RenderProfileItem } from './RenderProfileItem';
import { Icon } from '../../components/display/Icon';
import { Checkbox } from '../../components/form-fields/Checkbox';

const profileTypes = [
  { id: 'text', label: 'Text' },
  { id: 'number', label: 'Nombre' },
  { id: 'date', label: 'Date' },
  { id: 'file', label: 'Fichier' },
  { id: 'choice', label: 'Choix multiple' },
  { id: 'paiement', label: 'Paiement' },
];

function getProfileTypeByKey(key: string) {
  return profileTypes.find((it) => it.id === key);
}

const defaultField: ProfileItem = {
  key: '',
  label: '',
  type: 'text',
  validation: {},
};

type Props = {
  label: string;
  onChange: (v: ProfileItem[]) => void;
  onRemove: (v: string) => void;
  value?: ProfileItem[];
  startEditing?: (l: string) => void;
};

export function CreateProfileField({
  label,
  onChange = () => {},
  onRemove = () => {},
  value,
  startEditing,
}: Props) {
  const [items, setItems] = useState<ProfileItem[]>(value ?? []);
  const [currentItem, setCurrentItem] = useState<ProfileItem>(defaultField);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleChange = (key: string, value: string) => {
    setCurrentItem((currentItem) => ({ ...currentItem, [key]: value }));
    onChange(items);
  };

  const handleValidationChange = (
    key: string,
    value: string | number | boolean,
  ) => {
    setCurrentItem((currentItem) => ({
      ...currentItem,
      validation: { ...currentItem.validation, [key]: value },
    }));
    onChange(items);
  };

  const addField = () => {
    const newItems = [...items, currentItem];
    setItems(newItems);
    setCurrentItem(defaultField);
    onChange(newItems);
  };

  const editField = () => {
    if (currentIndex !== null) {
      items[currentIndex] = currentItem;
      setItems([...items]);
      onChange([...items]);
      setCurrentIndex(null);
      setCurrentItem(defaultField);
    }
  };

  const saveField = () => {
    if (currentIndex !== null) return editField();
    return addField();
  };

  const removeField = (key: string) => {
    const _items = items.filter((it) => it.key !== key);
    setItems(_items);
    onChange(_items);
  };

  const startEditingItem = (index: number) => {
    setCurrentItem(items[index]);
    setCurrentIndex(index);
  };

  return (
    <div className="rounded border p-3">
      <div className="font-bold text-xs flex justify-between items-center">
        <span className="mt-2">{label}</span>
        <div className="flex gap-3">
          <div
            onClick={() => {
              if (startEditing) startEditing(label);
            }}>
            <Icon
              name="edit"
              className="text-blue-700"
            />
          </div>
          <div onClick={() => onRemove(label)}>
            <Icon
              name="delete"
              className="text-red-700"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 my-2">
        <RenderProfileItem
          items={items}
          remove={removeField}
          edit={startEditingItem}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          placeholder="Slug du champs"
          value={currentItem.key}
          onChange={(e) => handleChange('key', e.target.value.toLowerCase())}
        />
        <Input
          placeholder="Libellé du champs"
          value={currentItem.label}
          onChange={(e) => handleChange('label', e.target.value.toUpperCase())}
        />
        <Select
          placeholder="Type de champs"
          onChange={(o: any) => handleChange('type', o.id)}
          options={profileTypes}
          defaultValue={getProfileTypeByKey(currentItem.type)}
          optionLabel="label"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {currentItem.type === 'text' && (
          <Input
            placeholder="Valdt: Nbr de caractères minimum"
            type="number"
            value={currentItem.validation.minLength}
            onChange={(e) =>
              handleValidationChange('minLength', e.target.value)
            }
          />
        )}
        {currentItem.type === 'text' && (
          <Input
            placeholder="Valdt: Nbr de caractères maximum"
            type="number"
            value={currentItem.validation.maxLength}
            onChange={(e) =>
              handleValidationChange('maxLength', e.target.value)
            }
          />
        )}
        {currentItem.type === 'number' && (
          <Input
            placeholder="Valdt: Valeur minimum"
            value={currentItem.validation.min}
            type="number"
            onChange={(e) => handleValidationChange('min', e.target.value)}
          />
        )}
        {currentItem.type === 'number' && (
          <Input
            placeholder="Valdt: Valeur maximum"
            value={currentItem.validation.max}
            type="number"
            onChange={(e) => handleValidationChange('max', e.target.value)}
          />
        )}
        {currentItem.type === 'date' && (
          <Input
            placeholder="Valdt: Date minimum"
            value={currentItem.validation.min}
            type="date"
            onChange={(e) => handleValidationChange('min', e.target.value)}
          />
        )}
        {currentItem.type === 'date' && (
          <Input
            placeholder="Valdt: Date maximum"
            value={currentItem.validation.max}
            type="date"
            onChange={(e) => handleValidationChange('max', e.target.value)}
          />
        )}
        {currentItem.type === 'choice' && (
          <Input
            area
            placeholder="Liste des choix (séparés par des ;)"
            value={currentItem.validation.values}
            type="date"
            onChange={(e) => handleValidationChange('values', e.target.value)}
          />
        )}
        {currentItem.type === 'paiement' && (
          <Input
            placeholder="Montant"
            value={currentItem.validation.amount}
            type="number"
            onChange={(e) => handleValidationChange('amount', e.target.value)}
          />
        )}

        {currentItem.type === 'paiement' && (
          <Input
            placeholder="Clé d'api"
            value={currentItem.validation.apiKey}
            onChange={(e) => handleValidationChange('apiKey', e.target.value)}
          />
        )}

        <div className="flex items-center gap-2">
          <span>Requis ?</span>
          <Checkbox
            checked={currentItem.validation.required}
            onChange={(e) => handleValidationChange('required', e)}
          />
        </div>
      </div>
      <div className="flex justify-end my-4">
        <Button
          className="!bg-gray-700 text-white text-xs rounded px-4"
          onClick={saveField}>
          {currentIndex !== null ? 'Modifier' : 'Ajouter'} le champs
        </Button>
      </div>
    </div>
  );
}
