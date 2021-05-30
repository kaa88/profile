// Portfolio button
var portfolioElement = document.querySelector('.portfolio');
var portfolioButton = document.querySelector('.profile__portfolio-button');
portfolioButton.addEventListener('click', function() {portfolioElement.scrollIntoView({behavior: "smooth"});})
// /

// Portfolio count
document.querySelector('.portfolio__counter').innerHTML = ' (' + document.querySelectorAll('.site').length + ')';
// /