# IVC Accounting Website

## Required Social Media Images

The following images need to be created and placed in `/public/images/`:

1. `og-image.jpg` (1200x630px)
   - IVC logo
   - Text: "Other Accountants File. We Fight."
   - Dark background with orange accents (#1a2b4a background, #ff6b35 accents)
   - High contrast for readability
   - Include James Howard's photo if possible

2. `twitter-card.jpg` (1200x600px)
   - Same design as og-image.jpg but adjusted for Twitter's aspect ratio

Design Guidelines:
- Use brand colors: #1a2b4a (dark blue), #ff6b35 (orange), #f5f1e8 (off-white)
- Maintain high contrast for text
- Keep the design clean and professional
- Ensure text is legible at smaller sizes

## Environment Variables

Copy `.env.template` to `.env.local` and fill in the following variables:

```
# Analytics and Tracking
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=YOUR_CLARITY_ID
NEXT_PUBLIC_CRISP_ID=YOUR_CRISP_ID

# SEO and Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code

# API Configuration
NEXT_PUBLIC_API_URL=https://ivc-api.yourdomain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://ivcaccounting.co.uk
NEXT_PUBLIC_COMPANY_NAME="IVC Accounting"
NEXT_PUBLIC_CONTACT_EMAIL=james@ivcaccounting.co.uk
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Deployment

The site is deployed on Railway. See `DEPLOYMENT.md` for details.

## SEO Optimization

1. Each page includes:
   - Semantic HTML structure
   - Proper heading hierarchy
   - Meta descriptions
   - Schema markup
   - Breadcrumb navigation

2. Technical SEO:
   - Sitemap at `/public/sitemap.xml`
   - Robots.txt at `/public/robots.txt`
   - PWA support via `/public/site.webmanifest`

3. Performance:
   - Images are optimized and served through Next.js Image component
   - Fonts are preloaded with display swap
   - Critical CSS is inlined
   - Code splitting for optimal loading

4. Analytics:
   - Google Tag Manager for event tracking
   - Microsoft Clarity for heatmaps
   - Custom event tracking for key user actions

## Content Guidelines

1. Tone of Voice:
   - Direct and confident
   - Professional but not corporate
   - Uses "fight" metaphors appropriately
   - Emphasizes personal service

2. Key Messages:
   - 50 client limit
   - Direct access to James
   - No junior staff
   - 2-year price lock
   - Fighting for clients vs just filing

3. Call to Actions:
   - Primary: "Book Your No-BS Call"
   - Secondary: "See How We Fight"
   - Tertiary: "Learn More"

## Maintenance

1. Regular Updates:
   - Check and update schema markup
   - Verify all tracking is working
   - Test contact forms and Calendly integration
   - Update content for seasonal changes

2. Performance Monitoring:
   - Monthly Google Lighthouse audits
   - Weekly analytics review
   - Daily uptime monitoring

## Support

For technical support or content updates, contact the development team at dev@ivcaccounting.co.uk
