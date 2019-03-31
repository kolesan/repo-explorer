import axios from 'axios';
import parseLinkHeader from 'parse-link-header';
import token from '../../token';

const PER_PAGE = 30;

const client = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    "Authorization": `token ${token}`
  }
})

export async function contributorCount(owner: string, repo: string): Promise<number> {
  const firstPageResponse = await client.get(`/repos/${owner}/${repo}/contributors`);
  const links = parseLinkHeader(firstPageResponse.headers.link);

  if (links) {
    const lastLink = links.last;
    const lastPageResponse = await client.get(lastLink.url);
    const contributorCountBeforeLastPage = (parseInt(lastLink.page) - 1) * PER_PAGE
    return contributorCountBeforeLastPage + lastPageResponse.data.length;
  }

  return firstPageResponse.data.length;
}

export async function commitStats(owner: string, repo: string): Promise<number[]> {
  const { data: participation } = await client.get(`/repos/${owner}/${repo}/stats/participation`);
  return participation.all;
}
