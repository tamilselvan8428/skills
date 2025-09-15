import { useState, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Add content-type header if sending JSON data
      if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Prepare request options
      const requestOptions = {
        method,
        headers: new Headers(headers),
        credentials: 'include', // Important for cookies, authorization headers with HTTPS
      };

      // Add body if present (not for GET or HEAD requests)
      if (body && method !== 'GET' && method !== 'HEAD') {
        requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      let responseData;

      // Parse response data if content exists
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        // Handle HTTP error status codes
        const error = new Error(responseData.message || 'Something went wrong');
        error.status = response.status;
        error.data = responseData;
        throw error;
      }

      setLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message || 'Something went wrong!');
      setLoading(false);
      throw err; // Re-throw the error so it can be caught in the component
    }
  }, []);

  // Helper methods for common HTTP methods
  const get = useCallback((url, headers = {}) => 
    request(url, 'GET', null, headers), [request]);

  const post = useCallback((url, body, headers = {}) => 
    request(url, 'POST', body, headers), [request]);

  const put = useCallback((url, body, headers = {}) => 
    request(url, 'PUT', body, headers), [request]);

  const del = useCallback((url, headers = {}) => 
    request(url, 'DELETE', null, headers), [request]);

  const patch = useCallback((url, body, headers = {}) => 
    request(url, 'PATCH', body, headers), [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    del,
    patch,
    setError // Allow manual error setting if needed
  };
};

export default useApi;
