console.log("JavaScript start.");

console.log("Define variables.")
var sideSubmitButton = document.getElementById('side-submit-button');
var modalBackground = document.getElementById('modal-background');
var createPostModal = document.getElementById('create-post-modal');
var postTextInput = document.getElementById('post-text-input');
var postPhotoInput = document.getElementById('post-photo-input');

// User clicks on the make post button.
sideSubmitButton.addEventListener("click", function() {
  //Make modal visible.
  console.log("Revealed the modal.");
  modalBackground.classList.remove('hidden');
  createPostModal.classList.remove('hidden');
});

// This function closes the modal and reset all the fields.
function respondToCloseClick() {
  console.log("Hide the modal.");
  modalBackground.classList.add('hidden');
  createPostModal.classList.add('hidden');
  postTextInput.value = null;
  postPhotoInput.value = null;
}

// This function builds a post.
function buildPost() {
  //We will send to server here.
}

// This function creates a post if the title field is set. Otherwise gives user an error message.
function respondToAddClick() {
  // Check to make sure all fields are set.
  if(!postTextInput.value) {
    console.log("Post failed to create.");
    alert("Set the title before attempting to create a post.");
  }
  else {
    console.log("New post created.");
    buildPost();
    respondToCloseClick();
  }
}

// User interaction with modal.
createPostModal.addEventListener("click", function(e) {
  // User clicks on cancel or close buttons.
  var clickTarget = e.target;
  if(clickTarget.classList.contains("close-modal")) {
    respondToCloseClick();
  }
  // User clicks on create post.
  if(clickTarget.id == "modal-accept") {
    respondToAddClick();
  }
});
