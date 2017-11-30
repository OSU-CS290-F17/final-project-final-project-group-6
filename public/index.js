console.log("JavaScript start.");

console.log("Define variables for submiting posts/stashes.")
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
  function buildPost(postId, topic, user, imageURL, linkURL, title) {
    console.log("New post created.");
    //*************************************************************
    // We send the body of our post as a request to the server.
    // (can start by just creating a client side handlebars object.)
    //*************************************************************
    var context = {
      postId: postId,
      topic: topic,
      user: user,
      imageURL: imageURL,
      linkURL: linkURL,
      title: title
    };

    var postHTML = Handlebars.templates.post(context);

    var postsContainer = document.querySelector('#id-posts');
    postsContainer.insertAdjacentHTML('beforeend', postHTML);

    return postHTML;
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
      // We create the post and fill it with relavent data.
      var id = "0";
      var stash = "Generic";
      var linkURL = "#";
      var userName = document.getElementById("text-name-of-poster").value;
      if(userName == "") {userName = "Anonymous";}
      buildPost(id, stash, userName, postPhotoInput.value, linkURL,  postTextInput.value);
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
  function buildStash(stashId, topic, linkURL, text) {
    console.log("New stash created.");
    //*************************************************************
    // We send the body of our stash as a request to the server.
    // (can start by just creating a client side handlebars object.)
    //*************************************************************
    var context = {
      stashId: stashId,
      topic: topic,
      linkURL: linkURL,
      text: text
    };

    var stashHTML = Handlebars.templates.stash(context);

    var stashesContainer = document.querySelector('#id-stashes');
    stashesContainer.insertAdjacentHTML('beforeend', stashHTML);

    return stashHTML;
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
      // We create the stash and fill it with relavent data.
      var id = "0";
      var linkURL = "#";
      var name = document.getElementById('stash-name-input');;
      var description = document.getElementById('stash-description-input');;
      buildStash(id, name, linkURL, description);
      respondToCloseClick();
    }
  }

  // User interaction with modal.
  createStashModal.addEventListener("click", function(e) {
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

//=================== SUBMIT COMMENT ================================//

var commentButton = document.getElementById("comment-button");
var newCommentBox = document.getElementById("comment-body-input");

// This function sends a request to the server to create a new comment.
function buildComment(commentId, user, text) {
  console.log("New comment created.");
  //*************************************************************
  // We send the body of our comment as a request to the server.
  // (can start by just creating a client side handlebars object.)
  //*************************************************************
  var context = {
    commentId: commentId,
    user: user,
    text: text
  };

  var commentHTML = Handlebars.templates.comment(context);

  var commentsContainer = document.querySelector('#id-comments');
  commentsContainer.insertAdjacentHTML('beforeend', commentHTML);

  return commentHTML;
}

// User clicks on the comment button.
if(commentButton) {
  commentButton.addEventListener("click", function() {
    // Don't create a new comment if the text field is empty.
    if(newCommentBox.value !== "") {
      // We create the comment and fill it with relavent data.
      var id = "0";
      var textField = document.getElementById("comment-body-input").value;
      var userName = document.getElementById("text-name-of-poster").value;
      if(userName == "") {userName = "Anonymous";}
      buildComment(id, userName, textField);
      newCommentBox.value = "";
    }
  });
}

//======================== SEARCH ===================================//

console.log("Define variables for searching posts/stashes.");
var searchButton = document.getElementById("id-search-button");
var searchStash = document.getElementById("search-stash");
var searchPost = document.getElementById("search-post");


// This function sends a request to the server to find a stash that contains
// the given text.
function requestSearchStash() {
  console.log("We are searching for a stash.");
}

// This function sends a request to the server to find a post that contains
// the given text.
function requestSearchPost() {
  console.log("We are searching for a post.");
}

// User clicks on search button.
if(searchButton) {
  searchButton.addEventListener("click", function() {
    if(searchPost) {
      // Don't search if the text field is empty.s
      if(searchPost.value !== "") {
        requestSearchPost();
      }
    }
    if(searchStash) {
      // Don't search if the text field is empty.s
      if(searchStash.value !== "") {
        requestSearchStash();
      }
    }
  });
}

//==================== WAITING FOR SERVER RESPONSES =======================//
//*************************************************************
// This is where we setup functions waiting for a response from the server.
// This is where we should REALLY be creating the handlebars object once we
// get a status 200 code back from one of our above requests.
//*************************************************************
