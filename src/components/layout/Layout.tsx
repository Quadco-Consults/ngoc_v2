import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../hooks/useRedux';

export default function Layout() {
  const isExpanded = useAppSelector((state) => state.ui.isSidebarExpanded);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 h-16 bg-[#F6F8FC]">
        <Header />
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 mt-16 overflow-hidden">
        {/* Collapsible Sidebar */}
        <div
          className={`transition-all duration-300 ${
            isExpanded ? 'w-[15%]' : 'w-[5%]'
          }`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 h-full w-full overflow-y-auto scrollbar-hide p-2 bg-[#F6F8FC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
