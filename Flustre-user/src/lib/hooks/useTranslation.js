export const useTranslation = () => {
  const translate = (key) => key;
  return {
    t: translate,
    language: 'EN',
    isRTL: false,
    changeLanguage: () => {},
  };
};