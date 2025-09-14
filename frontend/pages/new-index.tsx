import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Components
import HomeLayout from '../components/HomeLayout';
import QuoteForm from '../components/QuoteForm';
import ResultsView from '../components/ResultsView';

// Utils
import { focusResults, announceResults } from '../utils/scrollAndFocus';

// Types
interface Country {
  code: string;
  currency: string;
  name: string;
  flag: string;
}

interface QuoteFormData {
  amount: string;
  country: Country;
}

interface ProviderData {
  provider: string;
  recipient_gets: number;
  exchange_rate: number;
  fee: number;
  link: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sendhome-production.up.railway.app';

// Get localized meta data (simplified version)
const getLocalizedMeta = (locale: string) => {
  const metaData = {
    ko: {
      title: "해외송금 비교 | 한국 최저 수수료 실시간 환율 비교 - RemitBuddy",
      description: "한국 최대 해외송금 비교 플랫폼. 10개국 지원, 9개 공인 송금업체 실시간 환율·수수료 3초 비교.",
      ogLocale: "ko_KR"
    },
    en: {
      title: "Money Transfer Comparison | Best Exchange Rates from Korea - RemitBuddy",
      description: "Korea's largest international money transfer comparison platform. Compare real-time rates from 9 licensed companies in 3 seconds.",
      ogLocale: "en_US"
    }
  };
  
  return metaData[locale as keyof typeof metaData] || metaData.en;
};

export default function NewRemitBuddyPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // State
  const [results, setResults] = useState<ProviderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCompared, setHasCompared] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<QuoteFormData | null>(null);

  // Analytics functions (placeholder - would integrate with existing analytics)
  const logCTA = (amount: string, countryCode: string, currency: string) => {
    console.log('CTA clicked:', { amount, countryCode, currency });
  };

  const logProviderClick = (provider: string) => {
    console.log('Provider clicked:', provider);
  };

  // API call function
  const fetchQuotes = async (formData: QuoteFormData): Promise<ProviderData[]> => {
    const { amount, country } = formData;
    const url = `${API_BASE_URL}/api/getRemittanceQuote?receive_country=${country.name}&receive_currency=${country.currency}&send_amount=${amount}&_t=${Date.now()}`;

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No exchange rate providers available');
    }

    return data.results;
  };

  // Handle form submission
  const handleFormSubmit = async (formData: QuoteFormData) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(formData);
    
    // Log analytics
    logCTA(formData.amount, formData.country.code, formData.country.currency);
    
    try {
      const data = await fetchQuotes(formData);
      setResults(data);
      setHasCompared(true);
      
      // Focus results and announce to screen readers
      setTimeout(() => {
        focusResults();
        announceResults(data.length, formData.country.currency);
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle provider click
  const handleProviderClick = (provider: string) => {
    logProviderClick(provider);
  };

  const meta = getLocalizedMeta(router.locale || 'en');

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://sendhome-production.up.railway.app;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.remitbuddy.com${router.asPath}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.remitbuddy.com${router.asPath}`} />
        <meta property="og:locale" content={meta.ogLocale} />
        
        {/* Favicon */}
        <link rel="icon" href="/icons/icon.svg" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <HomeLayout
          form={
            <QuoteForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              hasCompared={hasCompared}
            />
          }
          results={
            (hasCompared || isLoading) ? (
              <ResultsView
                data={results}
                loading={isLoading}
                error={error}
                amount={currentQuery?.amount || ''}
                currency={currentQuery?.country.currency || ''}
                country={currentQuery?.country.name || ''}
              />
            ) : null
          }
        />
      </div>
    </>
  );
}

// Server-side translations
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}