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
        response: 'Para ajudar com sua reserva, por favor, me informe:\n1. Número da reserva\n2. E-mail usado no cadastro\n3. Data da reserva',
        priority: 1,
        followUp: {
            question: 'Precisa de ajuda com algo específico na reserva?',
            options: ['Alterar datas', 'Adicionar serviços', 'Cancelar reserva', 'Outro assunto'],
        },
    },
    {
        patterns: ['pagamento', 'pagar', 'payment', 'mb way', 'cartão'],
        response: `Aceitamos várias formas de pagamento:\n💳 Cartão de crédito (Visa, Mastercard)\n🏦 Transferência bancária\n📱 MB Way\n\nComo posso ajudar com seu pagamento?`,
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
        response: 'Para verificar o status do seu pedido, preciso de:\n🔢 Número do pedido\n📧 E-mail de cadastro\n\nPosso ajudar com isso?',
        priority: 1,
        followUp: {
            question: 'Qual é a natureza da sua consulta?',
            options: ['Atraso na entrega', 'Produto não recebido', 'Status de produção', 'Outro'],
        },
    },
    {
        patterns: ['contato', 'atendente', 'humano', 'falar', 'whatsapp', 'telefone'],
        response: `Claro! Você pode entrar em contato por:\n📱 WhatsApp: ${WHATSAPP_NUMBER}\n📞 Telefone: ${PHONE_NUMBER}\n⏰ Horário: Seg-Sex 9h-18h\n\nDeseja que eu conecte você com um atendente agora?`,
        priority: 1,
    },
    {
        patterns: [/^ajuda$/, /^socorro$/, /^suporte$/],
        response: 'Estou aqui para ajudar! Por favor, me diga como posso assistir você hoje.',
        priority: 2,
    },
    {
        patterns: [/^olá$/, /^oi$/, /^bom dia$/, /^boa tarde$/, /^boa noite$/],
        response: 'Olá! 😊 Como posso ajudar você hoje?',
        priority: 2,
    },
    {
        patterns: [/.+/],
        response: 'Obrigado por entrar em contato! Por favor, escolha uma opção abaixo ou me diga como posso ajudar:',
        priority: 0,
    },
];
// Get bot response with context handling
export const getBotResponse = (message, context) => {
    const normalized = message
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    // Handle follow-up context first
    if (context?.followUp) {
        const optionMatch = context.followUp.options.find((opt) => normalized.includes(opt.toLowerCase()));
        if (optionMatch) {
            return {
                response: `Entendido! Você selecionou "${optionMatch}". Vou te ajudar com isso.`,
                followUp: null,
            };
        }
    }
    // Find all matching rules
    const matches = RESPONSE_RULES.filter((rule) => rule.patterns.some((pattern) => typeof pattern === 'string' ? normalized.includes(pattern) : pattern.test(message)));
    // Get best match based on priority
    const bestMatch = matches.sort((a, b) => b.priority - a.priority)[0];
    return {
        response: bestMatch?.response || RESPONSE_RULES.find((r) => r.priority === 0).response,
        followUp: bestMatch?.followUp || null,
    };
};
// Example usage:
// const response = getBotResponse('Preciso de ajuda com pagamento');
// console.log(response);
//# sourceMappingURL=support.js.map