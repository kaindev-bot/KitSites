// Enhanced generator: creates multiple variations, full copy sections, and export files for React/Next/HTML.

function sanitizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

function makeMetaTags({ title, description }){
  return `    <meta name="description" content="${description}" />\n    <meta property="og:title" content="${title}" />\n    <meta property="og:description" content="${description}" />\n    <meta name="twitter:card" content="summary_large_image" />\n`;
}

function defaultCopyFrom(prompt, color){
  // Very simple heuristic-based copy generation to avoid external API dependency.
  const brand = prompt.split(' ').slice(0,2).join(' ') || 'Brand';
  const headline = `${brand} — atitude oversized, pronta para você`;
  const subheadline = `Estética urbana, materiais duráveis e cortes oversized para expressar personalidade.`;
  const value = `Peças limitadas com design urbano e qualidade premium. Encontre seu look.`;
  const benefits = [
    'Corte oversized confortável',
    'Tecidos premium e duráveis',
    'Estilo autoral e edição limitada'
  ];
  const about = `Fundada por amantes da cena urbana, ${brand} cria roupas que comunicam atitude.`;
  const social = `Mais de 5.000 clientes satisfeitos e aparições em editoriais de moda.`;
  const cta = 'Compre a coleção';
  const faq = [
    {q:'Qual o prazo de entrega?', a:'Entrega em 5-8 dias úteis.'},
    {q:'Posso trocar o tamanho?', a:'Trocas em até 30 dias.'}
  ];
  const footer = `© ${new Date().getFullYear()} ${brand} — Todos os direitos reservados.`;

  return { brand, headline, subheadline, value, benefits, about, social, cta, faq, footer };
}

function buildPreviewHtml(copy, color){
  const benefitsHtml = copy.benefits.map(b=>`<li class="mb-2">${b}</li>`).join('\n');
  const faqHtml = copy.faq.map(f=>`<details class="mb-2"><summary class="font-semibold">${f.q}</summary><p class="mt-1">${f.a}</p></details>`).join('\n');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${copy.headline}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:${color};color:#fff;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;}</style>
  </head>
  <body>
    <main class="min-h-screen p-8 flex flex-col items-center">
      <section class="max-w-4xl text-center py-12">
        <h1 class="text-4xl font-extrabold mb-4">${copy.headline}</h1>
        <p class="mb-4 text-lg">${copy.subheadline}</p>
        <p class="mb-6">${copy.value}</p>
        <a href="#" class="bg-white text-black px-6 py-3 rounded-lg font-semibold">${copy.cta}</a>
      </section>

      <section class="max-w-3xl w-full bg-white bg-opacity-10 p-6 rounded mb-6">
        <h3 class="text-xl font-bold mb-3">Benefícios</h3>
        <ul class="list-disc pl-5">${benefitsHtml}</ul>
      </section>

      <section class="max-w-3xl w-full text-left bg-white bg-opacity-5 p-6 rounded mb-6">
        <h3 class="text-xl font-bold mb-3">Sobre</h3>
        <p>${copy.about}</p>
      </section>

      <section class="max-w-3xl w-full text-left p-6 rounded mb-6">
        <h3 class="text-xl font-bold mb-3">FAQ</h3>
        ${faqHtml}
      </section>
    </main>
  </body>
</html>`;
}

function buildReactFiles(slug, copy, color){
  const files = {};
  const base = `${slug}-landing`;

  files[`${base}/package.json`] = JSON.stringify({
    name: `${base}`,
    version: '0.1.0',
    private: true,
    scripts: { dev: 'vite', build: 'vite build', start: 'vite preview' },
    dependencies: { react: '^18.2.0', 'react-dom': '^18.2.0' },
    devDependencies: { vite: '^5.0.0', tailwindcss: '^3.4.0', postcss: '^8.4.0', autoprefixer: '^10.4.0' }
  }, null, 2);

  files[`${base}/index.html`] = `<!doctype html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>${copy.headline}</title>\n${makeMetaTags({ title: copy.headline, description: copy.subheadline })}  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.jsx\"></script>\n  </body>\n</html>`;

  files[`${base}/src/main.jsx`] = `import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\nimport './index.css'\n\ncreateRoot(document.getElementById('root')).render(<App />)\n`;

  files[`${base}/src/index.css`] = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

  files[`${base}/src/App.jsx`] = `import React from 'react'\n\nexport default function App(){\n  return (\n    <div className=\"min-h-screen flex items-center justify-center\" style={{background:'${color}', color:'#fff'}}>\n      <div className=\"max-w-3xl text-center p-6\">\n        <h1 className=\"text-4xl font-extrabold mb-4\">${copy.headline}</h1>\n        <p className=\"mb-6 text-lg\">${copy.subheadline}</p>\n        <button className=\"bg-white text-black px-6 py-3 rounded-lg font-semibold\">${copy.cta}</button>\n      </div>\n    </div>\n  )\n}\n`;

  files[`${base}/tailwind.config.cjs`] = `module.exports = { content: ['./index.html', './src/**/*.{js,jsx}'], theme: { extend: {} }, plugins: [] }`;

  return files;
}

function buildNextFiles(slug, copy, color){
  const files = {};
  const base = `${slug}-next`;

  files[`${base}/package.json`] = JSON.stringify({
    name: base,
    version: '0.1.0',
    private: true,
    scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
    dependencies: { react: '^18.2.0', 'react-dom': '^18.2.0', next: '^13.0.0' }
  }, null, 2);

  files[`${base}/pages/index.jsx`] = `export default function Home(){\n  return (\n    <main style={{background:'${color}', color:'#fff', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>\n      <div style={{maxWidth:800, textAlign:'center', padding:24}}>\n        <h1 style={{fontSize:36, fontWeight:800}}>${copy.headline}</h1>\n        <p style={{marginTop:16}}>${copy.subheadline}</p>\n      </div>\n    </main>\n  )\n}\n`;

  return files;
}

export function generateLanding(prompt, { style='streetwear', tone='jovem', color='#2D0A3A', product='fisico', variations=3 } = {}){
  const results = [];
  for(let i=0;i<variations;i++){
    const copy = defaultCopyFrom(prompt, color);
    // small variation tweaks
    if(i>0) copy.headline += i === 1 ? ' — Edição limitada' : ' — Nova coleção';

    const slug = sanitizeName(copy.brand + (i>0? `-${i+1}` : ''));
    const previewHtml = buildPreviewHtml(copy, color);

    const reactFiles = buildReactFiles(slug, copy, color);
    const nextFiles = buildNextFiles(slug, copy, color);
    const htmlFileName = `${slug}.html`;

    const files = {
      // single-file HTML preview
      [htmlFileName]: previewHtml,
      // react scaffold
      ...reactFiles,
      // next scaffold
      ...nextFiles,
      // favicon placeholder
      [`${slug}/assets/favicon.svg`]: `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\"><rect width=\"100%\" height=\"100%\" fill=\"${color}\"/></svg>`
    };

    results.push({ name: `variação ${i+1}`, slug, previewHtml, files, copy });
  }

  return { results };
}

export default generateLanding;
// Simple template-based generator for landing pages.
// This module returns both a preview HTML (static) and a files map for ZIP export (React + Tailwind scaffold).

function sanitizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

export function generateLanding(input, { style='minimalist', tone='jovem', color='#2D0A3A', product='physical', variations=1 } = {}){
  const brand = (input && input.split(' ').slice(0,2).join(' ')) || 'Brand';
  const slug = sanitizeName(brand);

  const headline = `${brand} — Moda urbana reinventada`;
  const subheadline = `Oversized, confortável e com atitude. Descubra a nova coleção.`;
  const cta = 'Compre Agora';

  const previewHtml = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>body{background:${color};color:#fff;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;}</style>
    </head>
    <body>
      <main class="min-h-screen flex flex-col items-center justify-center p-6">
        <section class="max-w-3xl text-center">
          <h1 class="text-4xl font-extrabold mb-4">${headline}</h1>
          <p class="mb-6 text-lg">${subheadline}</p>
          <a href="#" class="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold shadow">${cta}</a>
        </section>
      </main>
    </body>
  </html>`;

  // Files for React + Tailwind project (minimal)
  const files = {};

  files['package.json'] = JSON.stringify({
    name: `${slug}-landing`,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build',
      start: 'vite preview'
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      vite: '^5.0.0',
      tailwindcss: '^3.4.0',
      postcss: '^8.4.0',
      autoprefixer: '^10.4.0'
    }
  }, null, 2);

  files['index.html'] = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brand} — Landing</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>`;

  files['src/main.jsx'] = `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(<App />)
`;

  files['src/App.jsx'] = `import React from 'react'

export default function App(){
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'${color}', color:'#fff'}}>
      <div className="max-w-3xl text-center p-6">
        <h1 className="text-4xl font-extrabold mb-4">${headline}</h1>
        <p className="mb-6 text-lg">${subheadline}</p>
        <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">${cta}</button>
      </div>
    </div>
  )
}
`;

  files['src/index.css'] = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

  files['tailwind.config.cjs'] = `module.exports = { content: ['./index.html', './src/**/*.{js,jsx}'], theme: { extend: {} }, plugins: [] }`;

  // Add a README metadata file
  files['README.md'] = `# ${brand} Landing\n\nGenerated by AI Landing Page Generator.\n`;

  return { previewHtml, files };
}

export default generateLanding;
