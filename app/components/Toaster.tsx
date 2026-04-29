'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const toastOptions: ToasterProps = {
  position: 'top-right',
  toastOptions: {
    duration: 4500,
    style: {
      background: 'rgba(255, 255, 255, 0.94)',
      color: '#17212b',
      border: '1px solid rgba(23, 33, 43, 0.08)',
      borderRadius: '16px',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
    },
    success: {
      style: {
        background: '#ecfdf5',
        color: '#065f46',
      },
    },
    error: {
      style: {
        background: '#fef2f2',
        color: '#991b1b',
      },
    },
  },
};

export function Toaster() {
  return <Sonner {...toastOptions} />;
}