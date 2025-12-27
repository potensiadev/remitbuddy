import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-3xl border border-gray-150 bg-white/90 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">404</p>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-4 text-lg text-gray-600">
            The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/">
              <a className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md">
                Go home
              </a>
            </Link>
            <Link href="/blog">
              <a className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50">
                View blog
              </a>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
