export const products = [
  {
    id: 'trizapetide',
    name: 'Trizapetide',
    tagline: 'Välj styrka',
    description: 'Flexibel behandling för viktnedgång med två styrkor och olika längd.',
    story:
      'Välj 10 mg för 1 månad eller 20 mg för 2 månader. Diskret leverans och tydlig dosering.',
    image: '/tirzepetide/tirze-1.png',
    images: ['/tirzepetide/tirze-1.png'],
    highlights: ['Två styrkor', 'Tydlig dosering', 'Diskret leverans'],
    variants: [
      {
        id: '10mg',
        label: '10 mg',
        duration: '1 månad',
        price: 300000
      },
      {
        id: '20mg',
        label: '20 mg',
        duration: '2 månader',
        price: 520000,
        compareAtPrice: 600000
      }
    ]
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    tagline: 'Välj styrka',
    description: 'Långsiktig kur med två styrkor och differentierad längd.',
    story:
      'Välj 10 mg för 1 månad eller 20 mg för 2 månader. Levereras med tydliga instruktioner.',
    image: '/retatrutide/Retatrutide.png',
    images: ['/retatrutide/Retatrutide.png'],
    highlights: ['Två styrkor', 'Långsiktig plan', 'Instruktioner medföljer'],
    variants: [
      {
        id: '10mg',
        label: '10 mg',
        duration: '1 månad',
        price: 350000
      },
      {
        id: '20mg',
        label: '20 mg',
        duration: '2 månader',
        price: 550000
      }
    ]
  },
  {
    id: 'nassprej',
    name: 'Nässprej',
    tagline: 'Pigmentstöd',
    description: 'Nässprej 30 mg för att få bättre pigment, enkel att använda.',
    story:
      'Formulerad för daglig användning med fokus på jämn applicering och enkel rutin. 30 mg per flaska.',
    image: '/nasspray/nasspray.jpeg',
    images: ['/nasspray/nasspray.jpeg'],
    highlights: ['30 mg', 'Smidig rutin', 'Pigmentstöd'],
    variants: [
      {
        id: '30mg',
        label: '30 mg',
        duration: '1 flaska',
        price: 80000
      }
    ]
  },
  {
    id: 'melanotan-2',
    name: 'Melanotan 2',
    tagline: 'Komplett kit',
    description: '10 mg. Ingår vatten & insulinnålar.',
    story:
      'Ett komplett startkit med 10 mg, sterilt vatten och insulinnålar för enkel förberedelse.',
    image: '/melanotan/Melanotan-2.jpeg',
    images: ['/melanotan/Melanotan-2.jpeg'],
    highlights: ['10 mg', 'Vatten ingår', 'Insulinnålar ingår'],
    variants: [
      {
        id: '10mg',
        label: '10 mg',
        duration: 'Komplett kit',
        price: 65000
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
