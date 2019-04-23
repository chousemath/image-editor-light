"use strict";

var imageMap = {};
var images = [];
var index = 0;
var fileName = '';

var save = function save() {
  localStorage.setItem('triveimage-imageMap', JSON.stringify(imageMap));
  localStorage.setItem('triveimage-images', JSON.stringify(images));
  localStorage.setItem('triveimage-index', JSON.stringify(index));
  localStorage.setItem('triveimage-fileName', JSON.stringify(fileName));
  return false;
};

var recover = function recover() {
  imageMap = JSON.parse(localStorage.getItem('triveimage-imageMap'));
  images = JSON.parse(localStorage.getItem('triveimage-images'));
  index = JSON.parse(localStorage.getItem('triveimage-index'));
  fileName = JSON.parse(localStorage.getItem('triveimage-fileName'));
  changeImage(images[index]);
  return false;
};

var incrementIndex = function incrementIndex() {
  if (index === images.length - 1) return;
  index++;
  changeImage(images[index]);
  console.log(index, images.length, console.log(images[index]));
};

var decrementIndex = function decrementIndex() {
  if (index <= 0) return;
  index--;
  changeImage(images[index]);
};

var changeImageStatus = function changeImageStatus() {
  var link = images[index];
  imageMap[link] = !imageMap[link];
  changeBG(images[index]);
};

$(document).keydown(function (e) {
  if (images.length <= 0) return;

  switch (e.which) {
    case 8:
      // backspace
      changeImageStatus();
      break;

    case 32:
      // space
      changeImageStatus();
      break;

    case 37:
      // left
      decrementIndex();
      break;

    case 38:
      // up
      decrementIndex();
      break;

    case 39:
      // right
      incrementIndex();
      break;

    case 40:
      // down
      incrementIndex();
      break;

    default:
      return;
    // exit this handler for other keys
  }

  e.preventDefault(); // prevent the default action (scroll / move caret)
});

var changeImage = function changeImage(link) {
  document.getElementById('car-image').src = link;
  changeBG(link);
};

var changeBG = function changeBG(link) {
  if (imageMap[link]) {
    document.getElementById('image-container').style.backgroundColor = 'green';
  } else {
    document.getElementById('image-container').style.backgroundColor = 'red';
  }
};

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
    images = content.split('\n').filter(function (im) {
      return im;
    });
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var image = _step.value;
        imageMap[image] = true;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    index = 0;
    changeImage(images[0]);
  }).catch(function (error) {
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
  var keys = Object.keys(imageMap);
  var goodImages = [];
  var badImages = [];

  for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
    var key = _keys[_i];
    if (imageMap[key]) goodImages.push(key); else badImages.push(key);
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