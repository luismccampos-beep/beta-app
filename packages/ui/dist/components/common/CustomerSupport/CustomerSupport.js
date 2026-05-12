"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@akmleva/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@akmleva/ui';
import { Badge } from '@akmleva/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@akmleva/ui';
import { WHATSAPP_NUMBER, QUICK_REPLIES, getBotResponse, PHONE_NUMBER } from './constants/support';
// =====================
// Hook de ações
// =====================
const useSupportActions = () => {
    const openWhatsApp = () => {
        const message = encodeURIComponent('Olá! Preciso de ajuda com informações sobre viagens.');
        const globalObj = globalThis;
        globalObj.open?.(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${message}`, '_blank');
    };
    const openPhone = () => {
        const globalObj = globalThis;
        globalObj.open?.(`tel:${PHONE_NUMBER}`, '_self');
    };
    const openEmail = () => {
        const subject = encodeURIComponent('Solicitação de Suporte - Agência de Viagens');
        const body = encodeURIComponent('Olá,\n\nPreciso de ajuda com:\n\n[Descreva sua dúvida aqui]\n\nObrigado!');
        const globalObj = globalThis;
        globalObj.open?.(`mailto:suporte@agenciaviagens.com?subject=${subject}&body=${body}`, '_self');
    };
    const openLiveChat = () => {
        const globalObj = globalThis;
        globalObj.alert?.('Chat ao vivo será aberto em breve!');
    };
    return { openWhatsApp, openPhone, openEmail, openLiveChat };
};
// =====================
// Dados de suporte
// =====================
const getSupportChannels = (actions) => [
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        description: 'Resposta imediata via WhatsApp',
        icon: _jsx(MessageCircle, { className: 'h-5 w-5' }),
        action: actions.openWhatsApp,
        available: true,
        responseTime: 'Imediato',
        color: 'bg-green-500 hover:bg-green-600',
    },
    {
        id: 'phone',
        name: 'Telefone',
        description: 'Fale diretamente com nossos consultores',
        icon: _jsx(Phone, { className: 'h-5 w-5' }),
        action: actions.openPhone,
        available: true,
        responseTime: 'Imediato',
        color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
        id: 'email',
        name: 'E-mail',
        description: 'Envie sua dúvida por e-mail',
        icon: _jsx(Mail, { className: 'h-5 w-5' }),
        action: actions.openEmail,
        available: true,
        responseTime: 'Até 2 horas',
        color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
        id: 'livechat',
        name: 'Chat ao Vivo',
        description: 'Chat em tempo real no site',
        icon: _jsx(MessageSquare, { className: 'h-5 w-5' }),
        action: actions.openLiveChat,
        available: false,
        responseTime: 'Imediato',
        color: 'bg-orange-500 hover:bg-orange-600',
    },
];
// =====================
// Componentes Modulares
// =====================
const SupportChannelCard = ({ channel }) => (_jsx(Card, { className: 'hover:shadow-lg transition-shadow transform hover:scale-105', children: _jsxs(CardContent, { className: 'p-6', children: [_jsxs("div", { className: 'flex items-start justify-between mb-4', children: [_jsxs("div", { className: 'flex items-center space-x-3', children: [_jsx("div", { className: `p-2 rounded-lg ${channel.color} text-white`, children: channel.icon }), _jsxs("div", { children: [_jsx("h3", { className: 'font-semibold text-gray-900', children: channel.name }), _jsx("p", { className: 'text-sm text-gray-600', children: channel.description })] })] }), channel.available ? (_jsx(Badge, { className: 'bg-green-100 text-green-800', children: "Online" })) : (_jsx(Badge, { variant: 'secondary', children: "Em breve" }))] }), _jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex items-center space-x-1 text-sm text-gray-500', children: [_jsx(Clock, { className: 'h-4 w-4' }), _jsx("span", { children: channel.responseTime })] }), _jsx(Button, { onClick: channel.action, disabled: !channel.available, className: channel.available ? channel.color : '', "aria-label": `Contatar via ${channel.name}`, children: channel.available ? 'Contatar' : 'Em breve' })] })] }) }));
const QuickReplies = ({ onClick }) => (_jsx("div", { className: 'flex flex-wrap gap-2 mt-4', children: QUICK_REPLIES.map((text, index) => (_jsx(Button, { variant: 'outline', onClick: () => onClick(text), "aria-label": `Sugestão rápida: ${text}`, children: text }, index))) }));
const BusinessHoursCard = ({ hours }) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center space-x-2', children: [_jsx(Clock, { className: 'h-5 w-5' }), _jsx("span", { children: "Hor\u00E1rios de Funcionamento" })] }) }), _jsx(CardContent, { children: _jsx("div", { className: 'space-y-4', children: hours.map((h, idx) => (_jsxs("div", { className: 'flex justify-between items-center py-2 border-b border-gray-100 last:border-0', children: [_jsx("span", { className: 'font-medium text-gray-900', children: h.day }), _jsx("span", { className: 'text-gray-600', children: h.hours })] }, idx))) }) })] }));
const OfficesCard = () => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center space-x-2', children: [_jsx(MapPin, { className: 'h-5 w-5' }), _jsx("span", { children: "Nossos Escrit\u00F3rios" })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'space-y-4', children: [_jsxs("div", { className: 'border rounded-lg p-4', children: [_jsx("h4", { className: 'font-semibold text-gray-900 mb-2', children: "Matriz - Lisboa" }), _jsx("p", { className: 'text-gray-600 mb-2', children: "Av. da Liberdade, 200 - Lisboa" }), _jsx("p", { className: 'text-gray-600 mb-2', children: "Lisboa, 1250-140" }), _jsx("p", { className: 'text-sm text-gray-500', children: "Tel: (21) 1234-5678" })] }), _jsxs("div", { className: 'border rounded-lg p-4', children: [_jsx("h4", { className: 'font-semibold text-gray-900 mb-2', children: "Filial - Porto" }), _jsx("p", { className: 'text-gray-600 mb-2', children: "Rua de Santa Catarina, 150 - Porto" }), _jsx("p", { className: 'text-gray-600 mb-2', children: "Porto, 4000-455" }), _jsx("p", { className: 'text-sm text-gray-500', children: "Tel: (22) 9876-5432" })] })] }) })] }));
const FAQCard = ({ faqItems }) => (_jsx(_Fragment, { children: faqItems.map((item, idx) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: 'text-lg font-semibold', children: item.question }) }), _jsx(CardContent, { children: _jsx("p", { className: 'text-gray-600', children: item.answer }) })] }, idx))) }));
// =====================
// Componente Principal
// =====================
export const CustomerSupport = () => {
    const [activeTab, setActiveTab] = useState('channels');
    const [botMessage, setBotMessage] = useState('');
    const actions = useSupportActions();
    const supportChannels = getSupportChannels(actions);
    const businessHours = [
        { day: 'Segunda - Sexta', hours: '09:00 - 19:00' },
        { day: 'Sábado', hours: '10:00 - 15:00' },
        { day: 'Segunda a Sexta', hours: '08:00 - 18:00' },
        { day: 'Sábado', hours: '09:00 - 14:00' },
        { day: 'Domingo', hours: 'Fechado' },
    ];
    const faqItems = [
        {
            question: 'Como posso cancelar minha viagem?',
            answer: 'Você pode cancelar sua viagem até 48h antes da data de partida. Entre em contato conosco para mais detalhes.',
        },
        {
            question: 'Quais formas de pagamento aceitam?',
            answer: 'Aceitamos cartão, PIX, transferência bancária e parcelamento em até 12x sem juros.',
        },
        {
            question: 'Vocês oferecem seguro viagem?',
            answer: 'Sim! Oferecemos seguro viagem com cobertura completa para destinos nacionais e internacionais.',
        },
    ];
    const handleQuickReply = (action) => {
        const response = getBotResponse(action.replace(/_/g, ' '));
        setBotMessage(typeof response === 'string' ? response : response.response || '');
    };
    return (_jsx("div", { className: 'container mx-auto px-4 py-12', children: _jsxs("div", { className: 'max-w-6xl mx-auto', children: [_jsxs("div", { className: 'text-center mb-12', children: [_jsx("h1", { className: 'text-4xl font-bold text-gray-900 mb-4', children: "Central de Atendimento" }), _jsx("p", { className: 'text-xl text-gray-600', children: "Estamos aqui para ajudar voc\u00EA a planejar sua viagem" })] }), _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), className: 'w-full', children: [_jsxs(TabsList, { className: 'grid w-full grid-cols-3', children: [_jsx(TabsTrigger, { value: 'contact', children: "Contato" }), _jsx(TabsTrigger, { value: 'hours', children: "Hor\u00E1rios" }), _jsx(TabsTrigger, { value: 'faq', children: "FAQ" })] }), _jsxs(TabsContent, { value: 'contact', className: 'space-y-6', children: [_jsx("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-4', children: supportChannels.map((channel) => (_jsx(SupportChannelCard, { channel: channel }, channel.id))) }), _jsxs("div", { children: [_jsx("p", { className: 'font-medium text-gray-700 mb-2', children: "Sugest\u00F5es r\u00E1pidas:" }), _jsx(QuickReplies, { onClick: handleQuickReply }), botMessage && (_jsx("div", { className: 'mt-4 p-4 bg-gray-100 rounded-lg text-gray-800 transition-opacity duration-300', children: botMessage }))] })] }), _jsxs(TabsContent, { value: 'hours', className: 'space-y-6', children: [_jsx(BusinessHoursCard, { hours: businessHours }), _jsx(OfficesCard, {})] }), _jsxs(TabsContent, { value: 'faq', className: 'space-y-4', children: [_jsx(FAQCard, { faqItems: faqItems }), _jsx(Card, { className: 'bg-blue-50 border-blue-200', children: _jsxs(CardContent, { className: 'p-6 text-center', children: [_jsx("h3", { className: 'font-semibold text-blue-900 mb-2', children: "N\u00E3o encontrou sua resposta?" }), _jsx("p", { className: 'text-blue-700 mb-4', children: "Nossa equipe est\u00E1 pronta para ajudar voc\u00EA!" }), _jsxs("div", { className: 'flex flex-col sm:flex-row gap-2 justify-center', children: [_jsxs(Button, { onClick: actions.openWhatsApp, className: 'bg-green-500 hover:bg-green-600 flex-1 sm:flex-none', children: [_jsx(MessageCircle, { className: 'h-4 w-4 mr-2' }), "WhatsApp"] }), _jsxs(Button, { onClick: actions.openPhone, variant: 'outline', className: 'flex-1 sm:flex-none', children: [_jsx(Phone, { className: 'h-4 w-4 mr-2' }), "Ligar agora"] })] })] }) })] })] })] }) }));
};
/** @alias */
export default CustomerSupport;
//# sourceMappingURL=CustomerSupport.js.map