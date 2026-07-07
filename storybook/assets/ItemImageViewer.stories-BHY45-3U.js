import{i as e}from"./preload-helper-B45gAKPr.js";import{i as t,t as n}from"./core-BZngjW6Y.js";import{qt as r}from"./iframe-BUsqzLvk.js";import{D as i,c as a,f as o,h as s,y as c}from"./mocks-E977bbNC.js";import{n as l,t as u}from"./mockNetworkDelay-BJNPRY8o.js";import{i as d,n as f,r as p,t as m}from"./ItemImageViewer-CRdMjF83.js";var h,g,_,v,y,b,x,S;e((()=>{n(),i(),u(),d(),f(),{fn:h}=__STORYBOOK_MODULE_TEST__,g={component:m,argTypes:{onDeleteImage:{action:`onDeleteImage`},onSetPrimaryImage:{action:`onSetPrimaryImage`},itemDataUrl:{table:{disable:!0}}},args:{onDeleteImage:h(),onSetPrimaryImage:h(),onUploadImage:h()},parameters:{msw:{handlers:[t.get(`http://localhost:3000/api/v3/itemdata/image/:imageId`,async()=>{let e=await fetch(p).then(e=>e.arrayBuffer());return await l(),new r(e,{headers:{"Content-Length":e.byteLength.toString(),"Content-Type":`image/png`}})})]}}},_={args:{itemId:4,editModeToken:null,itemDataUrl:c,itemImageData:o,itemShortName:a.shortName,primaryImage:null}},v={args:{..._.args,editModeToken:`00000000-0000-0000-0000-000000000000`}},y={args:{itemId:4,editModeToken:null,itemDataUrl:c,itemImageData:s,itemShortName:a.shortName}},b={args:{...y.args,primaryImage:4}},x={args:{...y.args,editModeToken:`00000000-0000-0000-0000-000000000000`}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    itemId: 4,
    editModeToken: null,
    itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
    itemImageData: FAYE_IMAGES,
    itemShortName: FAYE.shortName,
    primaryImage: null
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    ...Single.args,
    editModeToken: '00000000-0000-0000-0000-000000000000'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    itemId: 4,
    editModeToken: null,
    itemDataUrl: QCEXT_SERVER_DEVELOPMENT_URL,
    itemImageData: MANY_IMAGES,
    itemShortName: FAYE.shortName
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    ...Many.args,
    primaryImage: 4
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...Many.args,
    editModeToken: '00000000-0000-0000-0000-000000000000'
  }
}`,...x.parameters?.docs?.source}}},S=[`Single`,`SingleEditMode`,`Many`,`ManyWithPrimarySet`,`ManyEditMode`]}))();export{y as Many,x as ManyEditMode,b as ManyWithPrimarySet,_ as Single,v as SingleEditMode,S as __namedExportsOrder,g as default};