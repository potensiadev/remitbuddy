// 파일 위치: /frontend/pages/_app.js
import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);