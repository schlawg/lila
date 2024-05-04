import LobbyController from '../ctrl';
import { h } from 'snabbdom';
//import { onInsert } from 'common/snabbdom';

export function renderEvents(ctrl: LobbyController) {
  ctrl;
  return h('div.lobby__events', {
    hook: {
      create: (_, vnode) => {
        const events = document.querySelector('.lobby__tournaments-simuls') as HTMLElement;
        if (!events) return;
        events.style.display = 'block';
        vnode.elm?.appendChild(events);
      },
      destroy: vnode => {
        const events = vnode.elm?.firstChild as HTMLElement;
        if (!events) return;
        events.style.display = 'none';
        document.body.appendChild(events);
      },
    },
  });
}
