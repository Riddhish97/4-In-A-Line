module.exports = {
      cookie: {
            "secret": "session",
            "key": "abhre5asdsdfsafUf4xc97Rd0vxvcKnddSsd3V"
      },
      session: {
            secret: "abhH4sdfre5Uf4Rddsfsd0Kn5sdff3V",
            resave: true,
            saveUninitialized: true,
            maxAge: Date.now() + (30 * 86400 * 1000)
      },
};