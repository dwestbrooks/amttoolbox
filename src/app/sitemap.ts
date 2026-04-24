import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.amttoolbox.com'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tools/torque-extension-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/bend-allowance-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/torque-unit-converter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/decimal-fraction-converter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/an-hardware-decoder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/rivet-size-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/hydraulic-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/wire-gauge-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/compression-check-reference`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/weight-balance-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reference`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/reference/aviation-abbreviations`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reference/minimum-bend-radius`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/study`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/study/general`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/study/airframe`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/study/powerplant`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/study/quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/study/progress`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/study/topics/sheet-metal-repair`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/study/topics/turbine-engines`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/study/topics/aircraft-electrical-systems`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ]
}
