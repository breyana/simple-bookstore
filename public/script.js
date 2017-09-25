document.addEventListener('DOMContentLoaded', function() {
  const deleteButton = document.querySelector('#delete-book')
  const addGenreButton = document.querySelector('.add-genre-input')
  const addAuthorButton = document.querySelector('.add-author-input')

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
      const previousGenreNumber = parseInt(previousGenreName[previousGenreName.length-1])
      const parent = event.target.parentElement
      const genreDiv = document.createElement('div')
      genreDiv.innerHTML = `<input list="genres" name="genre${previousGenreNumber+1}"><button class="remove-genre-input">X</button>`
      parent.insertBefore(genreDiv, event.target)
    })
  }

  if (addAuthorButton) {
    addAuthorButton.addEventListener('click', function(event) {
      const previousAuthorName = event.target.previousElementSibling.firstElementChild.name
      const previousAuthorNumber = parseInt(previousAuthorName[previousAuthorName.length-1])
      const parent = event.target.parentElement
      const authorDiv = document.createElement('div')
      authorDiv.innerHTML = `
          First Name: <input name="firstName${previousAuthorNumber+1}">
          Last Name: <input name="lastName${previousAuthorNumber+1}">
          <button type="button" class="remove-author-input">X</button>`
      parent.insertBefore(authorDiv, event.target)
    })
  }

})
