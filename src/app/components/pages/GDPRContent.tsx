import { Badge } from '../ui/badge';
import { CheckCircle2, Shield } from 'lucide-react';
import { useLocale } from 'next-intl';

export function GDPRContent() {
  const locale = useLocale();
  const content = {
    en: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            AKMLEVA is committed to protecting your privacy and personal data in compliance with the General Data Protection Regulation (GDPR). This document explains how we collect, use, store, and protect your personal information.
          </p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Full Transparency
            </Badge>
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
              <Shield className="w-3 h-3 mr-1" />
              GDPR Compliant
            </Badge>
          </div>
        </div>

        <h2>1. Data Controller</h2>
        <p>AKMLEVA - Travel and Tourism Agency, Ltd. is the entity responsible for processing your personal data under GDPR terms.</p>
        <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Entity:</strong> AKMLEVA - Travel and Tourism Agency, Ltd.</div>
            <div><strong>Email:</strong> privacy@akmleva.pt</div>
            <div><strong>Phone:</strong> +351 123 456 789</div>
            <div><strong>Address:</strong> R. São Nicolau 9, 4520-248 Santa Maria da Feira, Portugal</div>
          </div>
          <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">These contacts are exclusively for personal data protection matters.</p>
        </div>

        <h2>2. Categories of Personal Data Processed</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Category</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Examples</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Identification Data</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Full name, email, phone, ID document, date of birth</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">5 years after last interaction</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Contact Data</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Postal address, phone, email, communication preferences</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">3 years after last interaction</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Booking Data</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Travel details, accommodation preferences, payment info, booking history</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">7 years for tax purposes</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Technical Data</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">IP address, cookies, browsing data, device used, approximate geolocation</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">2 years or until consent withdrawn</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">Retention periods may be longer when required by law or shorter in case of rights exercise by the data subject.</p>
        </div>

        <h2>3. Processing Purposes</h2>
        <p>We process your personal data only for specific, explicit, and legitimate purposes in compliance with GDPR.</p>
        <div className="space-y-4 my-4">
          <div className="p-4 border-l-4 border-teal-500 bg-teal-50 dark:bg-teal-900/20 rounded-r">
            <p className="font-semibold text-lg">Tourism Services</p>
            <p className="text-sm mt-1">Processing bookings, client communication, travel and tourism services.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Legal Basis:</strong> Contract execution</p>
          </div>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r">
            <p className="font-semibold text-lg">Marketing and Communication</p>
            <p className="text-sm mt-1">Newsletters, special offers, promotional communications, satisfaction surveys.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Legal Basis:</strong> Consent</p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
            <p className="font-semibold text-lg">Legal Obligations</p>
            <p className="text-sm mt-1">Tax, accounting, and regulatory compliance in tourism sector.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Legal Basis:</strong> Legal obligation</p>
          </div>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r">
            <p className="font-semibold text-lg">Legitimate Interests</p>
            <p className="text-sm mt-1">Service improvement, data analysis for customer experience optimization.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Legal Basis:</strong> Legitimate interest</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">We do not process your data for purposes incompatible with those described here without a new legal basis or your explicit consent.</p>

        <h2>4. Your GDPR Rights</h2>
        <p>GDPR grants you several powerful rights over your personal data. You can exercise them at any time by contacting us through the contacts indicated in the "Data Controller" section.</p>
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right of Access
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Request information about personal data we process about you.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right to Rectification
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Request correction of incorrect or incomplete personal data.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right to Erasure
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Request deletion of your personal data in certain circumstances.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right to Restriction
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Request limitation of processing your personal data.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right to Portability
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Request transfer of your data to another service provider.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right to Object
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Object to processing of your personal data in certain situations.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right to Withdraw Consent
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Withdraw your consent at any time, when applicable.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Right to Lodge a Complaint
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Lodge a complaint with the National Data Protection Commission (CNPD).</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">To exercise any of these rights, simply contact us at privacy@akmleva.pt. We will respond within a maximum of one month (extendable in complex cases).</p>

        <h2>5. Data Security</h2>
        <p>We adopt adequate and updated technical and organizational measures to ensure a level of security proportional to the risk, in compliance with Article 32 of GDPR.</p>
        <ul className="space-y-2 my-4">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Encryption of data in transit and at rest (SSL/TLS)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Role-based access control and multi-factor authentication</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Continuous security monitoring and intrusion detection</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Regular employee training in data protection</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Periodic security audits and impact assessments</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Secure backup and disaster recovery plans</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Pseudonymization and data minimization whenever possible</span>
          </li>
        </ul>
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r">
          <p className="text-sm text-gray-700 dark:text-gray-300">Despite implemented measures, no system is 100% immune to risks. In case of data breach, we will notify the supervisory authority and affected individuals within legal timeframes.</p>
        </div>

        <h2>6. Contact and Exercise of Rights</h2>
        <p>To exercise any of your rights under GDPR or clarify doubts about processing your personal data, you can contact us through the following means:</p>
        <div className="my-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
            <div><strong>General Email:</strong> privacy@akmleva.pt</div>
            <div><strong>Phone:</strong> +351 123 456 789</div>
            <div className="md:col-span-2"><strong>Data Protection Officer (DPO):</strong> dpo@akmleva.pt</div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">We will respond as quickly as possible and always within the legal timeframes provided in GDPR.</p>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="font-semibold text-blue-900 dark:text-blue-300"><strong>In force since:</strong> May 25, 2018</p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">This document is fully compliant with Regulation (EU) 2016/679 (GDPR) and applicable national legislation.</p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400 italic">Commitment to transparency and protection of your rights.</p>
        </div>
      </>
    ),
    pt: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            A AKMLEVA está comprometida com a proteção da sua privacidade e dos seus dados pessoais, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD). Este documento explica como recolhemos, utilizamos, armazenamos e protegemos as suas informações pessoais.
          </p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Transparência total
            </Badge>
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
              <Shield className="w-3 h-3 mr-1" />
              Conformidade RGPD
            </Badge>
          </div>
        </div>

        <h2>1. Responsável pelo Tratamento de Dados</h2>
        <p>A AKMLEVA - Agência de Viagens e Turismo, Lda. é a entidade responsável pelo tratamento dos seus dados pessoais, nos termos do RGPD.</p>
        <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Entidade:</strong> AKMLEVA - Agência de Viagens e Turismo, Lda.</div>
            <div><strong>Email:</strong> privacy@akmleva.pt</div>
            <div><strong>Telefone:</strong> +351 123 456 789</div>
            <div><strong>Morada:</strong> Rua São Nicolau 9, 4520-248 Santa Maria da Feira, Portugal</div>
          </div>
          <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">Estes contactos destinam-se exclusivamente a questões relacionadas com proteção de dados pessoais.</p>
        </div>

        <h2>2. Categorias de Dados Pessoais Tratados</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Categoria</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Exemplos</th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Período de Retenção</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Dados de Identificação</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Nome completo, email, número de telefone, documento de identificação, data de nascimento</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">5 anos após última interação</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Dados de Contacto</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Endereço postal, número de telefone, email, preferências de comunicação</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">3 anos após última interação</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Dados de Reserva</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Detalhes da viagem, preferências de alojamento, informações de pagamento, histórico de reservas</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">7 anos para fins fiscais</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">Dados Técnicos</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">Endereço IP, cookies, dados de navegação, dispositivo utilizado, dados de geolocalização aproximada</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">2 anos ou até revogação do consentimento</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">Os prazos de retenção podem ser superiores quando exigido por lei ou inferiores em caso de exercício de direitos do titular.</p>
        </div>

        <h2>3. Finalidades do Tratamento de Dados</h2>
        <p>Tratamos os seus dados pessoais apenas para finalidades específicas, explícitas e legítimas, em conformidade com o Regulamento Geral de Proteção de Dados (RGPD).</p>
        <div className="space-y-4 my-4">
          <div className="p-4 border-l-4 border-teal-500 bg-teal-50 dark:bg-teal-900/20 rounded-r">
            <p className="font-semibold text-lg">Prestação de Serviços Turísticos</p>
            <p className="text-sm mt-1">Processamento de reservas, comunicação com clientes, prestação de serviços de viagem e turismo.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Base Legal:</strong> Execução de contrato</p>
          </div>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r">
            <p className="font-semibold text-lg">Marketing e Comunicação</p>
            <p className="text-sm mt-1">Envio de newsletters, ofertas especiais, comunicações promocionais e pesquisas de satisfação.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Base Legal:</strong> Consentimento</p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
            <p className="font-semibold text-lg">Cumprimento de Obrigações Legais</p>
            <p className="text-sm mt-1">Cumprimento de obrigações fiscais, contabilísticas e regulamentares do setor turístico.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Base Legal:</strong> Obrigação legal</p>
          </div>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r">
            <p className="font-semibold text-lg">Interesses Legítimos</p>
            <p className="text-sm mt-1">Melhoria dos nossos serviços, análise de dados para otimização da experiência do cliente.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>Base Legal:</strong> Interesse legítimo</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Não tratamos os seus dados para finalidades incompatíveis com as aqui descritas sem uma nova base legal ou o seu consentimento explícito.</p>

        <h2>4. Os Seus Direitos ao Abrigo do RGPD</h2>
        <p>O RGPD garante-lhe vários direitos poderosos sobre os seus dados pessoais. Pode exercê-los a qualquer momento contactando-nos através dos contactos indicados na secção "Responsável pelo Tratamento".</p>
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito de Acesso
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode solicitar informações sobre os dados pessoais que processamos sobre si.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito de Retificação
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode solicitar a correção de dados pessoais incorretos ou incompletos.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito ao Apagamento
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode solicitar a eliminação dos seus dados pessoais em certas circunstâncias.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito à Limitação do Tratamento
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode solicitar a limitação do processamento dos seus dados pessoais.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito à Portabilidade
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode solicitar a transferência dos seus dados para outro prestador de serviços.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito de Oposição
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode opor-se ao tratamento dos seus dados pessoais em determinadas situações.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito de Retirar o Consentimento
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode retirar o seu consentimento a qualquer momento, quando aplicável.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Direito de Apresentar Reclamação
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Pode apresentar uma reclamação à Comissão Nacional de Proteção de Dados (CNPD).</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Para exercer qualquer um destes direitos, basta contactar-nos através do email privacy@akmleva.pt. Responderemos no prazo máximo de um mês (prorrogável em casos complexos).</p>

        <h2>5. Segurança dos Dados</h2>
        <p>Adotamos medidas técnicas e organizacionais adequadas e atualizadas para garantir um nível de segurança proporcional ao risco, em conformidade com o artigo 32.º do RGPD.</p>
        <ul className="space-y-2 my-4">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Encriptação de dados em trânsito e em repouso (SSL/TLS)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Controlo de acesso baseado em funções e autenticação multi-fator</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Monitorização contínua de segurança e deteção de intrusões</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Formação regular dos colaboradores em proteção de dados</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Auditorias de segurança e avaliações de impacto periódicas</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Backup seguro e planos de recuperação de desastres</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <span>Pseudonimização e minimização de dados sempre que possível</span>
          </li>
        </ul>
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r">
          <p className="text-sm text-gray-700 dark:text-gray-300">Apesar das medidas implementadas, nenhum sistema é 100% imune a riscos. Em caso de violação de dados, notificaremos a autoridade de controlo e os titulares afetados dentro dos prazos legais.</p>
        </div>

        <h2>6. Contacto e Exercício de Direitos</h2>
        <p>Para exercer qualquer dos seus direitos ao abrigo do RGPD ou esclarecer dúvidas sobre o tratamento dos seus dados pessoais, pode contactar-nos através dos seguintes meios:</p>
        <div className="my-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
            <div><strong>Email geral:</strong> privacy@akmleva.pt</div>
            <div><strong>Telefone:</strong> +351 123 456 789</div>
            <div className="md:col-span-2"><strong>Encarregado de Proteção de Dados (DPO):</strong> dpo@akmleva.pt</div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Responderemos com a maior brevidade possível e sempre dentro dos prazos legais previstos no RGPD.</p>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="font-semibold text-blue-900 dark:text-blue-300"><strong>Em vigor desde:</strong> 25 de Maio de 2018</p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">Este documento está plenamente em conformidade com o Regulamento (UE) 2016/679 (RGPD/GDPR) e legislação nacional aplicável.</p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400 italic">Compromisso com transparência e proteção dos seus direitos.</p>
        </div>
      </>
    ),
    es: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            AKMLEVA está comprometida con la protección de su privacidad y datos personales en cumplimiento del Reglamento General de Protección de Datos (RGPD). Este documento explica cómo recopilamos, utilizamos, almacenamos y protegemos su información personal.
          </p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Transparencia total
            </Badge>
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
              <Shield className="w-3 h-3 mr-1" />
              Cumplimiento RGPD
            </Badge>
          </div>
        </div>

        <h2>1. Responsable del Tratamiento de Datos</h2>
        <p>AKMLEVA - Agencia de Viajes y Turismo, Ltd. es la entidad responsable del tratamiento de sus datos personales según los términos del RGPD.</p>
        <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Entidad:</strong> AKMLEVA - Agencia de Viajes y Turismo, Ltd.</div>
            <div><strong>Email:</strong> privacy@akmleva.pt</div>
            <div><strong>Teléfono:</strong> +351 123 456 789</div>
            <div><strong>Dirección:</strong> R. São Nicolau 9, 4520-248 Santa Maria da Feira, Portugal</div>
          </div>
          <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">Estos contactos son exclusivamente para cuestiones relacionadas con protección de datos personales.</p>
        </div>

        <h2>2. Sus Derechos RGPD</h2>
        <p>El RGPD le otorga varios derechos poderosos sobre sus datos personales.</p>
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Derecho de Acceso
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Solicitar información sobre datos personales que procesamos sobre usted.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Derecho de Rectificación
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Solicitar corrección de datos personales incorrectos o incompletos.</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Para ejercer cualquiera de estos derechos, simplemente contáctenos en privacy@akmleva.pt.</p>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="font-semibold text-blue-900 dark:text-blue-300"><strong>En vigor desde:</strong> 25 de Mayo de 2018</p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">Este documento cumple plenamente con el Reglamento (UE) 2016/679 (RGPD) y la legislación nacional aplicable.</p>
        </div>
      </>
    ),
    fr: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            AKMLEVA s'engage à protéger votre vie privée et vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD). Ce document explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles.
          </p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Transparence totale
            </Badge>
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
              <Shield className="w-3 h-3 mr-1" />
              Conformité RGPD
            </Badge>
          </div>
        </div>

        <h2>1. Responsable du Traitement</h2>
        <p>AKMLEVA - Agence de Voyages et Tourisme, Ltd. est l'entité responsable du traitement de vos données personnelles selon les termes du RGPD.</p>
        <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Entité:</strong> AKMLEVA - Agence de Voyages et Tourisme, Ltd.</div>
            <div><strong>Email:</strong> privacy@akmleva.pt</div>
            <div><strong>Téléphone:</strong> +351 123 456 789</div>
            <div><strong>Adresse:</strong> R. São Nicolau 9, 4520-248 Santa Maria da Feira, Portugal</div>
          </div>
          <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">Ces contacts sont exclusivement pour les questions liées à la protection des données personnelles.</p>
        </div>

        <h2>2. Vos Droits RGPD</h2>
        <p>Le RGPD vous accorde plusieurs droits puissants sur vos données personnelles.</p>
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Droit d'Accès
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Demander des informations sur les données personnelles que nous traitons vous concernant.</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              Droit de Rectification
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">Demander la correction de données personnelles incorrectes ou incomplètes.</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Pour exercer l'un de ces droits, contactez-nous simplement à privacy@akmleva.pt.</p>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="font-semibold text-blue-900 dark:text-blue-300"><strong>En vigueur depuis:</strong> 25 mai 2018</p>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">Ce document est pleinement conforme au Règlement (UE) 2016/679 (RGPD) et à la législation nationale applicable.</p>
        </div>
      </>
    )
  };

  return content[(locale as keyof typeof content) ?? 'en'] ?? content.en;
}
