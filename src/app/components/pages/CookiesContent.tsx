import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useLocale } from 'next-intl';

export function CookiesContent() {
  const locale = useLocale();
  const content = {
    en: (
      <>
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              This Cookies Policy explains how AKMLEVA uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control our use of them.
            </p>
          </div>
        </div>

        <h2>1. What Are Cookies?</h2>
        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>
        <p>Cookies set by the website owner (in this case, AKMLEVA) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies."</p>

        <h2>2. Why Do We Use Cookies?</h2>
        <p>We use first-party and third-party cookies for several reasons:</p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
          <li><strong>Functional cookies:</strong> Remember your preferences and choices</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
          <li><strong>Marketing cookies:</strong> Deliver relevant advertisements and measure campaign effectiveness</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>

        <div className="space-y-6 my-6">
          <div className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Essential Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              These cookies are strictly necessary for the website to function and cannot be switched off.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-green-600 dark:border-green-400">
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Cookie Name</th>
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Purpose</th>
                    <th className="text-left py-2 font-semibold text-green-900 dark:text-green-200">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">session_id</td>
                    <td className="py-2 pr-4">Maintains your session state</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">csrf_token</td>
                    <td className="py-2 pr-4">Security protection</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">cookie_consent</td>
                    <td className="py-2 pr-4">Stores your cookie preferences</td>
                    <td className="py-2">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Functional Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              These cookies enable enhanced functionality and personalization.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-600 dark:border-blue-400">
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Cookie Name</th>
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Purpose</th>
                    <th className="text-left py-2 font-semibold text-blue-900 dark:text-blue-200">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">language_pref</td>
                    <td className="py-2 pr-4">Remembers your language choice</td>
                    <td className="py-2">12 months</td>
                  </tr>
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">theme_mode</td>
                    <td className="py-2 pr-4">Stores dark/light mode preference</td>
                    <td className="py-2">12 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">currency_pref</td>
                    <td className="py-2 pr-4">Remembers currency selection</td>
                    <td className="py-2">6 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Analytics Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              These cookies help us understand how visitors use our website.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary dark:border-primary-300">
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Service</th>
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Purpose</th>
                    <th className="text-left py-2 font-semibold text-primary-900 dark:text-primary-200">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-primary-200 dark:border-primary-700">
                    <td className="py-2 pr-4 font-medium">Google Analytics</td>
                    <td className="py-2 pr-4">Website usage statistics</td>
                    <td className="py-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Hotjar</td>
                    <td className="py-2 pr-4">User behavior analysis</td>
                    <td className="py-2">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-accent-50 dark:bg-accent-700/20 border-l-4 border-accent rounded-lg">
            <h3 className="text-lg font-semibold text-accent-700 dark:text-accent-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Marketing Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              These cookies track your online activity to deliver relevant advertisements.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-accent dark:border-accent-200">
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Service</th>
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Purpose</th>
                    <th className="text-left py-2 font-semibold text-accent-700 dark:text-accent-200">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Google Ads</td>
                    <td className="py-2 pr-4">Targeted advertising</td>
                    <td className="py-2">2 years</td>
                  </tr>
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Facebook Pixel</td>
                    <td className="py-2 pr-4">Remarketing and analytics</td>
                    <td className="py-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">LinkedIn Insight</td>
                    <td className="py-2 pr-4">B2B marketing campaigns</td>
                    <td className="py-2">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2>4. How to Control Cookies</h2>
        <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:</p>

        <div className="ml-6 space-y-4 my-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Cookie Consent Banner</p>
            <p className="text-gray-700 dark:text-gray-300">When you first visit our website, you can choose which categories of cookies to accept through our consent banner.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Browser Settings</p>
            <p className="text-gray-700 dark:text-gray-300">Most web browsers allow you to control cookies through their settings. However, blocking all cookies may impact your ability to use certain features of our website.</p>
            <ul className="mt-2 ml-4">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Third-Party Opt-Out</p>
            <p className="text-gray-700 dark:text-gray-300">You can opt out of third-party cookies through:</p>
            <ul className="mt-2 ml-4">
              <li>Your Online Choices: <a href="https://www.youronlinechoices.com/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">www.youronlinechoices.com</a></li>
              <li>Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
              <li>Digital Advertising Alliance: <a href="https://optout.aboutads.info/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
            </ul>
          </div>
        </div>

        <h2>5. Updates to This Policy</h2>
        <p>We may update this Cookies Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies.</p>

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Last updated:</strong> April 29, 2026
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            For questions about our use of cookies, please contact us at: <a href="mailto:privacy@akmleva.pt" className="text-primary dark:text-primary-300 hover:underline">privacy@akmleva.pt</a>
          </p>
        </div>
      </>
    ),
    pt: (
      <>
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              Esta Política de Cookies explica como a AKMLEVA utiliza cookies e tecnologias similares para reconhecê-lo quando visita o nosso website. Explica o que são estas tecnologias, porque as utilizamos e os seus direitos para controlar o nosso uso das mesmas.
            </p>
          </div>
        </div>

        <h2>1. O Que São Cookies?</h2>
        <p>Cookies são pequenos ficheiros de texto que são colocados no seu computador ou dispositivo móvel quando visita um website. São amplamente utilizados para fazer os websites funcionarem de forma mais eficiente e fornecer informações aos proprietários do website.</p>
        <p>Os cookies definidos pelo proprietário do website (neste caso, AKMLEVA) são chamados "cookies próprios". Os cookies definidos por terceiros que não o proprietário do website são chamados "cookies de terceiros".</p>

        <h2>2. Porque Utilizamos Cookies?</h2>
        <p>Utilizamos cookies próprios e de terceiros por várias razões:</p>
        <ul>
          <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento adequado do website</li>
          <li><strong>Cookies funcionais:</strong> Lembram as suas preferências e escolhas</li>
          <li><strong>Cookies analíticos:</strong> Ajudam-nos a compreender como os visitantes interagem com o nosso website</li>
          <li><strong>Cookies de marketing:</strong> Entregam anúncios relevantes e medem a eficácia das campanhas</li>
        </ul>

        <h2>3. Tipos de Cookies Que Utilizamos</h2>

        <div className="space-y-6 my-6">
          <div className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Cookies Essenciais
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estes cookies são estritamente necessários para o funcionamento do website e não podem ser desativados.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-green-600 dark:border-green-400">
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Nome do Cookie</th>
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Finalidade</th>
                    <th className="text-left py-2 font-semibold text-green-900 dark:text-green-200">Duração</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">session_id</td>
                    <td className="py-2 pr-4">Mantém o estado da sua sessão</td>
                    <td className="py-2">Sessão</td>
                  </tr>
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">csrf_token</td>
                    <td className="py-2 pr-4">Proteção de segurança</td>
                    <td className="py-2">Sessão</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">cookie_consent</td>
                    <td className="py-2 pr-4">Armazena as suas preferências de cookies</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Cookies Funcionais
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estes cookies permitem funcionalidade melhorada e personalização.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-600 dark:border-blue-400">
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Nome do Cookie</th>
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Finalidade</th>
                    <th className="text-left py-2 font-semibold text-blue-900 dark:text-blue-200">Duração</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">language_pref</td>
                    <td className="py-2 pr-4">Lembra a sua escolha de idioma</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">theme_mode</td>
                    <td className="py-2 pr-4">Armazena preferência de modo escuro/claro</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">currency_pref</td>
                    <td className="py-2 pr-4">Lembra a seleção de moeda</td>
                    <td className="py-2">6 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Cookies Analíticos
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estes cookies ajudam-nos a compreender como os visitantes utilizam o nosso website.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary dark:border-primary-300">
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Serviço</th>
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Finalidade</th>
                    <th className="text-left py-2 font-semibold text-primary-900 dark:text-primary-200">Duração</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-primary-200 dark:border-primary-700">
                    <td className="py-2 pr-4 font-medium">Google Analytics</td>
                    <td className="py-2 pr-4">Estatísticas de uso do website</td>
                    <td className="py-2">2 anos</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Hotjar</td>
                    <td className="py-2 pr-4">Análise de comportamento do utilizador</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-accent-50 dark:bg-accent-700/20 border-l-4 border-accent rounded-lg">
            <h3 className="text-lg font-semibold text-accent-700 dark:text-accent-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Cookies de Marketing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estes cookies rastreiam a sua atividade online para fornecer anúncios relevantes.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-accent dark:border-accent-200">
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Serviço</th>
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Finalidade</th>
                    <th className="text-left py-2 font-semibold text-accent-700 dark:text-accent-200">Duração</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Google Ads</td>
                    <td className="py-2 pr-4">Publicidade direcionada</td>
                    <td className="py-2">2 anos</td>
                  </tr>
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Facebook Pixel</td>
                    <td className="py-2 pr-4">Remarketing e análise</td>
                    <td className="py-2">2 anos</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">LinkedIn Insight</td>
                    <td className="py-2 pr-4">Campanhas de marketing B2B</td>
                    <td className="py-2">2 anos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2>4. Como Controlar Cookies</h2>
        <p>Tem o direito de decidir se aceita ou rejeita cookies. Pode exercer as suas preferências de cookies através de:</p>

        <div className="ml-6 space-y-4 my-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Banner de Consentimento de Cookies</p>
            <p className="text-gray-700 dark:text-gray-300">Quando visita o nosso website pela primeira vez, pode escolher quais categorias de cookies aceitar através do nosso banner de consentimento.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Definições do Navegador</p>
            <p className="text-gray-700 dark:text-gray-300">A maioria dos navegadores web permite controlar cookies através das suas definições. No entanto, bloquear todos os cookies pode afetar a sua capacidade de usar certas funcionalidades do nosso website.</p>
            <ul className="mt-2 ml-4">
              <li><strong>Chrome:</strong> Definições → Privacidade e Segurança → Cookies e outros dados do site</li>
              <li><strong>Firefox:</strong> Preferências → Privacidade e Segurança → Cookies e Dados do Site</li>
              <li><strong>Safari:</strong> Preferências → Privacidade → Gerir Dados do Website</li>
              <li><strong>Edge:</strong> Definições → Privacidade, pesquisa e serviços → Cookies</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Exclusão de Terceiros</p>
            <p className="text-gray-700 dark:text-gray-300">Pode optar por não receber cookies de terceiros através de:</p>
            <ul className="mt-2 ml-4">
              <li>Your Online Choices: <a href="https://www.youronlinechoices.com/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">www.youronlinechoices.com</a></li>
              <li>Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
              <li>Digital Advertising Alliance: <a href="https://optout.aboutads.info/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
            </ul>
          </div>
        </div>

        <h2>5. Atualizações a Esta Política</h2>
        <p>Podemos atualizar esta Política de Cookies de tempos a tempos para refletir alterações nas nossas práticas ou por outras razões operacionais, legais ou regulamentares. Por favor, revisite esta página regularmente para se manter informado sobre o nosso uso de cookies.</p>

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Última atualização:</strong> 29 de Abril de 2026
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Para questões sobre o nosso uso de cookies, por favor contacte-nos em: <a href="mailto:privacy@akmleva.pt" className="text-primary dark:text-primary-300 hover:underline">privacy@akmleva.pt</a>
          </p>
        </div>
      </>
    ),
    es: (
      <>
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              Esta Política de Cookies explica cómo AKMLEVA utiliza cookies y tecnologías similares para reconocerle cuando visita nuestro sitio web. Explica qué son estas tecnologías, por qué las usamos y sus derechos para controlar nuestro uso de las mismas.
            </p>
          </div>
        </div>

        <h2>1. ¿Qué Son las Cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que se colocan en su computadora o dispositivo móvil cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y proporcionar información a los propietarios del sitio web.</p>
        <p>Las cookies establecidas por el propietario del sitio web (en este caso, AKMLEVA) se denominan "cookies propias". Las cookies establecidas por terceros distintos del propietario del sitio web se denominan "cookies de terceros".</p>

        <h2>2. ¿Por Qué Usamos Cookies?</h2>
        <p>Utilizamos cookies propias y de terceros por varias razones:</p>
        <ul>
          <li><strong>Cookies esenciales:</strong> Necesarias para que el sitio web funcione correctamente</li>
          <li><strong>Cookies funcionales:</strong> Recuerdan sus preferencias y elecciones</li>
          <li><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web</li>
          <li><strong>Cookies de marketing:</strong> Entregan anuncios relevantes y miden la efectividad de las campañas</li>
        </ul>

        <h2>3. Tipos de Cookies Que Usamos</h2>

        <div className="space-y-6 my-6">
          <div className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Cookies Esenciales
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estas cookies son estrictamente necesarias para que el sitio web funcione y no se pueden desactivar.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-green-600 dark:border-green-400">
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Nombre</th>
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Propósito</th>
                    <th className="text-left py-2 font-semibold text-green-900 dark:text-green-200">Duración</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">session_id</td>
                    <td className="py-2 pr-4">Mantiene el estado de su sesión</td>
                    <td className="py-2">Sesión</td>
                  </tr>
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">csrf_token</td>
                    <td className="py-2 pr-4">Protección de seguridad</td>
                    <td className="py-2">Sesión</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">cookie_consent</td>
                    <td className="py-2 pr-4">Almacena sus preferencias de cookies</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Cookies Funcionales
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estas cookies permiten funcionalidad mejorada y personalización.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-600 dark:border-blue-400">
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Nombre</th>
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Propósito</th>
                    <th className="text-left py-2 font-semibold text-blue-900 dark:text-blue-200">Duración</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">language_pref</td>
                    <td className="py-2 pr-4">Recuerda su elección de idioma</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">theme_mode</td>
                    <td className="py-2 pr-4">Almacena preferencia de modo oscuro/claro</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">currency_pref</td>
                    <td className="py-2 pr-4">Recuerda la selección de moneda</td>
                    <td className="py-2">6 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Cookies Analíticas
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estas cookies nos ayudan a entender cómo los visitantes usan nuestro sitio web.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary dark:border-primary-300">
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Servicio</th>
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Propósito</th>
                    <th className="text-left py-2 font-semibold text-primary-900 dark:text-primary-200">Duración</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-primary-200 dark:border-primary-700">
                    <td className="py-2 pr-4 font-medium">Google Analytics</td>
                    <td className="py-2 pr-4">Estadísticas de uso del sitio web</td>
                    <td className="py-2">2 años</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Hotjar</td>
                    <td className="py-2 pr-4">Análisis de comportamiento del usuario</td>
                    <td className="py-2">12 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-accent-50 dark:bg-accent-700/20 border-l-4 border-accent rounded-lg">
            <h3 className="text-lg font-semibold text-accent-700 dark:text-accent-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Cookies de Marketing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Estas cookies rastrean su actividad en línea para entregar anuncios relevantes.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-accent dark:border-accent-200">
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Servicio</th>
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Propósito</th>
                    <th className="text-left py-2 font-semibold text-accent-700 dark:text-accent-200">Duración</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Google Ads</td>
                    <td className="py-2 pr-4">Publicidad dirigida</td>
                    <td className="py-2">2 años</td>
                  </tr>
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Facebook Pixel</td>
                    <td className="py-2 pr-4">Remarketing y análisis</td>
                    <td className="py-2">2 años</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">LinkedIn Insight</td>
                    <td className="py-2 pr-4">Campañas de marketing B2B</td>
                    <td className="py-2">2 años</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2>4. Cómo Controlar las Cookies</h2>
        <p>Tiene derecho a decidir si acepta o rechaza las cookies. Puede ejercer sus preferencias de cookies mediante:</p>

        <div className="ml-6 space-y-4 my-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Banner de Consentimiento de Cookies</p>
            <p className="text-gray-700 dark:text-gray-300">Cuando visite nuestro sitio web por primera vez, puede elegir qué categorías de cookies aceptar a través de nuestro banner de consentimiento.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Configuración del Navegador</p>
            <p className="text-gray-700 dark:text-gray-300">La mayoría de los navegadores web le permiten controlar las cookies a través de su configuración. Sin embargo, bloquear todas las cookies puede afectar su capacidad para usar ciertas funciones de nuestro sitio web.</p>
            <ul className="mt-2 ml-4">
              <li><strong>Chrome:</strong> Configuración → Privacidad y Seguridad → Cookies y otros datos del sitio</li>
              <li><strong>Firefox:</strong> Preferencias → Privacidad y Seguridad → Cookies y Datos del Sitio</li>
              <li><strong>Safari:</strong> Preferencias → Privacidad → Administrar Datos del Sitio Web</li>
              <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Exclusión de Terceros</p>
            <p className="text-gray-700 dark:text-gray-300">Puede optar por no recibir cookies de terceros a través de:</p>
            <ul className="mt-2 ml-4">
              <li>Your Online Choices: <a href="https://www.youronlinechoices.com/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">www.youronlinechoices.com</a></li>
              <li>Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
              <li>Digital Advertising Alliance: <a href="https://optout.aboutads.info/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
            </ul>
          </div>
        </div>

        <h2>5. Actualizaciones a Esta Política</h2>
        <p>Podemos actualizar esta Política de Cookies de vez en cuando para reflejar cambios en nuestras prácticas o por otras razones operativas, legales o regulatorias. Por favor, vuelva a visitar esta página regularmente para mantenerse informado sobre nuestro uso de cookies.</p>

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Última actualización:</strong> 29 de Abril de 2026
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Para preguntas sobre nuestro uso de cookies, contáctenos en: <a href="mailto:privacy@akmleva.pt" className="text-primary dark:text-primary-300 hover:underline">privacy@akmleva.pt</a>
          </p>
        </div>
      </>
    ),
    fr: (
      <>
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              Cette Politique de Cookies explique comment AKMLEVA utilise des cookies et des technologies similaires pour vous reconnaître lorsque vous visitez notre site Web. Elle explique ce que sont ces technologies, pourquoi nous les utilisons et vos droits de contrôler notre utilisation de celles-ci.
            </p>
          </div>
        </div>

        <h2>1. Que Sont les Cookies?</h2>
        <p>Les cookies sont de petits fichiers texte qui sont placés sur votre ordinateur ou appareil mobile lorsque vous visitez un site Web. Ils sont largement utilisés pour faire fonctionner les sites Web plus efficacement et fournir des informations aux propriétaires du site Web.</p>
        <p>Les cookies définis par le propriétaire du site Web (dans ce cas, AKMLEVA) sont appelés "cookies propriétaires". Les cookies définis par des tiers autres que le propriétaire du site Web sont appelés "cookies tiers".</p>

        <h2>2. Pourquoi Utilisons-Nous des Cookies?</h2>
        <p>Nous utilisons des cookies propriétaires et tiers pour plusieurs raisons:</p>
        <ul>
          <li><strong>Cookies essentiels:</strong> Nécessaires au bon fonctionnement du site Web</li>
          <li><strong>Cookies fonctionnels:</strong> Se souviennent de vos préférences et choix</li>
          <li><strong>Cookies analytiques:</strong> Nous aident à comprendre comment les visiteurs interagissent avec notre site Web</li>
          <li><strong>Cookies marketing:</strong> Diffusent des publicités pertinentes et mesurent l'efficacité des campagnes</li>
        </ul>

        <h2>3. Types de Cookies Que Nous Utilisons</h2>

        <div className="space-y-6 my-6">
          <div className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Cookies Essentiels
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Ces cookies sont strictement nécessaires au fonctionnement du site Web et ne peuvent pas être désactivés.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-green-600 dark:border-green-400">
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Nom</th>
                    <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">Objectif</th>
                    <th className="text-left py-2 font-semibold text-green-900 dark:text-green-200">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">session_id</td>
                    <td className="py-2 pr-4">Maintient l'état de votre session</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-green-200 dark:border-green-800">
                    <td className="py-2 pr-4 font-medium">csrf_token</td>
                    <td className="py-2 pr-4">Protection de sécurité</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">cookie_consent</td>
                    <td className="py-2 pr-4">Stocke vos préférences de cookies</td>
                    <td className="py-2">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Cookies Fonctionnels
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Ces cookies permettent une fonctionnalité améliorée et une personnalisation.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-600 dark:border-blue-400">
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Nom</th>
                    <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">Objectif</th>
                    <th className="text-left py-2 font-semibold text-blue-900 dark:text-blue-200">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">language_pref</td>
                    <td className="py-2 pr-4">Se souvient de votre choix de langue</td>
                    <td className="py-2">12 mois</td>
                  </tr>
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <td className="py-2 pr-4 font-medium">theme_mode</td>
                    <td className="py-2 pr-4">Stocke la préférence de mode sombre/clair</td>
                    <td className="py-2">12 mois</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">currency_pref</td>
                    <td className="py-2 pr-4">Se souvient de la sélection de devise</td>
                    <td className="py-2">6 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Cookies Analytiques
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site Web.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary dark:border-primary-300">
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Service</th>
                    <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">Objectif</th>
                    <th className="text-left py-2 font-semibold text-primary-900 dark:text-primary-200">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-primary-200 dark:border-primary-700">
                    <td className="py-2 pr-4 font-medium">Google Analytics</td>
                    <td className="py-2 pr-4">Statistiques d'utilisation du site Web</td>
                    <td className="py-2">2 ans</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Hotjar</td>
                    <td className="py-2 pr-4">Analyse du comportement des utilisateurs</td>
                    <td className="py-2">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-accent-50 dark:bg-accent-700/20 border-l-4 border-accent rounded-lg">
            <h3 className="text-lg font-semibold text-accent-700 dark:text-accent-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Cookies Marketing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Ces cookies suivent votre activité en ligne pour diffuser des publicités pertinentes.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-accent dark:border-accent-200">
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Service</th>
                    <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">Objectif</th>
                    <th className="text-left py-2 font-semibold text-accent-700 dark:text-accent-200">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Google Ads</td>
                    <td className="py-2 pr-4">Publicité ciblée</td>
                    <td className="py-2">2 ans</td>
                  </tr>
                  <tr className="border-b border-accent-200 dark:border-accent-700">
                    <td className="py-2 pr-4 font-medium">Facebook Pixel</td>
                    <td className="py-2 pr-4">Remarketing et analyse</td>
                    <td className="py-2">2 ans</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">LinkedIn Insight</td>
                    <td className="py-2 pr-4">Campagnes marketing B2B</td>
                    <td className="py-2">2 ans</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2>4. Comment Contrôler les Cookies</h2>
        <p>Vous avez le droit de décider d'accepter ou de refuser les cookies. Vous pouvez exercer vos préférences de cookies par:</p>

        <div className="ml-6 space-y-4 my-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Bannière de Consentement des Cookies</p>
            <p className="text-gray-700 dark:text-gray-300">Lorsque vous visitez notre site Web pour la première fois, vous pouvez choisir les catégories de cookies à accepter via notre bannière de consentement.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Paramètres du Navigateur</p>
            <p className="text-gray-700 dark:text-gray-300">La plupart des navigateurs Web vous permettent de contrôler les cookies via leurs paramètres. Cependant, bloquer tous les cookies peut affecter votre capacité à utiliser certaines fonctionnalités de notre site Web.</p>
            <ul className="mt-2 ml-4">
              <li><strong>Chrome:</strong> Paramètres → Confidentialité et Sécurité → Cookies et autres données du site</li>
              <li><strong>Firefox:</strong> Préférences → Vie privée et Sécurité → Cookies et Données du Site</li>
              <li><strong>Safari:</strong> Préférences → Confidentialité → Gérer les Données du Site Web</li>
              <li><strong>Edge:</strong> Paramètres → Confidentialité, recherche et services → Cookies</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Désactivation des Tiers</p>
            <p className="text-gray-700 dark:text-gray-300">Vous pouvez refuser les cookies tiers via:</p>
            <ul className="mt-2 ml-4">
              <li>Your Online Choices: <a href="https://www.youronlinechoices.com/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">www.youronlinechoices.com</a></li>
              <li>Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
              <li>Digital Advertising Alliance: <a href="https://optout.aboutads.info/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
            </ul>
          </div>
        </div>

        <h2>5. Mises à Jour de Cette Politique</h2>
        <p>Nous pouvons mettre à jour cette Politique de Cookies de temps en temps pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Veuillez revisiter cette page régulièrement pour rester informé de notre utilisation des cookies.</p>

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Dernière mise à jour:</strong> 29 Avril 2026
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Pour des questions sur notre utilisation des cookies, veuillez nous contacter à: <a href="mailto:privacy@akmleva.pt" className="text-primary dark:text-primary-300 hover:underline">privacy@akmleva.pt</a>
          </p>
        </div>
      </>
    )
  };

  return content[(locale as keyof typeof content) ?? 'en'] ?? content.en;
}
