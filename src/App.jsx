import React, { useState } from 'react'
import { generateLanding } from './generator'

export default function App(){
  const [prompt, setPrompt] = useState('Landing page para loja streetwear dark focada em roupas oversized, estética urbana, cor roxa escura predominante')
  const [style, setStyle] = useState('streetwear')
  const [tone, setTone] = useState('jovem')
  const [color, setColor] = useState('#2D0A3A')
  const [product, setProduct] = useState('fisico')
  const [variationsCount, setVariationsCount] = useState(3)
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [exportFormat, setExportFormat] = useState('react')
  const [status, setStatus] = useState('')

  const onGenerate = () => {
    setStatus('Gerando...')
    const out = generateLanding(prompt, { style, tone, color, product, variations: variationsCount })
    setResults(out.results)
    setSelectedIndex(0)
    setStatus('Gerado ' + out.results.length + ' variações')
  }

  const onExport = async () => {
    if(!results || !results.length) return alert('Gere as variações primeiro')
    const selected = results[selectedIndex]
    let filesToExport = {}
    if(exportFormat === 'html'){
      // export the single html file
      const name = `${selected.slug}.html`
      filesToExport[name] = selected.previewHtml
    } else if(exportFormat === 'react'){
      filesToExport = selected.files
    } else if(exportFormat === 'next'){
      // filter next files
      for(const k in selected.files) if(k.includes('-next')) filesToExport[k] = selected.files[k]
    }

    setStatus('Exportando...')
    try{
      const res = await window.electronAPI.exportZip(filesToExport, selected.slug)
      if(res && res.ok) setStatus('Exportado: ' + res.path)
      else setStatus('Export cancelado')
    }catch(e){
      setStatus('Erro: ' + (e.message || e))
    }
  }

  const updateCopyField = (field, value) => {
    const copy = { ...results[selectedIndex].copy, [field]: value }
    const updatedPreview = (window && window.__generatePreview) ? window.__generatePreview(copy, color) : results[selectedIndex].previewHtml
    const updated = { ...results[selectedIndex], copy, previewHtml: updatedPreview }
    const newResults = [...results]; newResults[selectedIndex] = updated; setResults(newResults)
  }

  const selected = results[selectedIndex]

  return (
    <div className="h-full flex">
      <aside className="w-96 p-6 border-r bg-gray-50 overflow-auto">
        <h2 className="text-xl font-bold mb-4">AI Landing Page Generator</h2>
        <label className="block text-sm font-medium">Descrição</label>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full h-28 p-2 border rounded mt-1 mb-3" />

        <div className="mb-3">
          <label className="block text-sm">Variações</label>
          <input type="number" min={1} max={6} value={variationsCount} onChange={e=>setVariationsCount(parseInt(e.target.value||1))} className="w-24 p-2 border rounded mt-1" />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Estilo</label>
          <select value={style} onChange={e=>setStyle(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option>minimalista</option>
            <option>dark</option>
            <option>luxury</option>
            <option>streetwear</option>
            <option>tech</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm">Tom da copy</label>
          <select value={tone} onChange={e=>setTone(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option>agressivo</option>
            <option>premium</option>
            <option>jovem</option>
            <option>institucional</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm">Cor principal</label>
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-20 h-10 p-0 mt-1" />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Formato de export</label>
          <select value={exportFormat} onChange={e=>setExportFormat(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option value="react">React + Tailwind (scaffold)</option>
            <option value="next">Next.js (pages)</option>
            <option value="html">HTML único</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={onGenerate} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded">Gerar</button>
          <button onClick={onExport} className="bg-green-600 text-white px-4 py-2 rounded">Exportar .zip</button>
        </div>

        <p className="mt-3 text-sm">Status: {status}</p>

        <div className="mt-6">
          <h4 className="font-semibold">Variações</h4>
          {results.length===0 && <div className="text-sm text-gray-500">Nenhuma variação gerada</div>}
          <ul className="mt-2">
            {results.map((r, idx)=>(
              <li key={idx} className={`cursor-pointer p-2 rounded ${idx===selectedIndex? 'bg-indigo-50':''}`} onClick={()=>setSelectedIndex(idx)}>{r.name}</li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-2 gap-4 h-full">
          <section className="col-span-1 border rounded p-4 overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div className="border rounded h-[70vh] overflow-auto">
              {selected ? (
                <iframe title="preview" srcDoc={selected.previewHtml} className="w-full h-full" />
              ) : (
                <div className="p-6 text-gray-500">Clique em Gerar para ver o preview</div>
              )}
            </div>
          </section>

          <section className="col-span-1 border rounded p-4 overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Copy & Conteúdo (edite aqui)</h3>
            {selected ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium">Headline</label>
                <input className="w-full p-2 border rounded" value={selected.copy.headline} onChange={e=>updateCopyField('headline', e.target.value)} />

                <label className="block text-sm font-medium">Subheadline</label>
                <input className="w-full p-2 border rounded" value={selected.copy.subheadline} onChange={e=>updateCopyField('subheadline', e.target.value)} />

                <label className="block text-sm font-medium">Proposta de valor</label>
                <textarea className="w-full p-2 border rounded" value={selected.copy.value} onChange={e=>updateCopyField('value', e.target.value)} />

                <label className="block text-sm font-medium">Benefícios (uma por linha)</label>
                <textarea className="w-full p-2 border rounded" value={selected.copy.benefits.join('\n')} onChange={e=>updateCopyField('benefits', e.target.value.split('\n'))} />

                <label className="block text-sm font-medium">Sobre</label>
                <textarea className="w-full p-2 border rounded" value={selected.copy.about} onChange={e=>updateCopyField('about', e.target.value)} />

                <label className="block text-sm font-medium">Call to Action</label>
                <input className="w-full p-2 border rounded" value={selected.copy.cta} onChange={e=>updateCopyField('cta', e.target.value)} />
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  )
}
import React, { useState } from 'react'
import { generateLanding } from './generator'

export default function App(){
  const [prompt, setPrompt] = useState('Landing page para loja streetwear dark focada em roupas oversized, estética urbana, cor roxa escura predominante')
  const [style, setStyle] = useState('streetwear')
  const [tone, setTone] = useState('jovem')
  const [color, setColor] = useState('#2D0A3A')
  const [product, setProduct] = useState('fisico')
  const [preview, setPreview] = useState('')
  const [files, setFiles] = useState(null)
  const [status, setStatus] = useState('')

  const onGenerate = () => {
    const result = generateLanding(prompt, { style, tone, color, product })
    setPreview(result.previewHtml)
    setFiles(result.files)
    setStatus('Gerado')
  }

  const onExport = async () => {
    if (!files) return alert('Gere a landing primeiro')
    setStatus('Exportando...')
    try{
      const res = await window.electronAPI.exportZip(files, 'landing')
      if(res && res.ok) setStatus('Exportado: ' + res.path)
      else setStatus('Export cancelado')
    }catch(e){
      setStatus('Erro: ' + (e.message || e))
    }
  }

  return (
    <div className="h-full flex">
      <aside className="w-96 p-6 border-r bg-gray-50">
        <h2 className="text-xl font-bold mb-4">AI Landing Page Generator</h2>
        <label className="block text-sm font-medium">Descrição</label>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full h-40 p-2 border rounded mt-1 mb-3" />

        <div className="mb-3">
          <label className="block text-sm">Estilo</label>
          <select value={style} onChange={e=>setStyle(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option>minimalista</option>
            <option>dark</option>
            <option>luxury</option>
            <option>streetwear</option>
            <option>tech</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm">Tom da copy</label>
          <select value={tone} onChange={e=>setTone(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option>agressivo</option>
            <option>premium</option>
            <option>jovem</option>
            <option>institucional</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm">Cor principal</label>
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-20 h-10 p-0 mt-1" />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Tipo de produto</label>
          <select value={product} onChange={e=>setProduct(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option value="fisico">físico</option>
            <option value="digital">digital</option>
            <option value="saas">SaaS</option>
            <option value="moda">moda</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={onGenerate} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded">Gerar Landing Page</button>
          <button onClick={onExport} className="bg-green-600 text-white px-4 py-2 rounded">Exportar .zip</button>
        </div>

        <p className="mt-3 text-sm">Status: {status}</p>
      </aside>

      <main className="flex-1 p-4">
        <h3 className="text-lg font-semibold mb-2">Preview</h3>
        <div className="border rounded h-[calc(100%-56px)] overflow-auto">
          {preview ? (
            <iframe title="preview" srcDoc={preview} className="w-full h-full" />
          ) : (
            <div className="p-6 text-gray-500">Clique em "Gerar Landing Page" para ver o preview aqui.</div>
          )}
        </div>
      </main>
    </div>
  )
}
