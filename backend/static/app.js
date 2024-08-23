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
      /// c:
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

// Función para agregar un fragmento a un elemento padre y devolver el hijo agregado
function appendFrag(frag, parent) {
  var children = [].slice.call(frag.childNodes, 0);
  parent.appendChild(frag);
  return children[1];
}

// Función para agregar un comentario al objeto de datos
const addComment = (body, parentId, replyTo = undefined) => {
  // Determinar el comentario padre en función del parentId
  let commentParent =
    parentId === 0
      ? data.comments
      : data.comments.filter((c) => c.id == parentId)[0].replies;

  // Crear un nuevo objeto de comentario
  let newComment = {
    parent: parentId,
    id:
      commentParent.length == 0
        ? 1
        : commentParent[commentParent.length - 1].id + 1,
    content: body,
    createdAt: "Ahora",
    replyingTo: replyTo,
    replies: parentId == 0 ? [] : undefined,
    user: data.currentUser,
  };

  // Agregar el nuevo comentario al arreglo commentParent
  commentParent.push(newComment);

  // Volver a inicializar los comentarios
  initComments();
};

// Función para eliminar un comentario del objeto de datos
const deleteComment = (commentObject) => {
  if (commentObject.parent == 0) {
    // Si el comentario es un comentario de nivel superior, eliminarlo del arreglo de comentarios
    data.comments = data.comments.filter((e) => e != commentObject);
  } else {
    // Si el comentario es una respuesta, eliminarlo del arreglo de respuestas de su comentario padre
    data.comments.filter((e) => e.id === commentObject.parent)[0].replies =
      data.comments
        .filter((e) => e.id === commentObject.parent)[0]
        .replies.filter((e) => e != commentObject);
  }

  // Volver a inicializar los comentarios
  initComments();
};

// Función para solicitar la eliminación de un comentario
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

// Función para crear un nodo de comentario
const createCommentNode = (commentObject) => {
  // Clonar la plantilla de comentario y llenarla con los datos del objeto de comentario
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

  // Agregar un event listener al botón "Eliminar" si el comentario pertenece al usuario actual
  if (commentObject.user.username == data.currentUser.username) {
    commentNode.querySelector(".comment").classList.add("this-user");
    commentNode.querySelector(".delete").addEventListener("click", () => {
      promptDel(commentObject);
    });
  }

  return commentNode;
};

// Función para agregar un nodo de comentario a su elemento padre
const appendComment = (parentNode, commentNode, parentId) => {
  const bu_reply = commentNode.querySelector(".reply");

  const appendedCmnt = appendFrag(commentNode, parentNode);
  const replyTo = appendedCmnt.querySelector(".usr-name").textContent;

  // Agregar un event listener al botón "Responder"
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

// Función para inicializar los comentarios
function initComments(
  commentList = data.comments,
  parent = document.querySelector(".comments-wrp")
) {
  // Limpiar el elemento padre
  parent.innerHTML = "";

  // Iterar a través de commentList y crear nodos de comentario
  commentList.forEach((element) => {
    var parentId = element.parent == 0 ? element.id : element.parent;
    const comment_node = createCommentNode(element);

    // Si el comentario tiene respuestas, inicializar recursivamente las respuestas
    if (element.replies && element.replies.length > 0) {
      initComments(element.replies, comment_node.querySelector(".replies"));
    }

    // Agregar el nodo de comentario al elemento padre
    appendComment(parent, comment_node, parentId);
  });
}

// Inicializar los comentarios
initComments();

// Agregar un event listener al botón "Agregar Comentario"
const cmntInput = document.querySelector(".reply-input");
cmntInput.querySelector(".bu-primary").addEventListener("click", () => {
  let commentBody = cmntInput.querySelector(".cmnt-input").value;
  if (commentBody.length == 0) return;
  addComment(commentBody, 0);
  cmntInput.querySelector(".cmnt-input").value = "";
});
