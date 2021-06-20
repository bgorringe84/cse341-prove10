const deleteCar = (btn) => {
   const carId = btn.parentNode.querySelector('[name=carId]').value;
   const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

   const carElement = btn.closest('tr');

   fetch('/car/' + carId, {
      method: 'DELETE',
      headers: {
         'csrf-token': csrf
      }
   })
      .then(result => {
         return result.json();
      })
      .then(data => {
         console.log(data);
         carElement.parentNode.removeChild(carElement);
      })
     .catch(err => { console.log(err);
     });
};