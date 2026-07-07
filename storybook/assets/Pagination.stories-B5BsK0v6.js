import{i as e}from"./preload-helper-B45gAKPr.js";import{t}from"./iframe-BUsqzLvk.js";import{n,t as r}from"./Pagination-dt2-M7_3.js";var i,a,o,s,c,l,u,d,f,p,m,h,g;e((()=>{n(),i=t(),{useArgs:a}=__STORYBOOK_MODULE_PREVIEW_API__,{fn:o}=__STORYBOOK_MODULE_TEST__,s={component:r,args:{page:1,count:1,siblingCount:2,boundaryCount:3,showFirstButton:!1,showLastButton:!1,hideNextButton:!1,hidePrevButton:!1,disabled:!1,isFetching:!1,onGoToPage:o()},render:e=>{let[,t]=a(),n=n=>{t({page:n}),e.onGoToPage(n)};return(0,i.jsx)(`div`,{className:`flex justify-center`,children:(0,i.jsx)(r,{...e,onGoToPage:n})})}},c={},l={args:{count:10}},u={args:{count:100}},d={args:{count:1e3}},f={args:{...d.args,showFirstButton:!0,showLastButton:!0}},p={args:{...d.args,hideNextButton:!0,hidePrevButton:!0}},m={args:{...d.args,disabled:!0}},h={args:{...d.args,isFetching:!0,page:4}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    count: 10
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    count: 100
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    count: 1000
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...ThousandPages.args,
    showFirstButton: true,
    showLastButton: true
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...ThousandPages.args,
    hideNextButton: true,
    hidePrevButton: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...ThousandPages.args,
    disabled: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...ThousandPages.args,
    isFetching: true,
    page: 4
  }
}`,...h.parameters?.docs?.source}}},g=[`SinglePage`,`TenPages`,`HundredPages`,`ThousandPages`,`WithFirstAndLast`,`WithoutPrevAndNext`,`Disabled`,`Fetching`]}))();export{m as Disabled,h as Fetching,u as HundredPages,c as SinglePage,l as TenPages,d as ThousandPages,f as WithFirstAndLast,p as WithoutPrevAndNext,g as __namedExportsOrder,s as default};