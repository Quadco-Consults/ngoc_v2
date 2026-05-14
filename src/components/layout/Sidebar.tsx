import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gauge,
  Workflow,
  Factory,
  Flame,
  BarChart3,
  FileText,
  Settings,
  MapPin,
  Building2,
  Zap,
  TrendingUp,
  AlertTriangle,
  FileBarChart,
  Users,
  Layers,
} from 'lucide-react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useAppSelector } from '../../hooks/useRedux';

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    path: '',
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Operations Dashboard', path: '/dashboard/operations', icon: Settings },
      { label: 'Gas Dashboard', path: '/dashboard/gas', icon: Flame },
      { label: 'Infrastructure Dashboard', path: '/dashboard/infrastructure', icon: Factory },
    ],
  },
  {
    path: '/assets',
    label: 'Gas Assets',
    icon: MapPin,
    children: [
      { label: 'Gas Fields', path: '/assets/fields', icon: Gauge },
      { label: 'Gas Wells', path: '/assets/wells', icon: Gauge },
      { label: 'Gas Pipelines', path: '/assets/pipelines', icon: Workflow },
      { label: 'Gas Plants', path: '/assets/plants', icon: Factory },
      { label: 'AGG Stations', path: '/assets/agg-stations', icon: Gauge },
      { label: 'LNG Terminals', path: '/assets/lng-terminals', icon: Building2 },
      { label: 'Power Stations', path: '/assets/power-stations', icon: Zap },
    ],
  },
  {
    path: '/production',
    label: 'Production',
    icon: TrendingUp,
    children: [
      { label: 'Gas Production', path: '/production/gas', icon: Flame },
      { label: 'Field Production', path: '/production/fields', icon: BarChart3 },
      { label: 'Plant Production', path: '/production/plants', icon: Factory },
      { label: 'Flare Monitoring', path: '/production/flare', icon: AlertTriangle },
    ],
  },
  {
    path: '/commercial',
    label: 'Commercial',
    icon: FileText,
    children: [
      { label: 'Gas Nominations', path: '/commercial/nominations', icon: FileText },
      { label: 'Gas Allocations', path: '/commercial/allocations', icon: BarChart3 },
      { label: 'Gas Balancing', path: '/commercial/balancing', icon: Gauge },
      { label: 'Gas Contracts', path: '/commercial/contracts', icon: FileBarChart },
    ],
  },
  {
    path: '/operations',
    label: 'Operations',
    icon: Settings,
    children: [
      { label: 'Maintenance', path: '/operations/maintenance', icon: Settings },
      { label: 'Deferments', path: '/operations/deferments', icon: AlertTriangle },
      { label: 'Incidents', path: '/operations/incidents', icon: AlertTriangle },
    ],
  },
  { path: '/asset-management', label: 'Asset Management', icon: Layers },
  { path: '/network/pipeline-network', label: 'Pipeline Network', icon: Workflow },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/users', label: 'Users', icon: Users },
];

const SidebarItem = ({
  item,
  isExpanded,
  isActive,
  isOpen,
  onToggle,
}: {
  item: NavItem;
  isExpanded: boolean;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="w-full">
      <NavLink
        to={item.children ? '#' : item.path}
        onClick={item.children ? onToggle : undefined}
        className={`hover:bg-[#00AD511A] p-2 rounded w-full flex items-center justify-between ${
          isActive ? 'text-[#00AD51] bg-[#00AD511A]' : 'text-[#4F4F4F]'
        }`}
      >
        <div className="flex items-center">
          <item.icon className="w-[15px] h-[15px]" />
          {isExpanded && (
            <span className="ml-3 text-sm whitespace-nowrap">{item.label}</span>
          )}
        </div>
        {isExpanded && item.children && (
          <span>
            {isOpen ? (
              <FiChevronDown size={14} />
            ) : (
              <FiChevronRight size={14} />
            )}
          </span>
        )}
      </NavLink>

      {isExpanded && isOpen && item.children && (
        <div className="ml-6 mt-1 flex flex-col gap-1">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `text-sm p-2 rounded hover:bg-[#00AD511A] flex items-center ${
                  isActive ? 'text-[#00AD51] font-medium' : 'text-[#4F4F4F]'
                }`
              }
            >
              <child.icon className="w-[12px] h-[12px] mr-2" />
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const isExpanded = useAppSelector((state) => state.ui.isSidebarExpanded);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const handleToggle = (path: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <aside
      className={`transition-all duration-300 my-2 rounded-[10px] h-[calc(100vh-5rem)] px-2 bg-white flex flex-col items-center py-2 w-full ${
        isExpanded ? 'w-64' : 'max-w-[50px]'
      }`}
    >
      <nav
        className={`flex flex-col items-center w-full ${
          isExpanded ? 'gap-1' : 'gap-2'
        }`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const isOpen = !!openItems[item.path];

          return (
            <SidebarItem
              key={item.path}
              item={item}
              isExpanded={isExpanded}
              isActive={isActive}
              isOpen={isOpen}
              onToggle={() => handleToggle(item.path)}
            />
          );
        })}
      </nav>
    </aside>
  );
}
