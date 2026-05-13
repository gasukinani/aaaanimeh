import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';

interface AnimeCardProps {
  key?: React.Key;
  anime: any;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const navigate = useNavigate();
  const imageUrl = anime.img || (anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url);
  const animeId = anime.id || anime.mal_id;
  const animeTitle = anime.title_english || anime.title;
  
  return (
    <Link to={`/anime/${animeId}`} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/5 p-3 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col gap-3 shadow-xl backdrop-blur-md">
      <div className="relative aspect-[15/22] bg-zinc-800 rounded-xl overflow-hidden shrink-0 shadow-lg">
        <img
          src={imageUrl || 'https://via.placeholder.com/600x900?text=No+Image'}
          alt={animeTitle}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {(anime.score || anime.episode) && (
          <div className="absolute top-2 right-2 bg-indigo-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-black italic flex items-center gap-1 shadow-lg shadow-indigo-500/20 uppercase tracking-tighter">
            {anime.score ? <Star className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
            {anime.score || `EP ${anime.episode}`}
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
          <div className="bg-indigo-500 shadow-xl shadow-indigo-500/40 backdrop-blur-md rounded-full p-3.5 transform group-hover:rotate-12 transition-transform">
            <Play className="w-5 h-5 fill-current text-white ml-0.5" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-start px-1">
        <h3 className="font-black text-xs md:text-sm leading-tight line-clamp-2 uppercase tracking-tighter italic group-hover:text-indigo-400 transition-colors" title={animeTitle}>
          {animeTitle}
        </h3>
        
        {/* Genres/Tags */}
        {anime.genres && Array.isArray(anime.genres) && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 2).map((genre: any) => {
              const gName = typeof genre === 'string' ? genre : genre.name;
              const gId = typeof genre === 'string' ? genre.toLowerCase() : genre.mal_id;
              return (
                <button
                  key={gId}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/search?genre=${gId}&name=${encodeURIComponent(gName)}`);
                  }}
                  className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-white/40 hover:text-indigo-400"
                >
                  {gName}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-center mt-auto pt-2">
          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{anime.released || anime.year || anime.aired?.prop?.from?.year || 'Now'}</p>
          <span className="text-[9px] text-indigo-400 font-black italic uppercase tracking-tighter">{anime.type || (anime.episodes ? `${anime.episodes} EPS` : 'AIRING')}</span>
        </div>
      </div>
    </Link>
  );
}
