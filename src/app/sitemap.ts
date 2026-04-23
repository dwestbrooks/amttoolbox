import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.amttoolbox.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://www.amttoolbox.com/tools', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://www.amttoolbox.com/tools/torque-extension-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.amttoolbox.com/tools/bend-allowance-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.amttoolbox.com/tools/torque-unit-converter', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.amttoolbox.com/tools/decimal-fraction-converter', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.amttoolbox.com/tools/an-hardware-decoder', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.amttoolbox.com/study', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.amttoolbox.com/about', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ]
}
