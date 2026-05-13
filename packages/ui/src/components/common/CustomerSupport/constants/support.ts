// Contact information
export const WHATSAPP_NUMBER = '+351912345678';
export const PHONE_NUMBER = '+351221234567';

// Categorized quick replies for better organization
export const QUICK_REPLY_CATEGORIES = [
  {
    title: 'Reservas',
    replies: [
      'Preciso de ajuda com uma reserva',
      'Como faço para alterar minha reserva?',
      'Quero cancelar minha reserva',
    ],
  },
  {
    title: 'Status',
    replies: [
      'Qual é o status do meu pedido?',
      'Quando será minha entrega?',
      'Verificar histórico de pedidos',
    ],
  },
  {
    title: 'Pagamentos',
    replies: [
      'Preciso de informações sobre pagamento',
      'Formas de pagamento disponíveis',
      'Problema com meu pagamento',
    ],
  },
  {
    title: 'Contato',
    replies: ['Falar com atendente humano', 'Informações de contato', 'Horário de atendimento'],
  },
];

// Flattened version for backward compatibility
export const QUICK_REPLIES = QUICK_REPLY_CATEGORIES.flatMap((category) => category.replies);

// Response rules with priorities and patterns
const RESPONSE_RULES = [
  {
    patterns: ['reserva', 'reservar', 'booking'],
    response:
      'Para ajudar com a sua reserva, indique, por favor:\n1. Número da reserva\n2. E-mail usado no registo\n3. Data da reserva',
    priority: 1,
    followUp: {
      question: 'Precisa de ajuda com algo específico na reserva?',
      options: ['Alterar datas', 'Adicionar serviços', 'Cancelar reserva', 'Outro assunto'],
    },
  },
  {
    patterns: ['pagamento', 'pagar', 'payment', 'mb way', 'cartão'],
    response: `Aceitamos várias formas de pagamento:\n💳 Cartão de crédito (Visa, Mastercard)\n🏦 Transferência bancária\n📱 MB Way\n\nComo podemos ajudar com o seu pagamento?`,
    priority: 1,
    followUp: {
      question: 'Selecione uma opção:',
      options: [
        'Problema com transação',
        'Reembolso',
        'Formas de pagamento',
        'Confirmar pagamento',
      ],
    },
  },
  {
    patterns: ['status', 'situação', 'pedido', 'order', 'entrega'],
    response:
      'Para verificar o estado do seu pedido, preciso de:\n🔢 Número do pedido\n📧 E-mail usado no registo\n\nPosso ajudar com isto?',
    priority: 1,
    followUp: {
      question: 'Qual é a natureza da sua consulta?',
      options: ['Atraso na entrega', 'Produto não recebido', 'Status de produção', 'Outro'],
    },
  },
  {
    patterns: ['contato', 'atendente', 'humano', 'falar', 'whatsapp', 'telefone'],
    response: `Claro! Pode contactar-nos por:\n📱 WhatsApp: ${WHATSAPP_NUMBER}\n📞 Telefone: ${PHONE_NUMBER}\n⏰ Horário: seg–sex, 9h–18h\n\nDeseja falar com um atendente agora?`,
    priority: 1,
  },
  {
    patterns: [/^ajuda$/, /^socorro$/, /^suporte$/],
    response: 'Estou aqui para ajudar! Diga como podemos ajudar hoje.',
    priority: 2,
  },
  {
    patterns: [/^olá$/, /^oi$/, /^bom dia$/, /^boa tarde$/, /^boa noite$/],
    response: 'Olá! 😊 Como podemos ajudar hoje?',
    priority: 2,
  },
  {
    patterns: [/.+/],
    response:
      'Obrigado por contactar-nos! Escolha uma opção abaixo ou diga como podemos ajudar:',
    priority: 0,
  },
];

// Get bot response with context handling
export const getBotResponse = (
  message: string,
  context?: { followUp?: { options: string[] } }
): { response: string; followUp?: { question: string; options: string[] } | null } => {
  const normalized = message
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  // Handle follow-up context first
  if (context?.followUp) {
    const optionMatch = context.followUp.options.find((opt: string) =>
      normalized.includes(opt.toLowerCase())
    );

    if (optionMatch) {
      return {
        response: `Perfeito! Selecionou "${optionMatch}". Vou ajudá-lo com isso.`,
        followUp: null,
      };
    }
  }

  // Find all matching rules
  const matches = RESPONSE_RULES.filter((rule) =>
    rule.patterns.some((pattern) =>
      typeof pattern === 'string' ? normalized.includes(pattern) : pattern.test(message)
    )
  );

  // Get best match based on priority
  const bestMatch = matches.sort((a, b) => b.priority - a.priority)[0];

  return {
    response: bestMatch?.response || RESPONSE_RULES.find((r) => r.priority === 0)!.response,
    followUp: bestMatch?.followUp || null,
  };
};

// Example usage:
// const response = getBotResponse('Preciso de ajuda com pagamento');
// console.log(response);
