import{i as e}from"./preload-helper-B45gAKPr.js";import{i as t,t as n}from"./core-BZngjW6Y.js";import{$ as r,B as i,H as a,J as o,K as s,U as c,V as l,Y as u,i as d,lt as f,o as p,q as m,qt as h,t as g,ut as _,z as v}from"./iframe-BUsqzLvk.js";import{D as y,a as b,t as x}from"./mocks-E977bbNC.js";import{n as S,t as C}from"./mockNetworkDelay-BJNPRY8o.js";import{t as w}from"./query-Dd3NvAg0.js";import{n as T,r as E,t as D}from"./hooks-DNVZbieZ.js";import{n as O,t as k}from"./useLockedItem-waJy9iUz.js";function A(){let e=E(e=>e.settings.values),t=E(e=>e.comic.current),n=E(e=>e.comic.latest),r=E(e=>e.comic.random),i=E(e=>o(e)),a=E(e=>m(e)),{hasLockedItem:s,lockedItem:c,randomLockedItemComic:l}=O(t,e,E(e=>e.comic.lockedToItem));return s?{first:c.first??t,firstTitle:`Go to first strip with ${c.shortName}`,previous:c.previous??t,previousTitle:`Go to previous strip with ${c.shortName}`,next:c.next??t,nextTitle:`Go to next strip with ${c.shortName}`,last:c.last??t,lastTitle:`Go to last strip with ${c.shortName}`,random:l??0,randomTitle:`Go to random strip with ${c.shortName}`}:{first:1,firstTitle:`Go to first strip`,previous:i,previousTitle:`Go to previous strip`,next:a,nextTitle:`Go to next strip`,last:n,lastTitle:`Go to last strip`,random:r,randomTitle:`Go to random strip`}}var j=e((()=>{s(),D(),k()}));function M(){let e=T(),t=E(e=>e.settings.values),n=E(e=>e.comic.current),a=E(e=>e.comic.latest),o=E(e=>e.comic.lockedToItem),{isFetching:s}=r(n===0||!t?N.skipToken:u(n,t)),{hasLockedItem:c,refreshRandomLockedItemComic:l,isFetchingRandomLockedItemComic:d}=O(n,t,o),f=A();return(0,P.jsxs)(`ul`,{className:`menu qc-ext qc-ext-navigation-menu`,id:`comicnav`,children:[(0,P.jsx)(`li`,{children:(0,P.jsx)(`a`,{href:`view.php?comic=${f.first}`,title:f.firstTitle,onClick:t=>{t.preventDefault(),e(i(f.first,{locked:c}))},style:{pointerEvents:s?`none`:``},children:`First`})}),(0,P.jsx)(`li`,{children:(0,P.jsx)(`a`,{href:`view.php?comic=${f.previous}`,title:f.previousTitle,onClick:t=>{t.preventDefault(),e(i(f.previous,{locked:c}))},style:{pointerEvents:s?`none`:``},children:`Previous`})}),(0,P.jsx)(`li`,{children:(0,P.jsx)(`a`,{href:`view.php?comic=${f.next}`,title:f.nextTitle,onClick:t=>{t.preventDefault(),e(i(f.next,{locked:c}))},style:{pointerEvents:s?`none`:``},children:`Next`})}),(0,P.jsx)(`li`,{children:(0,P.jsx)(`a`,{href:`view.php?comic=${f.last}`,title:f.lastTitle,onClick:t=>{t.preventDefault(),e(i(f.last,{locked:c}))},style:{pointerEvents:s?`none`:``},children:n===a?`Last`:`Latest`})}),(0,P.jsx)(`li`,{children:(0,P.jsx)(`a`,{href:`view.php?comic=${f.random}`,title:f.randomTitle,onClick:t=>{t.preventDefault(),e(i(f.random,{locked:c})),c&&l()},style:{pointerEvents:s||d?`none`:``},children:`Random`})})]})}var N,P,F=e((()=>{k(),j(),N=w(),s(),v(),D(),P=g(),M.__docgenInfo={description:``,methods:[],displayName:`ComicNavigation`}})),I,L,R,z,B,V,H,U;e((()=>{n(),_(),v(),d(),y(),C(),F(),{expect:I,userEvent:L,waitFor:R,within:z}=__STORYBOOK_MODULE_TEST__,B={component:M,parameters:{msw:{handlers:[t.get(`http://localhost:3000/api/v3/itemdata/`,()=>{let e=[...x],t=`This is a mocked API response and will only be accurate for comic 666`;return e.push({id:-1,name:t,shortName:t,count:0,type:`storyline`,color:`ffaabb`,startComicId:null,endComicId:null}),h.json(e)}),t.get(`http://localhost:3000/api/v3/comicdata/:comicId`,async({params:e})=>{let{comicId:t}=e;if(t===`666`)return await S(),h.json(b);{let e={...b,comic:Number(t),previous:Number(t)-1,next:Number(t)+1,items:[...b.items,{id:-1,first:0,last:0,next:0,previous:0}]};return h.json(e)}}),t.get(`http://localhost:3000/api/v3/itemdata/:itemId/comics/random`,()=>h.json(420))]}},loaders:[()=>{p.dispatch(f.util.resetApiState()),p.getState().comic.current===0&&(p.dispatch(i(666)),p.dispatch(l(4269)),p.dispatch(c(420)))}]},V={play:async({canvasElement:e})=>{let t=z(e);p.dispatch(i(666)),p.dispatch(l(4269)),p.dispatch(c(420)),await R(async()=>I(t.getByTitle(`Go to previous strip`)).toBeInTheDocument()),await I(p.getState().comic.current).toEqual(666),await R(async()=>I(t.getByTitle(`Go to previous strip`)).not.toHaveStyle(`pointer-events: none`),{timeout:3e3}),await L.click(t.getByTitle(`Go to previous strip`)),await I(p.getState().comic.current).toEqual(665),await R(async()=>I(t.getByTitle(`Go to next strip`)).not.toHaveStyle(`pointer-events: none`)),await L.click(t.getByTitle(`Go to next strip`)),await I(p.getState().comic.current).toEqual(666),await R(async()=>I(t.getByTitle(`Go to first strip`)).not.toHaveStyle(`pointer-events: none`)),await L.click(t.getByTitle(`Go to first strip`)),await I(p.getState().comic.current).toEqual(1),await R(async()=>I(t.getByTitle(`Go to last strip`)).not.toHaveStyle(`pointer-events: none`)),await L.click(t.getByTitle(`Go to last strip`)),await I(p.getState().comic.current).toEqual(4269),await R(async()=>I(t.getByTitle(`Go to random strip`)).not.toHaveStyle(`pointer-events: none`)),await L.click(t.getByTitle(`Go to random strip`)),await I(p.getState().comic.current).toEqual(420)}},H={play:async({canvasElement:e})=>{let t=z(e);p.dispatch(i(666)),p.dispatch(l(5e3)),p.dispatch(a(4)),await R(async()=>I(t.getByTitle(`Go to last strip with Faye`)).not.toHaveStyle(`pointer-events: none`)),await L.click(t.getByTitle(`Go to last strip with Faye`)),await I(p.getState().comic.current).toEqual(4805)}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    store.dispatch(setCurrentComic(666));
    store.dispatch(setLatestComic(4269));
    store.dispatch(setRandomComic(420));
    await waitFor(async () => expect(canvas.getByTitle('Go to previous strip')).toBeInTheDocument());
    await expect(store.getState().comic.current).toEqual(666);
    await waitFor(async () => expect(canvas.getByTitle('Go to previous strip')).not.toHaveStyle('pointer-events: none'), {
      timeout: 3000
    });
    await userEvent.click(canvas.getByTitle('Go to previous strip'));
    await expect(store.getState().comic.current).toEqual(665);
    await waitFor(async () => expect(canvas.getByTitle('Go to next strip')).not.toHaveStyle('pointer-events: none'));
    await userEvent.click(canvas.getByTitle('Go to next strip'));
    await expect(store.getState().comic.current).toEqual(666);
    await waitFor(async () => expect(canvas.getByTitle('Go to first strip')).not.toHaveStyle('pointer-events: none'));
    await userEvent.click(canvas.getByTitle('Go to first strip'));
    await expect(store.getState().comic.current).toEqual(1);
    await waitFor(async () => expect(canvas.getByTitle('Go to last strip')).not.toHaveStyle('pointer-events: none'));
    await userEvent.click(canvas.getByTitle('Go to last strip'));
    await expect(store.getState().comic.current).toEqual(4269);
    await waitFor(async () => expect(canvas.getByTitle('Go to random strip')).not.toHaveStyle('pointer-events: none'));
    await userEvent.click(canvas.getByTitle('Go to random strip'));
    await expect(store.getState().comic.current).toEqual(420);
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    store.dispatch(setCurrentComic(666));
    store.dispatch(setLatestComic(5000));
    store.dispatch(setLockedToItem(4));

    // Item id 4 ("Faye", from COMIC_DATA_666) last appears in comic
    // 4805, which differs from the site's overall latest comic (5000)
    // set above. Clicking "Last" while locked to an item must honor
    // the locked item's last appearance, not the global latest comic.
    await waitFor(async () => expect(canvas.getByTitle('Go to last strip with Faye')).not.toHaveStyle('pointer-events: none'));
    await userEvent.click(canvas.getByTitle('Go to last strip with Faye'));
    await expect(store.getState().comic.current).toEqual(4805);
  }
}`,...H.parameters?.docs?.source}}},U=[`Default`,`LockedToItem`]}))();export{V as Default,H as LockedToItem,U as __namedExportsOrder,B as default};