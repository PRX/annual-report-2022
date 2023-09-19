// Function to handle changes in intersection
function handleIntersection(entries, observer) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      document.body.setAttribute('data-theme', entry.target.getAttribute('data-path'));
    }
  });
}

// Create an Intersection Observer
var observer = new IntersectionObserver(handleIntersection, {
  //threshold: 0.33, // Trigger when 33% of the target is visible
});

// Select all panels with the class 'scroll-bg'
var panels = document.querySelectorAll('[data-path]');

// Observe each panel
panels.forEach(function (panel) {
  observer.observe(panel);
});
