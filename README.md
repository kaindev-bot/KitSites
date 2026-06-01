# AI Landing Page Generator (Electron + React + Tailwind)

Quick start (Windows):

1. Install dependencies

```powershell
cd ai-landing-page-generator
npm install
```

2. Run development (Vite + Electron)

```powershell
npm run dev
```

Notes:
- The app runs Electron and a Vite dev server. Use `npm run start` after building for production.
- The generator currently uses a template-based local generator. For full AI generation integrate an external API.
 
 Abrir no VS Code:
 
 ```powershell
 # Se você tiver o comando `code` disponível no PATH do sistema:
 code .
 ```
 
 Arquivos principais:
 - `main.js` - processo principal do Electron
 - `preload.js` - bridge seguro para IPC
 - `src/` - código React + Tailwind
 - `src/generator.js` - lógica de geração de variações e arquivos exportáveis
 
 Se não conseguir abrir automaticamente, abra o VS Code manualmente e selecione a pasta:
 C:\workspace\ai-landing-page-generator
