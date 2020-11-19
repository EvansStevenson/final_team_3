function addbtnlistener(id, tasks) {
    return document.getElementById(id).addEventListener("click", () => {
        tasks();
    })
}
function getbyId(id) {
    return document.getElementById(id);
}

addbtnlistener("chickenbtn", () => {
    getbyId("cbuttons").classList.remove('grid');
    getbyId("chicken").hidden = false;
})
addbtnlistener("beefbtn", () => {
    getbyId("cbuttons").classList.remove('grid');
    getbyId("beef").hidden = false;
})
addbtnlistener("porkbtn", () => {
    getbyId("cbuttons").classList.remove('grid');
    getbyId("pork").hidden = false;
})
addbtnlistener("fishbtn", () => {
    getbyId("cbuttons").classList.remove('grid');
    getbyId("fish").hidden = false;
})
addbtnlistener("vegetablebtn", () => {
    getbyId("cbuttons").classList.remove('grid');
    getbyId("vegetable").hidden = false;
})
addbtnlistener("veganbtn", () => {
    getbyId("cbuttons").classList.remove('grid');
    getbyId("vegan").hidden = false;
})
addbtnlistener("dessertbtn", () => {
    getbyId("cbuttons").classList.remove('grid');
    getbyId("dessert").hidden = false;
})

