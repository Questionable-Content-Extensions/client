import{i as e}from"./preload-helper-B45gAKPr.js";import{t}from"./iframe-BUsqzLvk.js";import{n,t as r}from"./ForkAwesomeIcon-B6OZUu8b.js";import{n as i,t as a}from"./ExtraNavButton-BHNyqiwA.js";var o,s,c,l,u,d,f,p;e((()=>{n(),i(),o=t(),{expect:s,fn:c,userEvent:l,within:u}=__STORYBOOK_MODULE_TEST__,d={component:a,argTypes:{faClass:{control:{type:`select`},options:r}},args:{comicNo:69,title:`Previous strip`,visible:!0,faClass:`backward`,smallXPadding:!1,onClick:c()},render:e=>(0,o.jsx)(`div`,{className:`inline-block shadow m-auto`+(e.visible?``:` hidden`),children:(0,o.jsx)(a,{...e})})},f={play:async({canvasElement:e,args:t})=>{let n=u(e).getByRole(`link`);await l.click(n),await s(t.onClick).toHaveBeenCalled()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const navButton = canvas.getByRole('link');
    await userEvent.click(navButton);
    await expect(args.onClick).toHaveBeenCalled();
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`]}))();export{f as Default,p as __namedExportsOrder,d as default};