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

const loadData = async function () {
  const response = await fetch('./data.json');
  const data = await response.json();

  if (!response.ok) throw new Error('Data not found!');

  return data;
};

const app = async function (parentEl) {
  try {
    const { comments, currentUser } = await loadData();

    const commentForm = generateForm(currentUser);
    parentEl.insertAdjacentHTML('beforeend', commentForm);
  } catch (error) {
    console.error(error);
  }
};

app(parentElement);
