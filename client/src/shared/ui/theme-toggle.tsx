'use client';

import * as React from 'react';
import { Sun } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export function ModeToggle() {
  return (
    <ToggleGroup type="single" className="border">
      <ToggleGroupItem
        value="light"
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <span className="sr-only">Light theme only</span>
    </ToggleGroup>
  );
}
