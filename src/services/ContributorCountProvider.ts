import axios from 'axios';
import parseLinkHeader from 'parse-link-header';
import token from '../../token';

const headers = {
  "Authorization": `token ${token}`
}
const PER_PAGE = 30;

export default async function contributorCount(owner: string, name: string): Promise<number> {
  const firstPageResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/contributors`, { headers });
  const linkHeader = parseLinkHeader(firstPageResponse.headers.link);

  if (linkHeader) {
    const lastLink = linkHeader.last;
    const lastPageResponse = await axios.get(lastLink.url);
    const contributorCountBeforeLastPage = (+lastLink.page - 1) * PER_PAGE
    return contributorCountBeforeLastPage + lastPageResponse.data.length;
  }

  return firstPageResponse.data.length;
}
