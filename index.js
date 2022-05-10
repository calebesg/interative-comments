const parentElement = document.querySelector('.c-comment');

const state = {
  currentUser: {},
  comments: [],
};

const generateForm = function (user, type = 'NEW') {
  return `
    <form action="#" class="c-comment__form">
      <picture>
        <img
          class="c-comment__form__avatar"
          src="${user.image.png}"
          loading="lazy"
          alt="${user.username}"
        />
      </picture>

      <textarea
        class="c-comment__form__text"
        name="comment"
        id="comment"
        cols="30"
        rows="1"
        placeholder="Add a comment..."
        aria-label="Enter you comment"
      ></textarea>

      <button class="btn btn--blue form__comment">${
        type === 'NEW' ? 'SEND' : 'REPLY'
      }</button>
    </form>
  `;
};

const generateComment = function (comment, replies = null) {
  return `
    <li class="c-comment__item">
      <div class="c-card" data-id="${comment.id}">
        <div class="c-card__score">
          <button class="btn btn--tiny">
            <img src="./images/icon-plus.svg" alt="Plus" />
          </button>

          <span class="c-card__score__display">${comment.score}</span>

          <button class="btn btn--tiny">
            <img src="./images/icon-minus.svg" alt="Minus" />
          </button>
        </div>

        <div class="c-card__post">
          <header class="c-card__header">
            <figure class="c-card__publisher">
              <img
                class="c-card__publisher__photo"
                src="${comment.user.image.png}"
                alt="${comment.user.username}"
              />
              <figcaption>
                <strong class="c-card__publisher__name">${
                  comment.user.username
                }</strong>
                <span class="c-card__publisher__date">${
                  comment.createdAt
                }</span>
              </figcaption>
            </figure>

            <button class="btn btn--link btn__reply">
              <img
                src="./images/icon-reply.svg"
                alt=""
                aria-hidden="true"
              />
              Reply
            </button>
          </header>
          <p class="c-card__comment">${comment.content}</p>
        </div>
      </div>

      ${replies ? replies : ''}
    </li>
  `;
};

const generateCommentList = function (comments) {
  const commentList = `
    <ul class="c-comment__list">
      ${comments
        .map(comment => {
          if (comment?.replies.length === 0) return generateComment(comment);

          const replies = `
            <ul class="c-comment__reply">
              ${comment.replies.map(reply => generateComment(reply)).join('')}
            </ul>
          `;

          return generateComment(comment, replies);
        })
        .join('')}
    </ul>
  `;

  return commentList;
};

const loadData = async function () {
  const response = await fetch('./data.json');
  const data = await response.json();

  if (!response.ok) throw new Error('Data not found!');

  return data;
};

const updateUI = function () {
  parentElement.innerHTML = '';

  console.log(state.comments);

  const commentForm = generateForm(state.currentUser);
  parentElement.insertAdjacentHTML('beforeend', commentForm);

  const commentsEl = generateCommentList(state.comments);
  parentElement.insertAdjacentHTML('afterbegin', commentsEl);
};

const app = async function () {
  try {
    const { comments, currentUser } = await loadData();
    state.currentUser = currentUser;
    state.comments = comments;

    updateUI();
  } catch (error) {
    console.error(error);
  }
};
app();

// REPLY
//////////////////////////////////////////////
parentElement.addEventListener('click', e => {
  const buttonReply = e.target.closest('.btn__reply');

  if (!buttonReply) return;
});

// NEW COMMENT
/////////////////////////////////////////////
parentElement.addEventListener('click', e => {
  const submitButton = e.target.closest('.form__comment');

  if (!submitButton) return;

  const form = e.target.closest('.c-comment__form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const inputComment = e.target.querySelector('.c-comment__form__text');
    const comment = inputComment.value;

    if (!comment) return;

    inputComment.value = '';

    const newComment = {
      content: comment,
      createdAt: '2 mounter later',
      id: 5,
      replies: [],
      score: 0,
      user: state.currentUser,
    };

    state.comments.push(newComment);

    updateUI();
  });
});
