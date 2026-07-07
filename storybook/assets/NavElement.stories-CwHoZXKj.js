import{i as e}from"./preload-helper-B45gAKPr.js";import{i as t,t as n}from"./core-BZngjW6Y.js";import{n as r,t as i}from"./Settings-BA56IXRs.js";import{B as a,i as o,o as s,ot as c,qt as l,st as u,t as d,z as f}from"./iframe-BUsqzLvk.js";import{D as p,_ as m,g as h,v as g}from"./mocks-E977bbNC.js";import{n as _,r as v,t as y}from"./NavElement-Csv5M2gu.js";var b,x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{n(),f(),c(),o(),r(),p(),v(),b=d(),{expect:x,fn:S,userEvent:C,waitFor:w,within:T}=__STORYBOOK_MODULE_TEST__,E={component:y,argTypes:{mode:{control:`select`,options:[_[_.Present],_[_.Missing],_[_.Editor],_[_.Preview]]},onSetCurrentComic:{action:`onSetCurrentComic`},onShowInfoFor:{action:`onShowInfoFor`},onAddItem:{action:`onAddItem`},onRemoveItem:{action:`onRemoveItem`}},args:{item:m,useColors:!0,mode:_[_.Present],editMode:!1,onSetCurrentComic:S(),onShowInfoFor:S(),onAddItem:S(),onRemoveItem:S()},parameters:{msw:{handlers:[t.get(`http://localhost:3000/api/v3/itemdata/1/comics/random`,()=>l.json(4269))]}},render:e=>{let t=typeof e.mode==`string`?_[e.mode]:e.mode;return(0,b.jsx)(y,{...e,mode:t})},loaders:[()=>{s.getState().comic.current!==666&&s.dispatch(a(666)),s.dispatch(u({...i.DEFAULTS}))}]},D={play:async({canvasElement:e,args:t})=>{let n=T(e);await w(async()=>x(n.getByTitle(`First strip with Marten`)).toBeInTheDocument()),await x(t.onSetCurrentComic).not.toHaveBeenCalledWith(h.first,!1),await C.click(n.getByTitle(`First strip with Marten`)),await x(t.onSetCurrentComic).toHaveBeenCalledWith(h.first,!1),await x(t.onSetCurrentComic).not.toHaveBeenCalledWith(h.previous,!1),await C.click(n.getByTitle(`Previous strip with Marten`)),await x(t.onSetCurrentComic).toHaveBeenCalledWith(h.previous,!1),await x(t.onSetCurrentComic).not.toHaveBeenCalledWith(h.next,!1),await C.click(n.getByTitle(`Next strip with Marten`)),await x(t.onSetCurrentComic).toHaveBeenCalledWith(h.next,!1),await x(t.onSetCurrentComic).not.toHaveBeenCalledWith(h.last,!1),await C.click(n.getByTitle(`Last strip with Marten`)),await x(t.onSetCurrentComic).toHaveBeenCalledWith(h.last,!1),await x(t.onShowInfoFor).not.toHaveBeenCalledWith(h.id),await C.click(n.getByTitle(g.name)),await x(t.onShowInfoFor).toHaveBeenCalledWith(h.id)}},O={args:{useColors:!1}},k={args:{editMode:!0},play:async({canvasElement:e,args:t})=>{let n=T(e);await w(async()=>x(n.getByTitle(`Remove Marten from comic`)).toBeInTheDocument()),await x(t.onRemoveItem).not.toHaveBeenCalledWith(h.id),await C.click(n.getByTitle(`Remove Marten from comic`)),await x(t.onRemoveItem).toHaveBeenCalledWith(h.id)}},A={args:{editMode:!0,mode:_[_.Missing]},play:async({canvasElement:e,args:t})=>{let n=T(e);await w(async()=>x(n.getByTitle(`Add Marten to comic`)).toBeInTheDocument()),await x(t.onAddItem).not.toHaveBeenCalledWith(h.id),await C.click(n.getByTitle(`Add Marten to comic`)),await x(t.onAddItem).toHaveBeenCalledWith(h.id)}},j={loaders:[()=>{s.getState().settings.values?.showItemRandomButton||s.dispatch(u({...i.DEFAULTS,showItemRandomButton:!0}))}],play:async({canvasElement:e,args:t})=>{let n=T(e);await w(async()=>x(n.getByTitle(`Random strip with Marten`)).toBeInTheDocument()),await w(async()=>x(n.getByTitle(`Random strip with Marten`).href).toMatch(/4269$/)),await x(t.onSetCurrentComic).not.toHaveBeenCalledWith(4269,!1),await C.click(n.getByTitle(`Random strip with Marten`)),await x(t.onSetCurrentComic).toHaveBeenCalledWith(4269,!1)}},M={loaders:[()=>{s.getState().settings.values?.showItemChainButton||s.dispatch(u({...i.DEFAULTS,showItemChainButton:!0}))}],play:async({canvasElement:e})=>{let t=T(e);await w(async()=>x(t.getByTitle(`Lock page navigation to Marten`)).toBeInTheDocument()),await x(s.getState().comic.lockedToItem).toBeNull(),await C.click(t.getByTitle(`Lock page navigation to Marten`)),await x(s.getState().comic.lockedToItem).toEqual(h.id),await w(async()=>x(t.getByTitle(`Unlock page navigation from Marten`)).toBeInTheDocument()),await C.click(t.getByTitle(`Unlock page navigation from Marten`)),await x(s.getState().comic.lockedToItem).toBeNull(),await w(async()=>x(t.getByTitle(`Lock page navigation to Marten`)).toBeInTheDocument())}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => expect(canvas.getByTitle('First strip with Marten')).toBeInTheDocument());
    await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(MARTEN.first, false);
    await userEvent.click(canvas.getByTitle('First strip with Marten'));
    await expect(args.onSetCurrentComic).toHaveBeenCalledWith(MARTEN.first, false);
    await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(MARTEN.previous, false);
    await userEvent.click(canvas.getByTitle('Previous strip with Marten'));
    await expect(args.onSetCurrentComic).toHaveBeenCalledWith(MARTEN.previous, false);
    await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(MARTEN.next, false);
    await userEvent.click(canvas.getByTitle('Next strip with Marten'));
    await expect(args.onSetCurrentComic).toHaveBeenCalledWith(MARTEN.next, false);
    await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(MARTEN.last, false);
    await userEvent.click(canvas.getByTitle('Last strip with Marten'));
    await expect(args.onSetCurrentComic).toHaveBeenCalledWith(MARTEN.last, false);
    await expect(args.onShowInfoFor).not.toHaveBeenCalledWith(MARTEN.id);
    await userEvent.click(canvas.getByTitle(MARTEN_ITEM.name));
    await expect(args.onShowInfoFor).toHaveBeenCalledWith(MARTEN.id);
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    useColors: false
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => expect(canvas.getByTitle('Remove Marten from comic')).toBeInTheDocument());
    await expect(args.onRemoveItem).not.toHaveBeenCalledWith(MARTEN.id);
    await userEvent.click(canvas.getByTitle('Remove Marten from comic'));
    await expect(args.onRemoveItem).toHaveBeenCalledWith(MARTEN.id);
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true,
    mode: NavElementMode[NavElementMode.Missing] as unknown as NavElementMode
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => expect(canvas.getByTitle('Add Marten to comic')).toBeInTheDocument());
    await expect(args.onAddItem).not.toHaveBeenCalledWith(MARTEN.id);
    await userEvent.click(canvas.getByTitle('Add Marten to comic'));
    await expect(args.onAddItem).toHaveBeenCalledWith(MARTEN.id);
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  loaders: [() => {
    const state = store.getState();
    if (!state.settings.values?.showItemRandomButton) {
      store.dispatch(setSettings({
        ...Settings.DEFAULTS,
        showItemRandomButton: true
      }));
    }
  }],
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => expect(canvas.getByTitle('Random strip with Marten')).toBeInTheDocument());
    await waitFor(async () => expect(canvas.getByTitle<HTMLAnchorElement>('Random strip with Marten').href).toMatch(/4269$/));
    await expect(args.onSetCurrentComic).not.toHaveBeenCalledWith(4269, false);
    await userEvent.click(canvas.getByTitle('Random strip with Marten'));
    await expect(args.onSetCurrentComic).toHaveBeenCalledWith(4269, false);
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  loaders: [() => {
    const state = store.getState();
    if (!state.settings.values?.showItemChainButton) {
      store.dispatch(setSettings({
        ...Settings.DEFAULTS,
        showItemChainButton: true
      }));
    }
  }],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => expect(canvas.getByTitle('Lock page navigation to Marten')).toBeInTheDocument());
    await expect(store.getState().comic.lockedToItem).toBeNull();
    await userEvent.click(canvas.getByTitle('Lock page navigation to Marten'));
    await expect(store.getState().comic.lockedToItem).toEqual(MARTEN.id);
    await waitFor(async () => expect(canvas.getByTitle('Unlock page navigation from Marten')).toBeInTheDocument());
    await userEvent.click(canvas.getByTitle('Unlock page navigation from Marten'));
    await expect(store.getState().comic.lockedToItem).toBeNull();
    await waitFor(async () => expect(canvas.getByTitle('Lock page navigation to Marten')).toBeInTheDocument());
  }
}`,...M.parameters?.docs?.source}}},N=[`Default`,`WithoutColor`,`EditModePresent`,`EditModeMissing`,`WithRandomButton`,`WithChainButton`]}))();export{D as Default,A as EditModeMissing,k as EditModePresent,M as WithChainButton,j as WithRandomButton,O as WithoutColor,N as __namedExportsOrder,E as default};