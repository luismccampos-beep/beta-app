import React from 'react';
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
declare const ContactInfo: React.FC<ContactInfoProps>;
export { ContactInfo };
export default ContactInfo;
