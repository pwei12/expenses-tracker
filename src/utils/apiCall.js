import {
  HTTP_HEADERS,
  HTTP_POST_METHOD,
  HTTP_PUT_METHOD
} from '@/constants/http';

const handler = async (route, cookie, payload, httpMethod) => {
  try {
    const fetchOptions = {
      ...(httpMethod ? { method: httpMethod } : {}),
      headers: { ...HTTP_HEADERS, Cookie: cookie },
      ...(payload ? { body: JSON.stringify(payload) } : {})
    };

    const response = await fetch(route, fetchOptions);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return { success: false, reason: 'Unknown error' };
  }
};

export const postRequest = async (route, payload, cookie) => {
  return await handler(route, cookie, payload, HTTP_POST_METHOD);
};

export const putRequest = async (route, payload, cookie) => {
  return await handler(route, cookie, payload, HTTP_PUT_METHOD);
};

export const getRequest = async (route, cookie) => {
  return await handler(route, cookie);
};
