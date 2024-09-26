import { init, classModule, attributesModule, eventListenersModule } from 'snabbdom';
import { requestIdleCallback } from 'common';
import { LobbyOpts } from './interfaces';
import makeCtrl from './ctrl';
import appView from './view/main';
import startView from './view/start';
import { countersView } from './view/counters';
import { rotateBlogs } from './view/blog';

export const patch = init([classModule, attributesModule, eventListenersModule]);

export default function main(opts: LobbyOpts) {
  const ctrl = new makeCtrl(opts, redraw);
  const appElement = document.querySelector('.lobby__app') as HTMLElement;
  const startElement = document.querySelector('.lobby__start') as HTMLElement;
  const countersElement = document.querySelector('.lobby__counters') as HTMLElement;
  appElement.innerHTML = '';
  let appVNode = patch(appElement, appView(ctrl));
  startElement.innerHTML = '';
  let startVNode = patch(startElement, startView(ctrl));
  countersElement.innerHTML = '';
  let countersVNode = patch(document.querySelector('.lobby__counters')!, countersView(ctrl));

  function redraw() {
    appVNode = patch(appVNode, appView(ctrl));
    startVNode = patch(startVNode, startView(ctrl));
    countersVNode = patch(countersVNode, countersView(ctrl));
  }

  requestIdleCallback(() => {
    layoutChanged();
    window.addEventListener('resize', layoutChanged);
  });

  return ctrl;
}

let cols = 0;

/* Move the timeline to/from the bottom depending on screen width.
 * This must not cause any FOUC or layout shifting on page load. */

let animationFrameId: number;

const layoutChanged = () => {
  cancelAnimationFrame(animationFrameId); // avoid more than one call per frame
  animationFrameId = requestAnimationFrame(() => {
    $('main.lobby').each(function(this: HTMLElement) {
      const newCols = Number(window.getComputedStyle(this).getPropertyValue('---cols'));
      if (newCols != cols) {
        cols = newCols;
        if (cols === 3) {
          $('.lobby .lobby__timeline').appendTo('.lobby__side');
        } else $('.lobby__side .lobby__timeline').appendTo('.lobby');
        if (cols === 4) $('.lobby .lobby__feed').appendTo('.lobby__side');
        else $('.lobby__side .lobby__feed').appendTo('.lobby');
      }
    });
    rotateBlogs();
  });
};
