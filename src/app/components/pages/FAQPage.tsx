import { useMemo, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Languages,
  Moon,
  Sun,
  HelpCircle,
  ChevronDown,
  Search,
  Plane,
  CreditCard,
  XCircle,
  Shield,
  Globe,
  FileText
} from 'lucide-react';

interface FAQPageProps {
  onBack: () => void;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  faqs: FAQ[];
}

export function FAQPage({ onBack }: FAQPageProps) {
  const locale = useLocale();
  const t = useTranslations('faq');
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleFAQ = (id: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(id)) {
      newOpenFAQs.delete(id);
    } else {
      newOpenFAQs.add(id);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const categories = useMemo(() => {
    const raw = t.raw('categories') as unknown;
    return (Array.isArray(raw) ? raw : []) as FAQCategory[];
  }, [t]);

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  const categoryMeta = useMemo(() => {
    return {
      booking: { icon: Plane, bgClass: 'from-teal-600 to-teal-500' },
      payment: { icon: CreditCard, bgClass: 'from-blue-600 to-blue-500' },
      cancellation: { icon: XCircle, bgClass: 'from-orange-600 to-orange-500' },
      safety: { icon: Shield, bgClass: 'from-green-600 to-green-500' },
      travel: { icon: Globe, bgClass: 'from-purple-600 to-purple-500' },
      general: { icon: FileText, bgClass: 'from-gray-700 to-gray-600' }
    } as const;
  }, []);

  /*
   * Legacy inline translations (migrated to next-intl JSON):
   * Keeping this block commented for now makes it easy to diff/verify the content
   * while the migration is landing. Remove once you're happy.
   */
  /* const content = {
    en: {
      pageTitle: 'Frequently Asked Questions',
      pageSubtitle: 'Find answers to common questions about our services',
      searchPlaceholder: 'Search for questions...',
      allCategories: 'All Categories',
      categoryBooking: 'Bookings & Reservations',
      categoryPayment: 'Payments & Pricing',
      categoryCancellation: 'Cancellations & Refunds',
      categorySafety: 'Safety & Insurance',
      categoryTravel: 'Travel Information',
      categoryGeneral: 'General Questions',
      noResults: 'No questions found matching your search.',
      stillHaveQuestions: 'Still have questions?',
      contactUs: 'Contact Us',
      categories: [
        {
          id: 'booking',
          title: 'Bookings & Reservations',
          icon: Plane,
          color: 'teal',
          faqs: [
            {
              question: 'How do I make a booking?',
              answer: 'You can make a booking through our website by clicking "Get Started", filling out your travel preferences, and selecting from our personalized recommendations. You can also contact us directly by phone or email for assistance.'
            },
            {
              question: 'How far in advance should I book?',
              answer: 'We recommend booking at least 2-3 months in advance for international trips and 1 month for domestic travel. However, we can accommodate last-minute bookings depending on availability.'
            },
            {
              question: 'Can I modify my booking after confirmation?',
              answer: 'Yes, you can modify your booking subject to availability and the terms of the service providers. Modification fees may apply depending on how close to the departure date you make the change.'
            },
            {
              question: 'What information do I need to provide when booking?',
              answer: 'You\'ll need to provide full names (as they appear on passports), dates of birth, contact information, passport details for international travel, and any special requirements or preferences.'
            }
          ]
        },
        {
          id: 'payment',
          title: 'Payments & Pricing',
          icon: CreditCard,
          color: 'blue',
          faqs: [
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept credit cards (Visa, Mastercard, American Express), debit cards, bank transfers, and MB Way. Payment plans are available for bookings over €1000.'
            },
            {
              question: 'When do I need to pay?',
              answer: 'A deposit of 30% is required at the time of booking. The remaining balance is due 30 days before departure. Different terms may apply for last-minute bookings.'
            },
            {
              question: 'Are there any hidden fees?',
              answer: 'No, we provide transparent pricing. All fees, taxes, and charges are clearly displayed before you confirm your booking. The price you see is the price you pay.'
            },
            {
              question: 'Do you offer group discounts?',
              answer: 'Yes, we offer special rates for groups of 10 or more people. Contact us directly for a customized quote and group booking terms.'
            }
          ]
        },
        {
          id: 'cancellation',
          title: 'Cancellations & Refunds',
          icon: XCircle,
          color: 'orange',
          faqs: [
            {
              question: 'What is your cancellation policy?',
              answer: 'Cancellations more than 30 days before departure: 20% retention fee. 15-29 days: 50% retention. Less than 14 days: no refund. Different terms may apply for specific services.'
            },
            {
              question: 'How long does it take to receive a refund?',
              answer: 'Refunds are processed within 7-14 business days after cancellation approval. The funds will be returned to your original payment method.'
            },
            {
              question: 'Can I get a refund if I have to cancel due to illness?',
              answer: 'If you have travel insurance, medical cancellations are typically covered with proper documentation. Without insurance, standard cancellation fees apply. We strongly recommend purchasing travel insurance.'
            },
            {
              question: 'What happens if the airline cancels my flight?',
              answer: 'If a flight is cancelled by the airline, we will work with you to rebook on the next available flight at no extra cost, or provide a full refund if you choose not to travel.'
            }
          ]
        },
        {
          id: 'safety',
          title: 'Safety & Insurance',
          icon: Shield,
          color: 'green',
          faqs: [
            {
              question: 'Do I need travel insurance?',
              answer: 'While not mandatory, we strongly recommend travel insurance to cover unexpected events like trip cancellations, medical emergencies, lost luggage, and travel delays.'
            },
            {
              question: 'What does your travel insurance cover?',
              answer: 'Our recommended travel insurance covers trip cancellation, medical emergencies, lost or delayed luggage, travel delays, and emergency evacuation. Specific coverage varies by plan.'
            },
            {
              question: 'Are your bookings financially protected?',
              answer: 'Yes, we are registered with the Portuguese Tourism Authority and contribute to the Travel and Tourism Guarantee Fund (FGVT), which protects your payments in case of insolvency.'
            },
            {
              question: 'What safety measures do you have in place?',
              answer: 'We work only with certified partners, monitor travel advisories, provide 24/7 emergency support, and ensure all our services meet safety and quality standards.'
            }
          ]
        },
        {
          id: 'travel',
          title: 'Travel Information',
          icon: Globe,
          color: 'purple',
          faqs: [
            {
              question: 'Do I need a visa for my destination?',
              answer: 'Visa requirements vary by destination and nationality. We provide guidance on visa requirements, but it\'s your responsibility to ensure you have the correct documentation. We recommend checking at least 3 months before travel.'
            },
            {
              question: 'What documents do I need to travel?',
              answer: 'At minimum, you need a valid passport (valid for at least 6 months beyond your return date). Depending on your destination, you may also need visas, vaccination certificates, or other specific documents.'
            },
            {
              question: 'Can you help with special requirements (dietary, mobility, etc.)?',
              answer: 'Absolutely! We can arrange special meals, wheelchair access, medical assistance, and other accommodations. Please inform us of any special requirements when booking.'
            },
            {
              question: 'What if there\'s a travel advisory for my destination?',
              answer: 'We monitor all travel advisories and will inform you immediately if any are issued for your destination. You may be able to change your destination or receive a refund depending on the severity and your insurance coverage.'
            }
          ]
        },
        {
          id: 'general',
          title: 'General Questions',
          icon: FileText,
          color: 'gray',
          faqs: [
            {
              question: 'How does your AI-powered service work?',
              answer: 'Our AI analyzes your preferences, budget, travel dates, and interests to recommend personalized destinations and itineraries. It saves you time by filtering thousands of options to find the perfect match for you.'
            },
            {
              question: 'Do you offer packages or custom trips?',
              answer: 'We offer both! Choose from our curated packages or let us create a completely customized itinerary tailored to your specific needs and preferences.'
            },
            {
              question: 'What is included in your service fee?',
              answer: 'Our service fee covers personalized consultation, booking management, 24/7 support during your trip, and assistance with any issues that may arise. We also negotiate the best rates with our partners.'
            },
            {
              question: 'How can I contact you during my trip?',
              answer: 'We provide 24/7 emergency support via phone, email, and WhatsApp. You\'ll receive emergency contact numbers and your dedicated travel consultant\'s details before departure.'
            }
          ]
        }
      ] as FAQCategory[]
    },
    pt: {
      pageTitle: 'Perguntas Frequentes',
      pageSubtitle: 'Encontre respostas para questões comuns sobre os nossos serviços',
      searchPlaceholder: 'Procurar perguntas...',
      allCategories: 'Todas as Categorias',
      categoryBooking: 'Reservas',
      categoryPayment: 'Pagamentos',
      categoryCancellation: 'Cancelamentos',
      categorySafety: 'Segurança',
      categoryTravel: 'Informações de Viagem',
      categoryGeneral: 'Perguntas Gerais',
      noResults: 'Nenhuma pergunta encontrada.',
      stillHaveQuestions: 'Ainda tem dúvidas?',
      contactUs: 'Contacte-nos',
      categories: [
        {
          id: 'booking',
          title: 'Reservas',
          icon: Plane,
          color: 'teal',
          faqs: [
            {
              question: 'Como faço uma reserva?',
              answer: 'Pode fazer uma reserva através do nosso website clicando em "Começar", preenchendo as suas preferências de viagem e selecionando das nossas recomendações personalizadas. Também pode contactar-nos diretamente por telefone ou email.'
            },
            {
              question: 'Com que antecedência devo reservar?',
              answer: 'Recomendamos reservar com pelo menos 2-3 meses de antecedência para viagens internacionais e 1 mês para viagens nacionais. No entanto, podemos acomodar reservas de última hora dependendo da disponibilidade.'
            },
            {
              question: 'Posso modificar a minha reserva após confirmação?',
              answer: 'Sim, pode modificar a sua reserva sujeito a disponibilidade e aos termos dos fornecedores de serviços. Taxas de modificação podem ser aplicadas dependendo da proximidade da data de partida.'
            },
            {
              question: 'Que informações preciso fornecer ao reservar?',
              answer: 'Precisará fornecer nomes completos (como aparecem nos passaportes), datas de nascimento, informações de contacto, detalhes do passaporte para viagens internacionais e quaisquer requisitos ou preferências especiais.'
            }
          ]
        },
        {
          id: 'payment',
          title: 'Pagamentos e Preços',
          icon: CreditCard,
          color: 'blue',
          faqs: [
            {
              question: 'Que métodos de pagamento aceitam?',
              answer: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), cartões de débito, transferências bancárias e MB Way. Planos de pagamento estão disponíveis para reservas acima de €1000.'
            },
            {
              question: 'Quando preciso de pagar?',
              answer: 'É necessário um depósito de 30% no momento da reserva. O saldo restante vence 30 dias antes da partida. Termos diferentes podem aplicar-se a reservas de última hora.'
            },
            {
              question: 'Existem taxas ocultas?',
              answer: 'Não, fornecemos preços transparentes. Todas as taxas e encargos são claramente exibidos antes de confirmar a sua reserva. O preço que vê é o preço que paga.'
            },
            {
              question: 'Oferecem descontos para grupos?',
              answer: 'Sim, oferecemos tarifas especiais para grupos de 10 ou mais pessoas. Contacte-nos diretamente para um orçamento personalizado e termos de reserva de grupo.'
            }
          ]
        },
        {
          id: 'cancellation',
          title: 'Cancelamentos e Reembolsos',
          icon: XCircle,
          color: 'orange',
          faqs: [
            {
              question: 'Qual é a vossa política de cancelamento?',
              answer: 'Cancelamentos com mais de 30 dias antes da partida: taxa de retenção de 20%. 15-29 dias: retenção de 50%. Menos de 14 dias: sem reembolso. Termos diferentes podem aplicar-se a serviços específicos.'
            },
            {
              question: 'Quanto tempo demora a receber um reembolso?',
              answer: 'Os reembolsos são processados dentro de 7-14 dias úteis após a aprovação do cancelamento. Os fundos serão devolvidos ao seu método de pagamento original.'
            },
            {
              question: 'Posso obter reembolso se tiver que cancelar devido a doença?',
              answer: 'Se tiver seguro de viagem, cancelamentos médicos são tipicamente cobertos com documentação adequada. Sem seguro, aplicam-se as taxas de cancelamento padrão. Recomendamos fortemente a compra de seguro de viagem.'
            },
            {
              question: 'O que acontece se a companhia aérea cancelar o meu voo?',
              answer: 'Se um voo for cancelado pela companhia aérea, trabalharemos consigo para remarcar no próximo voo disponível sem custo extra, ou forneceremos um reembolso total se optar por não viajar.'
            }
          ]
        },
        {
          id: 'safety',
          title: 'Segurança e Seguros',
          icon: Shield,
          color: 'green',
          faqs: [
            {
              question: 'Preciso de seguro de viagem?',
              answer: 'Embora não seja obrigatório, recomendamos fortemente seguro de viagem para cobrir eventos inesperados como cancelamentos de viagem, emergências médicas, bagagem perdida e atrasos de viagem.'
            },
            {
              question: 'O que cobre o vosso seguro de viagem?',
              answer: 'O nosso seguro de viagem recomendado cobre cancelamento de viagem, emergências médicas, bagagem perdida ou atrasada, atrasos de viagem e evacuação de emergência. A cobertura específica varia por plano.'
            },
            {
              question: 'As vossas reservas estão financeiramente protegidas?',
              answer: 'Sim, estamos registados junto da Autoridade de Turismo Portuguesa e contribuímos para o Fundo de Garantia de Viagens e Turismo (FGVT), que protege os seus pagamentos em caso de insolvência.'
            },
            {
              question: 'Que medidas de segurança têm implementadas?',
              answer: 'Trabalhamos apenas com parceiros certificados, monitorizamos avisos de viagem, fornecemos suporte de emergência 24/7 e garantimos que todos os nossos serviços cumprem padrões de segurança e qualidade.'
            }
          ]
        },
        {
          id: 'travel',
          title: 'Informações de Viagem',
          icon: Globe,
          color: 'purple',
          faqs: [
            {
              question: 'Preciso de visto para o meu destino?',
              answer: 'Os requisitos de visto variam por destino e nacionalidade. Fornecemos orientação sobre requisitos de visto, mas é da sua responsabilidade garantir que tem a documentação correta. Recomendamos verificar pelo menos 3 meses antes da viagem.'
            },
            {
              question: 'Que documentos preciso para viajar?',
              answer: 'No mínimo, precisa de um passaporte válido (válido por pelo menos 6 meses além da data de retorno). Dependendo do seu destino, também pode precisar de vistos, certificados de vacinação ou outros documentos específicos.'
            },
            {
              question: 'Podem ajudar com requisitos especiais (dietéticos, mobilidade, etc.)?',
              answer: 'Absolutamente! Podemos organizar refeições especiais, acesso para cadeiras de rodas, assistência médica e outras acomodações. Por favor informe-nos de quaisquer requisitos especiais ao fazer a reserva.'
            },
            {
              question: 'E se houver um aviso de viagem para o meu destino?',
              answer: 'Monitorizamos todos os avisos de viagem e informá-lo-emos imediatamente se algum for emitido para o seu destino. Poderá alterar o seu destino ou receber um reembolso dependendo da gravidade e da sua cobertura de seguro.'
            }
          ]
        },
        {
          id: 'general',
          title: 'Perguntas Gerais',
          icon: FileText,
          color: 'gray',
          faqs: [
            {
              question: 'Como funciona o vosso serviço com IA?',
              answer: 'A nossa IA analisa as suas preferências, orçamento, datas de viagem e interesses para recomendar destinos e itinerários personalizados. Poupa-lhe tempo ao filtrar milhares de opções para encontrar a combinação perfeita para si.'
            },
            {
              question: 'Oferecem pacotes ou viagens personalizadas?',
              answer: 'Oferecemos ambos! Escolha dos nossos pacotes selecionados ou deixe-nos criar um itinerário completamente personalizado adaptado às suas necessidades e preferências específicas.'
            },
            {
              question: 'O que está incluído na vossa taxa de serviço?',
              answer: 'A nossa taxa de serviço cobre consultoria personalizada, gestão de reservas, suporte 24/7 durante a sua viagem e assistência com quaisquer problemas que possam surgir. Também negociamos as melhores tarifas com os nossos parceiros.'
            },
            {
              question: 'Como posso contactá-los durante a minha viagem?',
              answer: 'Fornecemos suporte de emergência 24/7 via telefone, email e WhatsApp. Receberá números de contacto de emergência e os detalhes do seu consultor de viagem dedicado antes da partida.'
            }
          ]
        }
      ] as FAQCategory[]
    },
    es: {
      pageTitle: 'Preguntas Frecuentes',
      pageSubtitle: 'Encuentre respuestas a preguntas comunes sobre nuestros servicios',
      searchPlaceholder: 'Buscar preguntas...',
      allCategories: 'Todas las Categorías',
      categoryBooking: 'Reservas',
      categoryPayment: 'Pagos',
      categoryCancellation: 'Cancelaciones',
      categorySafety: 'Seguridad',
      categoryTravel: 'Información de Viaje',
      categoryGeneral: 'Preguntas Generales',
      noResults: 'No se encontraron preguntas.',
      stillHaveQuestions: '¿Aún tienes preguntas?',
      contactUs: 'Contáctanos',
      categories: [
        {
          id: 'booking',
          title: 'Reservas',
          icon: Plane,
          color: 'teal',
          faqs: [
            {
              question: '¿Cómo hago una reserva?',
              answer: 'Puede hacer una reserva a través de nuestro sitio web haciendo clic en "Comenzar", completando sus preferencias de viaje y seleccionando entre nuestras recomendaciones personalizadas. También puede contactarnos directamente por teléfono o correo electrónico.'
            },
            {
              question: '¿Con cuánta anticipación debo reservar?',
              answer: 'Recomendamos reservar con al menos 2-3 meses de anticipación para viajes internacionales y 1 mes para viajes nacionales. Sin embargo, podemos acomodar reservas de última hora dependiendo de la disponibilidad.'
            },
            {
              question: '¿Puedo modificar mi reserva después de la confirmación?',
              answer: 'Sí, puede modificar su reserva sujeto a disponibilidad y a los términos de los proveedores de servicios. Se pueden aplicar tarifas de modificación dependiendo de qué tan cerca de la fecha de salida realice el cambio.'
            },
            {
              question: '¿Qué información necesito proporcionar al reservar?',
              answer: 'Deberá proporcionar nombres completos (como aparecen en los pasaportes), fechas de nacimiento, información de contacto, detalles del pasaporte para viajes internacionales y cualquier requisito o preferencia especial.'
            }
          ]
        },
        {
          id: 'payment',
          title: 'Pagos y Precios',
          icon: CreditCard,
          color: 'blue',
          faqs: [
            {
              question: '¿Qué métodos de pago aceptan?',
              answer: 'Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), tarjetas de débito, transferencias bancarias y MB Way. Los planes de pago están disponibles para reservas superiores a €1000.'
            },
            {
              question: '¿Cuándo necesito pagar?',
              answer: 'Se requiere un depósito del 30% en el momento de la reserva. El saldo restante vence 30 días antes de la salida. Pueden aplicarse diferentes términos para reservas de última hora.'
            },
            {
              question: '¿Hay tarifas ocultas?',
              answer: 'No, proporcionamos precios transparentes. Todas las tarifas, impuestos y cargos se muestran claramente antes de confirmar su reserva. El precio que ve es el precio que paga.'
            },
            {
              question: '¿Ofrecen descuentos para grupos?',
              answer: 'Sí, ofrecemos tarifas especiales para grupos de 10 o más personas. Contáctenos directamente para una cotización personalizada y términos de reserva grupal.'
            }
          ]
        },
        {
          id: 'cancellation',
          title: 'Cancelaciones y Reembolsos',
          icon: XCircle,
          color: 'orange',
          faqs: [
            {
              question: '¿Cuál es su política de cancelación?',
              answer: 'Cancelaciones con más de 30 días antes de la salida: tarifa de retención del 20%. 15-29 días: retención del 50%. Menos de 14 días: sin reembolso. Pueden aplicarse términos diferentes para servicios específicos.'
            },
            {
              question: '¿Cuánto tiempo tarda en recibirse un reembolso?',
              answer: 'Los reembolsos se procesan dentro de 7-14 días hábiles después de la aprobación de la cancelación. Los fondos se devolverán a su método de pago original.'
            },
            {
              question: '¿Puedo obtener un reembolso si tengo que cancelar por enfermedad?',
              answer: 'Si tiene seguro de viaje, las cancelaciones médicas generalmente están cubiertas con la documentación adecuada. Sin seguro, se aplican las tarifas de cancelación estándar. Recomendamos encarecidamente la compra de un seguro de viaje.'
            },
            {
              question: '¿Qué sucede si la aerolínea cancela mi vuelo?',
              answer: 'Si un vuelo es cancelado por la aerolínea, trabajaremos con usted para reprogramar en el próximo vuelo disponible sin costo adicional, o proporcionaremos un reembolso completo si decide no viajar.'
            }
          ]
        },
        {
          id: 'safety',
          title: 'Seguridad y Seguros',
          icon: Shield,
          color: 'green',
          faqs: [
            {
              question: '¿Necesito un seguro de viaje?',
              answer: 'Aunque no es obligatorio, recomendamos encarecidamente un seguro de viaje para cubrir eventos inesperados como cancelaciones de viaje, emergencias médicas, equipaje perdido y retrasos de viaje.'
            },
            {
              question: '¿Qué cubre su seguro de viaje?',
              answer: 'Nuestro seguro de viaje recomendado cubre cancelación de viaje, emergencias médicas, equipaje perdido o retrasado, retrasos de viaje y evacuación de emergencia. La cobertura específica varía según el plan.'
            },
            {
              question: '¿Sus reservas están protegidas financieramente?',
              answer: 'Sí, estamos registrados con la Autoridad de Turismo Portuguesa y contribuimos al Fondo de Garantía de Viajes y Turismo (FGVT), que protege sus pagos en caso de insolvencia.'
            },
            {
              question: '¿Qué medidas de seguridad tienen implementadas?',
              answer: 'Trabajamos solo con socios certificados, monitoreamos avisos de viaje, proporcionamos soporte de emergencia 24/7 y garantizamos que todos nuestros servicios cumplan con los estándares de seguridad y calidad.'
            }
          ]
        },
        {
          id: 'travel',
          title: 'Información de Viaje',
          icon: Globe,
          color: 'purple',
          faqs: [
            {
              question: '¿Necesito una visa para mi destino?',
              answer: 'Los requisitos de visa varían según el destino y la nacionalidad. Proporcionamos orientación sobre los requisitos de visa, pero es su responsabilidad asegurarse de tener la documentación correcta. Recomendamos verificar al menos 3 meses antes del viaje.'
            },
            {
              question: '¿Qué documentos necesito para viajar?',
              answer: 'Como mínimo, necesita un pasaporte válido (válido por al menos 6 meses más allá de su fecha de regreso). Dependiendo de su destino, también puede necesitar visas, certificados de vacunación u otros documentos específicos.'
            },
            {
              question: '¿Pueden ayudar con requisitos especiales (dietéticos, movilidad, etc.)?',
              answer: '¡Absolutamente! Podemos organizar comidas especiales, acceso para sillas de ruedas, asistencia médica y otras adaptaciones. Por favor infórmenos de cualquier requisito especial al hacer la reserva.'
            },
            {
              question: '¿Qué pasa si hay un aviso de viaje para mi destino?',
              answer: 'Monitoreamos todos los avisos de viaje y le informaremos inmediatamente si se emite alguno para su destino. Podrá cambiar su destino o recibir un reembolso dependiendo de la gravedad y su cobertura de seguro.'
            }
          ]
        },
        {
          id: 'general',
          title: 'Preguntas Generales',
          icon: FileText,
          color: 'gray',
          faqs: [
            {
              question: '¿Cómo funciona su servicio con IA?',
              answer: 'Nuestra IA analiza sus preferencias, presupuesto, fechas de viaje e intereses para recomendar destinos e itinerarios personalizados. Le ahorra tiempo al filtrar miles de opciones para encontrar la combinación perfecta para usted.'
            },
            {
              question: '¿Ofrecen paquetes o viajes personalizados?',
              answer: '¡Ofrecemos ambos! Elija entre nuestros paquetes seleccionados o permítanos crear un itinerario completamente personalizado adaptado a sus necesidades y preferencias específicas.'
            },
            {
              question: '¿Qué está incluido en su tarifa de servicio?',
              answer: 'Nuestra tarifa de servicio cubre consulta personalizada, gestión de reservas, soporte 24/7 durante su viaje y asistencia con cualquier problema que pueda surgir. También negociamos las mejores tarifas con nuestros socios.'
            },
            {
              question: '¿Cómo puedo contactarlos durante mi viaje?',
              answer: 'Proporcionamos soporte de emergencia 24/7 por teléfono, correo electrónico y WhatsApp. Recibirá números de contacto de emergencia y los detalles de su consultor de viajes dedicado antes de la salida.'
            }
          ]
        }
      ] as FAQCategory[]
    },
    fr: {
      pageTitle: 'Questions Fréquentes',
      pageSubtitle: 'Trouvez des réponses aux questions courantes sur nos services',
      searchPlaceholder: 'Rechercher des questions...',
      allCategories: 'Toutes les Catégories',
      categoryBooking: 'Réservations',
      categoryPayment: 'Paiements',
      categoryCancellation: 'Annulations',
      categorySafety: 'Sécurité',
      categoryTravel: 'Informations de Voyage',
      categoryGeneral: 'Questions Générales',
      noResults: 'Aucune question trouvée.',
      stillHaveQuestions: 'Vous avez encore des questions?',
      contactUs: 'Contactez-nous',
      categories: [
        {
          id: 'booking',
          title: 'Réservations',
          icon: Plane,
          color: 'teal',
          faqs: [
            {
              question: 'Comment faire une réservation?',
              answer: 'Vous pouvez faire une réservation via notre site web en cliquant sur "Commencer", en remplissant vos préférences de voyage et en sélectionnant parmi nos recommandations personnalisées. Vous pouvez également nous contacter directement par téléphone ou e-mail.'
            },
            {
              question: 'Combien de temps à l\'avance dois-je réserver?',
              answer: 'Nous recommandons de réserver au moins 2-3 mois à l\'avance pour les voyages internationaux et 1 mois pour les voyages nationaux. Cependant, nous pouvons accommoder les réservations de dernière minute selon la disponibilité.'
            },
            {
              question: 'Puis-je modifier ma réservation après confirmation?',
              answer: 'Oui, vous pouvez modifier votre réservation sous réserve de disponibilité et des conditions des prestataires de services. Des frais de modification peuvent s\'appliquer selon la proximité de la date de départ.'
            },
            {
              question: 'Quelles informations dois-je fournir lors de la réservation?',
              answer: 'Vous devrez fournir les noms complets (tels qu\'ils apparaissent sur les passeports), les dates de naissance, les coordonnées, les détails du passeport pour les voyages internationaux et toute exigence ou préférence particulière.'
            }
          ]
        },
        {
          id: 'payment',
          title: 'Paiements et Tarifs',
          icon: CreditCard,
          color: 'blue',
          faqs: [
            {
              question: 'Quels modes de paiement acceptez-vous?',
              answer: 'Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), les cartes de débit, les virements bancaires et MB Way. Des plans de paiement sont disponibles pour les réservations de plus de 1000€.'
            },
            {
              question: 'Quand dois-je payer?',
              answer: 'Un acompte de 30% est requis au moment de la réservation. Le solde restant est dû 30 jours avant le départ. Des conditions différentes peuvent s\'appliquer pour les réservations de dernière minute.'
            },
            {
              question: 'Y a-t-il des frais cachés?',
              answer: 'Non, nous offrons une tarification transparente. Tous les frais, taxes et charges sont clairement affichés avant de confirmer votre réservation. Le prix que vous voyez est le prix que vous payez.'
            },
            {
              question: 'Proposez-vous des réductions pour les groupes?',
              answer: 'Oui, nous proposons des tarifs spéciaux pour les groupes de 10 personnes ou plus. Contactez-nous directement pour un devis personnalisé et les conditions de réservation de groupe.'
            }
          ]
        },
        {
          id: 'cancellation',
          title: 'Annulations et Remboursements',
          icon: XCircle,
          color: 'orange',
          faqs: [
            {
              question: 'Quelle est votre politique d\'annulation?',
              answer: 'Annulations plus de 30 jours avant le départ: frais de rétention de 20%. 15-29 jours: rétention de 50%. Moins de 14 jours: aucun remboursement. Des conditions différentes peuvent s\'appliquer pour des services spécifiques.'
            },
            {
              question: 'Combien de temps faut-il pour recevoir un remboursement?',
              answer: 'Les remboursements sont traités dans les 7-14 jours ouvrables après l\'approbation de l\'annulation. Les fonds seront retournés à votre mode de paiement original.'
            },
            {
              question: 'Puis-je obtenir un remboursement si je dois annuler pour cause de maladie?',
              answer: 'Si vous avez une assurance voyage, les annulations médicales sont généralement couvertes avec une documentation appropriée. Sans assurance, les frais d\'annulation standards s\'appliquent. Nous recommandons fortement l\'achat d\'une assurance voyage.'
            },
            {
              question: 'Que se passe-t-il si la compagnie aérienne annule mon vol?',
              answer: 'Si un vol est annulé par la compagnie aérienne, nous travaillerons avec vous pour reprogrammer sur le prochain vol disponible sans frais supplémentaires, ou fournirons un remboursement complet si vous choisissez de ne pas voyager.'
            }
          ]
        },
        {
          id: 'safety',
          title: 'Sécurité et Assurance',
          icon: Shield,
          color: 'green',
          faqs: [
            {
              question: 'Ai-je besoin d\'une assurance voyage?',
              answer: 'Bien que non obligatoire, nous recommandons fortement une assurance voyage pour couvrir les événements imprévus comme les annulations de voyage, les urgences médicales, les bagages perdus et les retards de voyage.'
            },
            {
              question: 'Que couvre votre assurance voyage?',
              answer: 'Notre assurance voyage recommandée couvre l\'annulation de voyage, les urgences médicales, les bagages perdus ou retardés, les retards de voyage et l\'évacuation d\'urgence. La couverture spécifique varie selon le plan.'
            },
            {
              question: 'Vos réservations sont-elles protégées financièrement?',
              answer: 'Oui, nous sommes enregistrés auprès de l\'Autorité du Tourisme Portugaise et contribuons au Fonds de Garantie des Voyages et du Tourisme (FGVT), qui protège vos paiements en cas d\'insolvabilité.'
            },
            {
              question: 'Quelles mesures de sécurité avez-vous mises en place?',
              answer: 'Nous travaillons uniquement avec des partenaires certifiés, surveillons les avis de voyage, fournissons un support d\'urgence 24/7 et garantissons que tous nos services respectent les normes de sécurité et de qualité.'
            }
          ]
        },
        {
          id: 'travel',
          title: 'Informations de Voyage',
          icon: Globe,
          color: 'purple',
          faqs: [
            {
              question: 'Ai-je besoin d\'un visa pour ma destination?',
              answer: 'Les exigences de visa varient selon la destination et la nationalité. Nous fournissons des conseils sur les exigences de visa, mais il est de votre responsabilité de vous assurer d\'avoir la documentation correcte. Nous recommandons de vérifier au moins 3 mois avant le voyage.'
            },
            {
              question: 'Quels documents ai-je besoin pour voyager?',
              answer: 'Au minimum, vous avez besoin d\'un passeport valide (valide pendant au moins 6 mois au-delà de votre date de retour). Selon votre destination, vous pourriez également avoir besoin de visas, de certificats de vaccination ou d\'autres documents spécifiques.'
            },
            {
              question: 'Pouvez-vous aider avec des exigences spéciales (diététiques, mobilité, etc.)?',
              answer: 'Absolument! Nous pouvons organiser des repas spéciaux, un accès en fauteuil roulant, une assistance médicale et d\'autres aménagements. Veuillez nous informer de toute exigence particulière lors de la réservation.'
            },
            {
              question: 'Que se passe-t-il s\'il y a un avis de voyage pour ma destination?',
              answer: 'Nous surveillons tous les avis de voyage et vous informerons immédiatement si l\'un d\'entre eux est émis pour votre destination. Vous pourrez changer de destination ou recevoir un remboursement selon la gravité et votre couverture d\'assurance.'
            }
          ]
        },
        {
          id: 'general',
          title: 'Questions Générales',
          icon: FileText,
          color: 'gray',
          faqs: [
            {
              question: 'Comment fonctionne votre service alimenté par l\'IA?',
              answer: 'Notre IA analyse vos préférences, budget, dates de voyage et intérêts pour recommander des destinations et itinéraires personnalisés. Elle vous fait gagner du temps en filtrant des milliers d\'options pour trouver la combinaison parfaite pour vous.'
            },
            {
              question: 'Proposez-vous des forfaits ou des voyages personnalisés?',
              answer: 'Nous proposons les deux! Choisissez parmi nos forfaits sélectionnés ou laissez-nous créer un itinéraire entièrement personnalisé adapté à vos besoins et préférences spécifiques.'
            },
            {
              question: 'Qu\'est-ce qui est inclus dans vos frais de service?',
              answer: 'Nos frais de service couvrent la consultation personnalisée, la gestion des réservations, le support 24/7 pendant votre voyage et l\'assistance pour tout problème qui pourrait survenir. Nous négocions également les meilleurs tarifs avec nos partenaires.'
            },
            {
              question: 'Comment puis-je vous contacter pendant mon voyage?',
              answer: 'Nous fournissons un support d\'urgence 24/7 par téléphone, e-mail et WhatsApp. Vous recevrez les numéros de contact d\'urgence et les coordonnées de votre consultant voyage dédié avant le départ.'
            }
          ]
        }
      ] as FAQCategory[]
    }
  }; */

  // Filter FAQs based on search and category
  const filteredCategories = categories
    .map(category => ({
      ...category,
      faqs: category.faqs.filter(faq =>
        (activeCategory === 'all' || activeCategory === category.id) &&
        (searchQuery === '' ||
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-orange-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              AKMLEVA
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
                title={isDark ? t('header.lightMode') : t('header.darkMode')}
              >
                {isDark ? <Sun className="w-4 h-4 text-orange-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
              </button>

              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-teal-700 dark:text-teal-400 hidden sm:block" />
                <div className="inline-flex rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-0.5 shadow-sm">
                  {[
                    { code: 'en', label: '🇺🇸' },
                    { code: 'pt', label: '🇵🇹' },
                    { code: 'es', label: '🇪🇸' },
                    { code: 'fr', label: '🇫🇷' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code)}
                      className={`px-2.5 py-1 text-sm font-medium rounded-md transition-all ${
                        locale === lang.code
                          ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md scale-105'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={onBack}
                size="sm"
                className="gap-2 border-teal-300 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t('header.back')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="relative mb-8 sm:mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 dark:from-teal-500/5 dark:to-orange-500/5 rounded-2xl sm:rounded-3xl"></div>
          <div className="relative p-6 sm:p-8 md:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('pageTitle')}
            </h1>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('pageSubtitle')}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-lg transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex gap-2 sm:gap-3 pb-2 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
              }`}
            >
              {t('allCategories')}
            </button>
            {categories.map((category) => {
              const meta = categoryMeta[category.id as keyof typeof categoryMeta];
              const Icon = meta?.icon ?? HelpCircle;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 sm:space-y-8">
          {filteredCategories.length === 0 ? (
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
              <CardContent className="p-8 sm:p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400">{t('noResults')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const meta = categoryMeta[category.id as keyof typeof categoryMeta];
                    const Icon = meta?.icon ?? HelpCircle;
                    const bgClass = meta?.bgClass ?? 'from-teal-600 to-orange-500';
                    return (
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bgClass} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    );
                  })()}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
                  <Badge className="ml-auto">{category.faqs.length}</Badge>
                </div>

                <div className="space-y-3">
                  {category.faqs.map((faq, index) => {
                    const faqId = `${category.id}-${index}`;
                    const isOpen = openFAQs.has(faqId);

                    return (
                      <Card
                        key={faqId}
                        className="border-2 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-lg dark:bg-gray-800"
                      >
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleFAQ(faqId)}
                            className="w-full p-4 sm:p-6 flex items-start justify-between gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base flex-1">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                              <div className="pl-0 border-l-4 border-teal-500 pl-4 py-2">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12">
          <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-2xl dark:bg-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-2"></div>
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('stillHaveQuestions')}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                {t('ctaBody')}
              </p>
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg"
              >
                {t('contactUs')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
