import { useIonRouter } from '@ionic/react';
import { useState } from 'react';
import { api, setApiToken } from '../api';
import logo from '../assets/icon.png';
import Page from '../components/Page';

const defaultUser = {
  username: '',
  password: '',
};

export default function Login() {
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useIonRouter();

  const handleChange = (attr: 'username' | 'password', value: string) => {
    setUser({ ...user, [attr]: value });
  };

  const handleSubmit = async (event: any) => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await api.post('auth/login', user);
      console.log(response, response.status);
      if (response.status === 201) {
        setApiToken(response.data.accessToken);
        router.push('/home', 'forward', 'push');
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setHasError(false);
      }, 5000);
    }
  };

  return (
    <Page>
      <div className="flex justify-center items-center h-full px-4 w-full">
        <div className="w-full">
          <div className="text-center flex flex-col items-center mb-10 w-full">
            <img
              alt="LOGO"
              src={logo}
              className="w-[150px]"
            />
            <div className="font-bold text-3xl">Douanes Béninoise</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="border rounded p-4 ">
              <div className="text-xl font-bold text-center">
                Veuillez vous authentifier
              </div>
              {hasError && (
                <div className="my-4 text-red-500 font-bold text-center border border-red-500 rounded py-3">
                  Identifiants incorrects
                </div>
              )}
              <div className="flex flex-col gap-2 mt-8">
                <label
                  className="font-semibold"
                  htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  value={user.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="py-3 border rounded outline-0 px-4 border-[#aaa]"
                />
              </div>

              <div className="flex flex-col gap-2 mt-8">
                <label
                  className="font-semibold"
                  htmlFor="email">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={user.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="py-3 border rounded outline-0 px-4 border-[#aaa]"
                />
              </div>

              <button className="font-bold w-full bg-[#183661] text-white py-3 rounded mt-8">
                {loading ? 'Chargement ...' : 'Se connecter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
}
