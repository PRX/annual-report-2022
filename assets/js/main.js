window.addEventListener("scroll", function() {
  // selectors
  var body = document.body,
      panels = document.querySelectorAll('.scroll-bg');

  // Iterate through each panel
  panels.forEach(function (panel) {
    var rect = panel.getBoundingClientRect();

    // Calculate the top and bottom scroll positions for this panel
    var panelTop = rect.top + window.pageYOffset;
    var panelBottom = panelTop + rect.height;

    // Check if the current scroll position is within the panel's range
    if (window.pageYOffset >= panelTop && window.pageYOffset < panelBottom) {
      // Remove all classes on body with color-
      body.className = body.className.replace(/\bcolor-\S+/g, '');

      // Add class of the currently active div
      body.classList.add('color-' + panel.getAttribute('data-color'));
    }
  });
});

// Trigger the scroll event once to apply the initial state
window.dispatchEvent(new Event('scroll'));
