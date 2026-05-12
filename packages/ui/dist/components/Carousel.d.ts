import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>[0];
interface CarouselProps {
    opts?: UseCarouselParameters;
    plugins?: Parameters<typeof useEmblaCarousel>[1];
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
}
declare const Carousel: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & CarouselProps & React.RefAttributes<HTMLDivElement>>;
declare const CarouselContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CarouselItem: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CarouselPrevious: React.ForwardRefExoticComponent<Omit<import("./Button").ButtonProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const CarouselNext: React.ForwardRefExoticComponent<Omit<import("./Button").ButtonProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, };
