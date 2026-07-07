import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{i as r,t as i}from"./core-BZngjW6Y.js";import{qt as a,s as o,t as s,v as c}from"./iframe-BUsqzLvk.js";import{D as l,S as u,c as d,t as f}from"./mocks-E977bbNC.js";import{n as p,t as m}from"./hooks-DNVZbieZ.js";import{n as h,t as g}from"./ItemDetails-DZ70N0JF.js";var _,v,y,b,x,S,C,w,T,E;t((()=>{i(),_=e(n()),m(),o(),l(),h(),v=s(),{expect:y,fn:b,within:x}=__STORYBOOK_MODULE_TEST__,S={component:g,argTypes:{onGoToComic:{action:`onGoToComic`}},args:{item:d,editMode:!1,onGoToComic:b()},parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/itemdata/`,()=>{let e=[...f],t=`This is a mocked API response and will only be accurate for comic 666`;return e.push({id:-1,name:t,shortName:t,count:0,type:`storyline`,color:`ffaabb`,startComicId:null,endComicId:null}),a.json(e)})]}},render:e=>{let t=p(),[n,r]=(0,_.useState)(null);return n!==e.item&&(r(e.item),t(c(e.item))),(0,v.jsx)(g,{...e})}},C={},w={args:{editMode:!0}},T={args:{editMode:!0,item:u},play:async({canvasElement:e})=>{let t=x(e),n=t.getByLabelText(/Ongoing \(no end comic\)/);y(n.checked).toBe(!0),await n.click(),y(t.getByLabelText(/End comic/)).toHaveValue(u.last)}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true,
    item: STORYLINE_ONGOING_ITEM
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const ongoingCheckbox = canvas.getByLabelText<HTMLInputElement>(/Ongoing \\(no end comic\\)/);
    expect(ongoingCheckbox.checked).toBe(true);
    await ongoingCheckbox.click();

    // \`endComicId\` is exclusive, displayed inclusive at the UI boundary,
    // so unchecking should land on \`item.last\` (850), not \`startComicId\`
    // (400).
    expect(canvas.getByLabelText(/End comic/)).toHaveValue(STORYLINE_ONGOING_ITEM.last);
  }
}`,...T.parameters?.docs?.source}}},E=[`Default`,`Editor`,`EditorTogglingOngoingStoryline`]}))();export{C as Default,w as Editor,T as EditorTogglingOngoingStoryline,E as __namedExportsOrder,S as default};