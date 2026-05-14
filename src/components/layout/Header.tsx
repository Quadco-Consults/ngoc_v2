import { Bell } from 'lucide-react';
import { HiBars3BottomLeft } from 'react-icons/hi2';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { toggleSidebar } from '../../store/uiSlice';

const UserInitials = ({ name, className = '' }: { name: string; className?: string }) => {
  const getInitials = (name: string) => {
    if (!name) return 'AU';
    const nameArray = name.trim().split(' ');
    if (nameArray.length === 1) {
      return nameArray[0][0].toUpperCase();
    }
    return nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase();
  };

  return (
    <div
      className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default function Header() {
  const dispatch = useAppDispatch();
  const isExpanded = useAppSelector((state) => state.ui.isSidebarExpanded);
  const { user } = useAppSelector((state) => state.auth);

  const fullName = user?.name || 'Admin User';

  return (
    <header className="p-2 flex items-center justify-between h-full">
      {/* Left side - Toggle and Logo */}
      <div className="flex items-center px-1 space-x-[32px]">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`h-[50px] w-[50px] flex items-center justify-center hover:bg-[#00AD511A] transition-colors duration-300 rounded-full ${
            isExpanded ? 'bg-[#00AD51]' : 'text-[#4F4F4F]'
          }`}
        >
          <HiBars3BottomLeft
            size={30}
            className={`transition-colors duration-300 ${
              isExpanded ? 'text-white' : 'text-[#000000]'
            }`}
          />
        </button>
        <img src="/NNPC logo.png" alt="NNPC Logo" className="h-[50px] w-auto" />
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button className="bg-white rounded-full p-3 relative cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-200 shadow-sm">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg">
            3
          </span>
        </button>

        {/* User Profile */}
        <button className="cursor-pointer">
          <UserInitials name={fullName} className="bg-[#00AD51]" />
        </button>
      </div>
    </header>
  );
}
