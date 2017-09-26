document.addEventListener('DOMContentLoaded', function() {
  const deleteButton = document.querySelector('#delete-book')
  const addGenreButton = document.querySelector('.add-genre-input')
  const addAuthorButton = document.querySelector('.add-author-input')
  const removeGenreInputs = document.querySelectorAll('.remove-genre-input')
  const removeAuthorInputs = document.querySelectorAll('.remove-author-input')
  const openCart = document.querySelector('.open-cart')
  const modalOverlay = document.querySelector('.modal-overlay')
  const modal = document.querySelector('.modal')
  const closeCart = document.querySelector('.close-cart')
  const total = document.querySelector('.total')
  const cartContents = document.querySelector('.cart-contents')
  const addToCart = document.querySelector('#add-to-cart')
  const addXClickHandler = (button, section) => {
    button.addEventListener('click', function(event) {

      let allButtons = document.querySelectorAll(`.remove-${section}-input`)
      if(allButtons.length <= 1) {
        return
      }
      event.target.parentElement.remove()
      if (section === 'author') {
        const firstNameInputs = document.querySelectorAll('.first_name')
        const lastNameInputs = document.querySelectorAll('.last_name')
        firstNameInputs.forEach(function (input, index) {
          input.name = `first_name${index}`
        })
        lastNameInputs.forEach(function (input, index) {
          input.name = `last_name${index}`
        })
      } else {
        const genreInputs = document.querySelectorAll('.genre')
        genreInputs.forEach(function (input, index) {
          input.name = `genre${index}`
        })
      }
    })
  }

  if (openCart) {
    openCart.addEventListener('click', function() {
      modalOverlay.style.display = 'flex'
      modal.style.display = 'flex'
    })

    closeCart.addEventListener('click', function() {
      modalOverlay.style.display = 'none'
      modal.style.display = 'none'
    })
  }

  if (removeGenreInputs) {
    removeGenreInputs.forEach(function (button) {
      addXClickHandler(button, 'genre');
    });
  };

  if (removeAuthorInputs) {
    removeAuthorInputs.forEach(function(button) {
      addXClickHandler(button, 'author')
    })
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', function(event) {
      const bookId = deleteButton.getAttribute('data-id')
      console.log('deleting book #', bookId)
      fetch(`/books/${bookId}`, { method: 'DELETE' })
        .then(result => {
          window.location = '/'
        })
        .catch(error => console.error(error))
    })
  }

  if (addGenreButton) {
    addGenreButton.addEventListener('click', function(event) {
      const previousGenreName = event.target.previousElementSibling.firstElementChild.name
      const previousGenreNumber = parseInt(previousGenreName.match(/\d+/g))
      const currentIndex = previousGenreNumber + 1
      const parent = event.target.parentElement
      const genreDiv = document.createElement('div')
      genreDiv.innerHTML = `<input list="genres" class="genre" name="genre${currentIndex}">`
      const removeButton = document.createElement('button')
      removeButton.innerText = 'X'
      removeButton.className = 'remove-genre-input'
      removeButton.type = 'button'
      addXClickHandler(removeButton, 'genre')
      genreDiv.append(removeButton)
      parent.insertBefore(genreDiv, event.target)
    })
  }

  if (addAuthorButton) {
    addAuthorButton.addEventListener('click', function(event) {
      const previousAuthorName = event.target.previousElementSibling.firstElementChild.name
      const previousAuthorNumber = parseInt(previousAuthorName[previousAuthorName.length-1])
      const currentIndex = previousAuthorNumber + 1
      const parent = event.target.parentElement
      const authorDiv = document.createElement('div')
      authorDiv.innerHTML = `
          First Name: <input class="first_name" name="firstName${previousAuthorNumber+1}">
          Last Name: <input class="last_name" name="lastName${previousAuthorNumber+1}">
          <button type="button" class="remove-author-input" id="remove-author-input${currentIndex}">X</button>`
      parent.insertBefore(authorDiv, event.target)
      const removeButton = document.querySelector(`#remove-author-input${currentIndex}`)
      addXClickHandler(removeButton, 'author')
    })
  }

})
