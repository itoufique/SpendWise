import React from 'react';

const BrandBar = ({ brands = [], selected, onSelect }) => {
  return (
    <div className="mt-4 flex items-center gap-3 overflow-x-auto py-2">
      <button
        onClick={() => onSelect('')}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${selected === '' ? 'bg-accent text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
        All
      </button>
      {brands.map((b) => (
        <button
          key={b}
          onClick={() => onSelect(b)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${selected === b ? 'bg-accent text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
          {b}
        </button>
      ))}
    </div>
  );
};

export default BrandBar;
