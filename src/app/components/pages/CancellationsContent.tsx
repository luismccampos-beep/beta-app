import { Badge } from '../ui/badge';
import { CheckCircle2, AlertCircle, Mail, FileText, Clock } from 'lucide-react';
import { useLocale } from 'next-intl';

export function CancellationsContent() {
  const locale = useLocale();
  const content = {
    en: (
      <>
        <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-600 rounded-lg">
          <p className="font-semibold text-lg text-orange-900 dark:text-orange-300 mb-2">IMPORTANT INFORMATION</p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            To ensure transparency, we detail the applicable conditions. We recommend careful reading.
          </p>
        </div>

        <h2>1. General Conditions</h2>
        <ul className="space-y-2 my-4">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>All requests must be made in writing via email.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Calculation is based on the date of receipt of the request.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Service and administrative fees are non-refundable.</span>
          </li>
        </ul>

        <h2>2. Deadlines and Fees (Land Packages)</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Cancellation Period</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Cancellation Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">More than 30 days before</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-green-700 dark:text-green-400">20% retention fee</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3">Between 29 and 15 days before</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-orange-700 dark:text-orange-400">50% retention fee</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Less than 14 days before</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-red-700 dark:text-red-400">No refund</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
            <p className="font-semibold">Cancellation more than 30 days in advance:</p>
            <p className="text-sm mt-1">20% retention fee.</p>
          </div>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r">
            <p className="font-semibold">Cancellation between 29 and 15 days:</p>
            <p className="text-sm mt-1">50% retention fee.</p>
          </div>
          <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r">
            <p className="font-semibold">Cancellation less than 14 days:</p>
            <p className="text-sm mt-1">No refund.</p>
          </div>
        </div>

        <h2>3. Flights</h2>
        <p>Flight cancellation policies are dictated by airlines and may be 100% non-refundable.</p>

        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
          <p className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important
          </p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">
            In case of cancellation due to force majeure (pandemic, natural disasters, etc.), special conditions apply. Contact us for more information.
          </p>
        </div>

        <h2>4. How to Request a Cancellation</h2>
        <p className="mb-4">The process is simple and automatic through your customer area.</p>

        <div className="space-y-4 my-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Contact Support</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                The fastest and safest way is through the official support email.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Provide Details</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Please provide your booking number, full name, and reason for cancellation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Wait for Confirmation</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You will receive an email confirmation with processing details.
              </p>
            </div>
          </div>
        </div>

        <div className="my-6 p-6 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-300 dark:border-teal-700 rounded-lg text-center">
          <Mail className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
          <p className="font-semibold text-lg text-teal-900 dark:text-teal-300">Need additional help?</p>
          <p className="text-sm text-teal-800 dark:text-teal-400 mt-1">Our team is here to help</p>
        </div>

        <h2>5. Frequently Asked Questions</h2>
        <p className="mb-4">Find quick answers to your most common questions.</p>

        <div className="space-y-4 my-4">
          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">1.</span> Can I cancel my booking online?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Yes, you can initiate the cancellation process through your customer area or by contacting our support team via email.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">2.</span> How long does the refund take?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Refunds are typically processed within 14-30 business days after approval, depending on your payment method and financial institution.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">3.</span> Can I modify instead of cancel?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Yes! Modifications may be available depending on your booking conditions. Contact us to explore your options before canceling.
            </p>
          </details>
        </div>

        <div className="my-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 rounded-r">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            Didn't find the answer you were looking for? Contact us
          </p>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Last updated:</strong> April 29, 2026
          </p>
        </div>
      </>
    ),
    pt: (
      <>
        <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-600 rounded-lg">
          <p className="font-semibold text-lg text-orange-900 dark:text-orange-300 mb-2">INFORMAÇÃO IMPORTANTE</p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            Para garantir transparência, detalhamos as condições aplicáveis. Recomendamos uma leitura atenta.
          </p>
        </div>

        <h2>1. Condições Gerais</h2>
        <ul className="space-y-2 my-4">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Todos os pedidos devem ser feitos por escrito via email.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>O cálculo é baseado na data de receção do pedido.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Taxas de serviço e administrativas são não reembolsáveis.</span>
          </li>
        </ul>

        <h2>2. Prazos e Taxas (Pacotes Terrestres)</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Período de Cancelamento</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Taxa de Cancelamento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Mais de 30 dias antes</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-green-700 dark:text-green-400">Taxa de retenção de 20%</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3">Entre 29 e 15 dias antes</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-orange-700 dark:text-orange-400">Taxa de retenção de 50%</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Menos de 14 dias antes</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-red-700 dark:text-red-400">Sem reembolso</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
            <p className="font-semibold">Cancelamento com mais de 30 dias de antecedência:</p>
            <p className="text-sm mt-1">Taxa de retenção de 20%.</p>
          </div>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r">
            <p className="font-semibold">Cancelamento entre 29 e 15 dias:</p>
            <p className="text-sm mt-1">Taxa de retenção de 50%.</p>
          </div>
          <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r">
            <p className="font-semibold">Cancelamento com menos de 14 dias:</p>
            <p className="text-sm mt-1">Sem reembolso.</p>
          </div>
        </div>

        <h2>3. Voos</h2>
        <p>As políticas de cancelamento de voos são ditadas pelas companhias aéreas e podem ser 100% não reembolsáveis.</p>

        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
          <p className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Importante
          </p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">
            Em caso de cancelamento por motivos de força maior (pandemia, catástrofes naturais, etc.), aplicam-se condições especiais. Contacte-nos para mais informações.
          </p>
        </div>

        <h2>4. Como Solicitar um Cancelamento</h2>
        <p className="mb-4">O processo é simples e automático através da sua área de cliente.</p>

        <div className="space-y-4 my-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Contacte o Suporte</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                A forma mais rápida e segura é através do email oficial de suporte.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Forneça os Detalhes</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Por favor, indique o seu número de reserva, nome completo e o motivo do cancelamento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Aguarde Confirmação</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Receberá uma confirmação por email com os detalhes do processamento.
              </p>
            </div>
          </div>
        </div>

        <div className="my-6 p-6 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-300 dark:border-teal-700 rounded-lg text-center">
          <Mail className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
          <p className="font-semibold text-lg text-teal-900 dark:text-teal-300">Precisa de ajuda adicional?</p>
          <p className="text-sm text-teal-800 dark:text-teal-400 mt-1">A nossa equipa está aqui para ajudar</p>
        </div>

        <h2>5. Perguntas Frequentes</h2>
        <p className="mb-4">Encontre respostas rápidas às suas dúvidas mais comuns.</p>

        <div className="space-y-4 my-4">
          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">1.</span> Posso cancelar a minha reserva online?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Sim, pode iniciar o processo de cancelamento através da sua área de cliente ou contactando a nossa equipa de suporte por email.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">2.</span> Quanto tempo demora o reembolso?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Os reembolsos são normalmente processados dentro de 14-30 dias úteis após aprovação, dependendo do seu método de pagamento e instituição financeira.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">3.</span> Posso alterar em vez de cancelar?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Sim! As alterações podem estar disponíveis dependendo das condições da sua reserva. Contacte-nos para explorar as suas opções antes de cancelar.
            </p>
          </details>
        </div>

        <div className="my-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 rounded-r">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            Não encontrou a resposta que procurava? Entre em contacto connosco
          </p>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Última atualização:</strong> 29 de abril de 2026
          </p>
        </div>
      </>
    ),
    es: (
      <>
        <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-600 rounded-lg">
          <p className="font-semibold text-lg text-orange-900 dark:text-orange-300 mb-2">INFORMACIÓN IMPORTANTE</p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            Para garantizar transparencia, detallamos las condiciones aplicables. Recomendamos una lectura atenta.
          </p>
        </div>

        <h2>1. Condiciones Generales</h2>
        <ul className="space-y-2 my-4">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Todas las solicitudes deben realizarse por escrito por correo electrónico.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>El cálculo se basa en la fecha de recepción de la solicitud.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Las tarifas de servicio y administrativas no son reembolsables.</span>
          </li>
        </ul>

        <h2>2. Plazos y Tarifas</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Período de Cancelación</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Tarifa de Cancelación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Más de 30 días antes</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-green-700 dark:text-green-400">Tarifa de retención del 20%</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3">Entre 29 y 15 días antes</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-orange-700 dark:text-orange-400">Tarifa de retención del 50%</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Menos de 14 días antes</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-red-700 dark:text-red-400">Sin reembolso</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
            <p className="font-semibold">Cancelación con más de 30 días de antelación:</p>
            <p className="text-sm mt-1">Tarifa de retención del 20%.</p>
          </div>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r">
            <p className="font-semibold">Cancelación entre 29 y 15 días:</p>
            <p className="text-sm mt-1">Tarifa de retención del 50%.</p>
          </div>
          <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r">
            <p className="font-semibold">Cancelación con menos de 14 días:</p>
            <p className="text-sm mt-1">Sin reembolso.</p>
          </div>
        </div>

        <h2>3. Vuelos</h2>
        <p>Las políticas de cancelación de vuelos son dictadas por las aerolíneas y pueden ser 100% no reembolsables.</p>

        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
          <p className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Importante
          </p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">
            En caso de cancelación por fuerza mayor (pandemia, desastres naturales, etc.), se aplican condiciones especiales. Contáctenos para más información.
          </p>
        </div>

        <h2>4. Cómo Solicitar una Cancelación</h2>
        <p className="mb-4">El proceso es sencillo y automático a través de su área de cliente.</p>

        <div className="space-y-4 my-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Contacte al Soporte</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                La forma más rápida y segura es a través del correo electrónico de soporte oficial.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Proporcione los Detalles</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Por favor, indique su número de reserva, nombre completo y el motivo de la cancelación.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Espere la Confirmación</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Recibirá una confirmación por correo electrónico con los detalles del procesamiento.
              </p>
            </div>
          </div>
        </div>

        <div className="my-6 p-6 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-300 dark:border-teal-700 rounded-lg text-center">
          <Mail className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
          <p className="font-semibold text-lg text-teal-900 dark:text-teal-300">¿Necesita ayuda adicional?</p>
          <p className="text-sm text-teal-800 dark:text-teal-400 mt-1">Nuestro equipo está aquí para ayudarle</p>
        </div>

        <h2>5. Preguntas Frecuentes</h2>
        <p className="mb-4">Encuentre respuestas rápidas a sus preguntas más comunes.</p>

        <div className="space-y-4 my-4">
          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">1.</span> ¿Puedo cancelar mi reserva en línea?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Sí, puede iniciar el proceso de cancelación a través de su área de cliente o contactando a nuestro equipo de soporte por correo electrónico.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">2.</span> ¿Cuánto tiempo tarda el reembolso?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Los reembolsos se procesan normalmente dentro de 14-30 días hábiles después de la aprobación, dependiendo de su método de pago y entidad financiera.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">3.</span> ¿Puedo modificar en lugar de cancelar?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              ¡Sí! Las modificaciones pueden estar disponibles dependiendo de las condiciones de su reserva. Contáctenos para explorar sus opciones antes de cancelar.
            </p>
          </details>
        </div>

        <div className="my-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 rounded-r">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            ¿No encontró la respuesta que buscaba? Contáctenos
          </p>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Última actualización:</strong> 29 de abril de 2026
          </p>
        </div>
      </>
    ),
    fr: (
      <>
        <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-600 rounded-lg">
          <p className="font-semibold text-lg text-orange-900 dark:text-orange-300 mb-2">INFORMATION IMPORTANTE</p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            Pour garantir la transparence, nous détaillons les conditions applicables. Nous recommandons une lecture attentive.
          </p>
        </div>

        <h2>1. Conditions Générales</h2>
        <ul className="space-y-2 my-4">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Toutes les demandes doivent être faites par écrit par e-mail.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Le calcul est basé sur la date de réception de la demande.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Les frais de service et administratifs ne sont pas remboursables.</span>
          </li>
        </ul>

        <h2>2. Délais et Frais</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Période d'Annulation</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Frais d'Annulation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Plus de 30 jours avant</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-green-700 dark:text-green-400">Frais de rétention de 20%</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3">Entre 29 et 15 jours avant</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-orange-700 dark:text-orange-400">Frais de rétention de 50%</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Moins de 14 jours avant</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-red-700 dark:text-red-400">Aucun remboursement</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
            <p className="font-semibold">Annulation plus de 30 jours à l'avance :</p>
            <p className="text-sm mt-1">Frais de rétention de 20%.</p>
          </div>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r">
            <p className="font-semibold">Annulation entre 29 et 15 jours :</p>
            <p className="text-sm mt-1">Frais de rétention de 50%.</p>
          </div>
          <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r">
            <p className="font-semibold">Annulation moins de 14 jours :</p>
            <p className="text-sm mt-1">Aucun remboursement.</p>
          </div>
        </div>

        <h2>3. Vols</h2>
        <p>Les politiques d'annulation des vols sont dictées par les compagnies aériennes et peuvent être 100% non remboursables.</p>

        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
          <p className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important
          </p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">
            En cas d'annulation pour cause de force majeure (pandémie, catastrophes naturelles, etc.), des conditions spéciales s'appliquent. Contactez-nous pour plus d'informations.
          </p>
        </div>

        <h2>4. Comment Demander une Annulation</h2>
        <p className="mb-4">Le processus est simple et automatique via votre espace client.</p>

        <div className="space-y-4 my-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Contactez le Support</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Le moyen le plus rapide et le plus sûr est l'email de support officiel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Fournissez les Détails</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Veuillez fournir votre numéro de réservation, votre nom complet et le motif de l'annulation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Attendez la Confirmation</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Vous recevrez une confirmation par email avec les détails du traitement.
              </p>
            </div>
          </div>
        </div>

        <div className="my-6 p-6 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-300 dark:border-teal-700 rounded-lg text-center">
          <Mail className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
          <p className="font-semibold text-lg text-teal-900 dark:text-teal-300">Besoin d'aide supplémentaire ?</p>
          <p className="text-sm text-teal-800 dark:text-teal-400 mt-1">Notre équipe est là pour vous aider</p>
        </div>

        <h2>5. Questions Fréquentes</h2>
        <p className="mb-4">Trouvez des réponses rapides à vos questions les plus courantes.</p>

        <div className="space-y-4 my-4">
          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">1.</span> Puis-je annuler ma réservation en ligne ?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Oui, vous pouvez initier le processus d'annulation via votre espace client ou en contactant notre équipe de support par email.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">2.</span> Combien de temps prend le remboursement ?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Les remboursements sont généralement traités dans un délai de 14 à 30 jours ouvrables après approbation, selon votre mode de paiement et votre institution financière.
            </p>
          </details>

          <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">3.</span> Puis-je modifier au lieu d'annuler ?
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">
              Oui ! Les modifications peuvent être disponibles selon les conditions de votre réservation. Contactez-nous pour explorer vos options avant d'annuler.
            </p>
          </details>
        </div>

        <div className="my-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 rounded-r">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            Vous n'avez pas trouvé la réponse que vous cherchiez ? Contactez-nous
          </p>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Dernière mise à jour :</strong> 29 avril 2026
          </p>
        </div>
      </>
    )
  };

  return content[(locale as keyof typeof content) ?? 'en'] ?? content.en;
}
