"use client";

import { useEffect } from 'react';
import type { UiTheme } from '@/types';

interface DynamicThemeStyleProps {
  theme: UiTheme | null;
  applyTo?: string; // CSS selector for the element to apply the theme to, defaults to :root
}

// Helper function to determine if a color is light or dark
// This is a very basic implementation. More sophisticated methods exist.
function isColorLight(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp > 127.5; // Adjust threshold as needed
}


export function DynamicThemeStyle({ theme, applyTo = ":root" }: DynamicThemeStyleProps) {
  useEffect(() => {
    const element = applyTo === ':root' ? document.documentElement : document.querySelector(applyTo);
    if (!element) return;

    if (theme) {
      // Apply AI generated colors
      element.style.setProperty('--dynamic-background', theme.backgroundColor);
      element.style.setProperty('--dynamic-primary', theme.primaryColor);
      element.style.setProperty('--dynamic-accent', theme.accentColor);

      // Determine and apply contrasting foregrounds
      // For simplicity, black or white foregrounds are chosen.
      const primaryFg = isColorLight(theme.primaryColor) ? 'hsl(0 0% 0%)' : 'hsl(0 0% 100%)'; // Black or White
      const accentFg = isColorLight(theme.accentColor) ? 'hsl(0 0% 0%)' : 'hsl(0 0% 100%)'; // Black or White
      const backgroundFg = isColorLight(theme.backgroundColor) ? 'hsl(0 0% 10%)' : 'hsl(0 0% 90%)'; // Dark gray or Light gray

      element.style.setProperty('--dynamic-primary-foreground', primaryFg);
      element.style.setProperty('--dynamic-accent-foreground', accentFg);
      element.style.setProperty('--dynamic-foreground', backgroundFg);

      // To make these dynamic variables actually take effect over existing theme,
      // you would need to use these --dynamic-* variables in your components,
      // or override the standard --background, --primary etc. variables directly.
      // For this demo, we will override the standard ones within the scope of `applyTo`.
      element.style.setProperty('--background', theme.backgroundColor);
      element.style.setProperty('--foreground', backgroundFg);
      element.style.setProperty('--primary', theme.primaryColor);
      element.style.setProperty('--primary-foreground', primaryFg);
      element.style.setProperty('--accent', theme.accentColor);
      element.style.setProperty('--accent-foreground', accentFg);
      
      // Also update card, popover, secondary, muted, border, input, ring for consistency
      // This simplified version assumes these should also follow the main background/primary tones
      element.style.setProperty('--card', theme.backgroundColor); // or a slightly lighter/darker variant
      element.style.setProperty('--card-foreground', backgroundFg);
      element.style.setProperty('--popover', theme.backgroundColor);
      element.style.setProperty('--popover-foreground', backgroundFg);
      // For secondary, muted, border, input, ring - more complex derivation would be needed.
      // For now, they might retain their original values or be minimally adjusted.
      // E.g., make border a slightly darker shade of the new background
      // element.style.setProperty('--border', adjustBrightness(theme.backgroundColor, -10)); // Fictional adjustBrightness

    } else {
      // Optionally clear styles if theme is removed, or revert to defaults
      // This part depends on desired behavior. For now, we do nothing if theme is null.
      // Or, clear the overrides:
      // ['--background', '--foreground', '--primary', '--primary-foreground', '--accent', '--accent-foreground',
      //  '--card', '--card-foreground', '--popover', '--popover-foreground'].forEach(prop => element.style.removeProperty(prop));
    }

    // Cleanup function to remove styles when component unmounts or theme changes to null
    return () => {
      if (theme) { // Only remove if they were set by this specific theme instance
         ['--background', '--foreground', '--primary', '--primary-foreground', '--accent', '--accent-foreground',
         '--card', '--card-foreground', '--popover', '--popover-foreground',
         '--dynamic-background', '--dynamic-primary', '--dynamic-accent', 
         '--dynamic-primary-foreground', '--dynamic-accent-foreground', '--dynamic-foreground'
        ].forEach(prop => element.style.removeProperty(prop));
      }
    };

  }, [theme, applyTo]);

  return null; // This component does not render anything itself
}
