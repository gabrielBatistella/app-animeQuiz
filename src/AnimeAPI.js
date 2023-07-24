const URL_FIXED = 'https://api.jikan.moe/v4/';

function requestAnimesWithName(animeName, numOfAnimes = null, mediaType = null) {
  const limitQuery = (numOfAnimes == null) ? '' : `&limit=${numOfAnimes}`;
  const typeQuery = (mediaType == null) ? '' : `&type=${mediaType}`;
  const URL_OPTIONS = `anime?q=${animeName}${limitQuery}${typeQuery}`;
  return fetch(`${URL_FIXED}${URL_OPTIONS}`)
    .then((response) => response.json())
    .then((response) => response.data)
    .catch(() => null);
}

function requestAnimeInfoById(animeID) {
  const URL_OPTIONS = `anime/${animeID}`;
  return fetch(`${URL_FIXED}${URL_OPTIONS}`)
    .then((response) => response.json())
    .then((response) => response.data)
    .catch(() => null);
}

function requestAnimeInfoByName(animeName) {
  return requestAnimesWithName(animeName)
    .then((data) => {
      if (data == null) return null;
      return data.find((anime) => {
        let found = false;
        anime.titles.forEach((title) => {
          if (title.title.toLowerCase() === animeName.toLowerCase()) {
            found = true;
          }
        });
        return found;
      });
    });
}

function requestAnimeInfoByRank(rank = 1, mediaType = null) {
  const typeQuery = (mediaType == null) ? '' : `&type=${mediaType}`;
  const URL_OPTIONS = `top/anime?limit=1&page=${rank}${typeQuery}`;
  return fetch(`${URL_FIXED}${URL_OPTIONS}`)
    .then((response) => response.json())
    .then((response) => response.data[0])
    .catch(() => null);
}

export {
  requestAnimesWithName,
  requestAnimeInfoById,
  requestAnimeInfoByName,
  requestAnimeInfoByRank,
};
