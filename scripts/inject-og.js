/**
 * inject-og.js
 * Injeta Open Graph, Twitter Card e meta tags em dist/index.html
 * após o build do Expo (npx expo export --platform web).
 *
 * Rodado automaticamente pelo buildCommand no vercel.json.
 */

const fs   = require('fs');
const path = require('path');

const SITE_URL   = 'https://lista-compras-neon.vercel.app';
const PAGE_URL   = `${SITE_URL}/lista`;
const IMAGE_URL  = `${SITE_URL}/og-image.png`;
const TITLE      = 'Lista de Compras — Organize suas compras com facilidade';
const DESCRIPTION =
  'Crie listas de compras inteligentes, organize por categoria, ' +
  'controle preços e nunca esqueça um item no mercado. Grátis e sem cadastro.';

const OG_TAGS = `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${TITLE}" />
    <meta name="description" content="${DESCRIPTION}" />
    <meta name="theme-color" content="#2563EB" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type"        content="website" />
    <meta property="og:url"         content="${PAGE_URL}" />
    <meta property="og:title"       content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:image"       content="${IMAGE_URL}" />
    <meta property="og:image:type"  content="image/png" />
    <meta property="og:image:width" content="1024" />
    <meta property="og:image:height" content="1024" />
    <meta property="og:locale"      content="pt_BR" />
    <meta property="og:site_name"   content="Lista de Compras" />

    <!-- Twitter / X -->
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:url"         content="${PAGE_URL}" />
    <meta name="twitter:title"       content="${TITLE}" />
    <meta name="twitter:description" content="${DESCRIPTION}" />
    <meta name="twitter:image"       content="${IMAGE_URL}" />
`;

const distHtml = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(distHtml)) {
  console.error('[inject-og] dist/index.html não encontrado. Rode o build primeiro.');
  process.exit(1);
}

let html = fs.readFileSync(distHtml, 'utf8');

// Evita injeção dupla
if (html.includes('og:title')) {
  console.log('[inject-og] Tags OG já presentes — nada a fazer.');
  process.exit(0);
}

// Substitui <title> simples pelo título completo
html = html.replace(
  /<title>.*?<\/title>/,
  `<title>${TITLE}</title>`
);

// Injeta as tags OG logo após o <title>
html = html.replace(
  /(<title>.*?<\/title>)/,
  `$1\n${OG_TAGS}`
);

fs.writeFileSync(distHtml, html, 'utf8');
console.log('[inject-og] Tags Open Graph injetadas com sucesso em dist/index.html');
