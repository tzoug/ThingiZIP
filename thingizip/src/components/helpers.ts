import { AUTH_KEY, DETAILS_KEY } from '../constants';

export async function fetchData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', AUTH_KEY);
    xhr.responseType = 'text';
    xhr.onload = function () {
      if (xhr.status === 200) {        
        resolve(xhr.responseText);
      } else {
        reject(new Error(`Request failed with status: ${xhr.status}`));
      }
    };
    xhr.onerror = function () {
      reject(new Error('Request failed'));
    };
    xhr.send();
  });
}

export async function getDataFromLocalStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get([DETAILS_KEY], function (result) {
      resolve(result[DETAILS_KEY]);
    });
  });
}

export function setToStorage(key: string, value: object | string) {
  chrome.storage.local.set({ [key]: value }).then(() => {
    console.log('Set to storage', value);
  });
}

export function getActiveUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        let activeTab = tabs[0];
        resolve(activeTab.url);
      } else {
        resolve(undefined);
      }
    });
  });
}

export function getIdFromUrl(url: string) {
  let stringURL = url;
  let re = /https\:\/\/www\.thingiverse\.com\/thing\:(\d+)/;
  let matches = stringURL.match(re);
  const thingId = matches[1];
  return thingId;
}

export function convertHtmlToText(html: string): string {
  // TODO Add more obj to details for link, like, etc
  let text = undefined;
  let dom = new DOMParser().parseFromString(html, 'text/html');
  text = dom.body.textContent;
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/\s\s+/g, '\n');

  return text;
}

export function parseJson(response: string): Object {
  let data = JSON.parse(response);

  if (data == undefined) {
    return;
  }

  return {
    id: data['id'],
    public_url: data['public_url'],
    name: data['name'],
    thumbnail: data['thumbnail'],
    added: data['added'],
    collect_count: data['collect_count'],
    like_count: data['like_count'],
    download_count: data['download_count'],
    view_count: data['view_count'],
    comment_count: data['comment_count'],
    file_count: data['file_count'],
    files_url: data['files_url'],
    images_url: data['images_url'],
    creator: {
      cover: data['creator']['cover'],
      name: data['creator']['name'],
      public_url: data['creator']['public_url'],
      thumbnail: data['creator']['thumbnail'],
    },
    description_html: data['description_html'],
  };
}
