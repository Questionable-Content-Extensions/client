import{i as e}from"./preload-helper-B45gAKPr.js";import{t}from"./iframe-BUsqzLvk.js";function n(){return(0,r.jsx)(`div`,{className:`bg-gray-400 grid place-content-center place-items-center`,style:{width:`600px`,height:`1200px`},children:(0,r.jsx)(`div`,{className:`text-gray-600 text-9xl`,children:`Comic`})})}var r,i=e((()=>{r=t(),n.__docgenInfo={description:``,methods:[],displayName:`FakeComic`}})),a,o,s,c,l=e((()=>{a=`_ribbon_10i7z_5`,o=`_guestComic_10i7z_82`,s=`_nonCanon_10i7z_87`,c={ribbon:a,guestComic:o,nonCanon:s}}));function u({ribbonType:e,show:t}){if(t&&e!==0){let t,n;return e===1?(t=`Guest comic`,n=c.guestComic):(t=`Non-canon`,n=c.nonCanon),(0,d.jsx)(`div`,{className:`${c.ribbon} ${n}`,children:(0,d.jsx)(`span`,{children:t})})}else return(0,d.jsx)(d.Fragment,{})}var d,f,p=e((()=>{l(),d=t(),f=function(e){return e[e.None=0]=`None`,e[e.GuestComic=1]=`GuestComic`,e[e.NonCanon=2]=`NonCanon`,e}({}),u.__docgenInfo={description:``,methods:[],displayName:`ComicRibbon`,props:{ribbonType:{required:!0,tsType:{name:`RibbonType`},description:``},show:{required:!0,tsType:{name:`boolean`},description:``}}}})),m,h,g,_,v,y,b;e((()=>{i(),p(),m=t(),h={component:u,argTypes:{ribbonType:{control:`select`,options:[f[f.None],f[f.GuestComic],f[f.NonCanon]]}},render:e=>{let t=typeof e.ribbonType==`string`?f[e.ribbonType]:e.ribbonType;return(0,m.jsxs)(`div`,{className:`relative inline-block mt-4 mr-4`,children:[(0,m.jsx)(n,{}),(0,m.jsx)(u,{...e,ribbonType:t})]})}},g={args:{show:!0,ribbonType:f[f.GuestComic]}},_={args:{show:!0,ribbonType:f[f.NonCanon]}},v={args:{show:!0,ribbonType:f[f.None]}},y={args:{...g.args,show:!1}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    show: true,
    ribbonType: RibbonType[RibbonType.GuestComic] as unknown as RibbonType
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    show: true,
    ribbonType: RibbonType[RibbonType.NonCanon] as unknown as RibbonType
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    show: true,
    ribbonType: RibbonType[RibbonType.None] as unknown as RibbonType
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    ...GuestComic.args,
    show: false
  }
}`,...y.parameters?.docs?.source}}},b=[`GuestComic`,`NonCanon`,`Regular`,`Hidden`]}))();export{g as GuestComic,y as Hidden,_ as NonCanon,v as Regular,b as __namedExportsOrder,h as default};