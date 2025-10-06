import React from 'react';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="inline-block">
      <img
        src="/logo.svg"
        alt="RemitBuddy logo"
        className="h-10 md:h-12"
      />
    </Link>
  );
};

export default Logo;
