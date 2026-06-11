"use client"

import { Accordion } from '@/shared/ui/accordion';
import { Button } from '@/shared/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/shared/ui/navigation-menu';
import RenderMobileMenuItem from './RenderMobileMenuItem';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { Menu } from 'lucide-react';
import { PRODUCT_INFO } from '@/shared/constants/data';
import { menu } from '../lib/data';
import RenderMenuItem from './RenderItem';
import { ChangeLang } from './ChangeLang';
import Link from 'next/link';

const Navbar = () => {
  return (
    <section className="py-4 bg-white">
      <div className="custom-container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href={'/'} className="flex items-center gap-2">
              <img
                src={PRODUCT_INFO.logo}
                className="max-h-8"
                alt={PRODUCT_INFO.name}
              />
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                {PRODUCT_INFO.name}
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => RenderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ChangeLang />
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
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => RenderMobileMenuItem(item))}
                  </Accordion>
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
