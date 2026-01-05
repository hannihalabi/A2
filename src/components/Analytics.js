'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Analytics({ gaId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.toString() || '';

  useEffect(() => {
    if (!gaId) return;
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    const url = query ? `${pathname}?${query}` : pathname;
    window.gtag('config', gaId, { page_path: url });
  }, [gaId, pathname, query]);

  return null;
}
