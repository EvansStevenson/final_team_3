exports.get404 = (req, res) => {
    // 404 page
    res.render('404', {
        title: '404 - Page Not Found',
        path: req.url
    })
};

exports.get500 = (req, res) => {
    // 500 page
    res.render('500', {
        title: '500 - Error',
        path: '/500'
    })
};