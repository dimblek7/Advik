import React, { useState } from 'react'

type KV = { key: string; value: string }

interface InitialData {
  id: string
  name: string
  parent_id?: string | null
  attributes?: Record<string, string>
  status?: string
}

export function CreateComponentForm({
  onCancel,
  onSubmit,
  initialData,
}: {
  onCancel: () => void
  onSubmit: (payload: FormData) => void
  initialData?: InitialData
}) {
  const isEditing = !!initialData
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [name, setName] = useState(initialData?.name || '')
  const [parentId, setParentId] = useState<string | null>(initialData?.parent_id || null)
  const [status, setStatus] = useState(initialData?.status || 'draft')
  const [attrs, setAttrs] = useState<KV[]>(
    initialData?.attributes && Object.keys(initialData.attributes).length > 0
      ? Object.entries(initialData.attributes).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  )
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [videos, setVideos] = useState<FileList | null>(null)
  const [docs, setDocs] = useState<FileList | null>(null)

  function next() { setStep(s => (s < 4 ? ((s + 1) as any) : s)) }
  function prev() { setStep(s => (s > 1 ? ((s - 1) as any) : s)) }
  function addAttr() { setAttrs(a => [...a, { key: '', value: '' }]) }
  function updateAttr(i: number, field: 'key' | 'value', v: string) {
    setAttrs(a => a.map((kv, idx) => (idx === i ? { ...kv, [field]: v } : kv)))
  }
  function submit() {
    const attributes: Record<string, string> = {}
    attrs.forEach(kv => { if (kv.key) attributes[kv.key] = kv.value })
    const form = new FormData()
    form.append('name', name)
    if (parentId) form.append('parent_id', parentId)
    form.append('status', status)
    form.append('attributes', JSON.stringify(attributes))
    if (photos) Array.from(photos).forEach(f => form.append('photos', f))
    if (videos) Array.from(videos).forEach(f => form.append('videos', f))
    if (docs) Array.from(docs).forEach(f => form.append('docs', f))
    onSubmit(form)
  }

  const stepLabels = ['Basic Info', 'Attributes', 'Media', 'Review']

  return (
    <div className="form-wizard">
      <div className="wizard-header">
        <button className="secondary" onClick={onCancel}>← Back</button>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{isEditing ? 'Edit Component' : 'Create Component'}</span>
        <div className="wizard-steps">
          {stepLabels.map((label, i) => (
            <div key={i} className={`wizard-step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
              <span className="wizard-step-num">{i + 1}</span>
              <span className="wizard-step-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="form-section">
          <div className="form-field">
            <label>Component Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Industrial Pump" />
          </div>
          <div className="form-field">
            <label>Parent ID <span className="form-optional">(optional)</span></label>
            <input value={parentId || ''} onChange={e => setParentId(e.target.value || null)} placeholder="Parent component ID" />
          </div>
          <div className="form-field">
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="form-section">
          <div className="attr-list">
            {attrs.map((kv, i) => (
              <div className="attr-row" key={i}>
                <input placeholder="Key" value={kv.key} onChange={e => updateAttr(i, 'key', e.target.value)} />
                <input placeholder="Value" value={kv.value} onChange={e => updateAttr(i, 'value', e.target.value)} />
                <button className="secondary icon-btn" type="button" onClick={() => setAttrs(a => a.filter((_, j) => j !== i))} title="Remove">&times;</button>
              </div>
            ))}
          </div>
          <div><button className="secondary" onClick={addAttr}>+ Add Attribute</button></div>
          <div className="form-actions">
            <button className="secondary" onClick={prev}>← Back</button>
            <button onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-section">
          <div className="form-field">
            <label>Photos</label>
            <input type="file" multiple onChange={e => setPhotos(e.target.files)} />
          </div>
          <div className="form-field">
            <label>Videos</label>
            <input type="file" multiple onChange={e => setVideos(e.target.files)} />
          </div>
          <div className="form-field">
            <label>Documents</label>
            <input type="file" multiple onChange={e => setDocs(e.target.files)} />
          </div>
          <div className="form-actions">
            <button className="secondary" onClick={prev}>← Back</button>
            <button onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="form-section">
          <div className="review-card">
            <div className="review-row"><span>Name</span><strong>{name || '—'}</strong></div>
            <div className="review-row"><span>Status</span><strong>{status}</strong></div>
            <div className="review-row"><span>Parent</span><strong>{parentId || '—'}</strong></div>
            <div className="review-row"><span>Attributes</span><strong>{attrs.filter(a => a.key).length}</strong></div>
            <div className="review-row"><span>Photos</span><strong>{photos?.length || 0}</strong></div>
            <div className="review-row"><span>Videos</span><strong>{videos?.length || 0}</strong></div>
            <div className="review-row"><span>Documents</span><strong>{docs?.length || 0}</strong></div>
          </div>
          <div className="form-actions">
            <button className="secondary" onClick={prev}>← Back</button>
            <button onClick={submit}>{isEditing ? '✓ Update Component' : '✓ Create Component'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateComponentForm
