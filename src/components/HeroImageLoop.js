'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const images = [
  '/images/Viktned-1.jpg',
  '/images/Viktned-2.avif',
  '/images/viktned-3.avif',
  '/images/viktned-4.jpg',
  '/images/viktned-5.jpg'
];

export default function HeroImageLoop() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-carousel" aria-label="Före och efter-bilder">
      {images.map((src, index) => (
        <div
          key={src}
          className={`hero-slide ${index === activeIndex ? 'active' : ''}`}
        >
          <Image
            src={src}
            alt="Resultatbild"
            fill
            sizes="(max-width: 900px) 100vw, 40vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
