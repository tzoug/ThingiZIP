import {
  getActiveUrl,
  getIdFromUrl,
  fetchData,
  parseJson,
  setToStorage,
  getFromStorage,
  getRecentsFromStorage,
} from './helpers';
import { DETAILS_KEY, BASE_URL, BASE_API_URL, RECENTS_KEY, MAX_RECENTS } from './constants';

export async function fetchDetails() {
  let currentDetails = await getFromStorage(DETAILS_KEY);
  let activeUrl = await getActiveUrl();

  if (activeUrl.startsWith(BASE_URL)) {
    let id = getIdFromUrl(activeUrl);

    let storageHasValue = doesStorageHaveValue(currentDetails);

    // Stored details match the same as current page.
    if (storageHasValue && id == currentDetails['id']) {
      return currentDetails;
    }

    // Stored details don't match the same as current page.
    // Need to add the last details to recents.
    if (storageHasValue) {
      let recents = await getRecentsFromStorage();
      let recentsHasValue = doesStorageHaveValue(recents);

      if (!recentsHasValue) {
        let recents = [currentDetails];
        setToStorage(RECENTS_KEY, recents);
      } else {
        recents.unshift(currentDetails);
        recents.splice(MAX_RECENTS);
        setToStorage(RECENTS_KEY, recents);
      }
    }

    let data = await fetchData(BASE_API_URL + id);
    let newDetails = parseJson(data);
    setToStorage(DETAILS_KEY, newDetails);

    console.log('Fetched Details', newDetails);

    return newDetails;
  } else {
    // No need to re-fetch data if we're already on the last page that was visited
    if (currentDetails != undefined) {
      return currentDetails;
    }
  }
}

function doesStorageHaveValue(storageVal): boolean {
  return storageVal != undefined && storageVal != null;
}
