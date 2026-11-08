import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../assets/categoriesList';
import { activityService } from '../../services/activityService';

export default function CategorySection() {
  const navigate = useNavigate();

  const handleCategoryClick = (cat: (typeof categories)[number]) => {
    // Log category click activity
    activityService.log('view_category', { category: cat.title, path: cat.page }).catch(err => console.error('Failed to log category click', err));

    navigate(cat.page);
  };

  return (
    <div className="bg-background py-20 px-6 border-y border-border/50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-l-8 border-rose-600 pl-8 leading-[0.9]">
          Shop For<br /><span className="text-rose-600">New Arrival</span>
        </h2>
        <div className="flex flex-wrap justify-center lg:justify-end gap-3 md:gap-4 lg:max-w-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="px-6 md:px-8 py-4 bg-secondary/50 border border-border text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 shadow-sm"
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
