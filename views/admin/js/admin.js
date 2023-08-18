const deleteProduct = (btn) => {
    const bookId = btn.parentNode.querySelector('[name=bookId]').value;
    const bookElement = btn.closest('article');
    fetch('/admin/delete-book/' + bookId, {
        method: 'DELETE',
    }).then(result => {
        bookElement.parentNode.removeChild(bookElement);
        console.log(result);
    }).catch(err => {
        console.log(err);
    });
}