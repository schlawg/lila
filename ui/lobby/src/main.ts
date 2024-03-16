import { init, classModule, attributesModule, eventListenersModule } from 'snabbdom';
import { LobbyOpts } from './interfaces';
import makeCtrl from './ctrl';
import appView from './view/main';
import startView from './view/start';
import { countersView } from './view/counters';

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

  site.requestIdleCallback(() => {
    layoutHacks();
    window.addEventListener('resize', layoutHacks);
  });

  return ctrl;
}

let cols = 0;
let blogRotateTimer: number | undefined = undefined;

/* Move the timeline to/from the bottom depending on screen width.
 * This must not cause any FOUC or layout shifting on page load. */

let animationFrameId: number;

const layoutHacks = () => {
  cancelAnimationFrame(animationFrameId); // avoid more than one call per frame
  animationFrameId = requestAnimationFrame(() => {
    $('main.lobby').each(function (this: HTMLElement) {
      const newCols = Number(window.getComputedStyle(this).getPropertyValue('--cols'));
      if (newCols != cols) {
        cols = newCols;
        if (cols > 2) $('.lobby .lobby__timeline').appendTo('.lobby__side');
        else $('.lobby__side .lobby__timeline').appendTo('.lobby');
      }
    });
    $('.lobby__blog').each((_, el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      const gridGap = parseFloat(style.columnGap);
      const kids = el.children as HTMLCollectionOf<HTMLElement>;
      const visible = Math.floor((el.clientWidth + gridGap) / (180 + gridGap));
      // 180 from .lobby__blog grid/min in file://./../css/_lobby.scss
      let iter = 0;
      const blogRotate = () => {
        for (let i = 0; i < kids.length; i++) {
          const kid = kids[(iter * visible + i) % kids.length];
          kid.style.display = i < visible ? 'block' : 'none';
          kid.style.order = String(i);
        }
        iter++;
      };
      blogRotate();
      clearInterval(blogRotateTimer);
      blogRotateTimer = setInterval(blogRotate, 15000);
    });
  });
};
