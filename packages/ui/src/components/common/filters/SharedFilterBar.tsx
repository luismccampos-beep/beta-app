 "use client";

 import type { ReactNode } from "react";
 import {
   ChevronDown,
   Grid3x3,
   List,
   Search,
   SlidersHorizontal,
   X,
 } from "lucide-react";

 import { cn } from "../../../utils/index";

 type ViewMode = "grid" | "list";

 export interface SharedFilterBarSortOption {
   value: string;
   label: string;
 }

 export interface SharedFilterBarProps {
   query: string;
   onQueryChange: (query: string) => void;
   searchPlaceholder?: string;
   sortBy?: string;
   sortOptions?: SharedFilterBarSortOption[];
   onSortChange?: (value: string) => void;
   viewMode?: ViewMode;
   onViewModeChange?: (mode: ViewMode) => void;
   filtersLabel?: string;
   onToggleFilters?: () => void;
   activeFiltersCount?: number;
   rightSlot?: ReactNode;
 }

 export function SharedFilterBar({
   query,
   onQueryChange,
   searchPlaceholder = "Procurar...",
   sortBy,
   sortOptions,
   onSortChange,
   viewMode,
   onViewModeChange,
   filtersLabel = "Filtros",
   onToggleFilters,
   activeFiltersCount = 0,
   rightSlot,
 }: SharedFilterBarProps) {
   const hasSorting = Boolean(sortOptions && onSortChange);
   const hasViewMode = Boolean(viewMode && onViewModeChange);
   const hasFiltersToggle = Boolean(onToggleFilters);

   return (
     <div className="sticky top-0 z-40 flex flex-col gap-4 rounded-xl bg-white/80 px-4 py-3 ring-1 ring-zinc-200/60 supports-[backdrop-filter]:backdrop-blur dark:bg-zinc-900/70 dark:ring-zinc-700/60 sm:flex-row sm:items-center sm:justify-between">
       <div className="relative flex-1">
         <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
         <input
           type="text"
           value={query}
           onChange={(e) => onQueryChange(e.target.value)}
           placeholder={searchPlaceholder}
           className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-10 text-sm transition-colors placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
         />
         {query && (
           <button
             type="button"
             onClick={() => onQueryChange("")}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
             aria-label="Limpar pesquisa"
           >
             <X className="h-4 w-4" />
           </button>
         )}
       </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
         {hasSorting &&
           sortOptions &&
           sortOptions.length > 0 &&
           sortBy !== undefined && (
            <div className="relative w-full sm:w-auto">
               <select
                 value={sortBy}
                 onChange={(e) => onSortChange?.(e.target.value)}
                className="w-full appearance-none rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:w-auto"
               >
                 {sortOptions.map((opt) => (
                   <option key={opt.value} value={opt.value}>
                     {opt.label}
                   </option>
                 ))}
               </select>
               <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
             </div>
           )}

         {hasViewMode && viewMode && (
           <div className="flex rounded-lg border border-zinc-300 dark:border-zinc-700">
             <button
               type="button"
               onClick={() => onViewModeChange?.("grid")}
               className={cn(
                 "p-2 transition-colors",
                 viewMode === "grid"
                   ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                   : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
               )}
               aria-label="Vista em grelha"
             >
               <Grid3x3 className="h-4 w-4" />
             </button>
             <button
               type="button"
               onClick={() => onViewModeChange?.("list")}
               className={cn(
                 "p-2 transition-colors",
                 viewMode === "list"
                   ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                   : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
               )}
               aria-label="Vista em lista"
             >
               <List className="h-4 w-4" />
             </button>
           </div>
         )}

         {rightSlot}

         {hasFiltersToggle && (
           <button
             type="button"
             onClick={onToggleFilters}
             className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:hidden"
           >
             <SlidersHorizontal className="h-4 w-4" />
             {filtersLabel}
             {activeFiltersCount > 0 && (
               <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                 {activeFiltersCount}
               </span>
             )}
           </button>
         )}
       </div>
     </div>
   );
 }
