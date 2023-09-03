import { AUTH_KEY, DETAILS_KEY, RECENTS_KEY } from './constants';

export async function fetchData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
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

export async function getRecentsFromStorage(): Promise<Object[] | null> {
  let { [RECENTS_KEY]: value } = await chrome.storage.local.get(RECENTS_KEY);
  return value || null;
}

export async function getFromStorage(key: string): Promise<string | null> {
  let { [key]: value } = await chrome.storage.local.get(DETAILS_KEY);
  return value || null;
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
    chrome.permissions.contains({
      permissions: ['activeTab'],    
    }, (result) => {
      if (result) {
        console.log("has perm");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            let activeTab = tabs[0];
            resolve(activeTab.url);
          } else {
            resolve(undefined);
          }
        });        
      } else {
        console.log("no perm");
        resolve(undefined);
      }
    });
  });
}

export function getIdFromUrl(url: string) {
  let stringURL = url;
  let re = /https\:\/\/www\.thingiverse\.com\/thing\:(\d+)/;
  let matches = stringURL.match(re);
  let thingId = matches[1];
  return thingId;
}

export function convertHtmlToText(html: string, name: string, url: string): string {
  let info = `${name}\n${url}`;

  let text = undefined;
  let dom = new DOMParser().parseFromString(html, 'text/html');
  text = dom.body.textContent;
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/\s\s+/g, '\n');

  return `${info}\n\n${text}`;
}

export function parseJson(response: string): Object {
  let data = JSON.parse(response);

  if (data == undefined) {
    return;
  }

  return {
    id: data['id'],
    timestamp: Date.now(),
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

export function formatTimeDifference(timestamp: number) {
  let now: number = Date.now();
  let diff = now - timestamp;

  let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  let months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  let days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let result = '';
  if (years > 0) result += `> ${years} year${years > 1 ? 's' : ''} `;
  else if (months > 0) result += `> ${months} month${months > 1 ? 's' : ''} `;
  else if (days > 0) result += `> ${days} day${days > 1 ? 's' : ''} `;
  else if (hours > 0) result += `> ${hours} hour${hours > 1 ? 's' : ''} `;
  else if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''} `;

  if (result.trim() === '') {
    result = 'just now';
  } else {
    result += 'ago';
  }

  return result;
}
