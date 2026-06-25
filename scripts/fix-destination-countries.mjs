import fs from 'fs';
import path from 'path';
import https from 'https';

// Configuração
const INPUT_FILES = [
  'data/export_hybrid_review.csv',
  'data/export_final_review.csv'
];

const OUTPUT_DIR = 'data/country-fixes';

// Cache para evitar requisições duplicadas
const countryCache = new Map();

// Mapeamento de códigos de país comuns
const COUNTRY_NAMES = {
  'PT': 'Portugal',
  'ES': 'Spain',
  'FR': 'France',
  'IT': 'Italy',
  'DE': 'Germany',
  'GB': 'United Kingdom',
  'US': 'United States',
  'BR': 'Brazil',
  'AR': 'Argentina',
  'MX': 'Mexico',
  'JP': 'Japan',
  'CN': 'China',
  'IN': 'India',
  'AU': 'Australia',
  'CA': 'Canada',
  'RU': 'Russia',
  'KR': 'South Korea',
  'KP': 'North Korea',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'GR': 'Greece',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'NZ': 'New Zealand',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'MA': 'Morocco',
  'TN': 'Tunisia',
  'TR': 'Turkey',
  'IL': 'Israel',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'SY': 'Syria',
  'JO': 'Jordan',
  'LB': 'Lebanon',
  'CY': 'Cyprus',
  'MT': 'Malta',
  'IS': 'Iceland',
  'HR': 'Croatia',
  'RS': 'Serbia',
  'BG': 'Bulgaria',
  'RO': 'Romania',
  'HU': 'Hungary',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'BA': 'Bosnia and Herzegovina',
  'ME': 'Montenegro',
  'MK': 'North Macedonia',
  'AL': 'Albania',
  'XK': 'Kosovo',
  'UA': 'Ukraine',
  'BY': 'Belarus',
  'MD': 'Moldova',
  'GE': 'Georgia',
  'AM': 'Armenia',
  'AZ': 'Azerbaijan',
  'KZ': 'Kazakhstan',
  'UZ': 'Uzbekistan',
  'TM': 'Turkmenistan',
  'TJ': 'Tajikistan',
  'KG': 'Kyrgyzstan',
  'MN': 'Mongolia',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',
  'MO': 'Macau',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'LA': 'Laos',
  'KH': 'Cambodia',
  'MM': 'Myanmar',
  'BD': 'Bangladesh',
  'NP': 'Nepal',
  'BT': 'Bhutan',
  'LK': 'Sri Lanka',
  'MV': 'Maldives',
  'PK': 'Pakistan',
  'AF': 'Afghanistan',
  'YE': 'Yemen',
  'OM': 'Oman',
  'QA': 'Qatar',
  'BH': 'Bahrain',
  'KW': 'Kuwait',
  'LY': 'Libya',
  'DZ': 'Algeria',
  'SD': 'Sudan',
  'SS': 'South Sudan',
  'ET': 'Ethiopia',
  'ER': 'Eritrea',
  'DJ': 'Djibouti',
  'SO': 'Somalia',
  'KE': 'Kenya',
  'UG': 'Uganda',
  'TZ': 'Tanzania',
  'RW': 'Rwanda',
  'BI': 'Burundi',
  'CD': 'Democratic Republic of the Congo',
  'CG': 'Republic of the Congo',
  'GA': 'Gabon',
  'GQ': 'Equatorial Guinea',
  'CM': 'Cameroon',
  'NG': 'Nigeria',
  'NE': 'Niger',
  'TD': 'Chad',
  'CF': 'Central African Republic',
  'AO': 'Angola',
  'ZM': 'Zambia',
  'MW': 'Malawi',
  'MZ': 'Mozambique',
  'ZW': 'Zimbabwe',
  'BW': 'Botswana',
  'NA': 'Namibia',
  'ZA': 'South Africa',
  'LS': 'Lesotho',
  'SZ': 'Eswatini',
  'MG': 'Madagascar',
  'MU': 'Mauritius',
  'SC': 'Seychelles',
  'KM': 'Comoros',
  'CV': 'Cape Verde',
  'GW': 'Guinea-Bissau',
  'GN': 'Guinea',
  'SL': 'Sierra Leone',
  'LR': 'Liberia',
  'CI': 'Ivory Coast',
  'GH': 'Ghana',
  'TG': 'Togo',
  'BJ': 'Benin',
  'BF': 'Burkina Faso',
  'ML': 'Mali',
  'MR': 'Mauritania',
  'SN': 'Senegal',
  'GM': 'Gambia',
  'FJ': 'Fiji',
  'PG': 'Papua New Guinea',
  'SB': 'Solomon Islands',
  'VU': 'Vanuatu',
  'NC': 'New Caledonia',
  'PF': 'French Polynesia',
  'WS': 'Samoa',
  'TO': 'Tonga',
  'KI': 'Kiribati',
  'FM': 'Micronesia',
  'MH': 'Marshall Islands',
  'PW': 'Palau',
  'NR': 'Nauru',
  'TV': 'Tuvalu',
  'CK': 'Cook Islands',
  'NU': 'Niue',
  'TK': 'Tokelau',
  'AS': 'American Samoa',
  'MP': 'Northern Mariana Islands',
  'GU': 'Guam',
  'PR': 'Puerto Rico',
  'VI': 'U.S. Virgin Islands',
  'AW': 'Aruba',
  'CW': 'Curaçao',
  'SX': 'Sint Maarten',
  'BQ': 'Caribbean Netherlands',
  'TC': 'Turks and Caicos Islands',
  'KY': 'Cayman Islands',
  'BM': 'Bermuda',
  'GL': 'Greenland',
  'FO': 'Faroe Islands',
  'SJ': 'Svalbard and Jan Mayen',
  'AX': 'Åland Islands',
  'AD': 'Andorra',
  'MC': 'Monaco',
  'LI': 'Liechtenstein',
  'SM': 'San Marino',
  'VA': 'Vatican City',
  'MD': 'Moldova',
  'GG': 'Guernsey',
  'JE': 'Jersey',
  'IM': 'Isle of Man',
  'SH': 'Saint Helena',
  'AC': 'Ascension Island',
  'TA': 'Tristan da Cunha',
  'BV': 'Bouvet Island',
  'HM': 'Heard Island and McDonald Islands',
  'CC': 'Cocos (Keeling) Islands',
  'CX': 'Christmas Island',
  'NF': 'Norfolk Island',
  'WF': 'Wallis and Futuna',
  'TL': 'East Timor',
  'PS': 'Palestine',
  'XK': 'Kosovo'
};

/**
 * Função para fazer requisição HTTPS
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'DestinationCountryFixer/1.0'
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Reverse geocoding usando Nominatim (OpenStreetMap)
 */
async function getCountryFromCoordinates(lat, lon) {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  
  if (countryCache.has(cacheKey)) {
    return countryCache.get(cacheKey);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=pt`;
    const response = await makeRequest(url);
    const data = JSON.parse(response);
    
    let countryCode = null;
    
    // Tenta obter o código do país de diferentes formas
    if (data.address && data.address.country_code) {
      countryCode = data.address.country_code.toUpperCase();
    } else if (data.address && data.address.country) {
      // Tenta encontrar pelo nome do país
      const countryName = data.address.country;
      for (const [code, name] of Object.entries(COUNTRY_NAMES)) {
        if (name.toLowerCase() === countryName.toLowerCase()) {
          countryCode = code;
          break;
        }
      }
    }
    
    // Adiciona delay para respeitar rate limit do Nominatim (1 req/s)
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    countryCache.set(cacheKey, countryCode);
    return countryCode;
  } catch (error) {
    console.error(`Erro ao obter país para ${lat}, ${lon}:`, error.message);
    return null;
  }
}

/**
 * Verifica se as coordenadas estão em Portugal
 */
function isInPortugal(lat, lon) {
  // Portugal continental: aproximadamente 37°N a 42°N, -9°W a -6°W
  // Açores: aproximadamente 37°N a 39°N, -31°W a -25°W
  // Madeira: aproximadamente 32°N a 33°N, -17°W a -16°W
  
  const inMainland = lat >= 37 && lat <= 42 && lon >= -9.5 && lon <= -6;
  const inAzores = lat >= 36.5 && lat <= 39.5 && lon >= -31.5 && lon <= -24.5;
  const inMadeira = lat >= 32 && lat <= 33.5 && lon >= -17.5 && lon <= -16;
  
  return inMainland || inAzores || inMadeira;
}

/**
 * Processa um arquivo CSV
 */
async function processFile(filename) {
  console.log(`\nProcessando ${filename}...`);
  
  const inputPath = path.join(process.cwd(), filename);
  const outputPath = path.join(process.cwd(), OUTPUT_DIR, filename);
  
  // Cria diretório de saída se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Lê o arquivo
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n');
  const header = lines[0];
  
  console.log(`Total de registros: ${lines.length - 1}`);
  
  const fixedLines = [header];
  let fixedCount = 0;
  let skippedCount = 0;
  
  // Processa cada linha (exceto header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 10) {
      fixedLines.push(line);
      continue;
    }
    
    const [id, nome, originalPais, currentPais, lat, lon, nearestCity, nearestCc, distKm, hotelCount] = parts;
    
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    // Verifica se é um registro problemático
    const needsFix = originalPais === 'PT' && !isInPortugal(latNum, lonNum);
    
    if (needsFix) {
      console.log(`\n[${i}] Verificando: ${nome} (${lat}, ${lon})`);
      console.log(`  originalPais: ${originalPais}, currentPais: ${currentPais}`);
      
      // Tenta obter o país correto pelas coordenadas
      const correctCountry = await getCountryFromCoordinates(latNum, lonNum);
      
      if (correctCountry) {
        console.log(`  ✅ País correto: ${correctCountry} (${COUNTRY_NAMES[correctCountry] || correctCountry})`);
        
        // Atualiza a linha com o país correto
        const newOriginalPais = correctCountry;
        const newCurrentPais = correctCountry;
        
        fixedLines.push([
          id,
          nome,
          newOriginalPais,
          newCurrentPais,
          lat,
          lon,
          nearestCity,
          nearestCc,
          distKm,
          hotelCount
        ].join(','));
        
        fixedCount++;
      } else {
        console.log(`  ⚠️  Não foi possível determinar o país, mantendo original`);
        fixedLines.push(line);
        skippedCount++;
      }
    } else {
      // Registro não precisa de correção
      fixedLines.push(line);
    }
  }
  
  // Salva o arquivo corrigido
  const outputContent = fixedLines.join('\n');
  fs.writeFileSync(outputPath, outputContent, 'utf-8');
  
  console.log(`\n✅ ${filename} processado:`);
  console.log(`   - Registros corrigidos: ${fixedCount}`);
  console.log(`   - Registros ignorados: ${skippedCount}`);
  console.log(`   - Arquivo salvo em: ${outputPath}`);
  
  return { fixedCount, skippedCount };
}

/**
 * Função principal
 */
async function main() {
  console.log('🔧 Iniciando correção de países dos destinos...\n');
  console.log('Este script irá:');
  console.log('1. Identificar destinos com originalPais=PT que não estão em Portugal');
  console.log('2. Usar reverse geocoding para determinar o país correto');
  console.log('3. Corrigir tanto originalPais quanto currentPais');
  console.log('4. Salvar os arquivos corrigidos em data/country-fixes/\n');
  
  const results = {
    totalFixed: 0,
    totalSkipped: 0,
    files: []
  };
  
  for (const filename of INPUT_FILES) {
    try {
      const result = await processFile(filename);
      results.totalFixed += result.fixedCount;
      results.totalSkipped += result.skippedCount;
      results.files.push(filename);
    } catch (error) {
      console.error(`\n❌ Erro ao processar ${filename}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Resumo:');
  console.log(`   - Arquivos processados: ${results.files.length}`);
  console.log(`   - Total de registros corrigidos: ${results.totalFixed}`);
  console.log(`   - Total de registros ignorados: ${results.totalSkipped}`);
  console.log('='.repeat(60));
}

// Executa o script
main().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});