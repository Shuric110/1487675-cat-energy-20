'use strict';

let mainNavOpenButton = document.querySelector('.main-header__menu-button');
let mainNav = document.querySelector('.main-nav');

mainNavOpenButton.classList.remove('main-header__menu-button--no-js');
mainNav.classList.remove('main-nav--no-js');

mainNavOpenButton.addEventListener('click', function () {
  mainNavOpenButton.classList.toggle('main-header__menu-button--open');
  mainNav.classList.toggle('main-nav--open');
});
