console.log("JS start.");

console.log("Define variables.")
var sideSubmitButton = document.getElementById('side-submit-button');
var modalBackground = document.getElementById('modal-background');
var createPostModal = document.getElementById('create-post-modal');

// User clicks on the make post button.
sideSubmitButton.addEventListener("click", function() {
  //Make modal visible.
  console.log("Revealed the modal.");
  modalBackground.classList.remove('hidden');
  createPostModal.classList.remove('hidden');
});
