const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const payload = jwt.verify(h.slice(7), process.env.JWT_SECRET || 'dev');
    req.user = {
      sub: payload.sub,
      role: payload.role,
      name: payload.name,
      username: payload.sub === 'admin' ? process.env.ADMIN_USER || 'admin' : payload.sub,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  next();
}

module.exports = { auth, adminOnly };
