const data = {
    currentUser: {
      image: {
        png: "./images/avatars/default_avatar.png",
        webp: "./images/avatars/defaultWEB_avatar.webp",
      },
      username: "Luis",
    },
    comments: [
      {
        parent: 0,
        id: 1,
        content:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione nobis suscipit officia ea corporis consequatur dolores quod, aliquam pariatur veniam, quae enim aspernatur inventore. Nemo repudiandae neque nesciunt adipisci ab!",
        createdAt: "1 month ago",
        user: {
          image: {
            png: "./images/avatars/default_avatar.png",
            webp: "./images/avatars/defaultWEB_avatar.webp",
          },
          username: "Brian",
        },
        replies: [],
      },
      {
        parent: 0,
        id: 2,
        content:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione nobis suscipit officia ea corporis consequatur dolores quod, aliquam pariatur veniam, quae enim aspernatur inventore. Nemo repudiandae neque nesciunt adipisci ab!",
        createdAt: "2 weeks ago",
        user: {
          image: {
            png: "./images/avatars/default_avatar.png",
            webp: "./images/avatars/defaultWEB_avatar.webp",
          },
          username: "Gabriel",
        },
        replies: [
          {
            parent: 2,
            id: 1,
            content:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione nobis suscipit officia ea corporis",
            createdAt: "1 week ago",
            replyingTo: "Gabriel",
            user: {
              image: {
                png: "./images/avatars/default_avatar.png",
                webp: "./images/avatars/defaultWEB_avatar.webp",
              },
              username: "Kendal",
            },
          },
          {
            parent: 2,
            id: 1,
            content:
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione nobis suscipit officia ea corporis consequatur dolores quod, aliquam pariatur",
            createdAt: "2 days ago",
            replyingTo: "Kendal",
            user: {
              image: {
                png: "./images/avatars/default_avatar.png",
                webp: "./images/avatars/defaultWEB_avatar.webp",
              },
              username: "Luis",
            },
          },
        ],
      },
    ],
  };
  
    function appendFrag(frag, parent) {
        var children = [].slice.call(frag.childNodes, 0);
        parent.appendChild(frag);
        return children[1];
    }
    
    const addComment = (body, parentId, replyTo = undefined) => {
        let commentParent =
        parentId === 0
            ? data.comments
            : data.comments.filter((c) => c.id == parentId)[0].replies;
        let newComment = {
        parent: parentId,
        id:
            commentParent.length == 0
            ? 1
            : commentParent[commentParent.length - 1].id + 1,
        content: body,
        createdAt: "Now",
        replyingTo: replyTo,
        replies: parent == 0 ? [] : undefined,
        user: data.currentUser,
        };
        commentParent.push(newComment);
        initComments();
    };
    const deleteComment = (commentObject) => {
        if (commentObject.parent == 0) {
        data.comments = data.comments.filter((e) => e != commentObject);
        } else {
        data.comments.filter((e) => e.id === commentObject.parent)[0].replies =
            data.comments
            .filter((e) => e.id === commentObject.parent)[0]
            .replies.filter((e) => e != commentObject);
        }
        initComments();
    };
    
    const promptDel = (commentObject) => {
        const modalWrp = document.querySelector(".modal-wrp");
        modalWrp.classList.remove("invisible");
        modalWrp.querySelector(".yes").addEventListener("click", () => {
        deleteComment(commentObject);
        modalWrp.classList.add("invisible");
        });
        modalWrp.querySelector(".no").addEventListener("click", () => {
        modalWrp.classList.add("invisible");
        });
    };
    
    const spawnReplyInput = (parent, parentId, replyTo = undefined) => {
        if (parent.querySelectorAll(".reply-input")) {
        parent.querySelectorAll(".reply-input").forEach((e) => {
            e.remove();
        });
        }
        const inputTemplate = document.querySelector(".reply-input-template");
        const inputNode = inputTemplate.content.cloneNode(true);
        const addedInput = appendFrag(inputNode, parent);
        addedInput.querySelector(".bu-primary").addEventListener("click", () => {
        let commentBody = addedInput.querySelector(".cmnt-input").value;
        if (commentBody.length == 0) return;
        addComment(commentBody, parentId, replyTo);
        });
    };
    
    const createCommentNode = (commentObject) => {
        const commentTemplate = document.querySelector(".comment-template");
        var commentNode = commentTemplate.content.cloneNode(true);
        commentNode.querySelector(".usr-name").textContent =
        commentObject.user.username;
        commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
        
        commentNode.querySelector(".cmnt-at").textContent = commentObject.createdAt;
        commentNode.querySelector(".c-body").textContent = commentObject.content;
        if (commentObject.replyingTo)
        commentNode.querySelector(".reply-to").textContent =
            "@" + commentObject.replyingTo;
    
        if (commentObject.user.username == data.currentUser.username) {
        commentNode.querySelector(".comment").classList.add("this-user");
        commentNode.querySelector(".delete").addEventListener("click", () => {
            promptDel(commentObject);
        });
        }
        return commentNode;
    };
    
    const appendComment = (parentNode, commentNode, parentId) => {
        const bu_reply = commentNode.querySelector(".reply");
    
        const appendedCmnt = appendFrag(commentNode, parentNode);
        const replyTo = appendedCmnt.querySelector(".usr-name").textContent;
        bu_reply.addEventListener("click", () => {
        if (parentNode.classList.contains("replies")) {
            spawnReplyInput(parentNode, parentId, replyTo);
        } else {
    
            spawnReplyInput(
            appendedCmnt.querySelector(".replies"),
            parentId,
            replyTo
            );
        }
        });
    };
    
    function initComments(
        commentList = data.comments,
        parent = document.querySelector(".comments-wrp")
    ) {
        parent.innerHTML = "";
        commentList.forEach((element) => {
        var parentId = element.parent == 0 ? element.id : element.parent;
        const comment_node = createCommentNode(element);
        if (element.replies && element.replies.length > 0) {
            initComments(element.replies, comment_node.querySelector(".replies"));
        }
        appendComment(parent, comment_node, parentId);
        });
    }
    
    initComments();
    const cmntInput = document.querySelector(".reply-input");
    cmntInput.querySelector(".bu-primary").addEventListener("click", () => {
        let commentBody = cmntInput.querySelector(".cmnt-input").value;
        if (commentBody.length == 0) return;
        addComment(commentBody, 0);
        cmntInput.querySelector(".cmnt-input").value = "";
    });
    
    