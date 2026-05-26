export type MockDestination = {
  id: number;
  nome: string;
  pais: string;
  paisCode: string;
  iata: string | null;
  continente: string;
  tipo: string;
  clima: string;
  descricao: string;
  descricaoCompleta?: string;
  /** Cartão Wikivoyage: secção Entenda (resumo curto). */
  resumo?: string;
  /** O que ver (até ~3 itens). */
  veja?: string[];
  /** O que fazer. */
  faca?: string[];
  /** Onde comer. */
  coma?: string[];
  tags?: string[];
  /** Dicas práticas Wikivoyage (segurança, respeite, dinheiro, …). */
  dicas?: Partial<
    Record<
      | 'seguranca'
      | 'respeite'
      | 'comunique'
      | 'beba'
      | 'dinheiro'
      | 'saude'
      | 'transporte'
      | 'horarios'
      | 'compre'
      | 'clima',
      string[]
    >
  >;
  imagem_url: string;
  imagem_query?: string;
  wikivoyageUrl?: string;
  lang?: string;
  latitude?: number;
  longitude?: number;
  wikipedia_resumo?: string;
  wikipedia_url?: string;
  /** Snapshot OpenWeather no momento do enrich (offline). */
  clima_tempo?: {
    descricao?: string | null;
    temperatura_c?: number | null;
    sensacao_c?: number | null;
    humidade_pct?: number | null;
    atualizado?: string;
  };
  /** Orçamento diário offline (CSV Kaggle + índice país/continente). */
  custo_de_vida?: {
    moeda: string;
    fonte: string;
    nivel: 'cidade' | 'pais' | 'continente' | 'global';
    estimado?: boolean;
    confianca?: 'alta' | 'media' | 'baixa';
    fator_localidade?: number;
    indices?: {
      cost_of_living?: number;
      rent?: number;
      restaurant?: number;
    };
    orcamentos?: Partial<
      Record<
        'mochileiro' | 'conforto' | 'luxo',
        { total_dia: number; moeda: string; itens?: string[] }
      >
    >;
  };
  /** Aeroporto + rede aérea (OurAirports + OpenFlights, offline). */
  transporte?: {
    fonte: string;
    aeroporto: {
      iata: string;
      nome: string;
      tipo: string;
      municipio?: string;
      pais_code: string;
      lat: number;
      lon: number;
      scheduled_service: boolean;
      distancia_km?: number;
      match: 'iata' | 'cidade' | 'pais' | 'proximo';
    };
    rede?: {
      ligacoes_diretas: number;
      rotas_registadas: number;
      hubs_com_ligacao?: string[];
      ligacoes_desde_hubs?: Record<string, boolean>;
      top_destinos?: { iata: string; nome: string }[];
      preco_indicativo_desde?: Record<string, number>;
      aeronaves_frequentes?: { code: string; nome: string; rotas?: number }[];
    };
  };
};

export type MockHotel = {
  id: number;
  destino_id: number;
  nome: string;
  estrelas: number;
  preco_por_noite: number;
  comodidades: string[];
  wikivoyageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  image_url?: string | null;
  google_place_id?: string | null;
  wikidata_id?: string | null;
  fonte?: string | null;
  /** Preenchido em buscas por proximidade. */
  distance_km?: number;
};

export type MockFlight = {
  id: number;
  origem: string;
  destino_id: number;
  destino_iata: string | null;
  preco: number;
  duracao_minutos: number;
  companhia: string;
  cabin_class: string;
  escalas: number;
};

export type MockTravelBundle = {
  meta: {
    seed: number;
    generatedAt: string;
    source?: string;
    license?: string;
    langs?: string[];
    counts: { destinos: number; hoteis: number; voos: number };
  };
  destinos: MockDestination[];
  hoteis: MockHotel[];
  voos: MockFlight[];
};
