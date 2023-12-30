/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-await */
const token = 'c9e06262-608c-48b5-b781-c6ebb3280325';

function createApiRoute(
  endpoint: string,
  params: { [key: string]: string | number },
) {
  const base = `https://rcon1.82nd.gg/api/${endpoint}`;
  const url = new URL(base);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });

  return async () => {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      },
    });

    if (res.ok) {
      return await res.json();
    }

    throw new Error(res.statusText);
  };
}

export const getRecentLogs = createApiRoute('get_recent_logs', { end: 500 });
export const playersApi = createApiRoute('players', {});
export const getPlayers = (filter: string) =>
  createApiRoute('players_history', {
    player_name: filter,
    page_size: 5,
  });

export function isSteamId(id: number | string) {
  return id.toString().startsWith('76561198');
}

export const fetcher =
  async (
    urls: Array<{
      base: string;
      options?: Record<string, string>;
    }>,
  ) =>
  async () =>
    Promise.all(
      urls.map(async (url) => {
        const _url = new URL(url.base);

        Object.entries(url.options || {}).forEach(([key, value]) => {
          _url.searchParams.append(key, value);
        });

        const res = await fetch(_url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
          },
        });

        const decoded = await res.json();

        if ('result' in decoded) {
          return decoded.result;
        }

        throw new Error();
      }),
    );

export const getTimestamp = (epoch: number) => {
  const dateObj = new Date(epoch);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hours}.${minutes}.${seconds}`;
};

export const getMedian = (arr: number[]) => {
  arr.sort((a, b) => a - b);
  const middleIndex = Math.floor(arr.length / 2);

  if (arr.length % 2 === 0) {
    return (arr[middleIndex - 1] + arr[middleIndex]) / 2;
  }

  return arr[middleIndex];
};
