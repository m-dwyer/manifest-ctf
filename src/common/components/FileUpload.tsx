import { ChangeEvent, SyntheticEvent, useRef } from "react";

type setFilesProp = [File[], React.Dispatch<React.SetStateAction<File[]>>];

const FileUpload = ({ files }: { files: setFilesProp }) => {
  const [fileList, setFileList] = files;

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((f) => {
      setFileList([f, ...fileList]);
    });
  };

  const handleDeleteFile = (file: File) => {
    setFileList(fileList.filter((f) => f.name != file.name));
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
      />
      <button className="btn" onClick={handleFileSelect}>
        Upload file
      </button>
      <ul>
        {fileList.map((f) => (
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
