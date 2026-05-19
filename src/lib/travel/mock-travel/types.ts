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
  imagem_url: string;
  imagem_query?: string;
  wikivoyageUrl?: string;
  lang?: string;
};

export type MockHotel = {
  id: number;
  destino_id: number;
  nome: string;
  estrelas: number;
  preco_por_noite: number;
  comodidades: string[];
  wikivoyageUrl?: string;
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
