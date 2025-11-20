export function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

export const checkAuth = (req, res, next) => {
  const status = true;
  if(status){
      next();
  } else {
      console.log("Nothingg!!!!");
  }
}

export const requireSignin = expressJWT({
  algorithms: ["HS256"],
  secret: "123456",
  requestProperty: "auth" // req.auth    
});
export const isAuth = (req, res, next) => {
  console.log('req.profile',req.profile);
  console.log('req.auth',req.auth);

  const status = req.profile._id == req.auth._id;
  if(!status){
      res.status(400).json({
          message: "Bạn không có quyền truy cập"
      })
  }
  next();
} 
export const isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
      res.status(401).json({
          message: "You're not Admin"
      })
  }
  next();
}



