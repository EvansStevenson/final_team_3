exports.getHomePage = (req, res) => {
    res.render('../views/pages/home', {
        title: 'CSE341 final',
        path: '/',
        foods: [] //Added so that home would load without errors. This will eventually mean somehting
    });
 }

 
 
 
exports.getAddRecipe = (req, res) => {
     res.render('../views/pages/addrecipe', {
         title: 'New Recipe',
         path: '/addrecipe',
     });
 }

exports.postAddRecipe = (req, res) => {
    res.redirect('/recipe/addrecipe');
}


