let fileName = '';
const faded = '0.2';

const loadImages = (images) => {
  const div = document.getElementById('main-container');
  while (div.firstChild) div.removeChild(div.firstChild);

  const spacer = document.createElement('div');
  spacer.className = 'spacer';
  div.appendChild(spacer);

  for (let i = 0; i < images.length; i++) {
    const container = document.createElement('div');
    container.className = 'car-image-container';
    div.appendChild(container);

    const img = new Image();
    img.onload = function () { container.appendChild(img); };
    img.onclick = function () { return handleImageClick(this.id); };
    img.src = images[i];
    img.id = `image-${i}`;
    img.className = 'car-image';
  }
};

const addBadImages = (images) => {
  const div = document.getElementById('main-container');
  for (let i = 0; i < images.length; i++) {
    const container = document.createElement('div');
    container.className = 'car-image-container';
    div.appendChild(container);
    const img = new Image();
    img.onload = function () { container.appendChild(img); };
    img.onclick = function () { return handleImageClick(this.id); };
    img.src = images[i];
    img.id = `image-${i}`;
    img.className = 'car-image';
    img.style.opacity = faded;
  }
};

function save() {

  const images = document.getElementsByTagName('img');
  const goodImages = [];
  const badImages = [];

  for (let image of images) {
    if (image.style.opacity === faded) badImages.push(image.src);
    else goodImages.push(image.src);
  }

  localStorage.setItem('triveimage-good-images', JSON.stringify(goodImages));
  localStorage.setItem('triveimage-bad-images', JSON.stringify(badImages));

  localStorage.setItem('triveimage-fileName', JSON.stringify(fileName));

  alert('Your progress has been saved.');
  return false;
};

function recover() {
  const goodImages = JSON.parse(localStorage.getItem('triveimage-good-images'));
  const badImages = JSON.parse(localStorage.getItem('triveimage-bad-images'));
  console.log(`goodImages: ${goodImages}`);
  console.log(`badImages: ${badImages}`);
  fileName = JSON.parse(localStorage.getItem('triveimage-fileName'));

  loadImages(goodImages);
  addBadImages(badImages);

  return false;
};

function handleImageClick(id) {
  console.log(`${id} was clicked`);
  const image = document.getElementById(id);
  if (image.style.opacity === faded) image.style.opacity = '1.0';
  else image.style.opacity = faded;
}

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
    loadImages(content.split('\n').filter(im => im));
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
  const images = document.getElementsByTagName('img');
  const goodImages = [];
  const badImages = [];

  for (let image of images) {
    if (image.style.opacity === faded) badImages.push(image.src);
    else goodImages.push(image.src);
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