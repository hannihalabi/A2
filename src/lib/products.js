export const products = [
  {
    id: 'life-coaching',
    name: 'Life coaching',
    tagline: 'Välj paket',
    description: 'Personlig coaching med tydlig struktur, uppföljning och konkreta delmål.',
    story:
      'Välj mellan ett kortare paket med 10 sessioner eller ett längre paket med 20 sessioner. Fokus ligger på vardagsstruktur, motivation och hållbar utveckling.',
    highlights: ['Personlig coach', 'Tydlig plan', 'Löpande uppföljning'],
    variants: [
      {
        id: '10',
        label: 'Life coaching 10',
        duration: '10 sessioner',
        price: 300000
      },
      {
        id: '20',
        label: 'Life coaching 20',
        duration: '20 sessioner',
        price: 520000,
        compareAtPrice: 600000
      }
    ]
  },
  {
    id: 'dietplan',
    name: 'Dietplan',
    tagline: 'Välj upplägg',
    description: 'Strukturerat kostupplägg med praktiska rekommendationer och tydliga rutiner.',
    story:
      'Välj mellan ett upplägg för 10 dagar eller 20 dagar. Du får ett genomtänkt schema, tydliga riktlinjer och stöd för att hålla planen.',
    highlights: ['Tydligt upplägg', 'Praktiska råd', 'Enkel att följa'],
    variants: [
      {
        id: '10',
        label: 'Dietplan 10',
        duration: '10 dagar',
        price: 350000
      },
      {
        id: '20',
        label: 'Dietplan 20',
        duration: '20 dagar',
        price: 550000
      }
    ]
  },
  {
    id: 'brunare-hud',
    name: 'Brunare hud',
    tagline: 'Skönhetsbehandling',
    description: 'Kosmetisk behandling med fokus på jämn ton och ett naturligt resultat.',
    story:
      'En enkel behandling för dig som vill ha en varmare hudton inför vardag, resa eller event. Upplägget är gjort för att vara smidigt och lätt att boka.',
    highlights: ['Jämn finish', 'Naturlig ton', 'Snabb bokning'],
    variants: [
      {
        id: 'standard',
        label: 'Brunare hud',
        duration: '1 behandling',
        price: 65000
      }
    ]
  },
  {
    id: 'brun-spray',
    name: 'Brun spray',
    tagline: 'Spraytan',
    description: 'Snabb spraybehandling för en jämn och solkysst ton.',
    story:
      'En smidig behandling för dig som vill ha färg direkt med ett jämnt resultat. Passar inför event, resa eller när du bara vill ha en varmare ton.',
    highlights: ['Snabb behandling', 'Jämn ton', 'Enkel bokning'],
    variants: [
      {
        id: 'standard',
        label: 'Brun spray',
        duration: '1 behandling',
        price: 80000
      }
    ]
  }
];

export const productsById = products.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

export function getProductVariant(productId, variantId) {
  const product = productsById[productId];
  if (!product?.variants?.length) return null;
  if (!variantId) return product.variants[0];
  return product.variants.find((variant) => variant.id === variantId) || product.variants[0];
}
