document.addEventListener('DOMContentLoaded', function() {
  const deleteButton = document.querySelector('#delete-book')
  const addGenreButton = document.querySelector('.add-genre-input')
  const addAuthorButton = document.querySelector('.add-author-input')
  const removeGenreInputs = document.querySelectorAll('.remove-genre-input')
  const removeAuthorInputs = document.querySelectorAll('.remove-author-input')
  const bookTitle = document.querySelector('#single-book-title')
  const bookPrice = document.querySelector('#single-book-price')
  const bookISBN = document.querySelector('#single-book-isbn')
  const openCart = document.querySelector('.open-cart')
  const modalOverlay = document.querySelector('.modal-overlay')
  const modal = document.querySelector('.modal')
  const closeCart = document.querySelector('.close-cart')
  const total = document.querySelector('.total')
  const cartContents = document.querySelector('.cart-contents')
  const addToCart = document.querySelector('#add-to-cart')
  const numInCart = () => parseInt(openCart.innerText.match(/\d+/))
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
  const addBlurCartCalculation = (input) => {
    input.addEventListener('blur', function() {
      const bookCountTotals = document.querySelectorAll('.cart-book-count')
      let cartTotal = 0
      bookCountTotals.forEach(bookCount => {
        cartTotal += parseInt(bookCount.value)
      })
      openCart.innerText = `Cart (${cartTotal})`
      const cartBookPrices = document.querySelectorAll('.cart-book-price')
      let totalPrice = 0
      cartBookPrices.forEach(bookPrice => {
        const currentBookPrice = parseFloat(bookPrice.innerText.replace(/\$/, ''))
        let toAdd = parseFloat((bookPrice.previousElementSibling.value * currentBookPrice)).toFixed(2)
        totalPrice += parseFloat(toAdd)
        console.log(totalPrice)
      })
      total.innerText = `Total: $${totalPrice.toFixed(2)}`
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

  if (addToCart) {
    addToCart.addEventListener('click', function(event) {
      openCart.innerText = `Cart (${numInCart() + 1})`
      const isbnID = bookISBN.innerText.replace(/ISBN: /g, 'isbn')
      console.log(isbnID)
      const currentBookCount = document.querySelector(`#${isbnID}`)
      let totalCost = parseFloat(bookPrice.innerText.replace(/\$/, ''))

      if (currentBookCount) {
        const currentValue = parseInt(currentBookCount.value)
        currentBookCount.value = currentValue + 1
        totalCost = parseFloat(totalCost * currentBookCount.value).toFixed(2)
        total.innerText = `Total: $${totalCost}`
        return
      }

      const item = document.createElement('li')
      const bookTitleSpan = document.createElement('span')
      const bookCount = document.createElement('input')
      const bookPriceSpan = document.createElement('span')
      const removeFromCart = document.createElement('button')

      item.className = 'item'
      bookTitleSpan.className = 'cart-book-title'
      bookCount.className = 'cart-book-count'
      bookPriceSpan.className = 'cart-book-price'
      removeFromCart.className = 'remove-from-cart'

      bookCount.id = isbnID
      bookCount.value = 1

      bookTitleSpan.innerText = bookTitle.innerText.replace(/Title: /, '')
      bookPriceSpan.innerText = bookPrice.innerText
      removeFromCart.innerText = 'X'

      addBlurCartCalculation(bookCount)
      addBlurCartCalculation(removeFromCart)
      removeFromCart.addEventListener('click', function(event) {
        const itemCount = event.target.previousElementSibling.previousElementSibling.value
        const itemPrice = parseFloat(event.target.previousElementSibling.innerText.replace(/\$/, ''))
        const totalCostBeingRemoved = (itemPrice * itemCount).toFixed(2)
        const totalInCart = parseFloat(total.innerText.replace(/Total: \$/, ''))
        event.target.parentElement.remove()
        openCart.innerText = `Cart (${numInCart() - itemCount})`
        total.innerText = `Total: $${totalInCart - totalCostBeingRemoved}`
      })

      item.append(bookTitleSpan)
      item.append(bookCount)
      item.append(bookPriceSpan)
      item.append(removeFromCart)

      cartContents.append(item)

      total.innerText = `Total: $${totalCost}`
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
