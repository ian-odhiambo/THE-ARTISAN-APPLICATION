// Minimal CORS middleware (no external dependency)
// Fixes browser-blocking when frontend and backend run on different ports.

export const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8001");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
};

