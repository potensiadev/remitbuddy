// /frontend/pages/_app.js

import '../styles/globals.css'; // 전역 스타일을 여기서 불러옵니다.

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;