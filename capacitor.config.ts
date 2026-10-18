import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.abelhasnativas.meliponicultura',
  appName: 'Abelhas Nativas',
  webDir: 'dist',
  backgroundColor: '#163f35',
  android: {
    backgroundColor: '#163f35',
  },
  ios: {
    backgroundColor: '#163f35',
    contentInset: 'automatic',
  },
};

export default config;
