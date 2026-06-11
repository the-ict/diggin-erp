import { Users, User, Wrench, Truck, MapPin, Package, ArrowLeftRight, ShoppingCart, LayoutGrid } from 'lucide-react';
import { MenuItem } from './model';
import { LanguageRoutes } from '@/shared/config/i18n/types';

const menu: MenuItem[] = [
  { title: 'Ҳаммаси', url: '/dashboard', icon: LayoutGrid },
  {
    title: 'Ишчилар',
    url: '/dashboard/workers',
    items: [
      {
        title: 'Барча ишчилар',
        description: 'Ҳамма ишчилар рўйхати',
        icon: Users,
        url: '/dashboard/workers',
      },
      {
        title: 'Жамоалар',
        description: 'Ишчилар жамоалари',
        icon: User,
        url: '/dashboard/teams',
      },
    ],
  },
  {
    title: 'Техника',
    url: '/dashboard/machines',
    items: [
      {
        title: 'Машиналар',
        description: 'Барча машиналар рўйхати',
        icon: Truck,
        url: '/dashboard/machines',
      },
      {
        title: 'Қудуқлар',
        description: 'Қудуқлар маълумотлари',
        icon: MapPin,
        url: '/dashboard/wells',
      },
    ],
  },
  {
    title: 'Омбор',
    url: '/dashboard/warehouse',
    items: [
      {
        title: 'Махсулотлар',
        description: 'Омбордаги махсулотлар',
        icon: Package,
        url: '/dashboard/warehouse',
      },
      {
        title: 'Транзакциялар',
        description: 'Омбор кириш-чиқиши',
        icon: ArrowLeftRight,
        url: '/dashboard/transactions',
      },
    ],
  },
  {
    title: 'Олди Сотди',
    url: '/dashboard/purchases',
    items: [
      {
        title: 'Харидлар',
        description: 'Барча харидлар рўйхати',
        icon: ShoppingCart,
        url: '/dashboard/purchases',
      },
      {
        title: 'Транзакциялар',
        description: 'Пул транзакциялари',
        icon: ArrowLeftRight,
        url: '/dashboard/transactions',
      },
    ],
  },
];

const languages: { name: string; key: LanguageRoutes }[] = [
  {
    name: "O'zbekcha",
    key: LanguageRoutes.UZ,
  },
  {
    name: 'Ўзбекча',
    key: LanguageRoutes.KI,
  },
  {
    name: 'Русский',
    key: LanguageRoutes.RU,
  },
];

export { menu, languages };