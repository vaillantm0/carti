import React from 'react';
import { useNavigate } from 'react-router-dom';
// Import the specific icons from react-icons
import { 
  LuLayoutDashboard, 
  LuShoppingBag, 
  LuUsers, 
  LuPackage, 
  LuLogOut 
} from "react-icons/lu";

type Section = 'dashboard' | 'orders' | 'users' | 'products';

interface SidebarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  const navigate = useNavigate();

  // Store the Component itself in the array
  const navItems = [
    { id: 'dashboard' as Section, icon: <LuLayoutDashboard className="text-xl" />, label: 'Dashboard' },
    { id: 'orders' as Section, icon: <LuShoppingBag className="text-xl" />, label: 'Orders' },
    { id: 'users' as Section, icon: <LuUsers className="text-xl" />, label: 'Users' },
    { id: 'products' as Section, icon: <LuPackage className="text-xl" />, label: 'Products' },
  ];

  const handleSignOut = () => {
    navigate('/'); 
  };

  return (
    <aside className="w-[280px] h-screen fixed bg-white border-r border-slate-200 p-8 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-12 pl-2">
        <span className="text-xl font-bold tracking-tight text-[#2c72f1]">Kappe Shop</span>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center p-3 mb-2 rounded-xl font-medium cursor-pointer transition-all gap-3 ${
              activeSection === item.id
                ? 'bg-[#2c72f1] text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {/* Render the React Icon component */}
            <span className="w-6 flex justify-center">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center p-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-all border border-transparent hover:border-red-100 mt-auto gap-3"
      >
        <LuLogOut className="text-xl" />
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;