import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    // 브라우저의 언어 설정을 가져옵니다.
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'ko'];
    
    // 지원하는 언어이면 해당 언어 페이지로, 아니면 기본 'en' 페이지로 이동시킵니다.
    const targetLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    
    router.replace(`/${targetLang}`);
  }, [router]);

  // 이 페이지 자체는 아무것도 보여주지 않고, 로딩 중임을 암시하거나 비워둡니다.
  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      color: '#555'
    }}>
      Loading...
    </div>
  );
}