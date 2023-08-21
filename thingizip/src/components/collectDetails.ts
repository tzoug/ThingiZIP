import { getActiveUrl, getIdFromUrl, fetchData, parseJson, setToStorage } from './helpers'; // Adjust the path accordingly

const detailsKey = 'thingiverse_details';
const baseUrl = 'https://www.thingiverse.com/thing:';
const baseApiUrl = 'https://api.thingiverse.com/things/';

export async function collectDetails() {  
  let activeUrl = await getActiveUrl();
  if (!activeUrl.startsWith(baseUrl) || activeUrl == undefined) {
    return;
  }  

  let id = getIdFromUrl(activeUrl);
  let data = await fetchData(baseApiUrl + id);
  let details = parseJson(data);
  setToStorage(detailsKey, details);  

  return details;
}