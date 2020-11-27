function addbtnlistener(id, tasks) {
    return document.getElementById(id).addEventListener("click", () => {
        tasks();
    })
}
function getbyId(id) {
    return document.getElementById(id);
}

function hideAll(){
    getbyId("chicken").hidden = true;
    getbyId("chickenbtn").classList.remove('cSelect')
    getbyId("beef").hidden = true;
    getbyId("beefbtn").classList.remove('bSelect')
    getbyId("pork").hidden = true;
    getbyId("porkbtn").classList.remove('pSelect')
    getbyId("fish").hidden = true;
    getbyId("fishbtn").classList.remove('fSelect')
    getbyId("vegetable").hidden = true;
    getbyId("vegetablebtn").classList.remove('vSelect')
    getbyId("vegan").hidden = true;
    getbyId("veganbtn").classList.remove('veSelect')
    getbyId("dessert").hidden = true;
    getbyId("dessertbtn").classList.remove('dSelect')
}

addbtnlistener("chickenbtn", () => {
    hideAll();
    getbyId("chicken").hidden = false;
    getbyId("chickenbtn").className += ' cSelect';
})
addbtnlistener("beefbtn", () => {
    hideAll();
    getbyId("beef").hidden = false;
    getbyId("beefbtn").className += ' bSelect';
})
addbtnlistener("porkbtn", () => {
    hideAll();
    getbyId("pork").hidden = false;
    getbyId("porkbtn").className += ' pSelect';
})
addbtnlistener("fishbtn", () => {
    hideAll();
    getbyId("fish").hidden = false;
    getbyId("fishbtn").className += ' fSelect';
})
addbtnlistener("vegetablebtn", () => {
    hideAll();
    getbyId("vegetable").hidden = false;
    getbyId("vegetablebtn").className += ' vSelect';
})
addbtnlistener("veganbtn", () => {
    hideAll();
    getbyId("vegan").hidden = false;
    getbyId("veganbtn").className += ' veSelect';
})
addbtnlistener("dessertbtn", () => {
    hideAll();
    getbyId("dessert").hidden = false;
    getbyId("dessertbtn").className += ' dSelect';
})

