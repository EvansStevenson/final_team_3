exports.getHomePage = (req, res) => {
    res.render('../views/home', {
        title: 'CSE341 final',
        path: '/',
        foods: [] //Added so that home would load without errors. This will eventually mean somehting
    });
 }

exports.getAddRecipe = (req, res) => {
     res.render('../views/addrecipe', {
         title: 'New Recipe',
         path: '/recipe//addrecipe',
     });
 }

exports.postAddRecipe = (req, res) => {
    res.redirect('/recipe/addrecipe');
}


exports.getAbout = (req, res) => {
    res.render('../views/about', {
        title: 'about',
        path: '/recipe/about',
    });
}