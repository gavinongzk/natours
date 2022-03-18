const AppError = require("./../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);

}

const handleDuplicateFieldsDB = err => {

    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value entered: ${value}`

    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {

    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data ${errors.join(". ")}`;
    
    return new AppError(message, 400);
    
}

const handleJWTError = () => new AppError("Invalid token, please login again", 401);

const handleJWTExpiredError = () => new AppError("Your token has expired, please login again", 401);


const sendErrorDev = (err, req, res) => {
    // API 

    if (req.originalUrl.startsWith("/api")) {
    
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err

})
    } 
        // Rendered website
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong",
            msg: err.message
        })
};

const sendErrorProd = (err, req, res) => {
        // API
    if (req.originalUrl.startsWith("/api")) {
        // Operational, trusted error: send msg to client

        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
        
                
        })} 
            // Programming mistake: don't leak error details
        
            // 1) Log error
            console.error("ERROR", err);
        
            // 2) Send generic mistake
            return res.status(500).json({
                status: "error",
                message: "Something went very wrong!"
        
        })
    
    } else {

        // Rendered website

        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
        
                
        })} 
            // Programming mistake: don't leak error details
        
            // 1) Log error
            console.error("ERROR", err);
        
            // 2) Send generic mistake
            return res.status(500).json({
                status: "error",
                message: "Please try again later"
        
        })


    }
    
};

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);

    } else if (process.env.NODE_ENV === "production") {

        let error = Object.create(err);
        
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
        
        sendErrorProd(error, req, res);
    }

}