var userInfoElement = document.querySelector('.reply-input');
var userName = userInfoElement.getAttribute('data-username');
var userImageElement = document.querySelector('.usr-img');
var userImageSrc = userImageElement
  ? userImageElement.getAttribute('src')
  : '/static/images/icons8-user-64.png';

console.log(userImageSrc);

const data = {
    currentUser: {
        image: {
            png: userImageSrc,
            webp: userImageSrc,
        },
        username: userName,
    },
    comments: [
        {
            parent: 0,
            id: 1,
            content: 
                "¡Alerta sísmica! Un terremoto de magnitud 6.2 ha sacudido la región de San Salvador. Se reportan daños en varios edificios y se están realizando evacuaciones. Manténgase a salvo y siga las indicaciones de las autoridades locales.",
            createdAt: "Hace 1 mes",
            user: {
                image: {
                    png: "/static/images/icons8-user-64.png",
                    webp: "/static/images/icons8-user-64.png",
                },
                username: "Brian",
            },
            replies: [],
        },
        {
            parent: 0,
            id: 2,
            content:
                "Nuevo informe sobre el terremoto en la región de México: La magnitud se ha ajustado a 7.1 y se han confirmado varias víctimas y heridos. Las autoridades están trabajando en el rescate de personas atrapadas entre los escombros. Se recomienda a la población que evite las áreas afectadas.",
            createdAt: "Hace 2 semanas",
            user: {
                image: {
                    png: "/static/uploads/Imagen_de_WhatsApp_2024-07-20_a_las_14.30.46_c21c79c0.jpg",
                    webp: "/static/uploads/Imagen_de_WhatsApp_2024-07-20_a_las_14.30.46_c21c79c0.jpg",
                },
                username: "Gabriel",
            },
            replies: [
                {
                    parent: 2,
                    id: 1,
                    content:
                        "He visto las imágenes y es devastador. ¿Hay alguna información sobre cómo podemos ayudar desde fuera? Me gustaría saber cómo hacer una donación o qué tipo de ayuda es necesaria.",
                    createdAt: "Hace 1 semana",
                    replyingTo: "Gabriel",
                    user: {
                        image: {
                            png: "/static/uploads/Mcqueen.jpg",
                            webp: "/static/uploads/Mcqueen.jpg",
                        },
                        username: "Kendal",
                    },
                },
                {
                    parent: 2,
                    id: 2,
                    content:
                        "En las noticias dijeron que la mayoría de los daños están en áreas residenciales. Me preocupa la situación de los afectados. ¿Alguien tiene información actualizada sobre los esfuerzos de rescate?",
                    createdAt: "Hace 2 días",
                    replyingTo: "Kendal",
                    user: {
                        image: {
                            png: "/static/uploads/channels4_profile.jpg",
                            webp: "/static/uploads/channels4_profile.jpg",
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
    createdAt: 'Now',
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
  const modalWrp = document.querySelector('.modal-wrp');
  modalWrp.classList.remove('invisible');
  modalWrp.querySelector('.yes').addEventListener('click', () => {
    deleteComment(commentObject);
    modalWrp.classList.add('invisible');
  });
  modalWrp.querySelector('.no').addEventListener('click', () => {
    modalWrp.classList.add('invisible');
  });
};

const spawnReplyInput = (parent, parentId, replyTo = undefined) => {
  if (parent.querySelectorAll('.reply-input')) {
    parent.querySelectorAll('.reply-input').forEach((e) => {
      e.remove();
    });
  }
  const inputTemplate = document.querySelector('.reply-input-template');
  const inputNode = inputTemplate.content.cloneNode(true);
  const addedInput = appendFrag(inputNode, parent);
  addedInput.querySelector('.bu-primary').addEventListener('click', () => {
    let commentBody = addedInput.querySelector('.cmnt-input').value;
    if (commentBody.length == 0) return;
    addComment(commentBody, parentId, replyTo);
  });
};

const createCommentNode = (commentObject) => {
  const commentTemplate = document.querySelector('.comment-template');
  var commentNode = commentTemplate.content.cloneNode(true);
  commentNode.querySelector('.usr-name').textContent =
    commentObject.user.username;
  commentNode.querySelector('.usr-img').src = commentObject.user.image.webp;

  commentNode.querySelector('.cmnt-at').textContent = commentObject.createdAt;
  commentNode.querySelector('.c-body').textContent = commentObject.content;
  if (commentObject.replyingTo)
    commentNode.querySelector('.reply-to').textContent =
      '@' + commentObject.replyingTo;

  if (commentObject.user.username == data.currentUser.username || data.currentUser.username === 'Admin') {
    commentNode.querySelector('.comment').classList.add('this-user');
    commentNode.querySelector('.delete').addEventListener('click', () => {
      promptDel(commentObject);
    });
  }
  return commentNode;
};

const appendComment = (parentNode, commentNode, parentId) => {
  const bu_reply = commentNode.querySelector('.reply');

  const appendedCmnt = appendFrag(commentNode, parentNode);
  const replyTo = appendedCmnt.querySelector('.usr-name').textContent;
  bu_reply.addEventListener('click', () => {
    if (parentNode.classList.contains('replies')) {
      spawnReplyInput(parentNode, parentId, replyTo);
    } else {
      spawnReplyInput(
        appendedCmnt.querySelector('.replies'),
        parentId,
        replyTo
      );
    }
  });
};

function initComments(
  commentList = data.comments,
  parent = document.querySelector('.comments-wrp')
) {
  parent.innerHTML = '';
  commentList.forEach((element) => {
    var parentId = element.parent == 0 ? element.id : element.parent;
    const comment_node = createCommentNode(element);
    if (element.replies && element.replies.length > 0) {
      initComments(element.replies, comment_node.querySelector('.replies'));
    }
    appendComment(parent, comment_node, parentId);
  });
}

initComments();
const cmntInput = document.querySelector('.reply-input');
cmntInput.querySelector('.bu-primary').addEventListener('click', () => {
  let commentBody = cmntInput.querySelector('.cmnt-input').value;
  if (commentBody.length == 0) return;
  addComment(commentBody, 0);
  cmntInput.querySelector('.cmnt-input').value = '';
});
