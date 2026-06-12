"use client"

import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import RenderMobileMenuItem from './RenderMobileMenuItem';
import RenderMenuItem from './RenderItem';
import { ChangeLang } from './ChangeLang';
import { Menu } from 'lucide-react';
import { menu } from '../lib/data';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/shared/ui/navigation-menu';
import Link from 'next/link';
import { useAuth } from '@/shared/lib/hooks/use-auth';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const filteredMenu = menu.filter((item) => {
    if (!user) return false;
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  if(pathname.includes("login")) return;

  return (
    <section className="py-4 bg-white">
      <div className="custom-container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {filteredMenu.map((item) => RenderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ChangeLang />
            {user && (
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </nav>

        <div className="block lg:hidden border-b border-gray-200 pb-3">
          <div className="flex items-center justify-between">
            <Link href={'/'} className="flex items-center gap-2 font-bold text-gray-900">
              DIGGING-ERP
            </Link>
            <Sheet>
              <div className="space-x-2">
                <ChangeLang />
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
              </div>
              <SheetContent className="overflow-y-auto bg-white border-gray-200">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={'/'} className="flex items-center gap-2 font-bold text-gray-900">
                      DIGGING-ERP
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex w-full flex-col gap-4">
                    {filteredMenu.map((item) => RenderMobileMenuItem(item))}
                  </div>
                  {user && (
                    <Button variant="outline" onClick={logout} className="w-full">
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
