const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle ? themeToggle.querySelector('i') : null;
const body = document.body;

if (themeToggle && icon) {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      icon.classList.replace('fa-moon', 'fa-sun');
    }
  }

  themeToggle.addEventListener('click', () => {
    let theme = 'light';
    if (body.getAttribute('data-theme') !== 'dark') {
      body.setAttribute('data-theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
      theme = 'dark';
    } else {
      body.removeAttribute('data-theme');
      icon.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
  });
}

const portfolioContent = document.getElementById('portfolio-content');
const contactFormContainer = document.getElementById('contact-form-container');
const contactTrigger = document.getElementById('contact-form-trigger');
const closeContact = contactFormContainer
  ? contactFormContainer.querySelector('.close-button')
  : null;
const firstContactField = contactFormContainer
  ? contactFormContainer.querySelector('input[name="name"]')
  : null;
let lastFocusedElement = null;

const openContactForm = () => {
  if (!portfolioContent || !contactFormContainer || !contactTrigger || !closeContact) {
    return;
  }

  lastFocusedElement = document.activeElement;
  portfolioContent.classList.add('is-hidden');
  contactFormContainer.classList.add('is-active');
  contactTrigger.setAttribute('aria-expanded', 'true');
  contactFormContainer.setAttribute('aria-hidden', 'false');

  if (firstContactField) {
    firstContactField.focus();
  } else {
    closeContact.focus();
  }
};

const closeContactForm = () => {
  if (!portfolioContent || !contactFormContainer || !contactTrigger) {
    return;
  }

  contactFormContainer.classList.remove('is-active');
  portfolioContent.classList.remove('is-hidden');
  contactTrigger.setAttribute('aria-expanded', 'false');
  contactFormContainer.setAttribute('aria-hidden', 'true');

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  } else {
    contactTrigger.focus();
  }
};

if (contactTrigger && closeContact) {
  contactTrigger.addEventListener('click', openContactForm);
  closeContact.addEventListener('click', closeContactForm);
}

const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const data = new FormData(event.target);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (!status || !submitBtn) {
          return;
        }

        if (response.ok) {
          status.textContent = 'Thanks for your message!';
          status.style.color = 'green';
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          setTimeout(() => {
            closeContactForm();
            status.textContent = '';
          }, 3000);
          return;
        }

        response.json().then((payload) => {
          if (Object.hasOwn(payload, 'errors')) {
            status.textContent = payload.errors.map((error) => error.message).join(', ');
          } else {
            status.textContent = 'Oops! There was a problem';
          }
          status.style.color = 'red';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
      })
      .catch(() => {
        const status = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-btn');
        if (!status || !submitBtn) {
          return;
        }
        status.textContent = 'Oops! There was a problem';
        status.style.color = 'red';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });
}
