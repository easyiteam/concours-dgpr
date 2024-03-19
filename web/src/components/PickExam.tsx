import { useEffect, useId, useState } from 'react';
import { Exam, getExams } from '../api/exam.api';
import { useNavigate } from 'react-router-dom';

export const PickExam = () => {
  const [exams, setExams] = useState<Exam[]>([]);

  const id = useId();
  const navigate = useNavigate();

  const load = async () => {
    const _exams = await getExams();
    setExams(_exams);
  };

  useEffect(() => {
    load();
  }, []);

  const next = (id: string) => {
    navigate(`/proxy/${id}`);
  };

  return (
    <div className="bg-white rounded-none lg:rounded-lg p-10 w-full lg:w-[70%] mx-auto shadow-none lg:shadow-xl -translate-y-[8vh]">
      {exams.length > 0 && (
        <div className="text-center text-xl mb-10">
          Choisissez votre profil.
        </div>
      )}
      <div className="grid lg:grid-cols-3 gap-8">
        {exams.map((exam, index) => (
          <div
            key={`${id}_${index}`}
            className="shadow-xl rounded-xl p-10 border">
            <div className="text-center font-semibold">{exam.shortName}</div>
            <div
              onClick={() => next(exam.id)}
              className="w-fit text-center text-primary mx-auto hover:bg-primary hover:text-white cursor-pointer px-4 py-1 mt-8 rounded-lg">
              Continuer
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
