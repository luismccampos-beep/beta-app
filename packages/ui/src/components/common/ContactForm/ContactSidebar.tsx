// src/components/contact-form/ContactSidebar.tsx
import { Facebook, Instagram, Mail, MapPin, Phone, Plane, Twitter } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl'; // 1. Migrated to next-intl

export const ContactSidebar: React.FC = () => {
  // 2. Initialized useTranslations with the 'form' namespace
  const t = useTranslations('form');

  return (
    // 3. Responsive layout, adaptive corners, and dark mode gradient
    <div className='relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 p-6 text-white dark:from-gray-900 dark:via-blue-950 dark:to-teal-950 md:p-8 lg:w-2/5 lg:p-10 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none'>
      
      {/* 4. Modern "Aurora" decorative background effect */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-teal-500/30 blur-3xl dark:bg-teal-500/20" />
        <div className="absolute -bottom-24 -right-10 h-56 w-56 rounded-full bg-blue-400/30 blur-3xl dark:bg-blue-400/10" />
        <Plane className='absolute top-8 right-8 h-20 w-20 -rotate-12 text-white/10' />
      </div>

      <div className='relative z-10'>
        {/* 5. Improved typography with responsive font sizes */}
        <h3 className='mb-4 text-2xl font-bold md:text-3xl'>
          {t('sidePanel.title')}
        </h3>
        <p className='mb-8 text-base leading-relaxed text-blue-100 dark:text-gray-300 md:text-lg'>
          {t('sidePanel.subtitle')}
        </p>

        {/* 6. Semantically correct list for contact info */}
        <ul className='space-y-4'>
          <li className='flex items-center'>
            <Phone className='mr-4 h-5 w-5 flex-shrink-0 text-blue-200 dark:text-blue-300' />
            <span className='text-blue-100 dark:text-gray-300'>{t('sidePanel.phone')}</span>
          </li>
          <li className='flex items-center'>
            <Mail className='mr-4 h-5 w-5 flex-shrink-0 text-blue-200 dark:text-blue-300' />
            <span className='text-blue-100 dark:text-gray-300'>{t('sidePanel.email')}</span>
          </li>
          <li className='flex items-center'>
            <MapPin className='mr-4 h-5 w-5 flex-shrink-0 text-blue-200 dark:text-blue-300' />
            <span className='text-blue-100 dark:text-gray-300'>{t('sidePanel.address')}</span>
          </li>
        </ul>

        <div className='mt-10'>
          <p className='mb-3 text-sm text-blue-200 dark:text-blue-300'>
            {t('sidePanel.followUs')}
          </p>
          {/* 7. Improved social links with better hover effects */}
          <div className='flex space-x-2'>
            <a
              href='https://www.facebook.com/profile.php?id=61586650558724'
              target='_blank'
              rel='noopener noreferrer'
              className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-200 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:text-white dark:bg-white/5 dark:text-blue-300 dark:hover:bg-white/10'
              aria-label='Facebook'
            >
              <Facebook className='h-5 w-5' />
            </a>
            <a
              href='https://www.instagram.com/akmleva.ia?igsh=MTk1dWI3Ym5nMndjZQ=='
              target='_blank'
              rel='noopener noreferrer'
              className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-200 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:text-white dark:bg-white/5 dark:text-blue-300 dark:hover:bg-white/10'
              aria-label='Instagram'
            >
              <Instagram className='h-5 w-5' />
            </a>
            <a
              href='https://twitter.com/akmleva'
              target='_blank'
              rel='noopener noreferrer'
              className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-200 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:text-white dark:bg-white/5 dark:text-blue-300 dark:hover:bg-white/10'
              aria-label='Twitter'
            >
              <Twitter className='h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
