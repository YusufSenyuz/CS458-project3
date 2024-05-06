function validateInputAndShowModal() {
   var input = document.getElementById('loginEmail').value;
   var pattern = /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$)|^\d+$/;
   if (!pattern.test(input)) {
     var myModal = new bootstrap.Modal(document.getElementById('myModal'));
     myModal.show();
     return false;
   }
   return true;
 }