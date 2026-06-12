import { Users, User, Truck, MapPin, Package, ArrowLeftRight, ShoppingCart, LayoutGrid } from 'lucide-react';
import { MenuItem } from './model';
import { LanguageRoutes } from '@/shared/config/i18n/types';

const menu: MenuItem[] = [
  { title: 'Navbar.dashboard', url: '/dashboard', icon: LayoutGrid },
  { title: 'Navbar.worker', url: '/dashboard/worker', icon: Users },
  { title: 'Navbar.team', url: '/dashboard/team', icon: User },
  { title: 'Navbar.machine', url: '/dashboard/machine', icon: Truck },
  { title: 'Navbar.well', url: '/dashboard/well', icon: MapPin },
  { title: 'Navbar.wareitem', url: '/dashboard/wareitem', icon: Package },
  { title: 'Navbar.purchase', url: '/dashboard/purchase', icon: ShoppingCart },
  { title: 'Navbar.transaction', url: '/dashboard/transaction', icon: ArrowLeftRight },
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