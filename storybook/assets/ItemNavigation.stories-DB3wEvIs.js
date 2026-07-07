import{i as e}from"./preload-helper-B45gAKPr.js";import{i as t,t as n}from"./core-BZngjW6Y.js";import{B as r,H as i,i as a,lt as o,o as s,qt as c,t as l,ut as u,z as d}from"./iframe-BUsqzLvk.js";import{D as f,a as p,o as m,t as h}from"./mocks-E977bbNC.js";import{n as g,t as _}from"./ItemNavigation-D5RxEUCE.js";import{n as v,r as y}from"./NavElement-Csv5M2gu.js";var b,x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{n(),y(),u(),d(),a(),f(),g(),b=l(),{fn:x}=__STORYBOOK_MODULE_TEST__,S={component:_,parameters:{msw:{handlers:[t.get(`http://localhost:3000/api/v3/itemdata/`,()=>c.json(h)),t.get(`http://localhost:3000/api/v3/comicdata/:comicId`,()=>c.json(p))]}},argTypes:{mode:{control:`select`,options:[v[v.Present],v[v.Missing]]}},args:{itemNavigationData:m,useColors:!0,isLoading:!1,isFetching:!1,mode:v[v.Present],editMode:!1,onSetCurrentComic:x(),onShowInfoFor:x(),onRemoveItem:x(),onAddItem:x(),onAddFirstMatchChange:x()},render:e=>{let t=typeof e.mode==`string`?v[e.mode]:e.mode;return(0,b.jsx)(_,{...e,mode:t})},loaders:[e=>{s.dispatch(o.util.resetApiState()),s.getState().comic.current!==666&&s.dispatch(r(666));let t=e.args.lockedToItemId;s.dispatch(i(t??null))}]},C={},w={args:{useColors:!1}},T={args:{isLoading:!0}},E={args:{isFetching:!0}},D={args:{itemNavigationData:[]}},O={args:{mode:v[v.Missing]}},k={args:{itemNavigationData:[],mode:v[v.Missing]}},A={args:{editMode:!0}},j={args:{editMode:!0,mode:v[v.Missing]}},M={args:{lockedToItemId:4}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    useColors: false
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    isFetching: true
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    itemNavigationData: []
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    mode: NavElementMode[NavElementMode.Missing] as unknown as NavElementMode.Present | NavElementMode.Missing
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    itemNavigationData: [],
    mode: NavElementMode[NavElementMode.Missing] as unknown as NavElementMode.Present | NavElementMode.Missing
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true,
    mode: NavElementMode[NavElementMode.Missing] as unknown as NavElementMode.Present | NavElementMode.Missing
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    lockedToItemId: 4
  }
}`,...M.parameters?.docs?.source}}},N=[`Default`,`WithoutColor`,`InitialLoading`,`ConsecutiveLoading`,`NoData`,`AllItemsMode`,`AllItemsModeNoData`,`EditMode`,`AllItemsEditMode`,`LockedToItem`]}))();export{j as AllItemsEditMode,O as AllItemsMode,k as AllItemsModeNoData,E as ConsecutiveLoading,C as Default,A as EditMode,T as InitialLoading,M as LockedToItem,D as NoData,w as WithoutColor,N as __namedExportsOrder,S as default};