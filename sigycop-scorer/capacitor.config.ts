import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bj.dgpr.sigycop-scorer',
  appName: 'dgpr-sigycop-scorer',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      splashImmersive: true,
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
