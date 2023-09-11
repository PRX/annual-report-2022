// Function to handle changes in intersection
function handleIntersection(entries, observer) {
  entries.forEach(function (entry) {
   console.log(entry.isIntersecting);
    if (entry.isIntersecting) {
      console.log(entry.target.getAttribute('data-color'));
      document.body.setAttribute('data-theme', entry.target.getAttribute('data-color'));
    }
  });
}

// Create an Intersection Observer
var observer = new IntersectionObserver(handleIntersection, {
  //threshold: 0.33, // Trigger when 33% of the target is visible
});

// Select all panels with the class 'scroll-bg'
var panels = document.querySelectorAll('[data-color]');

// Observe each panel
panels.forEach(function (panel) {
  observer.observe(panel);
});
