import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import this

// ... (types and interfaces stay the same)

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  const navigate = useNavigate(); // Initialize the hook

  const navItems = [
    { id: 'dashboard' as Section, icon: 'fa-solid fa-grid-2', label: 'Dashboard' },
    { id: 'orders' as Section, icon: 'fa-solid fa-cart-shopping', label: 'Orders' },
    { id: 'users' as Section, icon: 'fa-solid fa-users', label: 'Users' },
    { id: 'products' as Section, icon: 'fa-solid fa-box-archive', label: 'Products' },
  ];

  const handleSignOut = () => {
    // Perform logout logic here (clear tokens, etc.)
    navigate('/home'); // Redirect to /home
  };

  return (
    <aside className="w-[280px] h-screen fixed bg-white border-r border-slate-200 p-8 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-12 pl-2">
        <span className="text-xl font-bold tracking-tight text-[#2c72f1]">Kappe Shop</span>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <button // Changed to button for better accessibility
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center p-3 mb-2 rounded-xl font-medium cursor-pointer transition-all ${
              activeSection === item.id
                ? 'bg-[#2c72f1] text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <i className={`${item.icon} w-6 mr-3`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center p-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-all border border-transparent hover:border-red-100 mt-auto"
      >
        <i className="fa-solid fa-arrow-right-from-bracket mr-3"></i>
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;