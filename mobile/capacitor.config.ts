import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'easyiteam.dgefc.defrecrut',
  appName: 'DGEFC_RECRUT',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      backgroundColor: '#085A03',
      showSpinner: true,
      spinnerColor: '#FFFFFF',
    },
  },
};

export default config;
