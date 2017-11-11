console.log("JavaScript start.");

console.log("Define variables.")
var postSubmitButton = document.getElementById('post-submit-button');
var stashSubmitButton = document.getElementById('stash-submit-button');
var modalBackground = document.getElementById('modal-background');
var createPostModal = document.getElementById('create-post-modal');
var createStashModal = document.getElementById('create-stash-modal');
var postTextInput = document.getElementById('post-text-input');
var postPhotoInput = document.getElementById('post-photo-input');
var stashNameInput = document.getElementById('stash-name-input');
var stashDescriptionInput = document.getElementById('stash-description-input');

//======================== SUBMIT POSTS ===================================//

if(postSubmitButton)
{
  // User clicks on the make post button.
  postSubmitButton.addEventListener("click", function() {
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

  // This function creates a post if the title field is set.
  // Otherwise gives user an error message.
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

}


//======================== SUBMIT STASHES ===================================//

if(stashSubmitButton)
{
  // User clicks on the make stash button.
  stashSubmitButton.addEventListener("click", function() {
    //Make modal visible.
    console.log("Revealed the modal.");
    modalBackground.classList.remove('hidden');
    createStashModal.classList.remove('hidden');
  });

  // This function closes the modal and resets all the fields.
  function respondToCloseClick() {
    console.log("Hide the modal.");
    modalBackground.classList.add('hidden');
    createStashModal.classList.add('hidden');
    stashNameInput.value = null;
    stashDescriptionInput.value = null;
  }

  // This function builds a stash.
  function buildStash() {
    //We will send to server here.
  }

  // This function creates a stash if the title field is set.
  // Otherwise gives user an error message.
  function respondToAddClick() {
    // Check to make sure all fields are set.
    if(!stashNameInput.value) {
      console.log("Post failed to create.");
      alert("Set the title before attempting to create a stash.");
    }
    else {
      console.log("New stash created.");
      buildStash();
      respondToCloseClick();
    }
  }

  // User interaction with modal.
  createStashModal.addEventListener("click", function(e) {
    // User clicks on cancel or close buttons.
    console.log("User clicked on stash modal.")
    var clickTarget = e.target;
    if(clickTarget.classList.contains("close-modal")) {
      respondToCloseClick();
    }
    // User clicks on create stash.
    if(clickTarget.id == "modal-accept") {
      respondToAddClick();
    }
  });
}
