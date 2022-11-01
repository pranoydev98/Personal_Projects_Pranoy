var img1 = (Math.floor(Math.random()*10)%6)+1;
var img2 = (Math.floor(Math.random()*10)%6)+1;



if(img1 > img2){
document.querySelector("h1").innerHTML = "Player1 wins";
}

if(img1 < img2){
document.querySelector("h1").innerHTML = "Player2 wins";
}

if(img1 == img2){
document.querySelector("h1").innerHTML = "Draw";
}

var img11 = "images/dice"+img1+".png";
var img22 = "images/dice"+img2+".png";

document.querySelector("img.img1").setAttribute("src",img11);
document.querySelector("img.img2").setAttribute("src",img22);
