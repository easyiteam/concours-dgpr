import { formatDate } from 'usual_fn';
import { Document } from '../api/typings';
import { EditDelete } from '../components/display/EditDelete';
import { UpdateOrDeleteFn } from '../helpers/typings';
import { formatFileSize } from '../utils/file';

export const documentCols = (
  updateFn: UpdateOrDeleteFn<Document>,
  deleteFn: UpdateOrDeleteFn<Document>,
) => [
  { label: 'Titre', id: 'title' },
  { label: 'Description', id: 'description' },
  {
    label: 'Fichier',
    render: (row: Document) => (
      <a
        href={row.url}
        className="text-blue-500 underline"
        target="_blank">
        Ouvrir
      </a>
    ),
  },
  {
    label: 'Taille',
    render: (row: Document) => <div>{formatFileSize(row.size)}</div>,
  },
  {
    label: 'Publié le',
    render: (row: Document) => <div>{formatDate({ data: row.createdAt })}</div>,
  },
  { label: 'Vues', id: 'views' },
  { label: 'Télgts', id: 'downloads' },
  {
    label: 'Action',
    render: (row: Document) => (
      <EditDelete
        row={row}
        updateFn={updateFn}
        deleteFn={deleteFn}
      />
    ),
  },
];
