var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

document.getElementById("game").appendChild(canvas);

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function ()
{
    bgReady = true;
};
bgImage.src = "img/background.png";

var herosReady = false;
var herosImage = new Image();
herosImage.onload = function ()
{
    herosReady = true;
};
herosImage.src = "img/hero.png";

var monstreReady = false;
var monstreImage = new Image();
monstreImage.onload = function ()
{
    monstreReady = true;
};
monstreImage.src = "img/monster.png";


// Création monstre rouge

var monstreListe = [];  // contiendra toutes les informations sur chacun des monstres rouges créé

function spawnMonstreRouge(monstreListe){
    var monstre2Ready = false;

    var monstre2Image = new Image();

    monstre2Image.src = "img/monster2.png";

    var monstre2 =
    {
        x: 32 + (Math.random() * (canvas.width - 96)),
        y: 32 + (Math.random() * (canvas.width - 96))
    };

    var monstre2Presence = false;

    monstreListe.push([monstre2Ready, monstre2Image, monstre2, monstre2Presence])

    return monstreListe
}

monstreListe = spawnMonstreRouge(monstreListe)

var monstre2Ready = monstreListe[0][0];
var monstre2Image = monstreListe[0][1];
var monstre2 = monstreListe[0][2];
var monstre2Present = monstreListe[0][3];

monstre2Image.onload = function ()
{
    monstre2Ready = true;
};

// Fin de la création du monstre

var heros =
{
    speed: 256, // vitesse en pixels par seconde
    x: 0,
    y: 0
};

var monstre =
{
    x: 0,
    y: 0
};

var monstresAttrapes = 0;  // score

var touchesAppuyees = {};

addEventListener("keydown", function (e)
{
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        touchesAppuyees[e.keyCode] = true;
    }
}, false);

addEventListener("keyup", function (e)
{
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        delete touchesAppuyees[e.keyCode];
    }
}, false);

heros.x = canvas.width / 2 - 16,
heros.y = canvas.height / 2 - 16

var reset = function ()
{    
    // Faire apparaître un monstre au hasard
    monstre.x = 32 + (Math.random() * (canvas.width - 96));
    monstre.y = 32 + (Math.random() * (canvas.height - 96));

    if(heros.x <= (monstre.x + 32)
        && monstre.x <= (heros.x + 32)
        && heros.y <= (monstre.y + 32)
        && monstre.y <= (heros.y + 32))
    {
        reset();
    }
};

var resetMonstre2 = function(){
    // Faire apparaître un monstre au hasard
    for (let pas=0; pas<monstreListe.length; pas++){
        monstreListe[pas][2].x = 32 + (Math.random() * (canvas.width - 96));
        monstreListe[pas][2].y = 32 + (Math.random() * (canvas.height - 96));
    }
   

    if(heros.x <= (monstre2.x + 32)
        && monstre2.x <= (heros.x + 32)
        && heros.y <= (monstre2.y + 32)
        && monstre2.y <= (heros.y + 32))
    {   
        resetMonstre2();
    }
}

var update = function (modifier)
{
    if ((38 in touchesAppuyees) && (heros.y >= 0))
    {
        // Touche haut
        heros.y -= heros.speed * modifier;
    }

    if ((40 in touchesAppuyees) && (heros.y <= 448))
    { 
            heros.y += heros.speed * modifier;
    }

    if ((37 in touchesAppuyees) && (heros.x >= 0))
    {
        // Touche gauche
        heros.x -= heros.speed * modifier;
    }

    if ((39 in touchesAppuyees) && (heros.x <= canvas.height))
    {
        // Touche droite
        heros.x += heros.speed * modifier;
    }

    // Y a-t-il contact ?
    if(heros.x <= (monstre.x + 32)
        && monstre.x <= (heros.x + 32)
        && heros.y <= (monstre.y + 32)
        && monstre.y <= (heros.y + 32))
    {
        ++monstresAttrapes;
        reset();
        // si le joueur dépasse une tranche de 10 alors il faut mettre un monstre rouge
        if ((monstresAttrapes%10===0) && (monstresAttrapes!==0)){
            var nombreMonstreAAvoir = monstresAttrapes / 10; 
            var nombreMonstrePlateau = monstreListe.length;
            if ((nombreMonstreAAvoir > nombreMonstrePlateau)){
                monstreListe = spawnMonstreRouge(monstreListe);
                dernierMonstre = monstreListe[monstreListe.length - 1]
                dernierMonstre[1].onload = function ()
                {
                    dernierMonstre[0] = true;
                };  
            }
             
        }
    }

    // on vérifie le contact entre le joueur et tous les monstres rouges
    for (let pas=0; pas<monstreListe.length; pas++){
        if(heros.x <= (monstreListe[pas][2].x + 32)
        && monstreListe[pas][2].x <= (heros.x + 32)
        && heros.y <= (monstreListe[pas][2].y + 32)
        && monstreListe[pas][2].y <= (heros.y + 32))
    {
        --monstresAttrapes;
        resetMonstre2();
        reset();
    }
    
    }
};

var render = function ()
{
    if (bgReady)
    {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (herosReady)
    {
        ctx.drawImage(herosImage, heros.x, heros.y);
    }

    if (monstreReady)
    {
        ctx.drawImage(monstreImage, monstre.x, monstre.y);
    }

    // premier monstre rouge à mettre
    if ((monstre2Ready) && (monstresAttrapes%10===0) && (monstresAttrapes!==0))
    {
        ctx.drawImage(monstre2Image, monstre2.x, monstre2.y);
        monstre2Present = true
    }

    if (monstre2Present === true)
    {
        for (let pas=0; pas<monstreListe.length; pas++){
            ctx.drawImage(monstreListe[pas][1], monstreListe[pas][2].x, monstreListe[pas][2].y)
        }
        
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText( " Points : " + monstresAttrapes, 32, 32);
};

var main = function ()
{
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
};

reset();
resetMonstre2();
var then = Date.now();
setInterval(main, 1); // Executer aussi vite que possible
