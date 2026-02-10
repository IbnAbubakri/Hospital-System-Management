import { ThemeConfig } from 'antd';

export const medicalTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0077B6',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    borderRadius: 8,
    fontFamily: 'Geist Sans, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#0C4A6E',
    },
    Menu: {
      darkItemBg: '#0C4A6E',
      darkItemSelectedBg: '#0077B6',
    },
  },
};
