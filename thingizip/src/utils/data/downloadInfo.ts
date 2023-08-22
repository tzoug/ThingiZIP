export interface DownloadInfo {
  id: string;
  name: string;
  url: string;
  fileType: DownloadType;
}

export enum DownloadType {
  File,
  Image,
}
