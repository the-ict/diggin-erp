import { Users, User, Truck, MapPin, Package, ArrowLeftRight, ShoppingCart, LayoutGrid } from 'lucide-react';
import { MenuItem } from './model';
import { LanguageRoutes } from '@/shared/config/i18n/types';

const menu: MenuItem[] = [
  { title: 'Navbar.dashboard', url: '/dashboard', icon: LayoutGrid, roles: ['ADMIN', 'WORKER'] },
  { title: 'Navbar.worker', url: '/dashboard/worker', icon: Users, roles: ['ADMIN'] },
  { title: 'Navbar.team', url: '/dashboard/team', icon: User, roles: ['ADMIN'] },
  { title: 'Navbar.machine', url: '/dashboard/machine', icon: Truck, roles: ['ADMIN'] },
  { title: 'Navbar.well', url: '/dashboard/well', icon: MapPin, roles: ['ADMIN', 'WORKER'] },
  { title: 'Navbar.wareitem', url: '/dashboard/wareitem', icon: Package, roles: ['ADMIN', 'WAREHOUSEMAN'] },
  { title: 'Navbar.purchase', url: '/dashboard/purchase', icon: ShoppingCart, roles: ['ADMIN', 'MANAGER'] },
  { title: 'Navbar.transaction', url: '/dashboard/transaction', icon: ArrowLeftRight, roles: ['ADMIN'] },
];

const languages: { name: string; key: LanguageRoutes }[] = [
  {
    name: "Lotin (O'zbek)",
    key: LanguageRoutes.UZ,
  },
  {
    name: 'Кирилл (Ўзбек)',
    key: LanguageRoutes.KI,
  },
];

export { menu, languages };