import { getActiveUrl, getIdFromUrl, fetchData, parseJson, setToStorage } from './helpers';
import { DETAILS_KEY, BASE_URL, BASE_API_URL } from '../constants';

export async function collectDetails() {
  let storageVal = await getDetailsFromStorage();
  let activeUrl = await getActiveUrl();

  if (activeUrl.startsWith(BASE_URL)) {
    let id = getIdFromUrl(activeUrl);

    // No need to re-fetch data if we're already on the last page that was visited
    if (storageVal != undefined && id == storageVal['id']) {
      return storageVal;
    }

    let data = await fetchData(BASE_API_URL + id);
    console.log(data);
    let details = parseJson(data);
    setToStorage(DETAILS_KEY, details);

    return details;
  } else {
    // No need to re-fetch data if we're already on the last page that was visited
    if (storageVal != undefined) {
      return storageVal;
    }
  }
}

async function getDetailsFromStorage(): Promise<string | null> {
  const { [DETAILS_KEY]: value } = await chrome.storage.local.get(DETAILS_KEY);
  return value || null;
}
