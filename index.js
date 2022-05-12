const parentElement = document.querySelector('.c-comment');
const allComments = document.querySelectorAll('.c-comment__item');

const state = {
  currentUser: {},
  comments: [],
  target: 0,
  last: 5,
};

const generateForm = function (user, type = 'NEW') {
  return `
    <form action="#" class="c-comment__form ${
      type === 'REPLY' ? '--reply' : ''
    }">
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
          <button class="btn btn--tiny btn__upscore">
            <img src="./images/icon-plus.svg" alt="Plus" />
          </button>

          <span class="c-card__score__display">${comment.score}</span>

          <button class="btn btn--tiny btn__dowscore">
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

const resetUi = function () {
  parentElement.innerHTML = '';

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

    resetUi();
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

  const oldForm = document.querySelector('.--reply');
  if (oldForm) {
    const parent = oldForm.closest('.c-comment__item');
    parent.removeChild(oldForm);
  }

  const form = generateForm(state.currentUser, 'REPLY');
  const commentTarget = buttonReply.closest('.c-card');

  const id = commentTarget.dataset.id;
  state.target = +id;

  commentTarget.insertAdjacentHTML('afterend', form);
});

// NEW COMMENT
/////////////////////////////////////////////
parentElement.addEventListener('click', e => {
  const submitButton = e.target.closest('.form__comment');

  if (!submitButton) return;

  const form = e.target.closest('.c-comment__form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const inputComment = this.querySelector('.c-comment__form__text');
    const text = inputComment.value;

    if (!text) return;

    persistComment(text, state.target ? 'REPLY' : 'NEW');
    state.target = 0;

    inputComment.value = '';
    resetUi();
  });
});

// UPDATE SCORE
/////////////////////////////////////////////
parentElement.addEventListener('click', e => {
  const button = e.target.closest('.btn--tiny');

  if (!button) return;

  const id = +button.closest('.c-card').dataset.id;
  const upscore = button.classList.contains('btn__upscore');

  state.comments.forEach(comment => {
    if (comment.id === id)
      upscore
        ? (comment.score += 1)
        : comment.score > 0 && (comment.score -= 1);
    else {
      comment.replies.forEach(sub => {
        if (sub.id === id) {
          upscore ? (sub.score += 1) : sub.score > 0 && (sub.score -= 1);
        } else sub.score = 0;
      });
    }
  });

  resetUi();
});

const persistComment = function (message, type) {
  state.last += 1;
  const newComment = {
    content: message,
    createdAt: '2 mounter later',
    id: state.last,
    replies: [],
    score: 0,
    user: state.currentUser,
  };

  if (type === 'NEW') state.comments.push(newComment);
  else {
    state.comments.forEach(comment => {
      if (comment.id === state.target) comment.replies.push(newComment);
      else {
        comment.replies.forEach(sub => {
          if (sub.id === state.target) comment.replies.push(newComment);
        });
      }
    });
  }
};

window.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  state.target = 0;
  resetUi();
});
