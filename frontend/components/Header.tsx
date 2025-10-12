import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const router = useRouter();
  const { locale } = router;

  return (
    <header className="px-4 pt-12 pb-6">
      <Link href={`/${locale}`} locale={locale}>
        <h1 className="text-[32px] font-poppins font-bold text-brand cursor-pointer hover:opacity-80 transition-opacity">
          RemitBuddy
        </h1>
      </Link>
    </header>
  );
};

export default Header;
