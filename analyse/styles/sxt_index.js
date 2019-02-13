// JavaScript Document
function boutOver(e) {
	e.style.borderBottom = "6px solid red";
	e.style.backgroundColor = "#FFA";
}
function boutOut(e) {
	e.style.borderBottom = "0px"
	e.style.backgroundColor = "white";
	e.style.color = "black";
}
function boutDown(e) {
	if (window.event.button > 1) boutOut(e);
	else e.style.color = "red";
}
function  boutUp(e) {
	boutOut(e);
}
function  click(e) {
	boutOut(e);
}