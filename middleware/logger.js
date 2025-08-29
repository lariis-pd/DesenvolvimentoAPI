function logger(req, res, next) {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); // continua para a próxima função (rota)
  }
  
  module.exports = logger;
  