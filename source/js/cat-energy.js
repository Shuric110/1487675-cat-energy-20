'use strict';

const widthMediaQueryTablet = window.matchMedia('(min-width: 768px)');
const widthMediaQueryDesktop = window.matchMedia('(min-width: 1260px)');

/* Инициализация карты */

const mapElement = document.querySelector('.contacts__map');

if (mapElement) {
  let map;

  window.initMap = function () {
    const IconSizes = {
      MOBILE: {
        size: [63, 54],
        offset: [-31, -52]
      },
      TABLET: {
        size: [122, 104],
        offset: [-61, -101]
      }
    };

    const coords = [59.938770, 30.323037];
    const center = coords.slice();

    if (widthMediaQueryDesktop.matches) {
      center[1] -= 0.003;
    }

    map = new ymaps.Map(mapElement, {
      center: center,
      zoom: 17
    });

    const placemarkIconSizes = widthMediaQueryTablet.matches ? IconSizes.TABLET : IconSizes.MOBILE;

    const placemark = new ymaps.Placemark(coords, {
        balloonContent: 'Cat Energy'
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'img/map-pin.png',
        iconImageSize: placemarkIconSizes.size,
        iconImageOffset: placemarkIconSizes.offset
    });

    map.geoObjects.add(placemark)
  };

  const yandexMapsApiKey = 'a51e4efa-6d57-4c5d-a0af-19c767ce93c2';
  const script = document.createElement('script');
  script.src = 'https://api-maps.yandex.ru/2.1/?apikey=' + yandexMapsApiKey + '&lang=ru_RU&onload=initMap';
  script.defer = true;
  document.head.appendChild(script);
}


/* Открытие/закрытие меню в мобильной версии */

const mainNavOpenButton = document.querySelector('.main-header__menu-button');
const mainNav = document.querySelector('.main-nav');

mainNavOpenButton.classList.remove('main-header__menu-button--no-js');
mainNav.classList.remove('main-nav--no-js');

mainNavOpenButton.addEventListener('click', function () {
  mainNavOpenButton.classList.toggle('main-header__menu-button--open');
  mainNav.classList.toggle('main-nav--open');
});

/* Слайдер "живой пример" */

(function () {
  const exampleElement = document.querySelector('.example');
  if (!exampleElement) {
    return;
  }

  const exampleInnerElement = exampleElement.querySelector('.example__inner');
  const controlPinElement = exampleElement.querySelector('.example__preview-control-pin');
  const beforeButtonElement = exampleElement.querySelector('.example__preview-control-button--before');
  const afterButtonElement = exampleElement.querySelector('.example__preview-control-button--after');
  const imageContainerElement = exampleElement.querySelector('.example__preview-image-container');
  const imageBeforeCropElement = exampleElement.querySelector('.example__preview-image--before');
  const imageAfterCropElement = exampleElement.querySelector('.example__preview-image--after');

  let smoothMode;
  let roughPosition = 100;
  let smoothPosition = 50;

  const updateSliderPosition = function () {
    let imageCropPosition;

    if (!smoothMode) {
      controlPinElement.style.left = null;
      controlPinElement.classList.toggle('example__preview-control-pin--after', roughPosition === 0);
      imageCropPosition = roughPosition === 0 ? 0 : imageContainerElement.offsetWidth;
    } else {
      controlPinElement.classList.remove('example__preview-control-pin--after');
      controlPinElement.style.left = smoothPosition + '%';
      controlPinElement.offsetWidth;
      imageCropPosition = Math.round(controlPinElement.getBoundingClientRect().left + controlPinElement.offsetWidth / 2
        - imageContainerElement.getBoundingClientRect().left);
      exampleInnerElement.style.setProperty('--slider-delta', imageCropPosition + 'px');
    }

    imageBeforeCropElement.style.width = imageCropPosition + 'px';
    imageAfterCropElement.style.width = (imageContainerElement.offsetWidth - imageCropPosition) + 'px';
  };

  const updateSliderMode = function () {
    let newSmoothMode = widthMediaQueryTablet.matches;
    if (newSmoothMode !== smoothMode) {
      smoothMode = newSmoothMode;
      updateSliderPosition();
    }
  };

  controlPinElement.addEventListener('click', function () {
    if (!smoothMode) {
      roughPosition = roughPosition === 100 ? 0 : 100;
      updateSliderPosition();
    }
  });

  beforeButtonElement.addEventListener('click', function () {
    if (!smoothMode) {
      roughPosition = 100;
    } else {
      smoothPosition = 100;
    }
    updateSliderPosition();
  });

  afterButtonElement.addEventListener('click', function () {
    if (!smoothMode) {
      roughPosition = 0;
    } else {
      smoothPosition = 0;
    }
    updateSliderPosition();
  });

  controlPinElement.addEventListener('mousedown', function (evt) {
    if (!smoothMode) {
      return;
    }

    evt.preventDefault();
    const baseWidth = evt.target.offsetParent.offsetWidth;
    const baseX = evt.clientX - evt.target.offsetLeft;

    const onControlPinElementMouseMove = function (evtMove) {
      evtMove.preventDefault();
      let newPosition = (evtMove.clientX - baseX) * 100 / baseWidth;
      newPosition = (newPosition < 0) ? 0 : newPosition;
      newPosition = (newPosition > 100) ? 100 : newPosition;

      smoothPosition = newPosition;
      updateSliderPosition();
    };

    const onControlPinElementMouseUp = function () {
      document.removeEventListener('mousemove', onControlPinElementMouseMove);
      document.removeEventListener('mouseup', onControlPinElementMouseUp);
    };

    document.addEventListener('mousemove', onControlPinElementMouseMove);
    document.addEventListener('mouseup', onControlPinElementMouseUp);
  });

  controlPinElement.addEventListener('touchstart', function (evt) {
    if (!smoothMode || evt.touches.length > 1) {
      return;
    }

    evt.preventDefault();
    const touch = evt.touches[0];
    const baseWidth = touch.target.offsetParent.offsetWidth;
    const baseX = touch.clientX - touch.target.offsetLeft;

    const onControlPinElementTouchMove = function (evtMove) {
      if (evtMove.touches.length > 1) {
        return;
      }

      evtMove.preventDefault();
      const touchMove = evtMove.touches[0];
      let newPosition = (touchMove.clientX - baseX) * 100 / baseWidth;
      newPosition = (newPosition < 0) ? 0 : newPosition;
      newPosition = (newPosition > 100) ? 100 : newPosition;

      smoothPosition = newPosition;
      updateSliderPosition();
    };

    const onControlPinElementTouchEnd = function () {
      document.removeEventListener('touchmove', onControlPinElementTouchMove);
      document.removeEventListener('touchend', onControlPinElementTouchEnd);
    };

    document.addEventListener('touchmove', onControlPinElementTouchMove, {passive: false});
    document.addEventListener('touchend', onControlPinElementTouchEnd), {passive: false};
  }, {passive: false});

  controlPinElement.addEventListener('mousedown', function (evt) {
    console.log('mousedown');
  });

  controlPinElement.addEventListener('touchstart', function (evt) {
    console.log('touchstart');
  });

  window.addEventListener('resize', updateSliderMode);
  updateSliderMode();

})();
