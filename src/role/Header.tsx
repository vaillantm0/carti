import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 w-96 flex items-center gap-12 shadow-sm">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
          <input
            type="text"
            className="outline-none text-sm w-full"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">Manzi Admin</p>
          <p className="text-[11px] text-slate-400 font-medium">Administrator</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
          
        </div>
      </div>
    </header>
  );
};

export default Header;