//class for common function
module.exports = {
      commonMiddelware: function (req, res, next) {
            res.locals.site_title = config.siteTitle;
            res.locals.current_url = unescape(req.url);
            if (req.user) {
                  res.locals.userSession = req.user;

            }
            let error = req.flash('error');
            let success = req.flash('success');
            if (success.length > 0) {
                  res.locals.flash = {
                        type: 'success',
                        message: success
                  };
            }
            if (error.length > 0) {
                  res.locals.flash = {
                        type: 'error',
                        message: error
                  };
            }
            return next();
      },
};