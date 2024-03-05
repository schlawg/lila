import { h } from 'snabbdom';
import { onInsert } from 'common/snabbdom';
import LobbyController from '../ctrl';
import { spinnerVdom } from 'common/spinner';
import { initAll } from 'common/miniBoard';
import * as xhr from 'common/xhr';

export function renderRecent(ctrl: LobbyController) {
  if (!ctrl.me) return null;
  return h(
    'div.recent',
    {
      hook: onInsert(async el => {
        const rsp = await xhr.text(`/@/${ctrl.me!.username}/all?page=1`);
        const games = $as<HTMLElement>(`<div>${rsp}</div>`).querySelector('.search__result');
        if (!games) return;
        el.innerHTML = games.innerHTML;
        initAll();
      }),
    },
    spinnerVdom(),
  );
}
