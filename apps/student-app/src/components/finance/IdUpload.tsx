import { FileCheck2, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@nudle/ui/button";

export type UploadedFile = { name: string; size: number; preview: string | null };

type Props = {
  label: string;
  required?: boolean;
  file: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
};

export function IdUpload({ label, required, file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    if (!isImage) {
      onChange({ name: f.name, size: f.size, preview: null });
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      onChange({ name: f.name, size: f.size, preview: String(reader.result) });
    reader.readAsDataURL(f);
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </p>
        {file ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-1 h-4 w-4" />
            Upload
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="sr-only"
        onChange={handle}
      />

      {file ? (
        <div className="mt-3 flex items-center gap-3">
          {file.preview ? (
            <img
              src={file.preview}
              alt={`${label} preview`}
              className="h-16 w-24 rounded-lg border border-border object-cover"
            />
          ) : (
            <span className="flex h-16 w-24 items-center justify-center rounded-lg border border-border bg-muted/40 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB · ready to submit
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          JPG, PNG or PDF. Make sure all details are clearly visible.
        </p>
      )}
    </div>
  );
}
