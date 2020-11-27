exports.getfoods = (req, res) => {
    res.render('../views/admin/foods', {
        title: 'Foods | Gourmeat',
        path: '/admin/foods.js',
        foods: [] //Added so that page would load without errors. This will eventually mean somehting
    });
 }

 exports.getEditFood = (req, res) => {
    res.render('../views/admin/edit-food', {
        title: 'Edit Food | Gourmeat',
        path: '/admin/edit-foods.js',
        food: {}, //Added so that page would load without errors. This will eventually mean somehting
        editing: true, //Added so that page would load without errors. This will eventually mean somehting
        csrf: "code" //Added so that page would load without errors. This will eventually mean somehting
    });
 }
