<script lang="ts">
  import JSZip from 'jszip';
  import JSZipUtils from 'jszip-utils';
  import { saveAs } from 'file-saver';
  import { fetchData, getDataFromLocalStorage, convertHtmlToText } from './helpers';

  const downloadFallbackUrl = 'https://www.thingiverse.com/download:';

  interface DownloadInfo {
    id: string;
    name: string;
    url: string;
    fileType: DownloadType;
  }

  enum DownloadType {
    File,
    Image,    
  }

  export async function downloadFiles() {
    let data = await getDataFromLocalStorage();
    let name = data['name'];

    let filesUrl = data['files_url'];
    let downloadUrls = await getDownloadUrls(filesUrl, DownloadType.File);
    console.log(downloadUrls);

    await downloadAndZipFiles(downloadUrls, `${name}_files`, undefined);
  }

  export async function downloadAll() {
    let data = await getDataFromLocalStorage();
    let name = data['name'];
    let descriptionHtml = data['description_html'];

    let filesUrl = data['files_url'];
    let imagesUrl = data['images_url'];
    let filesToDownload = await getDownloadUrls(filesUrl, DownloadType.File);
    let imagesToDownload = await getDownloadUrls(imagesUrl, DownloadType.Image);
    let downloadUrls = filesToDownload.concat(imagesToDownload);

    await downloadAndZipFiles(downloadUrls, name, descriptionHtml);
  }

  async function getDownloadUrls(url: string, type: DownloadType | null): Promise<DownloadInfo[] | null> {
    try {
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
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async function downloadAndZipFiles(
    toDownload: DownloadInfo[],
    zipName: string,
    descriptionHtml: string,
  ) {
    const zip = new JSZip();
    let tempFileNames: string[] = [];

    try {      
      let promises = toDownload.map((obj) => {
        let data = downloadFile(obj.url);

        let filename = obj.name;
        let dirAndFilename = filename;
        if (obj.fileType == DownloadType.File) {
          dirAndFilename = `Files/${filename}`;
        } else if (obj.fileType == DownloadType.Image) {
          dirAndFilename = `Images/${filename}`;
        }

        zip.file(dirAndFilename, data, { binary: true });
        tempFileNames.push(dirAndFilename);
      });

      if (descriptionHtml != undefined) {
        let description = convertHtmlToText(descriptionHtml);
        zip.file('Details.txt', description);
      }

      await Promise.all(promises);

      let zipData = await zip.generateAsync({ type: 'blob' });
      saveAs(zipData, `${zipName}.zip`);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async function downloadFile(url: string) {
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
        link = downloadFallbackUrl + item['id'];
      }
    } else if (fileType == DownloadType.Image) {
      link = item['sizes'][12]['url'];
      if (link == undefined || link == null) {
        link = downloadFallbackUrl + item['id'];
      }
    }

    if(link == undefined || link == null || link == ''){
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
</script>
