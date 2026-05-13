"use client";



import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@akmleva/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@akmleva/ui';
import { Badge } from '@akmleva/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@akmleva/ui';

import { WHATSAPP_NUMBER, QUICK_REPLIES, getBotResponse, PHONE_NUMBER } from './constants/support';

type TabType = 'channels' | 'faq' | 'contact';

// =====================
// Tipagens
// =====================
interface SupportChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  available: boolean;
  responseTime: string;
  color: string;
}

interface BusinessHour {
  day: string;
  hours: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// =====================
// Hook de ações
// =====================
const useSupportActions = () => {
  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Preciso de ajuda com informações sobre viagens.');
    const globalObj = globalThis as unknown as {
      open?: (url?: string, target?: string) => void;
    };

    globalObj.open?.(
      `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${message}`,
      '_blank'
    );
  };

  const openPhone = () => {
    const globalObj = globalThis as unknown as {
      open?: (url?: string, target?: string) => void;
    };

    globalObj.open?.(`tel:${PHONE_NUMBER}`, '_self');
  };

  const openEmail = () => {
    const subject = encodeURIComponent('Solicitação de Suporte - Agência de Viagens');
    const body = encodeURIComponent(
      'Olá,\n\nPreciso de ajuda com:\n\n[Descreva sua dúvida aqui]\n\nObrigado!'
    );
    const globalObj = globalThis as unknown as {
      open?: (url?: string, target?: string) => void;
    };

    globalObj.open?.(
      `mailto:suporte@agenciaviagens.com?subject=${subject}&body=${body}`,
      '_self'
    );
  };

  const openLiveChat = () => {
    const globalObj = globalThis as unknown as {
      alert?: (message?: string) => void;
    };

    globalObj.alert?.('Chat ao vivo será aberto em breve!');
  };

  return { openWhatsApp, openPhone, openEmail, openLiveChat };
};

// =====================
// Dados de suporte
// =====================
const getSupportChannels = (actions: ReturnType<typeof useSupportActions>): SupportChannel[] => [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Resposta imediata via WhatsApp',
    icon: <MessageCircle className='h-5 w-5' />,
    action: actions.openWhatsApp,
    available: true,
    responseTime: 'Imediato',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'phone',
    name: 'Telefone',
    description: 'Fale diretamente com nossos consultores',
    icon: <Phone className='h-5 w-5' />,
    action: actions.openPhone,
    available: true,
    responseTime: 'Imediato',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'email',
    name: 'E-mail',
    description: 'Envie sua dúvida por e-mail',
    icon: <Mail className='h-5 w-5' />,
    action: actions.openEmail,
    available: true,
    responseTime: 'Até 2 horas',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'livechat',
    name: 'Chat ao Vivo',
    description: 'Chat em tempo real no site',
    icon: <MessageSquare className='h-5 w-5' />,
    action: actions.openLiveChat,
    available: false,
    responseTime: 'Imediato',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
];

// =====================
// Componentes Modulares
// =====================
const SupportChannelCard: React.FC<{ channel: SupportChannel }> = ({ channel }) => (
  <Card className='hover:shadow-lg transition-shadow transform hover:scale-105'>
    <CardContent className='p-6'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center space-x-3'>
          <div className={`p-2 rounded-lg ${channel.color} text-white`}>{channel.icon}</div>
          <div>
            <h3 className='font-semibold text-gray-900'>{channel.name}</h3>
            <p className='text-sm text-gray-600'>{channel.description}</p>
          </div>
        </div>
        {channel.available ? (
          <Badge className='bg-green-100 text-green-800'>Online</Badge>
        ) : (
          <Badge variant='secondary'>Em breve</Badge>
        )}
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-1 text-sm text-gray-500'>
          <Clock className='h-4 w-4' />
          <span>{channel.responseTime}</span>
        </div>
        <Button
          onClick={channel.action}
          disabled={!channel.available}
          className={channel.available ? channel.color : ''}
          aria-label={`Contatar via ${channel.name}`}
        >
          {channel.available ? 'Contatar' : 'Em breve'}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const QuickReplies: React.FC<{ onClick: (action: string) => void }> = ({ onClick }) => (
  <div className='flex flex-wrap gap-2 mt-4'>
    {QUICK_REPLIES.map((text: string, index: number) => (
      <Button
        key={index}
        variant='outline'
        onClick={() => onClick(text)}
        aria-label={`Sugestão rápida: ${text}`}
      >
        {text}
      </Button>
    ))}
  </div>
);

const BusinessHoursCard: React.FC<{ hours: BusinessHour[] }> = ({ hours }) => (
  <Card>
    <CardHeader>
      <CardTitle className='flex items-center space-x-2'>
        <Clock className='h-5 w-5' />
        <span>Horários de Funcionamento</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        {hours.map((h, idx) => (
          <div
            key={idx}
            className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'
          >
            <span className='font-medium text-gray-900'>{h.day}</span>
            <span className='text-gray-600'>{h.hours}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const OfficesCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className='flex items-center space-x-2'>
        <MapPin className='h-5 w-5' />
        <span>Nossos Escritórios</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        <div className='border rounded-lg p-4'>
          <h4 className='font-semibold text-gray-900 mb-2'>Matriz - Lisboa</h4>
          <p className='text-gray-600 mb-2'>Av. da Liberdade, 200 - Lisboa</p>
          <p className='text-gray-600 mb-2'>Lisboa, 1250-140</p>
          <p className='text-sm text-gray-500'>Tel: (21) 1234-5678</p>
        </div>
        <div className='border rounded-lg p-4'>
          <h4 className='font-semibold text-gray-900 mb-2'>Filial - Porto</h4>
          <p className='text-gray-600 mb-2'>Rua de Santa Catarina, 150 - Porto</p>
          <p className='text-gray-600 mb-2'>Porto, 4000-455</p>
          <p className='text-sm text-gray-500'>Tel: (22) 9876-5432</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FAQCard: React.FC<{ faqItems: FAQItem[] }> = ({ faqItems }) => (
  <>
    {faqItems.map((item, idx) => (
      <Card key={idx}>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>{item.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600'>{item.answer}</p>
        </CardContent>
      </Card>
    ))}
  </>
);

// =====================
// Componente Principal
// =====================
export const CustomerSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('channels');
  const [botMessage, setBotMessage] = useState<string>('');
  const actions = useSupportActions();
  const supportChannels = getSupportChannels(actions);

  const businessHours: BusinessHour[] = [
    { day: 'Segunda - Sexta', hours: '09:00 - 19:00' },
    { day: 'Sábado', hours: '10:00 - 15:00' },
    { day: 'Segunda a Sexta', hours: '08:00 - 18:00' },
    { day: 'Sábado', hours: '09:00 - 14:00' },
    { day: 'Domingo', hours: 'Fechado' },
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'Como posso cancelar a minha viagem?',
      answer:
        'Pode cancelar a sua viagem até 48 h antes da data de partida. Contacte-nos para mais detalhes.',
    },
    {
      question: 'Quais formas de pagamento aceitam?',
      answer: 'Aceitamos cartão, PIX, transferência bancária e parcelamento em até 12x sem juros.',
    },
    {
      question: 'Vocês oferecem seguro viagem?',
      answer:
        'Sim! Oferecemos seguro viagem com cobertura completa para destinos nacionais e internacionais.',
    },
  ];

  const handleQuickReply = (action: string) => {
    const response = getBotResponse(action.replace(/_/g, ' '));
    setBotMessage(typeof response === 'string' ? response : response.response || '');
  };

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Central de Atendimento</h1>
          <p className='text-xl text-gray-600'>
            Estamos aqui para o ajudar a planear a sua viagem
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value: string) => setActiveTab(value as TabType)}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='contact'>Contato</TabsTrigger>
            <TabsTrigger value='hours'>Horários</TabsTrigger>
            <TabsTrigger value='faq'>FAQ</TabsTrigger>
          </TabsList>

          {/* Contato */}
          <TabsContent value='contact' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {supportChannels.map((channel) => (
                <SupportChannelCard key={channel.id} channel={channel} />
              ))}
            </div>

            <div>
              <p className='font-medium text-gray-700 mb-2'>Sugestões rápidas:</p>
              <QuickReplies onClick={handleQuickReply} />
              {botMessage && (
                <div className='mt-4 p-4 bg-gray-100 rounded-lg text-gray-800 transition-opacity duration-300'>
                  {botMessage}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Horários */}
          <TabsContent value='hours' className='space-y-6'>
            <BusinessHoursCard hours={businessHours} />
            <OfficesCard />
          </TabsContent>

          {/* FAQ */}
          <TabsContent value='faq' className='space-y-4'>
            <FAQCard faqItems={faqItems} />
            <Card className='bg-blue-50 border-blue-200'>
              <CardContent className='p-6 text-center'>
                <h3 className='font-semibold text-blue-900 mb-2'>Não encontrou sua resposta?</h3>
                <p className='text-blue-700 mb-4'>Nossa equipe está pronta para ajudar você!</p>
                <div className='flex flex-col sm:flex-row gap-2 justify-center'>
                  <Button
                    onClick={actions.openWhatsApp}
                    className='bg-green-500 hover:bg-green-600 flex-1 sm:flex-none'
                  >
                    <MessageCircle className='h-4 w-4 mr-2' />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={actions.openPhone}
                    variant='outline'
                    className='flex-1 sm:flex-none'
                  >
                    <Phone className='h-4 w-4 mr-2' />
                    Ligar agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

/** @alias */
export default CustomerSupport;
