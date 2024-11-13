import axios from "axios";

// Fetch recent posts
export async function fetchPosts(query, page, hitsPerPage) {
  const apiUrl = query
    ? `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&page=${page}&hitsPerPage=${hitsPerPage}`
    : `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&page=${page}&hitsPerPage=${hitsPerPage}`;
  
  return axios.get(apiUrl);
}

// Fetch post details including comments
export async function fetchPostDetails(postId) {
  const detailsUrl = `https://hn.algolia.com/api/v1/items/${postId}`;
  return axios.get(detailsUrl);
}
