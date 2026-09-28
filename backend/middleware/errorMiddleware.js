const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Log error for debugging internally but hide stack trace from user in production
    console.error(err);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { errorHandler };
