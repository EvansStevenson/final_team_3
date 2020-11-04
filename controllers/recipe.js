exports.getHomePage = (req, res) => {
    res.render('../views/pages/home', {
        title: 'CSE341 final',
        path: '/',
    });
 }