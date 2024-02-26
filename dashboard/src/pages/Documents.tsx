import { useState } from 'react';
import { CreateDocument, Document } from '../api/typings';
import { Button } from '../components/buttons/Button';
import { EmptyState } from '../components/display/EmptyState';
import { H1 } from '../components/display/H1';
import { Form } from '../components/form-fields/Form';
import { Datatable } from '../components/table/Datatable';
import { useConfirm } from '../hooks/useConfirm';
import { useDatable } from '../hooks/useDatatable';
import { Input } from '../components/form-fields/Input';
import {
  CloseModalProps,
  useModal,
} from '../components/actions/modal/constants';
import { documentApi } from '../api/document.api';
import { documentCols } from '../data/documents.cols';
import { datetimeForInput } from '../utils/helpers';
import { FileUpload } from '../components/form-fields/FileUpload';

export const Documents = () => {
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'documents.update',
    callback: () =>
      documentApi.findAll({
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });
  const confirm = useConfirm();
  const { openModal, closeModal } = useModal();

  const archive = async (row: Document) => {
    confirm({
      message: 'Etes-vous sûr de vouloir effectuer cette action ?',
      onConfirm: async () => {
        await documentApi.archiveOne(row.id);
      },
    });
  };

  const openUserForm = () => {
    openModal({
      header: <div>Ajouter un communiqué</div>,
      children: (
        <RegisterUser
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
      <div className="flex justify-between items-center">
        <H1>Communiqués</H1>

        <Button
          className="text-sm"
          icon="add_circle"
          onClick={openUserForm}>
          Ajouter un communiqué
        </Button>
      </div>

      <div className="mt-10">
        {props.totalCount !== 0 ? (
          <Datatable
            noDownload
            noFilter
            cols={documentCols(archive, archive)}
            {...props}
          />
        ) : (
          <EmptyState>Vous n'avez encore créé aucun communiqué</EmptyState>
        )}
      </div>
    </div>
  );
};

const defaultDocument = {
  title: '',
  description: '',
  url: '',
  size: 0,
  at: datetimeForInput(new Date().toISOString()),
};

function RegisterUser({ onClose }: CloseModalProps) {
  const [document, setDocument] = useState<CreateDocument>(defaultDocument);

  const handleSubmit = async () => {
    await documentApi.create({
      ...document,
      at: new Date(document.at ?? '').toISOString(),
    });
    setDocument(defaultDocument);
    if (onClose) onClose();
  };

  return (
    <div className="w-full">
      <Form
        className="flex flex-col gap-6 w-[90vw] md:w-[40vw] p-8"
        onSubmit={handleSubmit}>
        <Input
          label="Titre du communiqué (*)"
          area
          name="title"
          value={document.title}
          onChange={(e) =>
            setDocument({ ...document, title: e.target.value.toUpperCase() })
          }
        />

        <Input
          area
          label="Description du communiqué (*)"
          name="fullname"
          value={document.description}
          onChange={(e) =>
            setDocument({ ...document, description: e.target.value })
          }
        />

        <Input
          label="Date de publication"
          name="fullname"
          type="datetime-local"
          value={document.at}
          onChange={(e) =>
            setDocument({ ...document, description: e.target.value })
          }
        />

        <FileUpload
          label="Fichier"
          onChange={({ url, size }) => {
            setDocument({ ...document, size, url });
          }}
        />

        <Button>Créer le communiqué</Button>
      </Form>
    </div>
  );
}
