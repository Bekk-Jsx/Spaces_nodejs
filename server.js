const app = require("./app");
const express = require("express");
const path = require("path");
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');


// for hosting 
if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );

}

// error to no exist routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error midleware 
app.use(globalErrorHandler);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server started on port :${PORT}`));