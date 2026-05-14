import { useRef, useState, type DragEvent, type ChangeEvent } from "react";

export function UploadZone({ file, onFile }: { file: File | null; onFile: (f: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    onFile(f);
  };

  return (
    <div
      className={`upload-zone ${drag ? "dragging" : ""} ${file ? "has-file" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
    >
      <div className="upload-dots">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="u-dot" />)}
      </div>
      <p className="upload-title">{file ? file.name.toUpperCase() : "DROP RESUME HERE"}</p>
      <p className="upload-hint">{file ? "CLICK TO REPLACE" : "PDF · DOCX · MAX 5MB"}</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}
