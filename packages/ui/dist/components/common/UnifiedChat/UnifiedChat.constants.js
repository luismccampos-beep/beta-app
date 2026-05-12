import { HelpCircle, MessageSquare, Phone, Settings } from 'lucide-react';
export const CHAT_STORAGE_KEY = 'akmleva_chat_history';
export const WELCOME_MESSAGE_ID = 'welcome-akmleva';
export const MESSAGE_GROUP_TIME_THRESHOLD = 120000; // 2 minutes
export const CHAT_TOPICS = [
    {
        id: 'general-support',
        title: 'Suporte Geral',
        description: 'Dúvidas gerais sobre a plataforma',
        icon: HelpCircle,
    },
    {
        id: 'technical-issues',
        title: 'Problemas Técnicos',
        description: 'Reportar bugs ou problemas técnicos',
        icon: Settings,
    },
    {
        id: 'booking-help',
        title: 'Ajuda com Reservas',
        description: 'Suporte para reservas e pagamentos',
        icon: MessageSquare,
    },
    {
        id: 'contact-info',
        title: 'Informações de Contato',
        description: 'Outros meios de contato',
        icon: Phone,
    },
];
//# sourceMappingURL=UnifiedChat.constants.js.map