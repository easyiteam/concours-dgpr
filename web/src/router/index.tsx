import { Home } from '../pages/Home';
import { AppLayout } from '../layout/AppLayout';
import { createBrowserRouter } from 'react-router-dom';
import { Register } from '../pages/Register';
import { Proxy } from '../pages/Proxy';
import { VerifyCandidature } from '../pages/VerifyCandidature';
import { UpdateCandidature } from '../pages/UpdateCandidature';
import { UpdateRegister } from '../pages/UpdateRegister';
import { VerifySportProfile } from '../pages/VerifySportProfile';
import { VerifyWritingProfile } from '../pages/VerifyWritingProfile';

export const router = createBrowserRouter([
  {
    path: '',
    element: <AppLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'proxy/:id', element: <Proxy /> },
      { path: 'register/:id', element: <Register /> },
      { path: 'verify-candidature/:id', element: <VerifyCandidature /> },
      { path: 'verify-sport-profile/:id', element: <VerifySportProfile /> },
      { path: 'verify-writing-profile/:id', element: <VerifyWritingProfile /> },
      {
        path: 'update-candidature/:id',
        element: <UpdateCandidature />,
      },
      {
        path: 'update-register/:id',
        element: <UpdateRegister />,
      },
    ],
  },
]);
