document.addEventListener('DOMContentLoaded', function() {
  const deleteButton = document.querySelector('#delete-book')

  if (deleteButton) {
    deleteButton.addEventListener('click', function(event) {
      const bookId = deleteButton.getAttribute('data-id')
      console.log('deleting book #', bookId)
      fetch(`/books/${bookId}/delete`, { method: 'DELETE' })
        .then(result => {
          window.location = '/'
        })
        .catch(error => console.error(error))
    })
  }

})
