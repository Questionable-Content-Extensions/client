import{i as e}from"./preload-helper-B45gAKPr.js";import{i as t,t as n}from"./core-BZngjW6Y.js";import{B as r,i,lt as a,o,qt as s,ut as c,z as l}from"./iframe-BUsqzLvk.js";import{D as u,a as d,c as f,o as p,t as m}from"./mocks-E977bbNC.js";import{n as h,t as g}from"./FilteredNavigationData-Do8_dURR.js";var _,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M;e((()=>{n(),c(),l(),i(),u(),h(),{expect:_,fn:v,userEvent:y,waitFor:b,within:x}=__STORYBOOK_MODULE_TEST__,S={component:g,parameters:{msw:{handlers:[t.get(`http://localhost:3000/api/v3/itemdata/`,()=>s.json(m)),t.get(`http://localhost:3000/api/v3/comicdata/:comicId`,()=>s.json(d))]}},argTypes:{onAddItem:{action:`onAddItem`}},args:{editMode:!1,isFetching:!1,isLoading:!1,isSaving:!1,hasError:!1,itemData:p,useColors:!0,onAddItem:v(),onSetCurrentComic:v(),onShowInfoFor:v()},loaders:[()=>{o.dispatch(a.util.resetApiState()),o.getState().comic.current!==666&&o.dispatch(r(666))}]},C={},w={args:{useColors:!1}},T={args:{isLoading:!0}},E={args:{isFetching:!0}},D={args:{isSaving:!0}},O={args:{hasError:!0}},k={args:{editMode:!0}},A={args:{editMode:!0},play:async({canvasElement:e,args:t})=>{let n=x(e),r=n.getByPlaceholderText(`Filter non-present`);await y.type(r,f.shortName),await b(async()=>_(n.getByTitle(`Add ${f.shortName} to comic`)).toBeInTheDocument()),await _(t.onAddItem).not.toHaveBeenCalled(),await y.keyboard(`{Enter}`),await _(t.onAddItem).toHaveBeenCalledWith({new:!1,itemId:f.id}),await b(async()=>_(r).toHaveValue(``))}},j={args:{editMode:!0},play:async({canvasElement:e,args:t})=>{let n=x(e),r=n.getByPlaceholderText(`Filter non-present`);await y.type(r,`!Newbie`),await b(async()=>_(n.getByTitle(`Add cast`)).toBeInTheDocument()),await _(t.onAddItem).not.toHaveBeenCalled(),await y.keyboard(`{Control>}{Enter}{/Control}`),await _(t.onAddItem).toHaveBeenCalledWith({new:!0,newItemName:`Newbie`,newItemType:`cast`}),await b(async()=>_(r).toHaveValue(``))}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    useColors: false
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    isFetching: true
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    isSaving: true
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    hasError: true
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Filter non-present');
    await userEvent.type(input, FAYE.shortName);
    await waitFor(async () => expect(canvas.getByTitle(\`Add \${FAYE.shortName} to comic\`)).toBeInTheDocument());
    await expect(args.onAddItem).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    await expect(args.onAddItem).toHaveBeenCalledWith({
      new: false,
      itemId: FAYE.id
    });
    await waitFor(async () => expect(input).toHaveValue(''));
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Filter non-present');
    await userEvent.type(input, '!Newbie');
    await waitFor(async () => expect(canvas.getByTitle('Add cast')).toBeInTheDocument());
    await expect(args.onAddItem).not.toHaveBeenCalled();
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    await expect(args.onAddItem).toHaveBeenCalledWith({
      new: true,
      newItemName: 'Newbie',
      newItemType: 'cast'
    });
    await waitFor(async () => expect(input).toHaveValue(''));
  }
}`,...j.parameters?.docs?.source}}},M=[`Default`,`NoColors`,`Loading`,`Fetching`,`Saving`,`HasError`,`EditMode`,`EditModeAddFirstMatchViaEnter`,`EditModeAddNewViaCtrlEnter`]}))();export{C as Default,k as EditMode,A as EditModeAddFirstMatchViaEnter,j as EditModeAddNewViaCtrlEnter,E as Fetching,O as HasError,T as Loading,w as NoColors,D as Saving,M as __namedExportsOrder,S as default};