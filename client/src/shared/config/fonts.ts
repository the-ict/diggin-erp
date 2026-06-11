import { Roboto } from 'next/font/google';

const robotoText = Roboto({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-roboto',
  subsets: ['latin', 'cyrillic'],
});

export { robotoText };
