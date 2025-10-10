import React, { useCallback, useRef, useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function SubmitDropdown({ onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []);
    if (list.length) setFiles((f) => f.concat(list));
  }, []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    if (list.length) setFiles((f) => f.concat(list));
  }, []);

  const removeFile = (idx: number) => setFiles((f) => f.filter((_, i) => i !== idx));

  const onSave = () => {
    // Placeholder: we'll wire actual upload/coords handling later.
    console.log('submit images', { files, lat, lng });
    onClose();
  };

  return (
    <div className="submit-drop w-80 bg-white text-slate-900 rounded-md shadow-lg p-3">
      <div
        className="drop-area p-4 rounded-md border-2 border-dashed border-slate-300 text-center text-sm text-slate-600"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      >
        <div>Drag & drop images here, or click to browse</div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPick} />
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <img src={URL.createObjectURL(f)} alt={f.name} className="w-12 h-8 object-cover rounded-sm" />
              <div className="text-xs truncate">{f.name}</div>
              <button onClick={() => removeFile(i)} className="ml-auto text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <label className="flex flex-col">
          <span className="text-[10px] text-slate-500">Latitude</span>
          <input value={lat} onChange={(e) => setLat(e.target.value)} className="border px-2 py-1 rounded-sm text-xs" placeholder="e.g. 29.6465" />
        </label>
        <label className="flex flex-col">
          <span className="text-[10px] text-slate-500">Longitude</span>
          <input value={lng} onChange={(e) => setLng(e.target.value)} className="border px-2 py-1 rounded-sm text-xs" placeholder="e.g. -82.3533" />
        </label>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button onClick={onClose} className="text-sm px-3 py-1 rounded-sm border">Cancel</button>
        <button onClick={onSave} className="text-sm px-3 py-1 rounded-sm bg-blue-600 text-white">Save</button>
      </div>
    </div>
  );
}
