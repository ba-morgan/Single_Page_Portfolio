const CONTENT_FILES = {
  site: './content/site.json',
  projects: './content/projects.json',
  skills: './content/skills.json',
  contact: './content/contact.json',
};

const loadJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
};

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
};

const setHtml = (id, value) => {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.innerHTML = value;
  }
};

const renderParagraphs = (containerId, paragraphs) => {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = '';
  (paragraphs || []).forEach((paragraph) => {
    const p = document.createElement('p');
    p.innerHTML = paragraph;
    container.appendChild(p);
  });
};

const applyMeta = (meta) => {
  if (!meta) {
    return;
  }

  if (meta.title) {
    document.title = meta.title;
  }

  const setMeta = (selector, attribute, value) => {
    if (!value) {
      return;
    }
    const tag = document.querySelector(selector);
    if (tag) {
      tag.setAttribute(attribute, value);
    }
  };

  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[property="og:title"]', 'content', meta.og?.title);
  setMeta('meta[property="og:description"]', 'content', meta.og?.description);
  setMeta('meta[property="og:type"]', 'content', meta.og?.type);
  setMeta('meta[property="og:image"]', 'content', meta.og?.image);
  setMeta('meta[name="twitter:card"]', 'content', meta.twitter?.card);
  setMeta('meta[name="twitter:title"]', 'content', meta.twitter?.title);
  setMeta('meta[name="twitter:description"]', 'content', meta.twitter?.description);
  setMeta('meta[name="twitter:image"]', 'content', meta.twitter?.image);
};

const applyThemeToggle = (label) => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    return;
  }

  if (label) {
    themeToggle.title = label;
    themeToggle.setAttribute('aria-label', label);
  }

  const icon = themeToggle.querySelector('i');
  if (!icon) {
    return;
  }

  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      icon.classList.replace('fa-moon', 'fa-sun');
    }
  }

  themeToggle.addEventListener('click', () => {
    let theme = 'light';
    if (document.body.getAttribute('data-theme') !== 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
      theme = 'dark';
    } else {
      document.body.removeAttribute('data-theme');
      icon.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
  });
};

const renderProjects = (projects) => {
  (projects || []).forEach((project) => {
    const target = document.querySelector(`[data-project-id="${project.id}"]`);
    if (!target) {
      return;
    }

    target.innerHTML = '';

    const link = document.createElement('a');
    link.href = project.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.alt || `${project.name} project screenshot`;
    image.loading = 'lazy';
    link.appendChild(image);

    const overlay = document.createElement('div');
    overlay.className = 'project-overlay';

    const overlayContent = document.createElement('div');
    overlayContent.className = 'overlay-content';

    const overlayTitle = document.createElement('h3');
    overlayTitle.textContent = project.overlayTitle || project.name;
    overlayContent.appendChild(overlayTitle);

    (project.overlayParagraphs || []).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      overlayContent.appendChild(p);
    });

    overlay.appendChild(overlayContent);
    link.appendChild(overlay);

    const label = document.createElement('h2');
    label.textContent = project.name;

    if (project.labelPosition === 'before') {
      target.appendChild(label);
      target.appendChild(link);
    } else {
      target.appendChild(link);
      target.appendChild(label);
    }
  });
};

const renderSkillBadges = (skills) => {
  const container = document.getElementById('skills-badges');
  if (!container) {
    return;
  }
  container.innerHTML = '';

  (skills || []).forEach((skill) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'skillsIcon con-tooltip bottom';
    wrapper.tabIndex = 0;

    const icon = document.createElement('i');
    icon.className = skill.iconClass;
    wrapper.appendChild(icon);

    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.appendChild(document.createTextNode(`${skill.label} `));

    const rating = Number(skill.rating) || 0;
    for (let i = 0; i < 5; i += 1) {
      const star = document.createElement('i');
      star.className = i < rating ? 'fa-solid fa-star' : 'fa-regular fa-star';
      tooltip.appendChild(star);
    }

    wrapper.appendChild(tooltip);
    container.appendChild(wrapper);
  });
};

const renderContactLinks = (links) => {
  const container = document.getElementById('contacts-container');
  if (!container) {
    return;
  }

  container.innerHTML = '';

  (links || []).forEach((link) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'contactIcons con-tooltip bottom';
    wrapper.tabIndex = 0;

    let control;
    if (link.type === 'button') {
      const button = document.createElement('button');
      button.type = 'button';
      if (link.id) {
        button.id = link.id;
      }
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'contact-form-container');
      if (link.ariaLabel) {
        button.setAttribute('aria-label', link.ariaLabel);
      }
      control = button;
    } else {
      const anchor = document.createElement('a');
      anchor.href = link.href || '#';
      if ((link.href || '').startsWith('http')) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
      if (link.ariaLabel) {
        anchor.setAttribute('aria-label', link.ariaLabel);
      }
      control = anchor;
    }

    const icon = document.createElement('i');
    icon.className = link.iconClass;
    control.appendChild(icon);
    wrapper.appendChild(control);

    if (link.tooltip) {
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.textContent = link.tooltip;
      wrapper.appendChild(tooltip);
    }

    container.appendChild(wrapper);
  });
};

const applyContactFormContent = (formContent) => {
  if (!formContent) {
    return;
  }

  setText('contact-form-title', formContent.title);

  const form = document.getElementById('contact-form');
  if (form && formContent.action) {
    form.action = formContent.action;
  }

  const nameInput = form?.querySelector('input[name="name"]');
  const emailInput = form?.querySelector('input[name="email"]');
  const messageInput = form?.querySelector('textarea[name="message"]');

  if (nameInput && formContent.fields?.name) {
    nameInput.placeholder = formContent.fields.name;
  }
  if (emailInput && formContent.fields?.email) {
    emailInput.placeholder = formContent.fields.email;
  }
  if (messageInput && formContent.fields?.message) {
    messageInput.placeholder = formContent.fields.message;
  }

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn && formContent.submitLabel) {
    submitBtn.textContent = formContent.submitLabel;
  }
};

const setupContactForm = (formContent) => {
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
  if (!form) {
    return;
  }

  const messages = {
    sendingLabel: formContent?.sendingLabel || 'Sending...',
    submitLabel: formContent?.submitLabel || 'Send Message',
    successMessage: formContent?.successMessage || 'Thanks for your message!',
    errorMessage: formContent?.errorMessage || 'Oops! There was a problem',
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const data = new FormData(event.target);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = messages.sendingLabel;
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
          status.textContent = messages.successMessage;
          status.style.color = 'green';
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = messages.submitLabel;
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
            status.textContent = messages.errorMessage;
          }
          status.style.color = 'red';
          submitBtn.disabled = false;
          submitBtn.textContent = messages.submitLabel;
        });
      })
      .catch(() => {
        if (!status || !submitBtn) {
          return;
        }
        status.textContent = messages.errorMessage;
        status.style.color = 'red';
        submitBtn.disabled = false;
        submitBtn.textContent = messages.submitLabel;
      });
  });
};

const init = async () => {
  try {
    const [site, projects, skills, contact] = await Promise.all([
      loadJson(CONTENT_FILES.site),
      loadJson(CONTENT_FILES.projects),
      loadJson(CONTENT_FILES.skills),
      loadJson(CONTENT_FILES.contact),
    ]);

    applyMeta(site.meta);
    applyThemeToggle(site.themeToggle?.title);

    setText('profile-name', site.profile?.name);
    setText('profile-subtitle', site.profile?.subtitle);
    setText('profile-headline', site.profile?.headline);
    renderParagraphs('profile-paragraphs', site.profile?.paragraphs);

    setText('skills-title', site.skillsSection?.title);
    renderParagraphs('skills-paragraphs', site.skillsSection?.paragraphs);

    setText('more-title', site.moreSection?.title);
    renderParagraphs('more-paragraphs', site.moreSection?.paragraphs);

    setText('contact-text', site.contactBar?.label);
    setHtml('footer-text', site.footer);

    renderProjects(projects.projects);
    renderSkillBadges(skills.skills);
    renderContactLinks(contact.links);
    applyContactFormContent(contact.form);
    setupContactForm(contact.form);
  } catch (error) {
    applyThemeToggle();
    console.error('Failed to load content JSON files.', error);
  }
};

init();
