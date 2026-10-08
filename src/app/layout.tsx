import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import {
  MantineProvider,
  ColorSchemeScript,
  createTheme,
} from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Top Lashes Perú',
  description: 'Sistema administrativo de Top Lashes Perú',
};

const theme = createTheme({
  fontFamily: 'var(--font-body), system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'var(--font-heading), Georgia, serif',
  },
  primaryColor: 'dark',
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        size: 'sm',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <DatesProvider settings={{ locale: 'es' }}>
            <Notifications position="top-right" />
            {children}
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
