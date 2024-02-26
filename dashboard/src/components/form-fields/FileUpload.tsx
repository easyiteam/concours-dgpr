import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { Icon } from '../display/Icon';
import { formatFileSize } from '../../utils/file';
import { uploadFileFirebaseStrategy } from '../../services/firebase.service';

type FileChange = {
  url: string;
  size: number;
};

export type FileProps = {
  onChange?: (args: FileChange) => void;
  label: string;
  stategy?: (file: File) => Promise<string | void>;
};

export const FileUpload = ({
  onChange,
  label,
  stategy = uploadFileFirebaseStrategy,
}: FileProps) => {
  const fileRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [uploading, setUploading] = useState(false);

  const pickFile = () => {
    if (fileRef.current) {
      (fileRef.current as HTMLInputElement).click();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleUpload(files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files) handleUpload(files[0]);
  };

  const handleUpload = async (file: File) => {
    setFile(file);
    setUploading(true);
    const url = await stategy(file);
    setUploading(false);
    if (onChange) onChange({ size: file.size, url: url ?? '' });
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        onChange={handleChange}
      />
      <div
        className="flex flex-col gap-1 w-full text-gray-500 cursor-pointer"
        onClick={pickFile}>
        <label className="text-gray-600 font-semibold text-sm">{label}</label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragActive(true)}
          onDragLeave={() => setIsDragActive(false)}
          className={[
            'bg-gray-50 border rounded-lg border-dashed border-2 flex gap-3 justify-center items-center p-3',
            isDragActive ? 'border-blue-200' : 'border-gray-200',
          ].join(' ')}>
          <Icon name="cloud_upload" />
          <div className="text-sm text-light">
            Choisir ou glisser un fichier
          </div>
        </div>
        {file && (
          <div className="text-xs flex items-center justify-between">
            <div className="flex">
              <div className="max-w-[50px] lg:max-w-[200px] truncate">
                {file.name}
              </div>
              <div>({formatFileSize(file.size)})</div>
            </div>
            <div>{uploading ? '⏳ En cours...' : '✅ Téléchargé'}</div>
          </div>
        )}
      </div>
    </>
  );
};
