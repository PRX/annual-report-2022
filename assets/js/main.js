function position(el) {
  const {top, left} = el.getBoundingClientRect();
  const {marginTop, marginLeft} = getComputedStyle(el);
  return {
    top: top - parseInt(marginTop, 10),
    left: left - parseInt(marginLeft, 10)
  };
}

function scrollTop(el, value) {
  var win;
  if (el.window === el) {
    win = el;
  } else if (el.nodeType === 9) {
    win = el.defaultView;
  }

  if (value === undefined) {
    return win ? win.pageYOffset : el.scrollTop;
  }

  if (win) {
    win.scrollTo(win.pageXOffset, value);
  } else {
    el.scrollTop = value;
  }
}

function updateBackgroundColor() {
  const body = this.document.querySelector('body');
  const panels = this.document.getElementsByClassName('scroll-bg');

  const scroll = scrollTop(window) + (window.innerHeight / 3);

  for (const panel of panels) {
    if (position(panel).top <= scroll && position(panel).top + panel.offsetHeight > scroll) {
      body.classList.forEach(clss => {
        if (clss.startsWith('color-')) {
          body.classList.remove(clss);
        }
      })

      body.classList.add(`color-${panel.getAttribute('data-color')}`)
    }
  }
}

window.addEventListener('scroll', updateBackgroundColor);

(function () {
  document.addEventListener('DOMContentLoaded', async (_) => {
    updateBackgroundColor();
  })
})();
