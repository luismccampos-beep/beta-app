import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type HeroData = {
  nome: string;
  pais: string | null;
  continente: string | null;
  iata: string | null;
  tipo: string;
  clima: string;
  imageUrl: string;
};

export function DestinationHero({ data }: { data: HeroData; slug: string }) {
  return (
    <div className="relative h-[50vh] min-h-[320px] max-h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl || '/travel-images/placeholder.svg'}
          alt={data.nome}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        <Button
          variant="secondary"
          asChild
          className="gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg text-xs sm:text-sm"
        >
          <Link href="/destinations">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-10 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
          {data.nome}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-white/90">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {data.pais}, {data.continente}
          </span>
          {data.iata && (
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
              {data.iata}
            </Badge>
          )}
          <span className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            {data.tipo} · {data.clima}
          </span>
        </p>
      </div>
    </div>
  );
}
