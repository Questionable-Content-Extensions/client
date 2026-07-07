import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{t as r}from"./iframe-BUsqzLvk.js";import{D as i,E as a,o}from"./mocks-E977bbNC.js";import{n as s,t as c}from"./CopyItemsDialogPanel-KF5levo2.js";var l,u,d,f,p,m,h,g,_;t((()=>{l=e(n()),i(),s(),u=r(),{useArgs:d}=__STORYBOOK_MODULE_PREVIEW_API__,{fn:f}=__STORYBOOK_MODULE_TEST__,p={component:c,argTypes:{selectedItems:{table:{disable:!0}},onUpdateSelectedItems:{table:{disable:!0}}},args:{allComics:a(5e3),selectedComic:665,isLoading:!1,isFetching:!1,comicItems:o,onChangeSelectedComic:f(),onUpdateSelectedItems:f()},render:e=>{let[,t]=d(),n=n=>{t({selectedComic:n}),e.onChangeSelectedComic(n)},r=(0,l.useMemo)(()=>{if(e.allComics){let t=[...e.allComics];return t.reverse(),t}},[e.allComics]),[i,a]=(0,l.useState)({});return(0,l.useEffect)(()=>{let t={};if(e.comicItems){for(let n of e.comicItems)t[n.id]=!0;a(t)}},[e.comicItems]),(0,u.jsx)(c,{...e,allComics:r,onChangeSelectedComic:n,selectedItems:i,onUpdateSelectedItems:t=>{a(t),e.onUpdateSelectedItems(t)}})}},m={},h={args:{allComics:void 0,isLoading:!0}},g={args:{isFetching:!0}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    allComics: undefined,
    isLoading: true
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    isFetching: true
  }
}`,...g.parameters?.docs?.source}}},_=[`Default`,`IsLoading`,`IsFetching`]}))();export{m as Default,g as IsFetching,h as IsLoading,_ as __namedExportsOrder,p as default};