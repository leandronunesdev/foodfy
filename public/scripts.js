function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }
  return pages;
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const pages = paginate(page, total);

  let elements = '';

  for (let page of pages) {
    if (String(page).includes('...')) {
      elements += `<span>${page}</span>`;
    } else {
      elements += `<a href="?page=${page}">${page}</a>`;
    }
  }

  pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination) {
  createPagination(pagination);
}

// HIDE AND SHOW

const cards = document.querySelectorAll('.card');

function hideShow() {
  var x = document.getElementById('hide-show');
  var y = document.getElementById('hide-button');
  if (x.style.display === 'none') {
    x.style.display = 'block';
    y.innerHTML = 'Esconder';
  } else {
    x.style.display = 'none';
    y.innerHTML = 'Mostrar';
  }
}

function hideShow2() {
  var x = document.getElementById('hide-show2');
  var y = document.getElementById('hide-button2');
  if (x.style.display === 'none') {
    x.style.display = 'block';
    y.innerHTML = 'Esconder';
  } else {
    x.style.display = 'none';
    y.innerHTML = 'Mostrar';
  }
}

function hideShow3() {
  var x = document.getElementById('hide-show3');
  var y = document.getElementById('hide-button3');
  if (x.style.display === 'none') {
    x.style.display = 'block';
    y.innerHTML = 'Esconder';
  } else {
    x.style.display = 'none';
    y.innerHTML = 'Mostrar';
  }
}

//  ADD INGREDIENT

function addIngredient() {
  const ingredients = document.querySelector('#ingredients');
  const fieldContainer = document.querySelectorAll('.ingredient');

  // Realiza um clone do ??ltimo ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // N??o adiciona um novo input se o ??ltimo tem um valor vazio
  if (newField.children[0].value == '') return false;

  // Deixa o valor do input vazio
  newField.children[0].value = '';
  ingredients.appendChild(newField);
}

const addIngredientOption = document.querySelector('.add-ingredient');

if (addIngredientOption) {
  addIngredientOption.addEventListener('click', addIngredient);
}

// ADD STEP

function addStep() {
  const steps = document.querySelector('#steps');
  const fieldContainer = document.querySelectorAll('.step');

  // Realiza um clone do ??ltimo ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // N??o adiciona um novo input se o ??ltimo tem um valor vazio
  if (newField.children[0].value == '') return false;

  // Deixa o valor do input vazio
  newField.children[0].value = '';
  steps.appendChild(newField);
}

const addStepOption = document.querySelector('.add-step');

if (addStepOption) {
  addStepOption.addEventListener('click', addStep);
}

// PHOTOS UPLOAD

const PhotosUpload = {
  input: '',
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach((file) => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);
        PhotosUpload.preview.appendChild(div);
      };
      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no m??ximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value == 'photo')
        photosDiv.push(item);
    });

    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert('Voc?? atingiu o limite m??ximo de fotos');
      event.preventDefault();
      return true;
    }
    return false;
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent('').clipboardData || new DataTransfer();

    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = 'close';
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode; // <div class="photo">
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"');
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  },
};

// IMAGE GALLERY

const ImageGallery = {
  highlight: document.querySelector('.highlight  img'),
  previews: document.querySelectorAll('.gallery-preview img'),

  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach((preview) =>
      preview.classList.remove('active')
    );
    target.classList.add('active');
    ImageGallery.highlight.src = target.src;
  },
};
