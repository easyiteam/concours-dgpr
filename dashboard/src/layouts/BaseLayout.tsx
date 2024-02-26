import { PropsWithChildren, useEffect, useState } from 'react';
import { MainWindow } from './MainWindow';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../hooks/useAuth';
import { examApi } from '../api/exam.api';
import { Exam } from '../api/typings';
import { useParams } from 'react-router-dom';
import { ExamStore } from '../store/exam.store';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  useAuth();
  const { id } = useParams();
  const [exam, setExam] = useState<Exam>();

  useAuth();

  const getExam = async () => {
    const _exam = await examApi.findOne(id);
    if (_exam) ExamStore.set(_exam);
    setExam(_exam);
  };

  useEffect(() => {
    getExam();
  }, []);

  if (!exam) return null;

  return (
    <div className="bg-[#f0f0f0] h-full p-3 grid lg:grid-cols-[240px_1fr] min-w-0 min-h-0">
      <Sidebar />
      <div className="grid grid-rows-[auto_1fr_auto] min-w-0 min-h-0 px-1 lg:pl-4">
        <Topbar
          full={false}
          title={exam?.label}
        />
        <MainWindow>{children}</MainWindow>
      </div>
    </div>
  );
};
