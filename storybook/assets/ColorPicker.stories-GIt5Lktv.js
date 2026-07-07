import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{t as r}from"./iframe-BUsqzLvk.js";import{n as i,t as a}from"./ColorPicker-DHD_4VNX.js";var o,s,c,l,u,d,f,p;t((()=>{o=e(n()),i(),s=r(),{useArgs:c}=__STORYBOOK_MODULE_PREVIEW_API__,l={component:a,argTypes:{setColor:{action:`setColor`},resetColor:{action:`resetColor`}},args:{color:`#ffaabb`,isColorDirty:!1,isSaving:!1},render:e=>{let[t,n]=(0,o.useState)(e.color);t!==e.color&&n(e.color);let[,r]=c();return(0,s.jsx)(a,{...e,setColor:t=>{r({color:t,dirty:!0}),e.setColor(t)}})}},u={},d={args:{isColorDirty:!0}},f={args:{isSaving:!0}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    isColorDirty: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    isSaving: true
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`,`Dirty`,`Saving`]}))();export{u as Default,d as Dirty,f as Saving,p as __namedExportsOrder,l as default};