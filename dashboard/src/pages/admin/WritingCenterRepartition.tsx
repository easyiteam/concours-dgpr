import { Back } from '../../components/buttons/Back';
import { H1 } from '../../components/display/H1';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { writingApi } from '../../api/writing.api';
import { Center, WritingProfile } from '../../api/typings';
import { Table } from '../../components/table/Table';
import { writingCols } from '../../data/writing.cols';
import { Button } from '../../components/buttons/Button';
import { fieldApi } from '../../api/field.api';
import { Dropdown } from '../../components/actions/Dropdown';

export const WritingCenterRepartition = () => {
  const { id, centerId } = useParams();
  const { data: center } = useFetch<Center | undefined>({
    cb: async () => await writingApi.getCenter(centerId),
  });
  const { data: profiles } = useFetch<WritingProfile[][]>({
    cb: async () => await writingApi.getRepartition(id, centerId),
  });
  const { data: fields } = useFetch({
    cb: () => fieldApi.findAllByExam(id),
  });

  const downloadRoomList = async (room: number) => {
    await writingApi.downloadRoomList(id ?? '', centerId ?? '', room);
  };

  const downloadAnonymousList = async (fieldId: string, room: number) => {
    await writingApi.downloadAnonymousList(
      id ?? '',
      centerId ?? '',
      fieldId,
      room,
    );
  };

  const downloadQrcodes = async (fieldId: string, room: number) => {
    await writingApi.downloadQrcodes(id ?? '', centerId ?? '', fieldId, room);
  };

  return (
    <div>
      <div className="flex items-center gap-8">
        <Back />
        <H1>Répartition par salle : {center?.label}</H1>
      </div>

      <div className="my-8">
        {profiles?.map((profile, index) => (
          <div key={index}>
            <div className="flex justify-between items-center">
              <H1>Salle {index + 1}</H1>
              <div className="flex gap-4">
                <Button
                  onClick={() => downloadRoomList(index + 1)}
                  className="text-xs !bg-gray-50 border border-slate-200 !text-slate-700">
                  Télécharger la liste
                </Button>
                <Dropdown
                  content={
                    <div className="flex flex-col shadow-xl rounded text-xs text-gray-600 w-[130px] bg-white">
                      {fields?.values.map((field) => (
                        <div
                          key={field.id + 'des'}
                          className="hover:bg-slate-100 cursor-pointer p-3"
                          onClick={() => downloadQrcodes(field.id, index + 1)}>
                          {field.label}
                        </div>
                      ))}
                    </div>
                  }>
                  <Button className="text-xs !bg-gray-50 border border-slate-200 !text-slate-700">
                    Qr Codes
                  </Button>
                </Dropdown>
                <Dropdown
                  content={
                    <div className="flex flex-col shadow-xl rounded text-xs text-gray-600">
                      {fields?.values.map((field) => (
                        <div
                          key={field.id + 'des'}
                          className="hover:bg-slate-100 cursor-pointer p-3"
                          onClick={() =>
                            downloadAnonymousList(field.id, index + 1)
                          }>
                          {field.label}
                        </div>
                      ))}
                    </div>
                  }>
                  <Button className="text-xs !bg-gray-50 border border-slate-200 !text-slate-700">
                    Liste de désanonymat
                  </Button>
                </Dropdown>
              </div>
            </div>

            <div className="my-6 bg-white">
              <Table
                cols={writingCols}
                rows={profile}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
