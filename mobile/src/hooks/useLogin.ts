import http, { Auth } from '@/http';
import { applyInterceptorMiddleware } from '@/libs/middleware';
import { toastController } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useLogin() {
  const router = useRouter();
  const userInfo = ref({
    email: '',
    password: '',
  });
  const isLoading = ref(false);

  const openToast = async () => {
    const toast = await toastController.create({
      message: 'Identifiants incorrects',
      duration: 5000,
    });
    return toast.present();
  };

  const handleSubmit = async () => {
    isLoading.value = true;
    const response = await http.post('auth/login', userInfo.value);
    Auth.setToken(response.token);
    userInfo.value = {
      email: '',
      password: '',
    };
    isLoading.value = false;
    if (response.statusCode > 399) {
      await openToast();
      return;
    }

    await applyInterceptorMiddleware(router);
  };

  return {
    isLoading,
    handleSubmit,
    userInfo,
  };
}
