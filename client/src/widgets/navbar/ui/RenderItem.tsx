import {
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/shared/ui/navigation-menu';
import { MenuItem } from '../lib/model';
import { useTranslations } from 'next-intl';

interface RenderMenuItemProps {
  item: MenuItem;
}

const RenderMenuItem = ({ item }: RenderMenuItemProps) => {
  const t = useTranslations();

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted gap-2"
      >
        {item.icon && <item.icon className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 transition-colors" />}
        <span>{t(item.title)}</span>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default RenderMenuItem;
