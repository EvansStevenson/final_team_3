exports.getHomePage = (req, res) => {
    res.render('home', {
        title: 'CSE341 final',
        path: '/',
    });
}