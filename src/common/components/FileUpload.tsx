import { ChangeEvent, SyntheticEvent, useRef } from "react";

type SetFilesProp = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const FileUpload = ({ files, setFiles }: SetFilesProp) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((f) => {
      setFiles([f, ...files]);
    });
  };

  const handleDeleteFile = (file: File) => {
    setFiles(files.filter((f) => f.name != file.name));
  };

  const handleFileSelect = (e: SyntheticEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (!hiddenFileInput) return;
    hiddenFileInput?.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        id="challenge-files[]"
        style={{ display: "none" }}
        multiple={true}
        ref={hiddenFileInput}
        onChange={handleAddFile}
        data-testid="file-uploader"
      />
      <button className="btn" onClick={handleFileSelect}>
        Upload file
      </button>
      <ul>
        {files.map((f) => (
          <li key={f.name}>
            <span>{f.name}</span>
            <span className="btn" onClick={() => handleDeleteFile(f)}>
              x
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
