let imageMap = {};
let images = [];
let index = 0;
let fileName = '';

function save() {
  localStorage.setItem('triveimage-imageMap', JSON.stringify(imageMap));
  localStorage.setItem('triveimage-images', JSON.stringify(images));
  localStorage.setItem('triveimage-index', JSON.stringify(index));
  localStorage.setItem('triveimage-fileName', JSON.stringify(fileName));

  return false;
};

function recover() {
  imageMap = JSON.parse(localStorage.getItem('triveimage-imageMap'));
  images = JSON.parse(localStorage.getItem('triveimage-images'));
  index = JSON.parse(localStorage.getItem('triveimage-index'));
  fileName = JSON.parse(localStorage.getItem('triveimage-fileName'));

  changeImage(images[index]);

  return false;
};

const incrementIndex = () => {
  if (index === (images.length - 1)) return;
  index++;
  changeImage(images[index]);
  console.log(index, images.length, console.log(images[index]));
};
const decrementIndex = () => {
  if (index <= 0) return;
  index--;
  changeImage(images[index]);
};

const changeImageStatus = () => {
  const link = images[index];
  imageMap[link] = !imageMap[link];
  changeBG(images[index]);
};

$(document).keydown((e) => {
  if (images.length <= 0) return;
  switch (e.which) {
    case 8: // backspace
      changeImageStatus();
      break;
    case 32: // space
      changeImageStatus();
      break;
    case 37: // left
      decrementIndex();
      break;
    case 38: // up
      decrementIndex();
      break;
    case 39: // right
      incrementIndex();
      break;
    case 40: // down
      incrementIndex();
      break;
    default:
      return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});

const changeImage = (link) => {
  document.getElementById('car-image').src = link;
  changeBG(link);
};

const changeBG = (link) => {
  if (imageMap[link]) {
    document.getElementById('image-container').style.backgroundColor = 'green';
  } else {
    document.getElementById('image-container').style.backgroundColor = 'red';
  }
};

document.getElementById('input-file')
  .addEventListener('change', getFile);

function getFile(event) {
  const input = event.target;
  if ('files' in input && input.files.length > 0) {
    const file = input.files[0];
    fileName = file.name;
    placeFileContent(file);
  }
}

function placeFileContent(file) {
  readFileContent(file).then(content => {
    images = content.split('\n').filter(im => im);
    for (let image of images) imageMap[image] = true;
    index = 0;
    changeImage(images[0]);
  }).catch(error => console.log(error));
}

function readFileContent(file) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

function clickInput() {
  document.getElementById('input-file').click();
  return false;
}

function handleDownload() {
  const keys = Object.keys(imageMap);
  const goodImages = [];
  const badImages = [];
  for (let key of keys) {
    if (imageMap[key]) goodImages.push(key);
    else badImages.push(key);
  }

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(goodImages.join('\n')));
  element.setAttribute('download', `${fileName}xxxGOOD.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(badImages.join('\n')));
  element.setAttribute('download', `${fileName}xxxBAD.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  return false;
}