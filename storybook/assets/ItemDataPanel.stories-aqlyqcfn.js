import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{i as r,t as i}from"./core-BZngjW6Y.js";import{i as a,lt as o,o as s,qt as c,s as l,t as u,ut as d,v as f}from"./iframe-BUsqzLvk.js";import{D as p,c as m,d as h,f as g,h as _,i as v,n as y,p as b,r as x,t as S,y as C}from"./mocks-E977bbNC.js";import{i as w,r as T}from"./ItemImageViewer-CRdMjF83.js";import{n as E,t as D}from"./ItemDataPanel-Dwwhy5Ct.js";var O,k,A,j,M,N,P,F,I,L,R,z,B,V;t((()=>{i(),O=e(n()),d(),l(),a(),p(),w(),E(),k=u(),{fn:A}=__STORYBOOK_MODULE_TEST__,j={component:D,argTypes:{onGoToComic:{action:`onGoToComic`},onShowItemData:{action:`onShowItemData`},onDeleteImage:{action:`onDeleteImage`},onSetPrimaryImage:{action:`onSetPrimaryImage`}},args:{itemDataUrl:C,itemData:m,itemImageData:g,itemFriendData:h,itemLocationData:b,editModeToken:null,onGoToComic:A(),onShowItemData:A(),onDeleteImage:A(),onSetPrimaryImage:A(),onUploadImage:A()},parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/itemdata/`,()=>{let e=[...S],t=`This is a mocked API response and will only be accurate for comic 666`;return e.push({id:-1,name:t,shortName:t,count:0,type:`storyline`,color:`ffaabb`,startComicId:null,endComicId:null}),c.json(e)}),r.get(`http://localhost:3000/api/v3/itemdata/image/:imageId`,async()=>{let e=await fetch(T).then(e=>e.arrayBuffer());return new c(e,{headers:{"Content-Length":e.byteLength.toString(),"Content-Type":`image/png`}})})]}},render:e=>{let[t,n]=(0,O.useState)(null);return t!==e.itemData&&e.itemData&&(n(e.itemData),s.dispatch(f(e.itemData))),(0,k.jsx)(D,{...e})},loaders:[()=>{s.dispatch(o.util.resetApiState())}]},M={},N={args:{editModeToken:`00000000-0000-0000-0000-000000000000`}},P={args:{itemData:null}},F={args:{itemImageData:[]}},I={args:{itemImageData:[],editModeToken:`00000000-0000-0000-0000-000000000000`}},L={args:{itemImageData:_}},R={args:{itemImageData:_,editModeToken:`00000000-0000-0000-0000-000000000000`}},z={args:{itemFriendData:[],itemLocationData:[]}},B={args:{itemData:y,itemImageData:[],itemFriendData:x,itemLocationData:v}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    editModeToken: '00000000-0000-0000-0000-000000000000'
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    itemData: null
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    itemImageData: []
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    itemImageData: [],
    editModeToken: '00000000-0000-0000-0000-000000000000'
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    itemImageData: MANY_IMAGES
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    itemImageData: MANY_IMAGES,
    editModeToken: '00000000-0000-0000-0000-000000000000'
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    itemFriendData: [],
    itemLocationData: []
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    itemData: COFFEE_OF_DOOM,
    itemImageData: [],
    itemFriendData: COFFEE_OF_DOOM_FRIENDS,
    itemLocationData: COFFEE_OF_DOOM_LOCATIONS
  }
}`,...B.parameters?.docs?.source}}},V=[`Default`,`Editor`,`Loading`,`NoImages`,`NoImagesEditor`,`MultipleImages`,`MultipleImagesEditor`,`NoRelations`,`Location`]}))();export{M as Default,N as Editor,P as Loading,B as Location,L as MultipleImages,R as MultipleImagesEditor,F as NoImages,I as NoImagesEditor,z as NoRelations,V as __namedExportsOrder,j as default};