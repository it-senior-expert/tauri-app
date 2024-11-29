// import { fs, os } from '@tauri-apps/api/';
import * as tauriPath from '@tauri-apps/api/path';
import React, { useContext, useEffect, useState } from 'react';
import tauriConfJson from '../../src-tauri/tauri.conf.json';

const WIN32_CUSTOM_TITLEBAR = true;
export const APP_NAME = tauriConfJson.package.productName;
export const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;
const EXTS = new Set(['.json']);

interface TauriContextType {
  loading: boolean;
  downloads: string | undefined;
  documents: string | undefined;
  appDocuments: string | undefined;
  osType: string | undefined;
  fileSep: string;
  isFullScreen: boolean;
  usingCustomTitleBar: boolean;
}

const TauriContext = React.createContext<TauriContextType>({
  loading: true,
  downloads: undefined,
  documents: undefined,
  appDocuments: undefined,
  osType: undefined,
  fileSep: '/',
  isFullScreen: false,
  usingCustomTitleBar: false,
});

export const useTauriContext = () => useContext(TauriContext);

export function TauriProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloadDir] = useState<string | undefined>();
  const [documents, setDocumentDir] = useState<string | undefined>();
  const [osType, setOsType] = useState<string | undefined>();
  const [fileSep, setFileSep] = useState('/');
  const [appDocuments, setAppDocuments] = useState<string | undefined>();
  const [isFullScreen, setFullscreen] = useState(false);
  const [usingCustomTitleBar, setUsingCustomTitleBar] = useState(false);

  useEffect(() => {
    // if (RUNNING_IN_TAURI) {
    //   const callTauriAPIs = async () => {
    //     setDownloadDir(await tauriPath.downloadDir());
    //     const _documents = await tauriPath.documentDir();
    //     setDocumentDir(_documents);
    //     const _osType = await os.type();
    //     setOsType(_osType);
    //     const _fileSep = _osType === 'Windows_NT' ? '\\' : '/';
    //     setFileSep(_fileSep);
    //     await fs.createDir(APP_NAME, { dir: fs.BaseDirectory.Document, recursive: true });
    //     setAppDocuments(`${_documents}${_fileSep}${APP_NAME}`);
    //     setLoading(false);
    //   };
    //   callTauriAPIs().catch(console.error);
    // }
  }, []);

  useEffect(() => {
    setUsingCustomTitleBar(!isFullScreen && osType === 'Windows_NT' && WIN32_CUSTOM_TITLEBAR);
  }, [isFullScreen, osType]);

  return (
    <TauriContext.Provider
      value={{
        loading,
        fileSep,
        downloads,
        documents,
        osType,
        appDocuments,
        isFullScreen,
        usingCustomTitleBar,
      }}
    >
      {children}
    </TauriContext.Provider>
  );
}

export async function getUserAppFiles() {
  // const documents = await tauriPath.documentDir();
  // const saveFiles: { path: string; name: string }[] = [];
  // await fs.createDir(APP_NAME, { dir: fs.BaseDirectory.Document, recursive: true });
  // const entries = await fs.readDir(APP_NAME, { dir: fs.BaseDirectory.AppData, recursive: true });
  // if (entries !== null) {
  //   const osType = await os.type();
  //   const sep = osType === 'Windows_NT' ? '\\' : '/';
  //   const appFolder = `${documents}${sep}${APP_NAME}`;
  //   for (const { path } of flattenFiles(entries)) {
  //     const friendlyName = path.substring(appFolder.length + 1, path.length);
  //     if (EXTS.has(getExtension(path).toLowerCase())) saveFiles.push({ path, name: friendlyName });
  //   }
  // }
  // return saveFiles;
}
function* flattenFiles(entries: any[]) {
  for (const entry of entries) {
    entry.children === null ? yield entry.path : yield* flattenFiles(entry.children);
  }
}

function getExtension(path: string) {
  const basename = path.split(/[\\/]/).pop();
  if (!basename) return ''; // Return empty string if basename is undefined or null
  const pos = basename.lastIndexOf('.');
  if (pos < 0) return '';
  return basename.slice(pos);
}
