function cekApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'API key tidak valid' });
  }

  next();
}

module.exports = cekApiKey;