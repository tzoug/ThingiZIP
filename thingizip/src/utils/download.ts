import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { fetchData, getDataFromLocalStorage, convertHtmlToText } from './helpers';
import { DOWNLOAD_FALLBACK_URL, FILES_DIR, IMAGES_DIR, DESCRIPTION_FILE } from './constants';
import { type DownloadInfo, DownloadType } from './data/downloadInfo';

export async function downloadFiles() {
  let data = await getDataFromLocalStorage();
  let name = data['name'];
  let url = data['public_url'];

  let filesUrl = data['files_url'];
  let downloadUrls = await getDownloadUrls(filesUrl, DownloadType.File);

  await downloadAndZipFiles(downloadUrls, name, undefined, url, DownloadType.File);
}

export async function downloadAll() {
  let data = await getDataFromLocalStorage();
  let name = data['name'];
  let descriptionHtml = data['description_html'];
  let url = data['public_url'];

  let filesUrl = data['files_url'];
  let imagesUrl = data['images_url'];
  let filesToDownload = await getDownloadUrls(filesUrl, DownloadType.File);
  let imagesToDownload = await getDownloadUrls(imagesUrl, DownloadType.Image);
  let downloadUrls = filesToDownload.concat(imagesToDownload);

  await downloadAndZipFiles(downloadUrls, name, descriptionHtml, url, DownloadType.All);
}

async function getDownloadUrls(
  url: string,
  type: DownloadType | null,
): Promise<DownloadInfo[] | null> {
  let response = await fetchData(url);
  let json = JSON.parse(response);

  let filesToDownload = [];

  json.forEach(function (item) {
    let toDownload = getValuesNeedForDownload(item, type);

    if (toDownload == null) {
      return;
    }

    filesToDownload.push(toDownload);
  });

  return filesToDownload;
}

async function downloadAndZipFiles(
  toDownload: DownloadInfo[],
  name: string,
  descriptionHtml: string,
  url: string,
  type: DownloadType,
) {
  const zip = new JSZip();
  let tempFileNames: string[] = [];

  let promises = toDownload.map((obj) => {
    let data = downloadFile(obj.url);

    let filename = obj.name;
    let dirAndFilename = filename;
    if (obj.fileType == DownloadType.File) {
      dirAndFilename = `${FILES_DIR}/${filename}`;
    } else if (obj.fileType == DownloadType.Image) {
      dirAndFilename = `${IMAGES_DIR}/${filename}`;
    }
    zip.file(dirAndFilename, data, { binary: true });
    tempFileNames.push(dirAndFilename);
  });

  if (descriptionHtml != undefined) {
    let description = convertHtmlToText(descriptionHtml, name, url);
    zip.file(DESCRIPTION_FILE, description);
  }

  await Promise.all(promises);

  let zipData = await zip.generateAsync({ type: 'blob' });
  let zipName = name.replace(/\s+/g, '_');

  if (type == DownloadType.File) {
    zipName += '_Files';
  }

  saveAs(zipData, `${zipName}.zip`);
}

async function downloadFile(url: string): Promise<null> {
  return new Promise((resolve, reject) => {
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function getValuesNeedForDownload(item: {}, fileType: DownloadType | null): DownloadInfo | null {
  let id = item['id'];
  if (id == undefined) {
    return null;
  }

  let link = undefined;

  if (fileType == DownloadType.File) {
    link = item['direct_url'];
    if (link == undefined || link == null) {
      link = DOWNLOAD_FALLBACK_URL + item['id'];
    }
  } else if (fileType == DownloadType.Image) {
    link = item['sizes'][12]['url'];
    if (link == undefined || link == null) {
      link = DOWNLOAD_FALLBACK_URL + item['id'];
    }
  }

  if (link == undefined || link == null || link == '') {
    return;
  }

  let name = item['name'];
  if (name == undefined || name.trim() == '' || name == null) {
    name = id;
  }

  let downloadInfo: DownloadInfo = {
    id: id,
    name: name,
    fileType: fileType,
    url: link,
  };

  return downloadInfo;
}
