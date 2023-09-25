(() => {
  document.documentElement.classList.add('js-on');

  let useScrollSelection = false;
  let scrollPath;
  let disableScrollPathLoad = false;
  let menuObserver;

  const centerRectQuery = '[data-path-target="creator"]';
  let centerRect = document.querySelector(centerRectQuery)?.getBoundingClientRect();

  // Detect user interaction type.
  function detectMouseMove() {
    useScrollSelection = true;

    document.documentElement.classList.add('js-mouse');

    window.removeEventListener('mousemove', detectMouseMove);

    window.addEventListener('resize', () => {
      centerRect = document.querySelector(centerRectQuery)?.getBoundingClientRect();
    });

    window.addEventListener('mousemove', (event) => {
      if (event.x < centerRect.left) {
        scrollPath = 'partner';
      }

      if (event.x >= centerRect.left && event.x <= centerRect.right) {
        scrollPath = 'creator';
      }

      if (event.x > centerRect.right) {
        scrollPath = 'listener';
      }

      document.documentElement.setAttribute('data-scroll-path', scrollPath);
    });

    initMenuScrollObserver()
  }

  document.addEventListener('mousemove', detectMouseMove, { once: true });

  /////// Initialize Section Content.
  const PATH_KEYS = new Set(['partner', 'creator', 'listener']);
  const content = new Map();
  const paths = new Map();
  const pathsProgress = new Map();

  [...PATH_KEYS].forEach((pathKey) => {
    pathsProgress.set(pathKey, 0);
  });

  // Find all the dynamic section elements.
  const sections = document.querySelectorAll("[data-section-id]");

  // Store sections and their choose menus in content store.
  sections.forEach((section) => {
    const id = section.dataset.sectionId;
    const path = section.dataset.path;
    const menu = section.nextElementSibling?.classList.contains("prx-choose")
      ? section.nextElementSibling
      : null;
    const sectionContent = content.get(id);

    section.querySelector('[id]').removeAttribute('id');

    content.set(id, {
      ...sectionContent,
      id,
      path,
      section,
      menu,
    });

    if (!paths.has(path)) {
      paths.set(path, new Set());
    }

    paths.get(path).add(id);

    if (menu) {
      const links = menu.querySelectorAll('a');

      links.forEach((link) => {
        const href = link.getAttribute('href');
        const id = href.match(/#section-([\w-]+)/)[1];
        const linkSection = content.get(id);

        content.set(id, {
          ...linkSection,
          link
        });
      })
    }

    section.remove();
    menu.remove();
  });

  // Initialize intro menu.
  const introMenu = document.querySelector('.prx-choose');
  [...PATH_KEYS].forEach((pathKey) => {
    const pathIds = paths.get(pathKey);
    const nextPathSectionId = [...(pathIds || [])][0];
    const menuLink = introMenu.querySelector(`[data-path-target="${pathKey}"]`);

    menuLink?.setAttribute('href', `#section-${nextPathSectionId}`);
  });

  //// Initialize section selection.
  function initSectionLink(element) {
    element.addEventListener('click', handleSectionLinkClick, element);
  }

  function initChooseMenu(menuElement) {
    if (!menuElement) return;

    const links = menuElement.querySelectorAll('[href][data-path-target]');

    if (menuObserver) {
      const target = document.createElement('div');
      target.classList.add('scroll-target');
      menuElement.appendChild(target);
      menuObserver.observe(target);
    }

    links.forEach((link) => {
      initSectionLink(link);
    })
  }

  function handleSectionLinkClick(event) {
    event.preventDefault();

    let linkElement = event.target.closest('[href]');

    if (!linkElement) return;

    const linkId = linkElement.getAttribute('href');
    const id = linkId.match(/#section-([\w-]+)/)[1];

    appendSectionContent(id, linkElement.parentElement);
  }


  function appendSectionContent(id, menuElement, noCssTransition) {
    const contentData = content.get(id);
    const { section, menu, path } = contentData;
    const newSection = section.cloneNode(true);
    let newMenu = menu.cloneNode(true);
    const hasPathSelected = menuElement.hasAttribute('data-path-selected');

    // Check if section exists after the menu.
    while (menuElement.nextElementSibling.getAttribute('data-section-id')) {
      // Remove existing menu.
      menuElement.nextElementSibling.nextElementSibling.remove();

      // Remove existing section after updating its path progress.
      const nextSiblingPath = menuElement.nextElementSibling.dataset.path;
      pathsProgress.set(nextSiblingPath, pathsProgress.get(nextSiblingPath) - 1);
      menuElement.nextElementSibling.remove();
    }

    // Increment the new section's path progress.
    pathsProgress.set(path, pathsProgress.get(path) + 1);

    // Update menu links based on each paths progress.
    const completedPaths = [];
    [...PATH_KEYS].forEach((pathKey) => {
      const pathIds = paths.get(pathKey);
      const pathProgress = pathsProgress.get(pathKey);
      const nextPathSectionId = [...(pathIds || [])][pathProgress];
      const nextPathLink = content.get(nextPathSectionId)?.link.cloneNode(true);
      const menuLink = newMenu.querySelector(`[data-path-target="${pathKey}"]`);

      if (nextPathLink) {
        menuLink?.replaceWith(nextPathLink);
      } else {
        completedPaths.push(pathKey);
        menuLink?.remove();
      }
    });

    if (completedPaths.length) {
      newMenu.setAttribute('data-paths-completed', completedPaths.join(' '));
    }

    // Add selected section
    initChooseMenu(newMenu);

    const scrollTarget = menuElement.querySelector('.scroll-target');
    if (menuObserver && scrollTarget) {
      menuObserver.unobserve(scrollTarget);
      scrollTarget.remove();
    }

    if (noCssTransition) {
      menuElement.classList.add('js-no-animation');
      newSection.classList.add('js-no-animation');
      newSection.classList.add('js-show');
    } else if (!hasPathSelected) {
      // When menu hasn't had a selection yet, wait for height transition do show section.
      function handleFadeInUpEnd(event) {
        if (event.propertyName === 'min-height') {
          newSection.classList.add('js-show');
          menuElement.removeEventListener('animationend', handleFadeInUpEnd);
        }
      }
      menuElement.addEventListener('transitionend', handleFadeInUpEnd);
    } else {
      // Otherwise, show section immediately.
      newSection.classList.add('js-show');
    }

    menuElement.setAttribute('data-path-selected', path);
    menuElement.after(newSection, ...(newMenu ? [newMenu] : []));

    sectionObserver.observe(newSection);

    return newMenu;
  }

  function appendPathContent(path) {
    const ids = paths.get(path);
    let currentMenu = introMenu;

    [...ids].forEach((id) => {
      currentMenu = appendSectionContent(id, currentMenu, true);
    })
  }

  document.querySelectorAll('.prx-choose').forEach(menu => initChooseMenu(menu));

  /// Initialize Nav Menu Links.

  function scrollToSection(id) {
    let sectionElement = document.querySelector(`[data-section-id="${id}"]`);
    const section = content.get(id);
    const path = section.path;

    if (!sectionElement) {
      appendPathContent(path);
      sectionElement = document.querySelector(`[data-section-id="${id}"]`);
    }

    sectionElement.scrollIntoView();
  }

  function scrollToAnchorTarget(id) {
    if (!id) return;

    const targetElement = document.getElementById(id);

    if (!targetElement) return;

    disableScrollPathLoad = true;

    targetElement.scrollIntoView();
  }

  function handleSectionNavLinkClick(event) {
    event.preventDefault();

    let linkElement = event.target.closest('[href]');

    if (!linkElement) return;

    const href = linkElement.getAttribute('href');
    const id = href.match(/^#section-([\w-]+)/)[1];

    scrollToSection(id);
  }

  function handleAnchorNavLinkClick(event) {
    event.preventDefault();

    let linkElement = event.target.closest('[href]');

    if (!linkElement) return;

    const href = linkElement.getAttribute('href');
    const id = href.match(/^#([\w-]+)/)?.[1];

    scrollToAnchorTarget(id)
  }

  function handleUrlHashChange(event) {
    event.preventDefault();

    const hash = location.hash;
    const id = hash.match(/#section-([\w-]+)/)?.[1];

    if (id) {
      scrollToSection(id);
    }
  }

  const sectionNavLinks = document.querySelectorAll('a.nav-link[href][data-path]');

  sectionNavLinks.forEach((link) => {
    link.addEventListener('click', handleSectionNavLinkClick);
  });

  const anchorNavLinks = document.querySelectorAll('a.nav-link[href]:not([data-path])');

  anchorNavLinks.forEach((link) => {
    link.addEventListener('click', handleAnchorNavLinkClick);
  });

  window.addEventListener('hashchange', handleUrlHashChange);

  window.addEventListener('scrollend', () => {
    disableScrollPathLoad = false;
  });

  //// Initialize scroll events.

  // Function to handle changes in intersection
  function handleSectionIntersection(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        document.body.setAttribute(
          "data-theme",
          entry.target.getAttribute("data-path")
        );
      }
    });
  }

  // Create an Intersection Observer
  const sectionObserver = new IntersectionObserver(handleSectionIntersection, {
    threshold: 0.25, // Trigger when 33% of the target is visible
  });

  // Select all panels with the class 'scroll-bg'
  const sectionsWithPath = document.querySelectorAll("section[data-path]");

  // Observe each panel
  sectionsWithPath.forEach(function (section) {
    sectionObserver.observe(section);
  });

  function initMenuScrollObserver() {
    // Function to handle changes in intersection
    function handleMenuIntersection(entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.rootBounds) {
          const menu = entry.target.parentElement;
          const sectionLink = menu.querySelector(`[data-path-target="${scrollPath}"][href]`);
          const fromBottom = entry.boundingClientRect.bottom > entry.rootBounds.height / 2;

          if (!sectionLink || disableScrollPathLoad || !fromBottom) return;

          const linkHref = sectionLink.getAttribute('href');
          const id = linkHref.match(/#section-([\w-]+)/)[1];

          appendSectionContent(id, menu);
        }
      });
    }
  
    // Create an Intersection Observer
    menuObserver = new IntersectionObserver(handleMenuIntersection, {
      // threshold: 1, // Trigger when 33% of the target is visible
    });
  
    // Select all panels with the class 'scroll-bg'
    var chooseMenus = document.querySelectorAll(".prx-choose");
  
    // Observe each panel
    chooseMenus.forEach(function (menu) {
      if (menu.hasAttribute('data-path-selected')) return;

      const target = document.createElement('div');
      target.classList.add('scroll-target');
      menu.appendChild(target);
      menuObserver.observe(target);
    });
  }

  function buildThresholdList(numSteps = 20) {
    const thresholds = [];
  
    for (let i = 1.0; i <= numSteps; i++) {
      const ratio = i / numSteps;
      thresholds.push(ratio);
    }
  
    thresholds.push(0);
    return thresholds;
  }

  //// Handle URL's with hash.
  if (location.hash) {
    const hash = location.hash;
    const id = hash.match(/#section-([\w-]+)/)?.[1];

    if (id) {
      scrollToSection(id);
    }
  }
})();
