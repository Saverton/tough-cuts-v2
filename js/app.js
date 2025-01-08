"use strict";

(function (app) {
  app.copyrightYear = document.getElementById('copyright-year');

  app.initIndex = async function () {
    setCopyrightYear();

    // Showcased projects are hidden for now since there is no data.
    /*
    const showcasedProjectContainer = document.getElementById('showcased-project');

    const loadMessage = buildLoadMessage('Loading showcased project...');
    showcasedProjectContainer.appendChild(loadMessage);

    try {
      const projectObject = await getShowcasedProject();

      if (projectObject !== undefined) {
        const showcasedProject = buildProject(projectObject);
  
        showcasedProjectContainer.innerHTML = '';
        showcasedProjectContainer.appendChild(showcasedProject);
      } else {
        const projectHighlightsSection = document.getElementById('project-highlights');
        projectHighlightsSection.getElementsByClassName('link-btn')[0].remove();

        const infoMessage = buildInfoMessage('We are currently working on our project showcases. Please come back later to see some of our work.');

        showcasedProjectContainer.innerHTML = '';
        showcasedProjectContainer.appendChild(infoMessage);
      }
    } catch (err) {
      console.error(err);
      const errMessage = buildErrorMessage('Failed to get showcased project.');

      showcasedProjectContainer.innerHTML = '';
      showcasedProjectContainer.appendChild(errMessage);
    }
    */
  }

  app.initProjects = async function () {
    setCopyrightYear();

    const projectsContainer = document.getElementById('projects-section');

    const loadMessage = buildLoadMessage('Loading projects...');
    projectsContainer.appendChild(loadMessage);

    try {
      const projects = await getData('data/projects.json');

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
        const infoMessage = buildInfoMessage('We are currently working on our project showcases. Please come back later to see some of our work.');

        projectsContainer.innerHTML = '';
        projectsContainer.appendChild(infoMessage);
      }
    } catch (err) {
      console.error(err);
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
    const faqs = await getData('data/faq.json');

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

  app.initError = async function () {
    setCopyrightYear();
  }

  async function getData(url) {
    try {
      const localStorageData = localStorage.getItem(url);
      if (localStorageData !== null) {
        const { data, dateSerialized } = JSON.parse(localStorageData);
        const today = new Date().toISOString().slice(0, 10);
        // invalidates cached data after 1 day
        if (today !== dateSerialized) {
          localStorage.removeItem(url);
          return getData(url);
        } else {
          return data;
        }
      } else {
        const response = await fetch(url);
        const data = await response.json();

        if (data !== undefined && data !== null && data?.length > 0) {
          const localStorageData = JSON.stringify({ data, dateSerialized: new Date().toISOString().slice(0, 10) });
          localStorage.setItem(url, localStorageData);
        }

        return data;
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function getShowcasedProject() {
    const allProjects = await getData('data/projects.json');

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

  function buildInfoMessage(message) {
    const infoMessage = document.createElement('p');
    infoMessage.classList.add('info-message');
    infoMessage.textContent = message;

    return infoMessage;
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

