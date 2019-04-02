import axios from 'axios';
import parseLinkHeader from 'parse-link-header';
import token from '../../token';

const client = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    "Authorization": `token ${token}`
  }
})

//Due to inconsistency in github api this number will often be bigger than the one seen on the web page
//https://github.community/t5/GitHub-API-Development-and/API-Github-list-contributors/m-p/9737/highlight/true#M6
export async function contributorCount(owner: string, repo: string): Promise<number> {
  const firstPageResponse = await client.get(`/repos/${owner}/${repo}/contributors?per_page=1&anon=true`);
  const links = parseLinkHeader(firstPageResponse.headers.link);

  if (links) {
    return parseInt(links.last.page);
  }

  return 1;
}

export async function commitStats(owner: string, repo: string): Promise<number[]> {
  const { data: participation } = await client.get(`/repos/${owner}/${repo}/stats/participation`);
  return participation.all;
}
