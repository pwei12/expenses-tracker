import { HTTP_HEADERS, HTTP_POST_METHOD } from '@/constants/http';

export const postRequest = async (route, payload, cookie) => {
  try {
    const response = await fetch(route, {
      method: HTTP_POST_METHOD,
      headers: { ...HTTP_HEADERS, Cookie: cookie },
      body: JSON.stringify(payload)
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return { success: false, reason: 'Unknown error' };
  }
};

export const getRequest = async (route, cookie) => {
  try {
    const response = await fetch(route, {
      headers: { ...HTTP_HEADERS, Cookie: cookie }
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    throw new Error(error);
  }
};
