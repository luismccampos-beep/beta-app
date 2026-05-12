// src/components/FeaturedDestinations.tsx
import React from "react";
import { MapPin, Star, ArrowRight } from "lucide-react";
var cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
var DestinationCard = ({
  destination,
  priority,
  variant,
  ImageComponent,
  LinkComponent,
  customMessages
}) => {
  const { slug, title, country, description, heroImage, heroImageAlt, rating, reviewCount } = destination;
  const getMessage = (key, fallback) => {
    return customMessages?.[key] || fallback;
  };
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  const LinkWrapper = LinkComponent || "a";
  const linkProps = LinkComponent ? {
    href: `/destinos/${slug}`,
    "aria-label": `Explorar destino: ${title}`
  } : {
    href: `/destinos/${slug}`,
    target: "_blank",
    rel: "noopener noreferrer"
  };
  return /* @__PURE__ */ React.createElement(
    LinkWrapper,
    {
      ...linkProps,
      className: cn(
        "group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 motion-safe:animate-fade-in dark:bg-zinc-900 dark:hover:ring-blue-400",
        isCompact && "shadow-md hover:shadow-lg",
        isFeatured && "shadow-2xl hover:shadow-3xl"
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: cn("relative", isCompact ? "h-48" : "h-64") }, ImageComponent ? /* @__PURE__ */ React.createElement(
      ImageComponent,
      {
        src: heroImage,
        alt: heroImageAlt || `${title} - ${description}`,
        fill: true,
        sizes: "(max-width: 768px) 100vw, 33vw",
        className: "object-cover group-hover:scale-105 transition-transform duration-500",
        priority
      }
    ) : /* @__PURE__ */ React.createElement(
      "img",
      {
        src: heroImage,
        alt: heroImageAlt || `${title} - ${description}`,
        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
        loading: priority ? "eager" : "lazy"
      }
    ), rating && /* @__PURE__ */ React.createElement("div", { className: "absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm shadow-md dark:bg-zinc-800/80" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-1" }, /* @__PURE__ */ React.createElement(Star, { className: "w-4 h-4 text-yellow-400 fill-yellow-400" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-zinc-900 dark:text-white" }, rating.toFixed(1))))),
    /* @__PURE__ */ React.createElement("div", { className: cn("p-6", isCompact && "p-4") }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2 mb-2 text-sm" }, /* @__PURE__ */ React.createElement(MapPin, { className: "h-4 w-4 text-blue-500 dark:text-blue-400" }), /* @__PURE__ */ React.createElement("span", { className: "font-medium text-gray-500 dark:text-zinc-400" }, country)), /* @__PURE__ */ React.createElement("h3", { className: cn(
      "mb-2 font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
      isCompact ? "text-lg" : "text-2xl"
    ) }, title), /* @__PURE__ */ React.createElement("p", { className: cn(
      "text-gray-600 dark:text-zinc-300 line-clamp-3",
      isCompact ? "text-sm mb-3 line-clamp-2" : "mb-4"
    ) }, description), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-gray-500 dark:text-zinc-400" }, (reviewCount ?? 0).toLocaleString("pt-PT"), " ", getMessage("reviews", "avalia\xE7\xF5es")), /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center space-x-1 text-blue-600 font-semibold text-sm group-hover:underline dark:text-blue-400" }, getMessage("seeDetails", "Ver Detalhes"), /* @__PURE__ */ React.createElement(ArrowRight, { className: "w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" }))))
  );
};
var FeaturedDestinations = ({
  destinations,
  title,
  subtitle,
  showAllDestinationsButton = true,
  allDestinationsUrl = "/destinos",
  className,
  variant = "default",
  showBackground = true,
  ImageComponent,
  LinkComponent,
  customMessages
}) => {
  const getMessage = (key, fallback) => {
    return customMessages?.[key] || fallback;
  };
  const defaultDestinations = [
    {
      id: "paris",
      slug: "paris",
      title: "Paris",
      country: "Fran\xE7a",
      address: "Paris, Fran\xE7a",
      description: "Cidade das luzes e do amor eterno. Descubra os caf\xE9s charmosos, a arte cl\xE1ssica e a arquitetura monumental.",
      heroImage: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
      heroImageAlt: "Vista noturna da Torre Eiffel em Paris",
      coordinates: { lat: 48.8566, lng: 2.3522 },
      category: "Cidade",
      rating: 4.8,
      reviewCount: 1250
    },
    {
      id: "tokyo",
      slug: "tokyo",
      title: "T\xF3quio",
      country: "Jap\xE3o",
      address: "T\xF3quio, Jap\xE3o",
      description: "Tradi\xE7\xE3o milenar encontra tecnologia futurista. Explore os templos serenos e os bairros vibrantes como Shinjuku e Shibuya.",
      heroImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      heroImageAlt: "Vista urbana moderna de T\xF3quio com arranha-c\xE9us",
      coordinates: { lat: 35.6762, lng: 139.6503 },
      category: "Cidade",
      rating: 4.9,
      reviewCount: 980
    },
    {
      id: "rio-de-janeiro",
      slug: "rio-de-janeiro",
      title: "Rio de Janeiro",
      country: "Brasil",
      address: "Rio de Janeiro, Brasil",
      description: "Praias paradis\xEDacas e cultura vibrante. Relaxe em Copacabana, suba o P\xE3o de A\xE7\xFAcar e sinta a energia da cidade maravilhosa.",
      heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
      heroImageAlt: "Vista do Rio de Janeiro com Cristo Redentor",
      coordinates: { lat: -22.9068, lng: -43.1729 },
      category: "Cidade",
      rating: 4.7,
      reviewCount: 850
    }
  ];
  const destinationsToRender = destinations || defaultDestinations;
  const isCompact = variant === "compact";
  return /* @__PURE__ */ React.createElement(
    "section",
    {
      className: cn(
        "py-20 bg-zinc-50 dark:bg-zinc-950",
        !showBackground && "bg-transparent",
        isCompact && "py-12",
        className
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 sm:px-6 lg:px-12" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl" }, /* @__PURE__ */ React.createElement("div", { className: cn("text-center", isCompact ? "mb-8" : "mb-14") }, /* @__PURE__ */ React.createElement("h2", { className: cn(
      "font-extrabold text-zinc-900 dark:text-white motion-safe:animate-fade-in mb-3",
      isCompact ? "text-2xl md:text-3xl" : "text-4xl"
    ) }, title || getMessage("title", "Destinos em Destaque")), /* @__PURE__ */ React.createElement("p", { className: cn(
      "text-zinc-700 dark:text-zinc-300 motion-safe:animate-fade-in",
      isCompact ? "text-base max-w-2xl" : "text-xl max-w-3xl"
    ), style: { margin: "0 auto" } }, subtitle || getMessage("subtitle", "Descubra os lugares mais incr\xEDveis do mundo com experi\xEAncias \xFAnicas e inesquec\xEDveis."))), /* @__PURE__ */ React.createElement("div", { className: cn(
      "grid gap-10",
      isCompact ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "sm:grid-cols-2 lg:grid-cols-3"
    ) }, destinationsToRender.map((destination, index) => /* @__PURE__ */ React.createElement(
      DestinationCard,
      {
        key: destination.slug,
        destination,
        priority: index === 0,
        variant,
        ImageComponent,
        LinkComponent,
        customMessages
      }
    ))), showAllDestinationsButton && /* @__PURE__ */ React.createElement("div", { className: "mt-16 text-center" }, LinkComponent ? /* @__PURE__ */ React.createElement(
      LinkComponent,
      {
        href: allDestinationsUrl,
        className: "inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-blue-700 shadow-lg shadow-blue-500/50 dark:shadow-none"
      },
      /* @__PURE__ */ React.createElement("span", null, getMessage("allDestinations", "Ver Todos os Destinos")),
      /* @__PURE__ */ React.createElement(ArrowRight, { className: "w-5 h-5" })
    ) : /* @__PURE__ */ React.createElement(
      "a",
      {
        href: allDestinationsUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-blue-700 shadow-lg shadow-blue-500/50 dark:shadow-none"
      },
      /* @__PURE__ */ React.createElement("span", null, getMessage("allDestinations", "Ver Todos os Destinos")),
      /* @__PURE__ */ React.createElement(ArrowRight, { className: "w-5 h-5" })
    ))))
  );
};
var FeaturedDestinations_default = FeaturedDestinations;

export {
  FeaturedDestinations,
  FeaturedDestinations_default
};
//# sourceMappingURL=chunk-CGTNB4FH.js.map