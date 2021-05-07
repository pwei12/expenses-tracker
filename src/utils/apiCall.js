import { HTTP_HEADERS, HTTP_POST_METHOD } from '@/constants/http';

export const apiCall = async (route, payload, done, errorCallback) => {
  try {
    const response = await fetch(route, {
      method: HTTP_POST_METHOD,
      headers: HTTP_HEADERS,
      body: JSON.stringify(payload)
    });

    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    errorCallback(error);
  } finally {
    done();
  }
};
