const populate = () => {
   const list = document.getElementById('list');

   fetch('/prove10/fetchAll')
   .then(res => res.json())
   .then(data => {
       // Clear the list first
       while (list.firstChild) list.firstChild.remove()

       // Repopulate the list
       for (const avenger of data.avengers) {
           const li = document.createElement('li')
           li.className = "list-group-item"
           li.appendChild(document.createTextNode(avenger.name))
           list.appendChild(li)
       }
   })
   .catch(err => {
       console.error(err)
   })
}

const submitName = () => {
   const newName = document.getElementById('newName').value
   console.log(newName)
   fetch('/prove10/insertName', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({ newName })
   })
       .then(res => {
           document.getElementById('newName').value = ''
           populate()
       })
       .catch(err => {
           document.getElementById('newName').value = ''
           console.error(err)
       })
}

populate()