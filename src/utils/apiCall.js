import { HTTP_HEADERS, HTTP_POST_METHOD } from '@/constants/http';

export const postRequest = async (route, payload, done, errorCallback) => {
  try {
    const response = await fetch(route, {
      method: HTTP_POST_METHOD,
      headers: HTTP_HEADERS,
      body: JSON.stringify(payload)
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    errorCallback(error);
  } finally {
    done();
  }
};

export const newPostRequest = async (route, payload) => {
  try {
    const response = await fetch(route, {
      method: HTTP_POST_METHOD,
      headers: HTTP_HEADERS,
      body: JSON.stringify(payload)
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return { success: false, reason: error };
  }
};

export const getRequest = async route => {
  try {
    const response = await fetch(route, {
      headers: HTTP_HEADERS
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    throw new Error(error);
  }
};
