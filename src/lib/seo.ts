import { Product, Project } from '../types';

/**
  Generate a clean URL slug from a name or string
 */
export function createSlug(text?: string | null): string {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
  Inject or update Schema.org Product Structured Data JSON-LD script tag in document head
 */
export function updateProductSchemaJsonLd(productInput?: Product | Product[] | null) {
  const existingScript = document.getElementById('schema-product-jsonld');
  if (existingScript) {
    existingScript.remove();
  }

  if (!productInput) return;

  const product = Array.isArray(productInput) ? productInput[0] : productInput;
  if (!product || !product.name) return;

  const schemaData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [product.image],
    description: product.description || '',
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Inception Store',
    },
    offers: {
      '@type': 'Offer',
      url: window.location.origin + '?product=' + createSlug(product.name),
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Inception College Electronics Store',
      },
    },
  };

  const script = document.createElement('script');
  script.id = 'schema-product-jsonld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

/**
  Generate XML Sitemap string for all products, projects, and store sections
 */
export function generateXmlSitemap(products: Product[], projects: Project[]): string {
  const baseUrl = window.location.origin;
  const lastMod = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/?tab=marketplace`, priority: '0.9', changefreq: 'daily' },
    { url: `${baseUrl}/?tab=projects`, priority: '0.9', changefreq: 'weekly' },
  ];

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/?product=${createSlug(p.name)}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const projectUrls = projects.map((proj) => ({
    url: `${baseUrl}/?project=${createSlug(proj.title)}`,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allUrls = [...staticUrls, ...productUrls, ...projectUrls];

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls.map(
      (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    ),
    '</urlset>',
  ];

  return xmlLines.join('\n');
}
