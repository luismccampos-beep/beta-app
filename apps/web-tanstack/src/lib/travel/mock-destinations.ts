export type MockDestination = {
  id: number;
  slug: string;
  lang: string;
  nome: string;
  pais: string;
  paisCode: string;
  continente: string;
  iata: string | null;
  tipo: string;
  clima: string;
  descricao: string;
  resumo: string;
  imagemUrl: string;
  custoDeVida: number;
  hotelCount: number;
  latitude: number;
  longitude: number;
};

export const MOCK_DESTINATIONS: MockDestination[] = [
  { id: 1, slug: 'lisboa', lang: 'pt', nome: 'Lisboa', pais: 'Portugal', paisCode: 'PT', continente: 'Europa', iata: 'LIS', tipo: 'Cidade', clima: 'Mediterrânico', descricao: 'Capital de Portugal, conhecida por seus tramways, miradouros e vibrante vida noturna.', resumo: 'Capital vibrante com história rica e vistas deslumbrantes sobre o Tejo.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 75, hotelCount: 342, latitude: 38.7223, longitude: -9.1393 },
  { id: 2, slug: 'porto', lang: 'pt', nome: 'Porto', pais: 'Portugal', paisCode: 'PT', continente: 'Europa', iata: 'OPO', tipo: 'Cidade', clima: 'Mediterrânico', descricao: 'Segunda maior cidade de Portugal, famosa pelo vinho do Porto.', resumo: 'Cidade charmosa às margens do Douro, berço do vinho do Porto.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 65, hotelCount: 215, latitude: 41.1579, longitude: -8.6291 },
  { id: 3, slug: 'algarve', lang: 'pt', nome: 'Algarve', pais: 'Portugal', paisCode: 'PT', continente: 'Europa', iata: 'FAO', tipo: 'Região', clima: 'Mediterrânico', descricao: 'Região costeira no sul de Portugal, famosa por praias de águas cristalinas.', resumo: 'Paraíso de praias e falésias no extremo sul da Europa.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 70, hotelCount: 528, latitude: 37.0194, longitude: -7.9304 },
  { id: 4, slug: 'paris', lang: 'pt', nome: 'Paris', pais: 'França', paisCode: 'FR', continente: 'Europa', iata: 'CDG', tipo: 'Cidade', clima: 'Oceânico', descricao: 'Capital da França, referência mundial em arte, moda e gastronomia.', resumo: 'A Cidade Luz — arte, moda e gastronomia de classe mundial.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 95, hotelCount: 890, latitude: 48.8566, longitude: 2.3522 },
  { id: 5, slug: 'roma', lang: 'pt', nome: 'Roma', pais: 'Itália', paisCode: 'IT', continente: 'Europa', iata: 'FCO', tipo: 'Cidade', clima: 'Mediterrânico', descricao: 'A cidade eterna, berço do Império Romano.', resumo: 'A Cidade Eterna — história milenar e gastronomia italiana autêntica.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 80, hotelCount: 750, latitude: 41.9028, longitude: 12.4964 },
  { id: 6, slug: 'londres', lang: 'pt', nome: 'Londres', pais: 'Reino Unido', paisCode: 'GB', continente: 'Europa', iata: 'LHR', tipo: 'Cidade', clima: 'Oceânico', descricao: 'Capital do Reino Unido, metrópole vibrante com museus de classe mundial.', resumo: 'Metrópole imperial com museus, teatros e cultura multicultural.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 110, hotelCount: 1200, latitude: 51.5074, longitude: -0.1278 },
  { id: 7, slug: 'barcelona', lang: 'pt', nome: 'Barcelona', pais: 'Espanha', paisCode: 'ES', continente: 'Europa', iata: 'BCN', tipo: 'Cidade', clima: 'Mediterrânico', descricao: 'Capital da Catalunha, conhecida pela arquitetura de Gaudí.', resumo: 'Arquitetura de Gaudí, praias e vida noturna na Catalunha.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 80, hotelCount: 680, latitude: 41.3874, longitude: 2.1686 },
  { id: 8, slug: 'tokyo', lang: 'pt', nome: 'Tóquio', pais: 'Japão', paisCode: 'JP', continente: 'Ásia', iata: 'NRT', tipo: 'Cidade', clima: 'Subtropical', descricao: 'Capital do Japão, fusão de tradição milenar e tecnologia de ponta.', resumo: 'Fusão eletrizante de tradição milenar e tecnologia futurista.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 90, hotelCount: 950, latitude: 35.6762, longitude: 139.6503 },
  { id: 9, slug: 'nova-york', lang: 'pt', nome: 'Nova York', pais: 'Estados Unidos', paisCode: 'US', continente: 'América', iata: 'JFK', tipo: 'Cidade', clima: 'Continental', descricao: 'A cidade que nunca dorme, epicentro global de finanças e cultura.', resumo: 'A cidade que nunca dorme — ícone global de cultura e negócios.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 120, hotelCount: 1500, latitude: 40.7128, longitude: -74.006 },
  { id: 10, slug: 'dubai', lang: 'pt', nome: 'Dubai', pais: 'Emirados Árabes Unidos', paisCode: 'AE', continente: 'Ásia', iata: 'DXB', tipo: 'Cidade', clima: 'Desértico', descricao: 'Metrópole futurista, sinônimo de luxo e arquitetura ousada.', resumo: 'Luxo e inovação no deserto — arquitetura que desafia a imaginação.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 100, hotelCount: 720, latitude: 25.2048, longitude: 55.2708 },
  { id: 11, slug: 'bangkok', lang: 'pt', nome: 'Banguecoque', pais: 'Tailândia', paisCode: 'TH', continente: 'Ásia', iata: 'BKK', tipo: 'Cidade', clima: 'Tropical', descricao: 'Capital da Tailândia, templos dourados e mercados flutuantes.', resumo: 'Templos dourados, mercados flutuantes e sabores exóticos.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 45, hotelCount: 650, latitude: 13.7563, longitude: 100.5018 },
  { id: 12, slug: 'istambul', lang: 'pt', nome: 'Istambul', pais: 'Turquia', paisCode: 'TR', continente: 'Europa', iata: 'IST', tipo: 'Cidade', clima: 'Mediterrânico', descricao: 'Cidade que divide dois continentes, mesquitas e bazares.', resumo: 'Ponte entre dois mundos — mesquitas, bazares e história milenar.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 55, hotelCount: 580, latitude: 41.0082, longitude: 28.9784 },
  { id: 13, slug: 'sydney', lang: 'pt', nome: 'Sydney', pais: 'Austrália', paisCode: 'AU', continente: 'Oceânia', iata: 'SYD', tipo: 'Cidade', clima: 'Subtropical', descricao: 'Maior cidade da Austrália, famosa pela Ópera e praias.', resumo: 'Ícone australiano — Ópera, praias e natureza exuberante.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 95, hotelCount: 420, latitude: -33.8688, longitude: 151.2093 },
  { id: 14, slug: 'rio-de-janeiro', lang: 'pt', nome: 'Rio de Janeiro', pais: 'Brasil', paisCode: 'BR', continente: 'América', iata: 'GIG', tipo: 'Cidade', clima: 'Tropical', descricao: 'Cidade maravilhosa, Cristo Redentor, Copacabana e carnaval.', resumo: 'Cidade maravilhosa — Cristo, Copacabana e a energia do carnaval.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 55, hotelCount: 480, latitude: -22.9068, longitude: -43.1729 },
  { id: 15, slug: 'marrakech', lang: 'pt', nome: 'Marraquexe', pais: 'Marrocos', paisCode: 'MA', continente: 'África', iata: 'RAK', tipo: 'Cidade', clima: 'Semiárido', descricao: 'Cidade imperial de Marrocos, medinas e palácios coloridos.', resumo: 'Medinas labirínticas, sabores exóticos e palácios reais.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 40, hotelCount: 320, latitude: 31.6295, longitude: -7.9811 },
  { id: 16, slug: 'cairo', lang: 'pt', nome: 'Cairo', pais: 'Egito', paisCode: 'EG', continente: 'África', iata: 'CAI', tipo: 'Cidade', clima: 'Desértico', descricao: 'Capital do Egito, pirâmides de Gizé e o rio Nilo.', resumo: 'Pirâmides de Gizé e o Nilo — berço da civilização milenar.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 35, hotelCount: 290, latitude: 30.0444, longitude: 31.2357 },
  { id: 17, slug: 'cancun', lang: 'pt', nome: 'Cancún', pais: 'México', paisCode: 'MX', continente: 'América', iata: 'CUN', tipo: 'Cidade', clima: 'Tropical', descricao: 'Paraíso tropical no Caribe mexicano, praias brancas.', resumo: 'Praias turquesa e ruínas maias no Caribe mexicano.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 50, hotelCount: 380, latitude: 21.1619, longitude: -86.8515 },
  { id: 18, slug: 'bali', lang: 'pt', nome: 'Bali', pais: 'Indonésia', paisCode: 'ID', continente: 'Ásia', iata: 'DPS', tipo: 'Ilha', clima: 'Tropical', descricao: 'Ilha dos deuses, templos, arrozais e praias paradisíacas.', resumo: 'Ilha dos deuses — templos sagrados, arrozais e praias perfeitas.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 40, hotelCount: 520, latitude: -8.3405, longitude: 115.092 },
  { id: 19, slug: 'amsterdam', lang: 'pt', nome: 'Amsterdã', pais: 'Países Baixos', paisCode: 'NL', continente: 'Europa', iata: 'AMS', tipo: 'Cidade', clima: 'Oceânico', descricao: 'Capital dos Países Baixos, canais, museus e cultura liberal.', resumo: 'Canais pitorescos, museus renomados e mentalidade liberal.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 90, hotelCount: 450, latitude: 52.3676, longitude: 4.9041 },
  { id: 20, slug: 'berlim', lang: 'pt', nome: 'Berlim', pais: 'Alemanha', paisCode: 'DE', continente: 'Europa', iata: 'BER', tipo: 'Cidade', clima: 'Continental', descricao: 'Capital da Alemanha, cidade de história, arte e diversidade.', resumo: 'História dividida, reunificada — berço da cultura alternativa.', imagemUrl: '/travel-images/placeholder.svg', custoDeVida: 75, hotelCount: 520, latitude: 52.52, longitude: 13.405 },
];

export const MOCK_COUNTRIES = [
  { name: 'Portugal', code: 'PT', count: 3 },
  { name: 'França', code: 'FR', count: 1 },
  { name: 'Itália', code: 'IT', count: 1 },
  { name: 'Reino Unido', code: 'GB', count: 1 },
  { name: 'Espanha', code: 'ES', count: 1 },
  { name: 'Japão', code: 'JP', count: 1 },
  { name: 'Estados Unidos', code: 'US', count: 1 },
  { name: 'Emirados Árabes Unidos', code: 'AE', count: 1 },
  { name: 'Tailândia', code: 'TH', count: 1 },
  { name: 'Turquia', code: 'TR', count: 1 },
  { name: 'Austrália', code: 'AU', count: 1 },
  { name: 'Brasil', code: 'BR', count: 1 },
  { name: 'Marrocos', code: 'MA', count: 1 },
  { name: 'Egito', code: 'EG', count: 1 },
  { name: 'México', code: 'MX', count: 1 },
  { name: 'Indonésia', code: 'ID', count: 1 },
  { name: 'Países Baixos', code: 'NL', count: 1 },
  { name: 'Alemanha', code: 'DE', count: 1 },
];
