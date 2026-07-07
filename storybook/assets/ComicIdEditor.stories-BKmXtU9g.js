import{i as e}from"./preload-helper-B45gAKPr.js";import{i as t,t as n}from"./core-BZngjW6Y.js";import{qt as r,t as i}from"./iframe-BUsqzLvk.js";import{D as a,t as o}from"./mocks-E977bbNC.js";import{n as s,t as c}from"./ComicIdEditor-B2AQSzzO.js";var l,u,d,f,p,m,h;e((()=>{n(),a(),s(),l=i(),{useArgs:u}=__STORYBOOK_MODULE_PREVIEW_API__,d={component:c,parameters:{msw:{handlers:[t.get(`http://localhost:3000/api/v3/itemdata/`,()=>r.json(o))]}},args:{dirty:!1,isSaving:!1,label:`Start comic`,value:666},render:e=>{let[,t]=u();return(0,l.jsx)(c,{...e,setValue:e=>{t({value:e,dirty:!0})}})}},f={},p={args:{dirty:!0}},m={args:{isSaving:!0}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    dirty: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    isSaving: true
  }
}`,...m.parameters?.docs?.source}}},h=[`Default`,`Dirty`,`Saving`]}))();export{f as Default,p as Dirty,m as Saving,h as __namedExportsOrder,d as default};