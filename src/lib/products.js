export const products = [
  {
    id: 'lumen-lamp',
    name: 'Lumen Desk Lamp',
    tagline: 'Soft-focus brass',
    description: 'Brushed brass lighting with a warm amber glow and dimmable touch control.',
    story:
      'A compact lamp built for late-night focus sessions, tuned to soften glare without dulling detail.',
    price: 12900,
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Brushed brass body', 'Touch dimmer', 'Warm amber diffuser']
  },
  {
    id: 'solace-chair',
    name: 'Solace Lounge Chair',
    tagline: 'Quiet structure',
    description: 'A low-slung reading chair with sculpted walnut arms and linen upholstery.',
    story:
      'Designed to anchor slow mornings, the Solace chair pairs a firm frame with soft textured cushions.',
    price: 48900,
    image:
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Solid walnut arms', 'Linen upholstery', 'Low lounge profile']
  },
  {
    id: 'ember-mug',
    name: 'Ember Stoneware Set',
    tagline: 'Hand-thrown warmth',
    description: 'Four matte stoneware mugs with reactive glaze and a speckled finish.',
    story:
      'Thrown in small batches, each mug carries a unique glaze pattern that deepens with use.',
    price: 6800,
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Set of four', 'Reactive glaze', 'Dishwasher safe']
  },
  {
    id: 'aura-throw',
    name: 'Aura Wool Throw',
    tagline: 'Layered comfort',
    description: 'A heavyweight merino throw with a tonal gradient and hand-knotted fringe.',
    story:
      'Soft, weighty, and woven for layering, the Aura throw anchors a room with subtle color shifts.',
    price: 15400,
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Merino wool', 'Hand-knotted fringe', 'Tonal gradient weave']
  }
];

export const productsById = products.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});
