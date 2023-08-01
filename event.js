document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.getElementById('btn-new');
  const editBtns = document.getElementsByClassName('btn-edit');
  const delBtns = document.getElementsByClassName('btn-delete');

  newBtn.addEventListener('click', (e) => {
    e.preventDefault();

    window.location = '/new';
  });

  for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].addEventListener('click', (e) => {
      e.preventDefault();

      const listItem = e.currentTarget.parentElement;
      const listItemId = listItem.getAttribute('data-id');

      window.location = `/messages/${listItemId}`;
    });
  }

  for (let j = 0; j < delBtns.length; j++) {
    delBtns[j].addEventListener('click', (e) => {
      e.preventDefault();

      const listItem = e.currentTarget.parentElement;
      const listItemId = listItem.getAttribute('data-id');

      fetch(`/messages/${listItemId}`, {
        method: 'DELETE'
      }).then(response => response.json())
        .then(data => {
          if (data.message === 'success') {
            window.location = `/`
          } else {
            console.log(`Error: ${data.message}`);
          }
        });
    });
  }
});