import{i as e}from"./preload-helper-B45gAKPr.js";import{i as t,t as n}from"./core-BZngjW6Y.js";import{qt as r}from"./iframe-BUsqzLvk.js";import{D as i,t as a}from"./mocks-E977bbNC.js";import{n as o,t as s}from"./PickComicDialog-B_ZH8_sf.js";var c,l,u,d,f,p,m,h,g,_,v,y;e((()=>{n(),i(),o(),{expect:c,fn:l,userEvent:u,waitFor:d,within:f}=__STORYBOOK_MODULE_TEST__,p=[{comic:1,title:`A comic about nothing in particular`,tagline:void 0,isGuestComic:!1,isNonCanon:!1},{comic:2,title:`The one with the tagline`,tagline:`A tale of two taglines`,isGuestComic:!1,isNonCanon:!1},{comic:3,title:`A guest comic`,tagline:void 0,isGuestComic:!0,isNonCanon:!1}],m={component:s,argTypes:{show:{table:{disable:!0}}},args:{show:!0,onClose:l(),onSelectComic:l()},parameters:{msw:{handlers:[t.get(`http://localhost:3000/api/v3/comicdata/`,()=>r.json(p)),t.get(`http://localhost:3000/api/v3/itemdata/`,()=>r.json(a))]}}},h={},g={play:async({args:e,canvasElement:t})=>{let n=await f(t).findByRole(`button`,{name:/A comic about nothing in particular/});await u.click(n),await c(e.onSelectComic).toHaveBeenCalledWith(1)}},_={play:async({canvasElement:e})=>{let t=f(e);await t.findByRole(`button`,{name:/A comic about nothing in particular/});let n=t.getByRole(`textbox`);await u.type(n,`tagline{enter}`),await d(()=>c(t.getByRole(`button`,{name:/The one with the tagline/})).toBeInTheDocument()),await c(t.queryByRole(`button`,{name:/A comic about nothing in particular/})).not.toBeInTheDocument()}},v={play:async({args:e,canvasElement:t})=>{let n=f(t);await u.click(n.getByRole(`button`,{name:`Cancel`})),await c(e.onClose).toHaveBeenCalled()}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const comicButton = await canvas.findByRole('button', {
      name: /A comic about nothing in particular/
    });
    await userEvent.click(comicButton);
    await expect(args.onSelectComic).toHaveBeenCalledWith(1);
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('button', {
      name: /A comic about nothing in particular/
    });
    const filterInput = canvas.getByRole('textbox');
    await userEvent.type(filterInput, 'tagline{enter}');
    await waitFor(() => expect(canvas.getByRole('button', {
      name: /The one with the tagline/
    })).toBeInTheDocument());
    await expect(canvas.queryByRole('button', {
      name: /A comic about nothing in particular/
    })).not.toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onClose).toHaveBeenCalled();
  }
}`,...v.parameters?.docs?.source}}},y=[`Default`,`SelectingAComicInvokesCallback`,`FilteringByTextNarrowsTheList`,`CancelInvokesOnClose`]}))();export{v as CancelInvokesOnClose,h as Default,_ as FilteringByTextNarrowsTheList,g as SelectingAComicInvokesCallback,y as __namedExportsOrder,m as default};