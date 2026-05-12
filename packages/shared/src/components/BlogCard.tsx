"use client";

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

export interface BlogCardProps {
  image: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string; // Adicionado para mais cor e contexto
  onClick?: () => void;
  className?: string;
}

const BlogCard: FC<BlogCardProps> = ({ 
  image, 
  title, 
  excerpt, 
  date, 
  category = "Viagem", 
  onClick, 
  className 
}) => {
  
  const CardWrapper = onClick ? motion.button : motion.article;

  return (
    <CardWrapper
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-[2rem] bg-slate-900 border border-white/10 text-left shadow-2xl transition-all duration-500 hover:border-indigo-500/50 hover:shadow-indigo-500/20",
        className
      )}
    >
      {/* 1. Imagem com Efeito de Zoom e Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          src={image}
          alt={`Artigo: ${title}`}
          className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
          loading="lazy"
        />
        
        {/* Badge de Categoria */}
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md border border-indigo-500/30">
            {category}
          </span>
        </div>

        {/* Ícone de Ação Flutuante */}
        <div className="absolute right-4 top-4 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <div className="rounded-full bg-white p-2 text-slate-950 shadow-lg">
             <ArrowUpRight className="h-4 w-4" />
           </div>
        </div>
      </div>

      {/* 2. Conteúdo com Glassmorphism sutil */}
      <div className="relative flex flex-1 flex-col p-6">
        {/* Data com ícone */}
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          <time dateTime={date}>{date}</time>
        </div>

        <h4 className="mb-3 text-xl font-bold leading-tight text-white group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
          {title}
        </h4>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-400">
          {excerpt}
        </p>

        {/* 3. Rodapé do Card / Link Visual */}
        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ler Artigo Completo
          <div className="h-px w-8 bg-indigo-500" />
        </div>
      </div>

      {/* Efeito de Brilho no Canto inferior */}
      <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
    </CardWrapper>
  );
};

export default BlogCard;
