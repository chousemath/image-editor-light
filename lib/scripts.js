"use strict";

var fileName = '';
var faded = '0.2';

var loadImages = function loadImages(images) {
  var div = document.getElementById('main-container');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  var spacer = document.createElement('div');
  spacer.className = 'spacer';
  div.appendChild(spacer);

  var _loop = function _loop(i) {
    var container = document.createElement('div');
    container.className = 'car-image-container';
    div.appendChild(container);
    var img = new Image();

    img.onload = function () {
      container.appendChild(img);
    };

    img.onclick = function () {
      return handleImageClick(this.id);
    };

    img.src = images[i];
    img.id = "image-".concat(i);
    img.className = 'car-image';
  };

  for (var i = 0; i < images.length; i++) {
    _loop(i);
  }
};

var addBadImages = function addBadImages(images) {
  var div = document.getElementById('main-container');

  var _loop2 = function _loop2(i) {
    var container = document.createElement('div');
    container.className = 'car-image-container';
    div.appendChild(container);
    var img = new Image();

    img.onload = function () {
      container.appendChild(img);
    };

    img.onclick = function () {
      return handleImageClick(this.id);
    };

    img.src = images[i];
    img.id = "image-".concat(i);
    img.className = 'car-image';
    img.style.opacity = faded;
  };

  for (var i = 0; i < images.length; i++) {
    _loop2(i);
  }
};

function save() {
  var images = document.getElementsByTagName('img');
  var goodImages = [];
  var badImages = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var image = _step.value;
      if (image.style.opacity === faded) badImages.push(image.src);else goodImages.push(image.src);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  localStorage.setItem('triveimage-good-images', JSON.stringify(goodImages));
  localStorage.setItem('triveimage-bad-images', JSON.stringify(badImages));
  localStorage.setItem('triveimage-fileName', JSON.stringify(fileName));
  alert('Your progress has been saved.');
  return false;
}

;

function recover() {
  var goodImages = JSON.parse(localStorage.getItem('triveimage-good-images'));
  var badImages = JSON.parse(localStorage.getItem('triveimage-bad-images'));
  console.log("goodImages: ".concat(goodImages));
  console.log("badImages: ".concat(badImages));
  fileName = JSON.parse(localStorage.getItem('triveimage-fileName'));
  loadImages(goodImages);
  addBadImages(badImages);
  return false;
}

;

function handleImageClick(id) {
  console.log("".concat(id, " was clicked"));
  var image = document.getElementById(id);
  if (image.style.opacity === faded) image.style.opacity = '1.0';else image.style.opacity = faded;
}

document.getElementById('input-file').addEventListener('change', getFile);

function getFile(event) {
  var input = event.target;

  if ('files' in input && input.files.length > 0) {
    var file = input.files[0];
    fileName = file.name;
    placeFileContent(file);
  }
}

function placeFileContent(file) {
  readFileContent(file).then(function (content) {
    loadImages(content.split('\n').filter(function (im) {
      return im;
    }));
  })["catch"](function (error) {
    return console.log(error);
  });
}

function readFileContent(file) {
  var reader = new FileReader();
  return new Promise(function (resolve, reject) {
    reader.onload = function (event) {
      return resolve(event.target.result);
    };

    reader.onerror = function (error) {
      return reject(error);
    };

    reader.readAsText(file);
  });
}

function clickInput() {
  document.getElementById('input-file').click();
  return false;
}

function handleDownload() {
  var images = document.getElementsByTagName('img');
  var goodImages = [];
  var badImages = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = images[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var image = _step2.value;
      if (image.style.opacity === faded) badImages.push(image.src);else goodImages.push(image.src);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(goodImages.join('\n')));
  element.setAttribute('download', "".concat(fileName, "xxxGOOD.txt"));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(badImages.join('\n')));
  element.setAttribute('download', "".concat(fileName, "xxxBAD.txt"));
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  return false;
}