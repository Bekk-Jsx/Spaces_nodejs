module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log(err);

    let message = err.message;

    if (err.errors && err.errors.length !== 0) {
        message = err.errors[0].message
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: message
    })
}
