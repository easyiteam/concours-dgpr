import { useNavigate } from 'react-router';
import { Button } from '../components/buttons/Button';
import { Form } from '../components/form-fields/Form';
import { Input } from '../components/form-fields/Input';
import { Password } from '../components/form-fields/Password';
import { ChangeEvent, useState } from 'react';
import { authApi } from '../api/auth.api';
import { useToast } from '../components/providers/ToastProvider';
import { AuthStore } from '../store/auth.store';
import { BeninFlag } from '../components/display/BeninFlag';
import { Paths } from '../router/routes';

export const Login = () => {
  const navigate = useNavigate();
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [auth, setAuth] = useState({
    email: '',
    password: '',
  });
  const openToast = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setAuth({ ...auth, [name]: value });
  };

  const handleSubmit = async () => {
    const isLogged = await authApi.login(auth);

    if (!isLogged) {
      openToast({ type: 'error', info: 'Identifiants incorrects.' });
      return;
    }

    await AuthStore.set(isLogged.token);
    navigate(Paths.exam.index);
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    const sent = await authApi.requestPasswordReset(resetEmail);
    setResetLoading(false);

    if (sent) {
      openToast({
        type: 'success',
        info: 'Si un compte est associé à cette adresse, un lien a été envoyé.',
      });
      setResetMode(false);
      setResetEmail('');
      return;
    }

    openToast({
      type: 'error',
      info: 'Impossible d’envoyer le lien pour le moment. Réessayez plus tard.',
    });
  };

  return (
    <div className="h-full">
      <div className="w-[80%] md:w-[30%] mx-auto mt-[20vh]">
        {/* <Logo position="left" /> */}

        <div className="font-bold mt-20 mb-8 text-2xl text-center">
          Direction Générale de la Police Républicaine
        </div>
        <div className="border p-8 shadow-lg bg-white rounded-xl">
          {resetMode ? (
            <Form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-6">
              <p className="text-sm text-gray-600">
                Saisissez l’adresse e-mail associée à votre compte administrateur.
              </p>
              <Input
                label="Adresse e-mail"
                name="resetEmail"
                type="email"
                autoComplete="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <Button
                className="w-full bg-blue-600 shadow-none"
                disabled={resetLoading}>
                Envoyer le lien
              </Button>
              <button
                type="button"
                className="text-sm text-blue-700 hover:underline"
                onClick={() => setResetMode(false)}>
                Retour à la connexion
              </button>
            </Form>
          ) : (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6">
              <Input
                value={auth.email}
                name="email"
                onChange={handleChange}
                label="Nom d'utilisateur ou e-mail"
              />
              <Password
                name="password"
                onChange={handleChange}
                label="Mot de passe"
              />
              <Button className="w-full bg-blue-600 shadow-none">
                Se connecter
              </Button>
              <button
                type="button"
                className="text-sm text-blue-700 hover:underline"
                onClick={() => setResetMode(true)}>
                Mot de passe oublié ?
              </button>
            </Form>
          )}
        </div>
      </div>
      <BeninFlag />
    </div>
  );
};
