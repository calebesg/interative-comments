const parentElement = document.querySelector('.c-comment');

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

      <button class="btn btn--blue">${
        type === 'NEW' ? 'SEND' : 'REPLY'
      }</button>
    </form>
  `;
};

const generateComment = function (comment, replies = null) {
  return `
    <li class="c-comment__item">
      <div class="c-card">
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

            <button class="btn btn--link">
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

const app = async function (parentEl) {
  try {
    const { comments, currentUser } = await loadData();
    console.log(comments);

    const commentForm = generateForm(currentUser);
    parentEl.insertAdjacentHTML('beforeend', commentForm);

    const commentsEl = generateCommentList(comments);
    parentEl.insertAdjacentHTML('afterbegin', commentsEl);
  } catch (error) {
    console.error(error);
  }
};

app(parentElement);
