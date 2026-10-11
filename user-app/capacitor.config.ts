import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.speedmoney.user',
  appName: 'SpeedMoney+',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      providers: ['phone']
    }
  }
};

export default config;
