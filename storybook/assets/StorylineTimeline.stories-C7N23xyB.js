import{i as e}from"./preload-helper-B45gAKPr.js";import{V as t,i as n,o as r,z as i}from"./iframe-BUsqzLvk.js";import{C as a,D as o,b as s,w as c,x as l}from"./mocks-E977bbNC.js";import{n as u,t as d}from"./StorylineTimeline-B00rASWB.js";var f,p,m,h,g,_,v,y,b,x,S,C;e((()=>{i(),n(),o(),u(),{fn:f}=__STORYBOOK_MODULE_TEST__,p={component:d,argTypes:{onSetCurrentComic:{action:`onSetCurrentComic`},onShowInfoFor:{action:`onShowInfoFor`},onAddItem:{action:`onAddItem`},onRemoveItem:{action:`onRemoveItem`}},args:{storyline:c,currentComicId:650,useColors:!0,isAttachedToCurrentComic:!1,onSetCurrentComic:f(),onShowInfoFor:f(),onAddItem:f(),onRemoveItem:f()},loaders:[()=>{r.dispatch(t(900))}]},m={args:{storyline:c,currentComicId:650}},h={args:{storyline:l,currentComicId:600}},g={args:{storyline:s,currentComicId:505}},_={args:{storyline:a,currentComicId:666}},v={args:{storyline:l,currentComicId:400}},y={args:{storyline:l,currentComicId:899}},b={args:{storyline:l,currentComicId:600,useColors:!1}},x={args:{storyline:l,currentComicId:600,editMode:!0,isAttachedToCurrentComic:!1}},S={args:{storyline:l,currentComicId:600,editMode:!0,isAttachedToCurrentComic:!0}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_SHORT_ARC_HYDRATED,
    currentComicId: 650
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_LONG_GAP_HYDRATED,
    currentComicId: 600
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_INTERMITTENT_HYDRATED,
    currentComicId: 505
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_OPEN_ENDED_HYDRATED,
    currentComicId: 666
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_LONG_GAP_HYDRATED,
    currentComicId: 400
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_LONG_GAP_HYDRATED,
    currentComicId: 899
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_LONG_GAP_HYDRATED,
    currentComicId: 600,
    useColors: false
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_LONG_GAP_HYDRATED,
    currentComicId: 600,
    editMode: true,
    isAttachedToCurrentComic: false
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    storyline: STORYLINE_LONG_GAP_HYDRATED,
    currentComicId: 600,
    editMode: true,
    isAttachedToCurrentComic: true
  }
}`,...S.parameters?.docs?.source}}},C=[`ShortFullyFeaturedArc`,`LongArcWithCappedGap`,`ManySmallGapsIntermittent`,`OpenEndedArc`,`CurrentComicAtStart`,`CurrentComicAtEnd`,`WithoutColor`,`EditModeUnattached`,`EditModeAttached`]}))();export{y as CurrentComicAtEnd,v as CurrentComicAtStart,S as EditModeAttached,x as EditModeUnattached,h as LongArcWithCappedGap,g as ManySmallGapsIntermittent,_ as OpenEndedArc,m as ShortFullyFeaturedArc,b as WithoutColor,C as __namedExportsOrder,p as default};