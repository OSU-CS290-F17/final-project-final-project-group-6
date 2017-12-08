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

// Copy of our stashes and posts.
if(document.getElementById('id-stashes')) {
  var searchCopyStash = document.getElementById('id-stashes').cloneNode(true);
}

if(document.getElementById('id-posts')) {
  var searchCopyPost = document.getElementById('id-posts').cloneNode(true);
}

// This function uses the URL to get the stashId.
function getStashId() {
  var currentURL = window.location.pathname;
  var urlComponents = currentURL.split('/');
  if(urlComponents[0] === "" && urlComponents[1] === "stash") {
    console.log("==URL Component: ",urlComponents[2]);
    return urlComponents[2];
  } else {
    return null
  }
}

// This function uses the URL to get the postId.
function getPostId() {
  var currentURL = window.location.pathname;
  var urlComponents = currentURL.split('/');
  if (urlComponents[0] === "" && urlComponents[1] === "stash") {
    return urlComponents[3];
  } else {
    return null;
  }
}

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

  // Get the id of the stash we are currently in.
  function getStashId() {
    var currentURL = window.location.pathname;
    var urlComponents = currentURL.split('/');
    if (urlComponents[0] === "" && urlComponents[1] === "stash") {
      return urlComponents[2];
    } else {
      return null;
    }
  }

  // This function sends a requests to the server to build a post.
  function requestPost(postId, topic, user, imageURL, linkURL, title) {
    var postRequest = new XMLHttpRequest();
    var postURL = "/stash/" + getStashId() + "/addPost";
    postRequest.open('POST', postURL);

    var postObj = {
      topic: topic,
      user: user,
      imageURL: imageURL,
      linkURL: linkURL,
      title: title
    };

    var requestBody = JSON.stringify(postObj);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function (event) {
      if (event.target.status !== 200) {
        alert("Error storing post in database:\n\n\n" + event.target.response);
      } else {
        var newLinkUrl = "/stash/"+getStashId()+"/"+event.target.responseText;
        var newStashId = getStashId().replace("%20", " ");
        buildPost(postId, newStashId, user, imageURL, newLinkUrl, title);
      }
    });

    console.log("postRequest:", requestBody);
    postRequest.send(requestBody);
  }

  // This function builds a post.
  function buildPost(postId, topic, user, imageURL, linkURL, title) {
    console.log("New post created.");

    var context = {
      postId: postId,
      topic: topic,
      user: user,
      imageURL: imageURL,
      linkURL: linkURL,
      title: title
    };

    var postHTML = Handlebars.templates.post(context);

    // Make a post and add it into the DOM.
    var postsContainer = document.querySelector('#id-posts');
    postsContainer.insertAdjacentHTML('beforeend', postHTML);

    // Make a copy of our post and add it to our post copy.
    var newPostCopy = document.getElementById("id-posts").lastChild.previousSibling.cloneNode(true);
    searchCopyPost.insertBefore(newPostCopy, searchCopyPost.lastChild.nextSibling);

    return postHTML;
  }

  // This function creates a post if the title field is set.
  // Otherwise gives user an error message.
  function respondToAddClick() {
    // Check to make sure all fields are set.
    if(!postTextInput.value || !postPhotoInput.value) {
      console.log("Post failed to create.");
      alert("Fill all fields before attempting to create a post.");
    }
    else {
      // We create the post and fill it with relavent data.
      var id = "0";
      var stash = "Generic";
      var linkURL = "#";
      var userName = document.getElementById("text-name-of-poster").value;
      if(userName == "") {userName = "Anonymous";}
      requestPost(id, stash, userName, postPhotoInput.value, linkURL,  postTextInput.value);
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

  // This function sends a requests to the server to build a stash.
  function requestStash(stashId, topic, linkURL, text) {
    var postRequest = new XMLHttpRequest();
    var postURL = "/addStash";
    postRequest.open('POST', postURL);

    var postObj = {
      stashId: stashId,
      topic: topic,
      linkURL: linkURL,
      text: text
    };

    var requestBody = JSON.stringify(postObj);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function (event) {
      if (event.target.status !== 200) {
        alert("Error storing stash in database:\n\n\n" + event.target.response);
      } else {
        buildStash(stashId, topic, "/stash/" + topic , text);
      }
    });

    console.log("postRequest:", requestBody);
    postRequest.send(requestBody);
  }

  // This function builds a stash.
  function buildStash(stashId, topic, linkURL, text) {
    console.log("New stash created.");

    var context = {
      stashId: stashId,
      topic: topic,
      linkURL: linkURL,
      text: text
    };

    var stashHTML = Handlebars.templates.stash(context);

    //Insert the stash into the DOM.
    var stashesContainer = document.querySelector('#id-stashes');
    stashesContainer.insertAdjacentHTML('beforeend', stashHTML);

    // Make a copy of our stash and add it to our stash copy.
    var newStashCopy = document.getElementById("id-stashes").lastChild.previousSibling.cloneNode(true);
    searchCopyStash.insertBefore(newStashCopy, searchCopyStash.lastChild.nextSibling);

    return stashHTML;
  }

  // This function creates a stash if the title field is set.
  // Otherwise gives user an error message.
  function respondToAddClick() {
    // Check to make sure all fields are set.
    if(!stashNameInput.value || !stashDescriptionInput.value) {
      console.log("Stash failed to create.");
      alert("Fill all fields before attempting to create a stash.");
    }
    else {
      // We create the stash and fill it with relavent data.
      var id = "0";
      var linkURL = "#";
      var name = document.getElementById('stash-name-input').value;
      var description = document.getElementById('stash-description-input').value;
      requestStash(id, name, linkURL, description);
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

// This function sends a requests to the server to build a comment.
function requestComment(commentId, user, text) {
  var postRequest = new XMLHttpRequest();
  var postURL = "/stash/" + getStashId() + "/" + getPostId() + "/addComment";
  postRequest.open('POST', postURL);

  var postObj = {
    commentId: commentId,
    user: user,
    text: text
  };

  var requestBody = JSON.stringify(postObj);
  postRequest.setRequestHeader('Content-Type', 'application/json');

  postRequest.addEventListener('load', function (event) {
    if (event.target.status !== 200) {
      alert("Error storing comment in database:\n\n\n" + event.target.response);
    } else {
      buildComment(commentId, user, text);
    }
  });

  console.log("postRequest:", requestBody);
  postRequest.send(requestBody);
}

// This function builds a new comment.
function buildComment(commentId, user, text) {
  console.log("New comment created.");

  var context = {
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
      requestComment(id, userName, textField);
      newCommentBox.value = "";
    }
  });
}

//======================== SEARCH ===================================//

console.log("Define variables for searching posts/stashes.");
var searchButton = document.getElementById("id-search-button");
var searchPost = document.getElementById("search-post");
var searchStash = document.getElementById("search-stash");

// This function searches our stashes.
function requestSearchStash(searchText) {
  console.log("We are searching for a stash.");

  // Make sure we are searching through all of our stashes.
  stashRefresh();

  // Update variables.
  var allStash = document.getElementsByClassName('stash');
  var searchStash = document.getElementById("search-stash").value;

  // Remove all stashes that don't match our search filter.
  for(var i = 0; i < allStash.length; i++) {
    if(allStash[i]) {
      savePostName = allStash[i].getElementsByClassName('stash-title');
      savePostName = savePostName[0].innerText;
      // Remove posts that don't match our text filter (Case in-sensitive).
      if(savePostName.toUpperCase().search(searchStash.toUpperCase()) == -1 && searchStash !== "") {
        allStash[i].remove();
        i--;
      }
    }
  }
}

// This function searches our posts.
function requestSearchPost(searchText) {
  console.log("We are searching for a post.");

  // Make sure we are searching through all of our stashes.
  postRefresh();

  // Update variables.
  var allPost = document.getElementsByClassName('post');
  var searchPost = document.getElementById("search-post").value;

  // Remove all posts that don't match our search filter.
  for(var i = 0; i < allPost.length; i++) {
    if(allPost[i]) {
      savePostName = allPost[i].getElementsByClassName('post-title');
      savePostName = savePostName[0].innerText;
      // Remove posts that don't match our text filter (Case in-sensitive).
      if(savePostName.toUpperCase().search(searchPost.toUpperCase()) == -1 && searchPost !== "") {
        allPost[i].remove();
        i--;
      }
    }
  }
}

// This function refreshes our stashes.
function stashRefresh() {
  console.log("Updated stashes.");
  var copyOverContent = searchCopyStash.cloneNode(true);
  var contentsOfPage = document.getElementById('id-content-container');
  var allStash = document.getElementById('id-stashes');

  allStash.remove();
  contentsOfPage.appendChild(copyOverContent);
}

// This function refreshes our posts.
function postRefresh() {
  console.log("Updated posts.");
  var copyOverContent = searchCopyPost.cloneNode(true);
  var contentsOfPage = document.getElementById('id-content-container');
  var allStash = document.getElementById('id-posts');

  allStash.remove();
  contentsOfPage.appendChild(copyOverContent);
}

// User clicks on search button.
if(searchButton) {
  searchButton.addEventListener("click", function() {
    if(searchPost) {
      requestSearchPost(searchPost.value);
    }
    if(searchStash) {
      requestSearchStash(searchStash.value);
    }
  });
}
