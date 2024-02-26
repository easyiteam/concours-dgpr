/* eslint-disable react-refresh/only-export-components */
import { Documents } from '../pages/Documents';
import { Login } from '../pages/Login';
import { Profile } from '../pages/Profile';
import { RegisterUser } from '../pages/RegisterUser';
import { Root } from '../pages/Root';
import { Users } from '../pages/Users';
import { AdminRoot } from '../pages/admin/AdminRoot';
import { CandidatureDetails } from '../pages/admin/CandidatureDetails';
import { Candidatures } from '../pages/admin/Candidatures';
import { Dashboard } from '../pages/admin/Dashboard';
import { Signers } from '../pages/admin/Signers';
import { CreateExamView } from '../pages/exams/CreateExam';
import { ExamSettings } from '../pages/admin/ExamSettings';
import { Exams } from '../pages/exams/Exams';
import { ExamsRoot } from '../pages/exams/ExamsRoot';
import { RouteItem } from './typings';
import { Reclamations } from '../pages/admin/Reclamations';
import { Sport } from '../pages/admin/Sport';
import { Validators } from '../pages/Validators';
import { RegisterValidator } from '../pages/RegisterValidator';
import { Writing } from '../pages/admin/Writing';
import { WritingRoot } from '../pages/admin/WritingRoot';
import { WritingCenterRepartition } from '../pages/admin/WritingCenterRepartition';
import { WritingScores } from '../pages/admin/WritingScores';
import { WritingResults } from '../pages/admin/WritingResults';

export const Paths = {
  login: '/',
  exam: {
    index: '/exams',
    create: 'create',
  },
  app: {
    index: '/app',
    users: 'users',
  },
  default: {
    index: '/default',
    users: 'users',
    register: 'register',
    registerValidator: 'register-validator',
    profile: 'profile',
    documents: 'documents',
    validators: 'validators',
  },
};

export const ROUTES: RouteItem[] = [
  { path: Paths.login, element: <Login /> },
  {
    path: Paths.default.index,
    element: <Root />,
    children: [
      { path: Paths.default.profile, element: <Profile /> },
      { path: Paths.default.users, element: <Users /> },
      { path: Paths.default.register, element: <RegisterUser /> },
      { path: Paths.default.documents, element: <Documents /> },
      { path: Paths.default.validators, element: <Validators /> },
      { path: Paths.default.registerValidator, element: <RegisterValidator /> },
    ],
  },
  {
    path: Paths.exam.index,
    element: <ExamsRoot />,
    children: [
      { path: '', element: <Exams /> },
      { path: 'create', element: <CreateExamView /> },
      { path: 'create/:id', element: <CreateExamView /> },
    ],
  },
  {
    path: 'exam-details/:id',
    element: <AdminRoot />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'candidatures',
        element: <Candidatures />,
      },
      {
        path: 'reclamations',
        element: <Reclamations />,
      },
      {
        path: 'sport',
        element: <Sport />,
      },
      {
        path: 'results',
        element: <WritingResults />,
      },
      {
        path: 'writing',
        element: <WritingRoot />,
        children: [
          { path: '', element: <Writing /> },
          {
            path: 'repartition/:centerId',
            element: <WritingCenterRepartition />,
          },
          {
            path: 'insert-score/:fieldId',
            element: <WritingScores />,
          },
        ],
      },
      {
        path: 'candidature/:candidatureId',
        element: <CandidatureDetails />,
      },
      {
        path: 'settings',
        element: <ExamSettings />,
      },
      {
        path: 'signers',
        element: <Signers />,
      },
    ],
  },
];
