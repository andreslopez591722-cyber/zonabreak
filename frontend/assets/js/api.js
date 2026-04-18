(function (global) {
  const base = '';

  function apiUrl(path) {
    return base + path;
  }

  function getToken() {
    return sessionStorage.getItem('zb_token');
  }

  function setToken(t) {
    if (t) sessionStorage.setItem('zb_token', t);
    else sessionStorage.removeItem('zb_token');
  }

  async function api(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...opts.headers };
    const t = getToken();
    if (t) headers.Authorization = 'Bearer ' + t;
    const r = await fetch(apiUrl(path), { ...opts, headers });
    const text = await r.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!r.ok) throw new Error((data && data.error) || r.statusText);
    return data;
  }

  global.ZB = {
    apiUrl,
    getToken,
    setToken,
    api,
    get: (p) => api(p, { method: 'GET' }),
    post: (p, body) => api(p, { method: 'POST', body: JSON.stringify(body) }),
    put: (p, body) => api(p, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (p, body) => api(p, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (p) => api(p, { method: 'DELETE' }),
  };
})(typeof window !== 'undefined' ? window : globalThis);
