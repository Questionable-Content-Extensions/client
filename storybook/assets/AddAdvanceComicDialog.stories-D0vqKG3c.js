import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{i as r,t as i}from"./core-BZngjW6Y.js";import{n as a,t as o}from"./Settings-BA56IXRs.js";import{$ as s,Ft as c,It as l,K as u,V as d,X as ee,Y as f,Z as p,i as m,it as h,lt as g,o as _,ot as v,qt as y,rt as b,st as x,t as te,tt as S,ut as ne,z as re}from"./iframe-BUsqzLvk.js";import{D as C,a as ie,t as w}from"./mocks-E977bbNC.js";import{n as T,t as E}from"./mockNetworkDelay-BJNPRY8o.js";import{n as D,t as O}from"./testUtils-UIS43-hk.js";import{n as ae,t as k}from"./Button-DMUzCpJg.js";import{n as A,t as oe}from"./ItemNavigation-D5RxEUCE.js";import{t as j}from"./query-Dd3NvAg0.js";import{r as M,t as se}from"./hooks-DNVZbieZ.js";import{n as ce,r as le}from"./NavElement-Csv5M2gu.js";import{n as ue,t as de}from"./FilteredNavigationData-Do8_dURR.js";import{n as fe,t as pe}from"./ModalDialog-DARihu8Y.js";import{n as me,t as he}from"./useHydratedItemData-j8gt0QF3.js";function ge(e){let t=new Date(e);return new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,16)}function N({show:e,onClose:t}){let n=M(e=>e.settings.values),r=M(e=>e.comic.latest),[i,a]=(0,I.useState)(null),o=()=>{a(null),t()};return i===null?(0,R.jsx)(P,{show:e,settings:n,latestComic:r,onSelectPending:a,onClose:o}):(0,R.jsx)(F,{comicId:i,onBack:()=>a(null),onClose:o})}function P({show:e,settings:t,latestComic:n,onSelectPending:r,onClose:i}){let{data:a,isFetching:o}=S(!e||!t?.editModeToken?L.skipToken:void 0),s=String(n+1),[c,l]=(0,I.useState)(s),[u,d]=(0,I.useState)(``),[f,p]=(0,I.useState)(``),[m,h]=(0,I.useState)(``),[g,_]=(0,I.useState)(!1),[v,y]=(0,I.useState)(!1),[b,x]=(0,I.useState)(!1),[te,{isLoading:ne}]=ee(),[re,C]=(0,I.useState)(!1);return(0,R.jsx)(pe,{onCloseClicked:i,header:(0,R.jsx)(`h5`,{className:`m-0 text-xl font-medium leading-normal text-gray-800`,children:`Add advance comic`}),body:(0,R.jsxs)(R.Fragment,{children:[a&&a.length>0&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`h6`,{className:`font-medium mb-2`,children:`Pending advance comics`}),(0,R.jsx)(`ul`,{className:`mb-4`,children:a.map(e=>(0,R.jsx)(`li`,{children:(0,R.jsxs)(`button`,{type:`button`,className:`text-blue-600 hover:underline`,onClick:()=>r(e.comic),children:[`#`,e.comic,` —`,` `,e.title]})},e.comic))}),(0,R.jsx)(`hr`,{className:`my-4 mx-0 border-solid border-b max-w-none`})]}),(0,R.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,R.jsxs)(`label`,{className:`flex flex-col`,children:[`Comic ID`,(0,R.jsx)(`input`,{type:`number`,min:`1`,className:`border border-qc-header pl-2`,value:c,onChange:e=>l(e.target.value)})]}),(0,R.jsxs)(`label`,{className:`flex flex-col`,children:[`Title`,(0,R.jsx)(`input`,{type:`text`,className:`border border-qc-header pl-2`,value:u,onChange:e=>d(e.target.value)})]}),(0,R.jsxs)(`label`,{className:`flex flex-col`,children:[`Tagline`,(0,R.jsx)(`input`,{type:`text`,className:`border border-qc-header pl-2`,value:f,onChange:e=>p(e.target.value)})]}),(0,R.jsxs)(`label`,{className:`flex flex-col`,children:[`Publish date`,(0,R.jsx)(`input`,{type:`datetime-local`,className:`border border-qc-header pl-2`,value:m,onChange:e=>h(e.target.value)})]}),(0,R.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,R.jsx)(`input`,{type:`checkbox`,checked:g,onChange:e=>_(e.target.checked)}),`Accurate date`]}),(0,R.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,R.jsx)(`input`,{type:`checkbox`,checked:v,onChange:e=>y(e.target.checked)}),`Guest comic`]}),(0,R.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,R.jsx)(`input`,{type:`checkbox`,checked:b,onChange:e=>x(e.target.checked)}),`Non-canon`]}),re&&(0,R.jsx)(`p`,{className:`text-red-600 m-0`,children:`Failed to add advance comic. See notification for details.`})]})]}),footer:(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(k,{onClick:async()=>{let e=Number(c);!e||!u||(`data`in await te({comicId:e,title:u,tagline:f||void 0,publishDate:m?new Date(m).toISOString():void 0,isAccuratePublishDate:g,isGuestComic:v,isNonCanon:b})?(C(!1),l(s),d(``),p(``),h(``),_(!1),y(!1),x(!1),r(e)):C(!0))},disabled:ne||o||!c||!u,children:`Add advance comic`}),(0,R.jsx)(k,{onClick:i,children:`Close`})]})})}function F({comicId:e,onBack:t,onClose:n}){let r=M(e=>e.settings.values),{data:i,isFetching:a}=s(r?f(e,r):L.skipToken);return!r?.editModeToken||!i||!i.hasData?(0,R.jsx)(pe,{onCloseClicked:n,header:(0,R.jsxs)(`h5`,{className:`m-0 text-xl font-medium leading-normal text-gray-800`,children:[`Edit advance comic #`,e]}),body:(0,R.jsx)(`p`,{children:a?`Loading…`:`Comic not found.`}),footer:(0,R.jsx)(k,{onClick:t,children:`Back`})}):(0,R.jsx)(_e,{comicId:e,settings:r,initialData:i,onBack:t,onClose:n})}function _e({comicId:e,settings:t,initialData:n,onBack:r,onClose:i}){let a=n.title,o=n.tagline??``,s=n.publishDate?ge(n.publishDate):``,c=n.isAccuratePublishDate,l=n.isGuestComic,u=n.isNonCanon,[d,ee]=(0,I.useState)(a),[f,m]=(0,I.useState)(o),[g,_]=(0,I.useState)(s),[v,y]=(0,I.useState)(c),[x,te]=(0,I.useState)(l),[S,ne]=(0,I.useState)(u),[re,{isLoading:C}]=b(),[ie,w]=(0,I.useState)(!1),T=d!==a,E=f!==o,D=g!==s,O=v!==c,ae=D||O,A=x!==l,j=S!==u,M=T||E||ae||A||j,{comicItems:se,allItems:le,isLoading:ue,isFetching:fe}=me(e,t),[he]=p(),[N]=h(),P=()=>{},F=()=>{};return(0,R.jsx)(pe,{onCloseClicked:i,header:(0,R.jsxs)(`h5`,{className:`m-0 text-xl font-medium leading-normal text-gray-800`,children:[`Edit advance comic #`,e]}),body:(0,R.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,R.jsxs)(`label`,{className:`flex flex-col`,children:[(0,R.jsxs)(`span`,{className:T?`italic`:``,children:[`Title`,T?`*`:``]}),(0,R.jsx)(`input`,{type:`text`,className:`border border-qc-header pl-2`,value:d,onChange:e=>ee(e.target.value)})]}),(0,R.jsxs)(`label`,{className:`flex flex-col`,children:[(0,R.jsxs)(`span`,{className:E?`italic`:``,children:[`Tagline`,E?`*`:``]}),(0,R.jsx)(`input`,{type:`text`,className:`border border-qc-header pl-2`,value:f,onChange:e=>m(e.target.value)})]}),(0,R.jsxs)(`label`,{className:`flex flex-col`,children:[(0,R.jsxs)(`span`,{className:D?`italic`:``,children:[`Publish date`,D?`*`:``]}),(0,R.jsx)(`input`,{type:`datetime-local`,className:`border border-qc-header pl-2`,value:g,onChange:e=>_(e.target.value)})]}),(0,R.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,R.jsx)(`input`,{type:`checkbox`,checked:v,onChange:e=>y(e.target.checked)}),(0,R.jsxs)(`span`,{className:O?`italic`:``,children:[`Accurate date`,O?`*`:``]})]}),(0,R.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,R.jsx)(`input`,{type:`checkbox`,checked:x,onChange:e=>te(e.target.checked)}),(0,R.jsxs)(`span`,{className:A?`italic`:``,children:[`Guest comic`,A?`*`:``]})]}),(0,R.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,R.jsx)(`input`,{type:`checkbox`,checked:S,onChange:e=>ne(e.target.checked)}),(0,R.jsxs)(`span`,{className:j?`italic`:``,children:[`Non-canon`,j?`*`:``]})]}),ie&&(0,R.jsx)(`p`,{className:`text-red-600 m-0`,children:`Failed to save changes. See notification for details.`}),(0,R.jsx)(`hr`,{className:`my-2 mx-0 border-solid border-b max-w-none`}),(0,R.jsx)(`h6`,{className:`font-medium mb-0`,children:`Items`}),(0,R.jsx)(oe,{itemNavigationData:se??[],isLoading:ue,isFetching:fe,useColors:t.useColors,orderMembersByLastAppearance:!1,onSetCurrentComic:P,onShowInfoFor:F,mode:ce.Present,editMode:!0,onRemoveItem:t=>{N({comicId:e,itemId:t})}}),(0,R.jsx)(de,{isLoading:ue,isFetching:fe,isSaving:!1,hasError:!1,itemData:le??[],onSetCurrentComic:P,onShowInfoFor:F,useColors:t.useColors,orderMembersByLastAppearance:!1,editMode:!0,onAddItem:async t=>{await he({comicId:e,...t}).unwrap()}})]}),footer:(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(k,{onClick:async()=>{if(!d)return;let t={};T&&(t.title=d),E&&(t.tagline=f||void 0),ae&&(t.publishDate=g?{publishDate:new Date(g).toISOString(),isAccuratePublishDate:v}:void 0),A&&(t.isGuestComic=x),j&&(t.isNonCanon=S),`data`in await re({comic:e,body:t})?(w(!1),r()):w(!0)},disabled:C||!d||!M,children:`Save changes`}),(0,R.jsx)(k,{onClick:r,children:`Back`})]})})}var I,L,R,ve=t((()=>{I=e(n()),ae(),A(),ue(),fe(),le(),he(),L=j(),u(),se(),R=te(),N.__docgenInfo={description:``,methods:[],displayName:`AddAdvanceComicDialog`,props:{show:{required:!0,tsType:{name:`boolean`},description:``},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),z,B,V,H,U,ye,W,G,K,q,J,Y,X,Z,Q,$,be;t((()=>{i(),l(),ne(),re(),v(),m(),a(),C(),E(),O(),ve(),{expect:z,userEvent:B,waitFor:V,within:H}=__STORYBOOK_MODULE_TEST__,U={...ie,comic:5001,title:`A comic from the future`,tagline:`Shh, nobody else knows yet`},ye={component:N,argTypes:{show:{table:{disable:!0}}},args:{show:!0,onClose:()=>{alert(`In the userscript, this window would close now.`)}},parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/comicdata/advance`,()=>y.json([{comic:U.comic,title:U.title,tagline:U.tagline,publishDate:U.publishDate}])),r.post(`http://localhost:3000/api/v3/comicdata/advance`,async()=>(await T(500),y.text(`"Added advance comic #5002"`))),r.get(`http://localhost:3000/api/v3/comicdata/:comicId`,({params:e})=>{let{comicId:t}=e;return Number(t)===U.comic?y.json({...U,allItems:w.map(e=>({id:e.id,first:e.id,previous:null,next:null,last:e.id}))}):y.json({comic:Number(t),editorData:{present:!1},hasData:!1})}),r.patch(`http://localhost:3000/api/v3/comicdata/:comicId`,async()=>(await T(500),y.text(`"Comic updated"`))),r.get(`http://localhost:3000/api/v3/itemdata/`,()=>y.json(w)),r.post(`http://localhost:3000/api/v3/comicdata/additem`,async()=>(await T(500),y.text(`"Added item to comic"`))),r.post(`http://localhost:3000/api/v3/comicdata/removeitem`,async()=>(await T(500),y.text(`"Removed item from comic"`)))]}},loaders:[()=>{_.dispatch(g.util.resetApiState()),_.dispatch(x({...o.DEFAULTS,editMode:!0,editModeToken:`00000000-0000-0000-0000-000000000000`}))}]},W={},G={loaders:[()=>{_.dispatch(d(2500))}],play:async({canvasElement:e})=>{let t=H(e);await V(()=>z(t.getByLabelText(`Comic ID`)).toHaveValue(2501))}},K={play:async({canvasElement:e})=>{let t=H(e);await V(()=>z(t.getByRole(`heading`,{name:`Add advance comic`})).toBeInTheDocument());let n=t.getByLabelText(`Comic ID`);await B.clear(n),await B.type(n,String(U.comic)),await B.type(t.getByLabelText(`Title`),`A new comic`),await B.click(t.getByLabelText(`Accurate date`)),await B.click(t.getByRole(`button`,{name:`Add advance comic`})),await V(()=>z(t.getByRole(`heading`,{name:`Edit advance comic #${U.comic}`})).toBeInTheDocument(),{timeout:3e3})}},q={play:async({canvasElement:e})=>{let t=H(e);await V(()=>z(t.getByText(`#${U.comic} — ${U.title}`)).toBeInTheDocument()),await B.click(t.getByText(`#${U.comic} — ${U.title}`)),await V(()=>z(t.getByText(`Edit advance comic #${U.comic}`)).toBeInTheDocument()),await z(_.getState().comic.current).toEqual(0),await V(()=>z(t.getByDisplayValue(U.title)).toBeInTheDocument())}},J={parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/comicdata/advance`,()=>y.json([])),r.post(`http://localhost:3000/api/v3/comicdata/advance`,async()=>(await T(500),y.text(`Server Error`,{status:500})))]}},play:async({canvasElement:e})=>{let t=H(e);await V(()=>z(t.getByRole(`heading`,{name:`Add advance comic`})).toBeInTheDocument());let n=t.getByLabelText(`Comic ID`);await B.clear(n),await B.type(n,`5003`),await B.type(t.getByLabelText(`Title`),`A new comic`),await D(`Got unexpected response from server`,async()=>{await B.click(t.getByRole(`button`,{name:`Add advance comic`})),await V(()=>z(t.getByText(`Failed to add advance comic. See notification for details.`)).toBeInTheDocument())}),await z(t.getByRole(`heading`,{name:`Add advance comic`})).toBeInTheDocument()}},Y={play:async({canvasElement:e})=>{let t=H(e);await B.click(await t.findByText(`#${U.comic} — ${U.title}`)),await V(()=>z(t.getByText(`Edit advance comic #${U.comic}`)).toBeInTheDocument());let n=await t.findByTitle(`Remove Faye from comic`);await B.click(n);let r=t.getByPlaceholderText(`Filter non-present`);await B.type(r,`Claire`);let i=await V(()=>t.getByTitle(`Add Claire to comic`));await B.click(i),await z(_.getState().comic.current).toEqual(0)}},X={play:async({canvasElement:e})=>{let t=H(e);await B.click(await t.findByText(`#${U.comic} — ${U.title}`));let n=await V(()=>t.getByRole(`button`,{name:`Save changes`}));await z(n).toBeDisabled();let r=t.getByLabelText(`Title`);await B.type(r,` (edited)`),await V(()=>z(n).toBeEnabled()),await B.clear(r),await B.type(r,U.title),await V(()=>z(n).toBeDisabled())}},Z={play:async({canvasElement:e})=>{let t=H(e);await B.click(await t.findByText(`#${U.comic} — ${U.title}`)),await V(()=>z(t.getByText(`Title`)).toBeInTheDocument()),await z(t.getByText(`Title`)).not.toHaveClass(`italic`),await z(t.queryByText(`Title*`)).not.toBeInTheDocument();let n=t.getByLabelText(`Title`);await B.type(n,` (edited)`),await V(()=>z(t.getByText(`Title*`)).toHaveClass(`italic`)),await z(t.getByText(`Guest comic`)).not.toHaveClass(`italic`),await B.click(t.getByLabelText(`Guest comic`)),await V(()=>z(t.getByText(`Guest comic*`)).toHaveClass(`italic`))}},Q={play:async({canvasElement:e})=>{let t=H(e);await B.click(await t.findByText(`#${U.comic} — ${U.title}`)),await V(()=>z(t.getByRole(`button`,{name:`Save changes`})).toBeInTheDocument());let n;c().use(r.patch(`http://localhost:3000/api/v3/comicdata/:comicId`,async({request:e})=>(n=await e.json(),y.text(`"Comic updated"`))));let i=t.getByLabelText(`Title`);await B.clear(i),await B.type(i,`An edited title`),await B.click(t.getByRole(`button`,{name:`Save changes`})),await V(()=>z(n).toEqual({title:`An edited title`}))}},$={parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/comicdata/advance`,()=>y.json([{comic:U.comic,title:U.title,tagline:U.tagline,publishDate:U.publishDate}])),r.get(`http://localhost:3000/api/v3/comicdata/:comicId`,({params:e})=>{let{comicId:t}=e;return Number(t)===U.comic?y.json({...U,allItems:w.map(e=>({id:e.id,first:e.id,previous:null,next:null,last:e.id}))}):y.json({comic:Number(t),editorData:{present:!1},hasData:!1})}),r.get(`http://localhost:3000/api/v3/itemdata/`,()=>y.json(w)),r.patch(`http://localhost:3000/api/v3/comicdata/:comicId`,async()=>(await T(500),y.text(`Server Error`,{status:500})))]}},play:async({canvasElement:e})=>{let t=H(e);await B.click(await t.findByText(`#${U.comic} — ${U.title}`)),await V(()=>z(t.getByRole(`button`,{name:`Save changes`})).toBeInTheDocument()),await B.type(t.getByLabelText(`Title`),` (edited)`),await D(`Got unexpected response from server`,async()=>{await B.click(t.getByRole(`button`,{name:`Save changes`})),await V(()=>z(t.getByText(`Failed to save changes. See notification for details.`)).toBeInTheDocument())}),await z(t.getByText(`Edit advance comic #${U.comic}`)).toBeInTheDocument()}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  loaders: [() => {
    store.dispatch(setLatestComic(2500));
  }],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByLabelText('Comic ID')).toHaveValue(2501));
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('heading', {
      name: 'Add advance comic'
    })).toBeInTheDocument());

    // Reuse the pending comic's id so the edit-mode GET mock resolves,
    // proving the dialog switches straight into edit mode (with items
    // available to add) right after a successful create — no need for
    // a second click on the newly-listed pending comic.
    const comicIdInput = canvas.getByLabelText('Comic ID');
    await userEvent.clear(comicIdInput);
    await userEvent.type(comicIdInput, String(PENDING_COMIC.comic));
    await userEvent.type(canvas.getByLabelText('Title'), 'A new comic');
    await userEvent.click(canvas.getByLabelText('Accurate date'));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Add advance comic'
    }));
    await waitFor(() => expect(canvas.getByRole('heading', {
      name: \`Edit advance comic #\${PENDING_COMIC.comic}\`
    })).toBeInTheDocument(), {
      timeout: 3000
    });
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(\`#\${PENDING_COMIC.comic} — \${PENDING_COMIC.title}\`)).toBeInTheDocument());

    // Selecting a pending advance comic must not go through the normal
    // comic-navigation state, since that would push real browser
    // history to the unpublished comic's URL on the live site.
    await userEvent.click(canvas.getByText(\`#\${PENDING_COMIC.comic} — \${PENDING_COMIC.title}\`));
    await waitFor(() => expect(canvas.getByText(\`Edit advance comic #\${PENDING_COMIC.comic}\`)).toBeInTheDocument());
    await expect(store.getState().comic.current).toEqual(0);
    await waitFor(() => expect(canvas.getByDisplayValue(PENDING_COMIC.title)).toBeInTheDocument());
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/comicdata/advance', () => {
        return HttpResponse.json([]);
      }), http.post('http://localhost:3000/api/v3/comicdata/advance', async () => {
        await mockNetworkDelay(500);
        return HttpResponse.text('Server Error', {
          status: 500
        });
      })]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('heading', {
      name: 'Add advance comic'
    })).toBeInTheDocument());
    const comicIdInput = canvas.getByLabelText('Comic ID');
    await userEvent.clear(comicIdInput);
    await userEvent.type(comicIdInput, '5003');
    await userEvent.type(canvas.getByLabelText('Title'), 'A new comic');
    await withSuppressedExpectedErrorAsync('Got unexpected response from server', async () => {
      await userEvent.click(canvas.getByRole('button', {
        name: 'Add advance comic'
      }));
      await waitFor(() => expect(canvas.getByText('Failed to add advance comic. See notification for details.')).toBeInTheDocument());
    });

    // The dialog must stay in create mode - it never navigates into
    // edit mode on a failed add.
    await expect(canvas.getByRole('heading', {
      name: 'Add advance comic'
    })).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(\`#\${PENDING_COMIC.comic} — \${PENDING_COMIC.title}\`));
    await waitFor(() => expect(canvas.getByText(\`Edit advance comic #\${PENDING_COMIC.comic}\`)).toBeInTheDocument());

    // Faye is already present on the mocked comic (item id 4). Removing
    // her must hit the comic-id-scoped removeItem mutation directly,
    // never touching comic navigation state.
    const removeFayeButton = await canvas.findByTitle('Remove Faye from comic');
    await userEvent.click(removeFayeButton);

    // Claire is not present on the mocked comic. Adding her via the
    // filter/add flow must likewise stay comic-id-scoped.
    const filterInput = canvas.getByPlaceholderText('Filter non-present');
    await userEvent.type(filterInput, 'Claire');
    const addClaireButton = await waitFor(() => canvas.getByTitle('Add Claire to comic'));
    await userEvent.click(addClaireButton);
    await expect(store.getState().comic.current).toEqual(0);
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(\`#\${PENDING_COMIC.comic} — \${PENDING_COMIC.title}\`));
    const saveButton = await waitFor(() => canvas.getByRole('button', {
      name: 'Save changes'
    }));

    // Nothing has been edited yet, so there's nothing to save.
    await expect(saveButton).toBeDisabled();
    const titleInput = canvas.getByLabelText('Title');
    await userEvent.type(titleInput, ' (edited)');
    await waitFor(() => expect(saveButton).toBeEnabled());

    // Reverting the edit back to the original value means the form is
    // clean again, so saving should be disabled once more.
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, PENDING_COMIC.title);
    await waitFor(() => expect(saveButton).toBeDisabled());
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(\`#\${PENDING_COMIC.comic} — \${PENDING_COMIC.title}\`));
    await waitFor(() => expect(canvas.getByText('Title')).toBeInTheDocument());

    // Untouched fields show their plain label, with no trailing marker.
    await expect(canvas.getByText('Title')).not.toHaveClass('italic');
    await expect(canvas.queryByText('Title*')).not.toBeInTheDocument();
    const titleInput = canvas.getByLabelText('Title');
    await userEvent.type(titleInput, ' (edited)');

    // Once edited, the label switches to the dirty presentation: italic
    // text with a trailing \`*\`, matching the regular comic editor.
    await waitFor(() => expect(canvas.getByText('Title*')).toHaveClass('italic'));
    const guestComicLabel = canvas.getByText('Guest comic');
    await expect(guestComicLabel).not.toHaveClass('italic');
    await userEvent.click(canvas.getByLabelText('Guest comic'));
    await waitFor(() => expect(canvas.getByText('Guest comic*')).toHaveClass('italic'));
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(\`#\${PENDING_COMIC.comic} — \${PENDING_COMIC.title}\`));
    await waitFor(() => expect(canvas.getByRole('button', {
      name: 'Save changes'
    })).toBeInTheDocument());
    let patchedBody: unknown;
    getWorker().use(http.patch('http://localhost:3000/api/v3/comicdata/:comicId', async ({
      request
    }) => {
      patchedBody = await request.json();
      return HttpResponse.text('"Comic updated"');
    }));

    // Only the title is touched; every other field is left as loaded.
    // The patch request should therefore only carry \`title\` — sending
    // unmodified fields would make the backend log spurious "changed
    // from X to X" entries for every one of them.
    const titleInput = canvas.getByLabelText('Title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'An edited title');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save changes'
    }));
    await waitFor(() => expect(patchedBody).toEqual({
      title: 'An edited title'
    }));
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/comicdata/advance', () => {
        return HttpResponse.json([{
          comic: PENDING_COMIC.comic,
          title: PENDING_COMIC.title,
          tagline: PENDING_COMIC.tagline,
          publishDate: PENDING_COMIC.publishDate
        }]);
      }), http.get('http://localhost:3000/api/v3/comicdata/:comicId', ({
        params
      }) => {
        const {
          comicId
        } = params;
        if (Number(comicId) === PENDING_COMIC.comic) {
          return HttpResponse.json({
            ...PENDING_COMIC,
            allItems: ALL_ITEMS.map(item => ({
              id: item.id,
              first: item.id,
              previous: null,
              next: null,
              last: item.id
            }))
          });
        }
        return HttpResponse.json({
          comic: Number(comicId),
          editorData: {
            present: false
          },
          hasData: false
        });
      }), http.get('http://localhost:3000/api/v3/itemdata/', () => {
        return HttpResponse.json(ALL_ITEMS);
      }), http.patch('http://localhost:3000/api/v3/comicdata/:comicId', async () => {
        await mockNetworkDelay(500);
        return HttpResponse.text('Server Error', {
          status: 500
        });
      })]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText(\`#\${PENDING_COMIC.comic} — \${PENDING_COMIC.title}\`));
    await waitFor(() => expect(canvas.getByRole('button', {
      name: 'Save changes'
    })).toBeInTheDocument());

    // Save changes is disabled until something is actually edited.
    await userEvent.type(canvas.getByLabelText('Title'), ' (edited)');
    await withSuppressedExpectedErrorAsync('Got unexpected response from server', async () => {
      await userEvent.click(canvas.getByRole('button', {
        name: 'Save changes'
      }));
      await waitFor(() => expect(canvas.getByText('Failed to save changes. See notification for details.')).toBeInTheDocument());
    });

    // A failed save must stay on the edit screen rather than going back.
    await expect(canvas.getByText(\`Edit advance comic #\${PENDING_COMIC.comic}\`)).toBeInTheDocument();
  }
}`,...$.parameters?.docs?.source}}},be=[`Default`,`ComicIdDefaultsToLatestPlusOne`,`CreateComicEntersEditMode`,`EditPendingComic`,`AddFails`,`EditPendingComicItems`,`SaveDisabledUntilChanged`,`DirtyFieldsAreMarked`,`SaveOnlySendsChangedFields`,`SaveFails`]}))();export{J as AddFails,G as ComicIdDefaultsToLatestPlusOne,K as CreateComicEntersEditMode,W as Default,Z as DirtyFieldsAreMarked,q as EditPendingComic,Y as EditPendingComicItems,X as SaveDisabledUntilChanged,$ as SaveFails,Q as SaveOnlySendsChangedFields,be as __namedExportsOrder,ye as default};