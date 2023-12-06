"use strict";

(function (app) {
  app.copyrightYear = document.getElementById('copyright-year');

  app.initIndex = async function () {
    setCopyrightYear();

    const showcasedProjectContainer = document.getElementById('showcased-project');

    const loadMessage = buildLoadMessage('Loading showcased project...');
    showcasedProjectContainer.appendChild(loadMessage);

    const projectObject = await getShowcasedProject();
    
    if (projectObject !== undefined) {
      const showcasedProject = buildProject(projectObject);

      showcasedProjectContainer.innerHTML = '';
      showcasedProjectContainer.appendChild(showcasedProject);
    } else {
      const errMessage = buildErrorMessage('Failed to get showcased project.');

      showcasedProjectContainer.innerHTML = '';
      showcasedProjectContainer.appendChild(errMessage);
    }
  }

  app.initProjects = async function () {
    setCopyrightYear();

    const projectsContainer = document.getElementById('projects-section');

    const loadMessage = buildLoadMessage('Loading projects...');
    projectsContainer.appendChild(loadMessage);

    const projects = await getProjects();

    if (projects.length > 0) {
      const projectsFragment = document.createDocumentFragment();

      projects.forEach(
        (projectObj) => {
          const project = buildProject(projectObj);
          projectsFragment.appendChild(project);
        }
      );

      projectsContainer.innerHTML = '';
      projectsContainer.appendChild(projectsFragment);
    } else {
      const errMessage = buildErrorMessage('Failed to get projects.');

      projectsContainer.innerHTML = '';
      projectsContainer.appendChild(errMessage);
    }
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

  async function getProjects() {
    try {
      const response = await fetch('data/projects.json');
      return await response.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function getShowcasedProject() {
    const allProjects = await getProjects();

    const showcasedProjects = allProjects.filter(project => project.isShowcased);

    const randomIndex = Math.floor(Math.random(showcasedProjects.length));

    return showcasedProjects[randomIndex];
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

  function buildProject(projectObject) {
    const project = document.createElement('div');
    project.classList.add('project');

    const header = document.createElement('div');
    header.classList.add('project-header');

    const name = document.createElement('h3');
    name.textContent = projectObject.name;
    header.appendChild(name);

    const date = document.createElement('time');
    date.textContent = formatMonthString(projectObject.date);
    date.setAttribute('datetime', projectObject.date)
    header.appendChild(date);
    project.appendChild(header);

    const body = document.createElement('div');
    body.classList.add('project-body');

    const photos = document.createElement('div');
    photos.classList.add('project-photos');
    
    projectObject.images.forEach((image) => {
      const figure = document.createElement('figure');
      figure.classList.add('project-photo');

      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      figure.appendChild(img);

      if (image.hasCaption === true) {
        const caption = document.createElement('figcaption');
        caption.textContent = image.caption;
        figure.appendChild(caption);
      }

      photos.appendChild(figure);
    });

    body.appendChild(photos);

    if (projectObject.hasCustomerReview) {
      const customerReview = document.createElement('div');
      customerReview.classList.add('customer-review');
  
      const customerReviewHeading = document.createElement('h4');
      customerReviewHeading.textContent = 'Customer Review';
      customerReview.appendChild(customerReviewHeading);
  
      const customerReviewBody = document.createElement('p');
      customerReviewBody.textContent = projectObject.customerReview;
      customerReview.appendChild(customerReviewBody);
  
      body.appendChild(customerReview);
    }

    project.appendChild(body);

    return project;
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

  function formatMonthString(monthString) {
    const [year, month] = monthString.split('-');

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const monthName = months[month - 1];

    return `${monthName}, ${year}`;
  }
})(window.app = window.app || {});

