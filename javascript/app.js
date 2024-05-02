import data from '../data.json' assert {type: 'json'};

const quizzes = data.quizzes;

const quizzData = {
  topTitle: document.querySelector('.header__top-title'),
  bottomTitle: document.querySelector('.header__bottom-title'),
  title: document.querySelector('.header__title'),
  questions: document.querySelector('.header__questions'),
  cards: document.querySelector('.cards'),
  titleQuestion: document.querySelector('.header__question'),
  buttonSubmit: document.querySelector('#submit'),
  buttonAgain: document.querySelector('#again'),
  errorMessage: document.querySelector('.card__error'),
  scoreHtml: document.querySelector('.score'),
  accessibility: document.querySelector('.control__accessibility'),
  scoreCount: document.querySelector('.score__count'),
  progressLine: document.querySelector('.progress__second-line'),
  questionOf:  document.querySelector('.header__questions-subtitle'),
  questionOfScore:  1,
  allCards: [],
  card: Node,
  answer: '',
  answerId: '',
  variants: [],
  isStart: true,
  isNext: false,
  count: 0,
  corretAnswer: 0,
  cardVariant: ['A', 'B', 'C', 'D'],
  length: 0,

}



function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.body.className = localStorage.getItem('theme') || 'dark-theme';

//переключение тем 
document.getElementById('themeToggle').addEventListener('click', function () {
let currentTheme = localStorage.getItem('theme') || document.body.className;
  if(!localStorage.getItem('theme') || currentTheme === 'dark-theme') {
      document.body.className = 'light-theme';
      localStorage.setItem('theme', 'light-theme');
  } else {
      document.body.className = 'dark-theme';
      localStorage.setItem('theme', 'dark-theme');

  }
});

// рендер первого экрана
const renderCard = () => {
  quizzes.map((quiz) => {
    quizzData.cards.insertAdjacentHTML('beforeend',
      `<button tabindex="0" id="${quiz.title}" class="card">
      <img src="${quiz.icon}" alt="html icon" class="card__img ${quiz.title}">
      <span class="card__description">${quiz.title}</span>
      </button>`
    )
  })
}

// рендер второго экрана
const renderQuestions = (question) => {

  quizzData.cards.innerHTML = ''
  quizzData.answer = question.answer;
  quizzData.titleQuestion.textContent = question.question

  question.options.map((option, indx) => {
    const escapedOption = escapeHtml(option);
    quizzData.questionOf.textContent = `Question ${quizzData.questionOfScore} of ${ quizzData.variants.length}`;
    quizzData.cards.insertAdjacentHTML('beforeend',
      `<button tabindex="-1" id="${escapedOption}" class="card card-answer${indx}">
      <span tabindex="1" class="card__variant answer${indx}">${quizzData.cardVariant[indx]}</span>
      <span class="card__description">${escapedOption}</span>
      </button>`
    )
  })
  quizzData.allCards = document.querySelectorAll('.card')

}

// установка выбранного сета вопросов  quizzData.variants
const setQuestions = (id) => {
  const result = data.quizzes.find(quiz => quiz.title === id).questions;
  quizzData.variants = result
  quizzData.length = result.length
  renderQuestions(quizzData.variants[quizzData.count])
}

renderCard()

const setCorrect = (card) => {
  quizzData.count++
  quizzData.answerId = card.id
  quizzData.card = card
  quizzData.isNext = true

  card.classList.add('answer-select-button')
  card.firstElementChild.classList.add('answer-select-label')

  if (quizzData.answer === quizzData.answerId) {
    quizzData.card.classList.add('correct-button')
    quizzData.card.firstElementChild.classList.add('correct-label')


    quizzData.corretAnswer++
  } else {
    quizzData.card.classList.add('not-correct-button')
    quizzData.card.firstElementChild.classList.add('not-correct-label')

    quizzData.allCards.forEach(item => {
      if (item.id === quizzData.answer) {
        item.classList.add('show-correct-button')
      }
    })

  }
  quizzData.buttonSubmit.textContent = 'Next Question'
}
const setNext = (id) => {
  quizzData.questions.classList.remove('hidden');
  quizzData.title.classList.add('hidden');
  quizzData.isStart = false;
  quizzData.buttonSubmit.classList.remove('hidden')

  quizzData.accessibility.classList.remove('hidden')
  switch (id) {
    case 'HTML': {
      quizzData.accessibility.firstElementChild.setAttribute('src', '../assets/images/icon-html.svg')
      quizzData.accessibility.lastElementChild.textContent = 'HTML'
      break;
    }
    case 'CSS': {
      quizzData.accessibility.firstElementChild.setAttribute('src', '../assets/images/icon-css.svg')
      quizzData.accessibility.lastElementChild.textContent = 'CSS'
      break;

    }
    case 'JavaScript': {
      quizzData.accessibility.firstElementChild.setAttribute('src', '../assets/images/icon-js.svg')
      quizzData.accessibility.lastElementChild.textContent = 'JavaScript'
      break;

    }
    case 'Accessibility': {
      quizzData.accessibility.firstElementChild.setAttribute('src', '../assets/images/icon-accessibility.svg')
      quizzData.accessibility.lastElementChild.textContent = 'Accessibility'
      break;


    }
    default: {
      break
    }
  }


}

// start quizz
quizzData.cards.addEventListener('click', (e) => {
  const card = e.target.closest('button')
  if (card && quizzData.isStart) {
    setQuestions(card.id);
    setNext(card.id)
  } else if (card && !quizzData.isNext) {
    // получить все кнопки с ответами 
    setCorrect(card)
    quizzData.questionOfScore++
  }

})

const finish = () => {
  quizzData.questions.classList.add('hidden');
  quizzData.title.classList.remove('hidden');
  quizzData.scoreHtml.classList.remove('hidden');

  quizzData.isStart = true;
  quizzData.buttonSubmit.classList.add('hidden')
  quizzData.buttonAgain.classList.remove('hidden')

  quizzData.topTitle.textContent = 'Quiz completed'
  quizzData.bottomTitle.textContent = 'You scored...'
  quizzData.bottomTitle.style = 'margin-bottom: 40px;';
  quizzData.bottomTitle.nextElementSibling.classList.add('hidden')
  quizzData.cards.classList.add('hidden')

  quizzData.scoreHtml.insertAdjacentElement('afterbegin', quizzData.accessibility)
  quizzData.scoreCount.textContent = quizzData.corretAnswer

}

const handleProgress = () => {
  if (!quizzData.currentWidth) {
    quizzData.currentWidth = 0;
  }
  quizzData.currentWidth += 10;
  quizzData.currentWidth = Math.min(quizzData.currentWidth, 100);
  quizzData.progressLine.style.width = `${quizzData.currentWidth}%`;
}


quizzData.buttonSubmit.addEventListener('click', (e) => {
  if (!quizzData.isNext) {
    quizzData.errorMessage.classList.remove('hidden')
  } else {
    quizzData.errorMessage.classList.add('hidden')
    quizzData.length--
    

    handleProgress()
    if (quizzData.length > 0) {
      renderQuestions(quizzData.variants[quizzData.count])
      quizzData.isNext = false;
    } else {
      finish()
    }
  }
})

const quizzAgain = () => {
  window.location.reload()
}


quizzData.buttonAgain.addEventListener('click', (e) => {
  quizzAgain()
})