// components/FileDownload.tsx
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import store from "./FileViewerStore";

const FileDownload: React.FC = observer(() => {
  // Делаем чтение idFile, чтобы observer подписал компонент
  const { idFile } = store;

  useEffect(() => {
    console.log(idFile);
    if (!idFile) return;
    // как только в сторе появился idFile — скачиваем
    store.downloadFile();
  }, [idFile]);

  // Никакого UI не нужно — компонент просто висит в MainWrapper
  return null;
});

export default FileDownload;
