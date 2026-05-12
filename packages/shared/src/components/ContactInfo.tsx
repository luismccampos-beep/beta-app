import React from 'react';
import { useTranslations } from 'next-intl';
import { LucideProps, MapPin, Phone, Mail, Clock } from 'lucide-react';

export type IconName = 'MapPin' | 'Phone' | 'Mail' | 'Clock';

export interface ContactInfoItem {
  icon: IconName;
  title: string;
  content: string;
  link?: string;
}

export interface ContactInfoProps {
  contactInfo: ContactInfoItem[];
}

const iconMap: Record<IconName, React.FC<LucideProps>> = {
  MapPin,
  Phone,
  Mail,
  Clock,
};

const ContactInfoItemComponent: React.FC<{ item: ContactInfoItem }> = ({ item }) => {
  const Icon = iconMap[item.icon];

  const isExternalLink = item.link?.startsWith('http');

  return (
    <div className='flex items-start space-x-4'>
      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
        <Icon className='h-6 w-6 text-blue-600' />
      </div>
      <div>
        <h3 className='font-semibold text-gray-900'>{item.title}</h3>
        {item.link ? (
          <a
            href={item.link}
            className='text-gray-600 hover:text-blue-600 transition-colors'
            target={isExternalLink ? '_blank' : undefined}
            rel={isExternalLink ? 'noopener noreferrer' : undefined}
          >
            {item.content}
          </a>
        ) : (
          <p className='text-gray-600'>{item.content}</p>
        )}
      </div>
    </div>
  );
};

const ContactInfo: React.FC<ContactInfoProps> = ({ contactInfo }) => {
  const t = useTranslations();

  return (
    <div className='rounded-lg bg-white p-8 shadow-lg'>
      <div className='mb-6'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>
          {t('contact.info.title') || 'Contact'}
        </h2>
        <p className='text-gray-600'>{t('contact.info.subtitle') || ''}</p>
      </div>

      <div className='space-y-6'>
        {contactInfo.map((item, index) => (
          <ContactInfoItemComponent key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export { ContactInfo };
export default ContactInfo;

