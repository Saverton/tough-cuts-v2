"use strict";

(function (app) {
  app.copyrightYear = document.getElementById('copyright-year');

  app.initIndex = async function () {
    setCopyrightYear();
  }

  app.initProjects = async function () {
    setCopyrightYear();
  }

  app.initFaq = async function () {
    setCopyrightYear();

    const faqContainer = document.getElementById('faqs-container');

    const loadMessage = buildLoadMessage('Loading FAQs...');
    faqContainer.appendChild(loadMessage);

    // pull in FAQ data
    const faqs = await getFaqs();

    if (faqs.length > 0) {
      const faqFragment = document.createDocumentFragment();

      faqs.forEach(
        (faqObj) => {
          const faq = buildFaq(faqObj);
          faqFragment.appendChild(faq);
        }
      );

      faqContainer.innerHTML = ''; // remove loading message
      faqContainer.appendChild(faqFragment);
    } else {
      const errMessage = buildErrorMessage('Failed to get FAQs.');

      faqContainer.innerHTML = ''; // remove loading message
      faqContainer.appendChild(errMessage);
    }
  }

  app.initAboutUs = async function () {
    setCopyrightYear();
  }

  app.initContactUs = async function () {
    setCopyrightYear();
  }

  async function getFaqs() {
    try {
      const response = await fetch('data/faq.json');
      return await response.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  function buildFaq(faqObject) {
    const questionAnswer = document.createElement('div');
    questionAnswer.classList.add('question-answer');

    const question = document.createElement('p');
    question.classList.add('question');
    question.textContent = faqObject.question;

    const answer = document.createElement('p');
    answer.classList.add('answer');
    answer.textContent = faqObject.answer;

    questionAnswer.appendChild(question);
    questionAnswer.appendChild(answer);

    return questionAnswer;
  }

  function buildErrorMessage(message) {
    const errMessage = document.createElement('p');
    errMessage.classList.add('error-message');
    errMessage.textContent = message;

    return errMessage;
  }

  function buildLoadMessage(message) {
    const loadMessage = document.createElement('p');
    loadMessage.classList.add('loading-message');
    loadMessage.textContent = message;

    return loadMessage;
  }

  function setCopyrightYear() {
    const year = new Date().getFullYear();
    app.copyrightYear.textContent = year;
  }
})(window.app = window.app || {});

