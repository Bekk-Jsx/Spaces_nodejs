var pgtools = require("pgtools");

exports.createDb = async (name, password) => {

    const config = {
        user: "postgres",
        host: "localhost",
        password: password,
        port: 5432
    };

    let result = {};

    await pgtools.createdb(config, name, (err, res) => {

        if (err) {
            // console.error(err);
            result.status = 500;
            result.message = err.message ? err.message : '';
        } else {
            // console.log(res);
            result.status = 201;
        }
    });

    return result;
}