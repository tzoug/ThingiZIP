import { getActiveUrl, getIdFromUrl, fetchData, parseJson, setToStorage } from './helpers';
import { DETAILS_KEY, BASE_URL, BASE_API_URL } from '../constants';

export async function collectDetails() {
  let storageVal = undefined;
  let activeUrl = await getActiveUrl();
  if (!activeUrl.startsWith(BASE_URL) || activeUrl == undefined) {
    storageVal = await getDetailsFromStorage();
    if (storageVal == undefined || storageVal == null) {
      return null;
    }
    return storageVal;
  }

  let id = getIdFromUrl(activeUrl);

  console.log('Storage here', storageVal);
  // No need to re-fetch data if we're already on the last page that was visited
  if (storageVal != undefined && id == storageVal['id']) {
    return;
  }

  let data = await fetchData(BASE_API_URL + id);
  let details = parseJson(data);
  setToStorage(DETAILS_KEY, details);

  return details;
}

async function getDetailsFromStorage(): Promise<string | null> {
  const { [DETAILS_KEY]: value } = await chrome.storage.local.get(DETAILS_KEY);
  return value || null;
}
