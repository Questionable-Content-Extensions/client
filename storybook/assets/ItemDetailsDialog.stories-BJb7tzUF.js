import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{i as r,t as i}from"./core-BZngjW6Y.js";import{n as a,r as o}from"./constants-BeXrtu-O.js";import{n as ee,t as s}from"./Settings-BA56IXRs.js";import{B as c,C as l,D as te,K as ne,M as re,N as u,O as ie,R as d,T as ae,Z as oe,h as se,i as f,it as ce,j as le,lt as ue,n as de,o as p,ot as m,p as fe,qt as h,r as g,s as _,st as v,t as y,ut as pe,v as me,w as b,z as x}from"./iframe-BUsqzLvk.js";import{D as S,a as C,c as he,d as w,f as ge,l as T,t as E,u as D}from"./mocks-E977bbNC.js";import{n as O,t as _e}from"./mockNetworkDelay-BJNPRY8o.js";import{n as ve,t as ye}from"./testUtils-UIS43-hk.js";import{n as be,t as k}from"./Button-DMUzCpJg.js";import{t as A}from"./query-Dd3NvAg0.js";import{n as xe,r as j,t as M}from"./hooks-DNVZbieZ.js";import{n as N,t as Se}from"./ModalDialog-DARihu8Y.js";import{n as Ce,t as P}from"./useHydratedItemData-j8gt0QF3.js";import{r as we,t as F}from"./logApiSlice-Cr2MkIzd.js";import{n as I,t as Te}from"./EditLogPanel-DfmxncUi.js";import{n as L,t as Ee}from"./Pagination-dt2-M7_3.js";import{i as De,n as Oe,r as ke,t as Ae}from"./ComicList-BXwQKt7L.js";import{i as je,r as Me}from"./ItemImageViewer-CRdMjF83.js";import{n as Ne,t as Pe}from"./ItemDataPanel-Dwwhy5Ct.js";function Fe({onClose:e,initialItemId:t}){let n=xe(),r=j(e=>e.settings.values),i=j(e=>e.itemEditor.id),o=j(e=>fe(e)),ee=j(e=>e.itemEditor.type),s=j(e=>e.itemEditor.startComicId),l=j(e=>e.itemEditor.endComicId),ne=ee===`storyline`&&l!==null&&l<s,u=j(e=>e.comic.current),d=j(e=>e.comic.lockedToItem),f=j(e=>e.itemEditor.name),[ue,de]=(0,R.useState)(null),[p,m]=(0,R.useState)(null),[h,g]=(0,R.useState)(1);ue!==t&&(de(t),m(t),g(1));let{itemData:_,imageData:v,friendData:y,locationData:pe,isError:b,isFetching:x}=ae(p?{itemId:p}:z.skipToken),S=(0,R.useRef)(_);(0,R.useEffect)(()=>{_&&!o&&(_.id!==i||_!==S.current)&&(S.current=_,n(me(_)))},[_,i,o,n]);let[C,{isLoading:he}]=ie(),[w,{isLoading:ge}]=le(),{comicItems:T,isFetching:E,isError:D}=Ce(r?.editMode??!1?u:0,r),O=(0,R.useMemo)(()=>!!T&&T.find(e=>e.id===p)!==void 0,[T,p]),[_e]=oe(),[ve]=ce(),[ye,{isLoading:be}]=re(),A=(0,R.useMemo)(()=>b||D?`Error`:x?`Loading...`:f??`Loading...`,[D,b,x,f]),{data:M,isLoading:N,isFetching:P,isError:F}=we(_&&r?.editMode&&p?{page:h,id:p}:z.skipToken),[I,L]=(0,R.useState)(!1),{data:De,isLoading:Oe}=te(I&&p?{itemId:p}:z.skipToken);return(0,B.jsx)(Se,{onCloseClicked:e,header:(0,B.jsx)(`h5`,{className:`m-0 text-xl font-medium leading-normal text-gray-800`,children:A}),body:(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(Pe,{itemDataUrl:a.webserviceBaseUrl+a.itemDataEndpoint,itemData:_??null,itemImageData:v??null,itemFriendData:y??null,itemLocationData:pe??null,editModeToken:r?.editMode?r?.editModeToken:null,onGoToComic:(t,r)=>{n(c(t,{locked:r})),e()},onShowItemData:e=>{L(!1),m(e)},onDeleteImage:e=>{C({itemId:i,imageId:e})},onSetPrimaryImage:e=>w({itemId:i,body:{imageId:e}}),hasError:b||D,onUploadImage:async e=>{await ye(e).unwrap()},isUploadingImage:be}),(0,B.jsx)(ke,{summary:`Comics item is featured in`,onToggle:e=>{L(e.currentTarget.open)},initiallyOpen:I,children:(0,B.jsx)(Ae,{allComicData:De??[],isLoading:Oe,subDivideGotoComics:r?.subDivideGotoComics??!0,onGoToComic:t=>{L(!1),n(c(t,{locked:d&&_?d===_.id:!1})),e()}})}),r?.editMode?(0,B.jsxs)(ke,{summary:`Edit log for item`,children:[(0,B.jsx)(Te,{logs:M,isLoading:N,isFetching:P,hasError:F,useCorrectTimeFormat:r?.useCorrectTimeFormat??!0}),M&&M.pageCount>1?(0,B.jsx)(`div`,{className:`flex justify-center`,children:(0,B.jsx)(Ee,{page:h,count:M.pageCount,isFetching:P,onGoToPage:e=>g(e),boundaryCount:2,siblingCount:2})}):(0,B.jsx)(B.Fragment,{})]}):(0,B.jsx)(B.Fragment,{})]}),footer:(0,B.jsxs)(B.Fragment,{children:[r?.editMode??!1?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(k,{onClick:()=>{O?ve({comicId:u,itemId:p}):_e({comicId:u,new:!1,itemId:p})},disabled:E,children:E?`Loading...`:O?`Remove item from current comic`:`Add item to current comic`}),(0,B.jsx)(k,{className:`ml-2`,disabled:!o||ne,onClick:()=>n(se()),children:o?`Save changes`:`No changes`})]}):(0,B.jsx)(B.Fragment,{}),(0,B.jsx)(k,{onClick:e,children:`Close`})]})})}var R,z,B,Ie=t((()=>{R=e(n()),be(),I(),L(),De(),Oe(),P(),N(),z=A(),ne(),l(),F(),x(),M(),_(),o(),Ne(),B=y(),Fe.__docgenInfo={description:``,methods:[],displayName:`ItemDetailsDialog`,props:{onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},initialItemId:{required:!0,tsType:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},description:``}}}}));function Le(){J={...q}}function Re(){return[r.get(`http://localhost:3000/api/v3/itemdata/:itemId`,async()=>(await O(),h.json(J))),r.patch(`http://localhost:3000/api/v3/itemdata/:itemId`,async({request:e})=>{let t=await e.json();return J={...J,...t.startComicId===void 0?{}:{startComicId:t.startComicId},...t.endComicId===void 0?{}:{endComicId:t.endComicId}},await O(),h.json(J)})]}var V,H,U,W,G,K,q,J,ze,Y,X,Z,Q,$,Be;t((()=>{i(),l(),pe(),x(),u(),m(),f(),ee(),S(),_e(),de(),ye(),je(),Ie(),{expect:V,waitFor:H,within:U}=__STORYBOOK_MODULE_TEST__,W=[r.get(`http://localhost:3000/api/v3/itemdata/`,()=>{let e=[...E],t=`This is a mocked API response and will only be accurate for comic 666`;return e.push({id:-1,name:t,shortName:t,count:0,type:`storyline`,color:`ffaabb`,startComicId:null,endComicId:null}),h.json(e)}),r.get(`http://localhost:3000/api/v3/comicdata/:comicId`,async({params:e})=>{let{comicId:t}=e;if(await O(),t===`666`)return h.json(C);{let e={...C,items:[...C.items,{id:-1,first:0,last:0,next:0,previous:0}]};return h.json(e)}}),r.get(`http://localhost:3000/api/v3/itemdata/:itemId`,async()=>(await O(),h.json(he))),r.patch(`http://localhost:3000/api/v3/itemdata/:itemId`,async()=>(await O(),h.text(`Fake success!`))),r.get(`http://localhost:3000/api/v3/itemdata/:itemId/comics`,async()=>(await O(),h.json(T))),r.get(`http://localhost:3000/api/v3/itemdata/:itemId/images`,async()=>(await O(),h.json(ge))),r.get(`http://localhost:3000/api/v3/itemdata/:itemId/friends`,async()=>(await O(),h.json(w))),r.get(`http://localhost:3000/api/v3/itemdata/:itemId/locations`,async()=>(await O(),h.json(w))),r.get(`http://localhost:3000/api/v3/itemdata/image/:imageId`,async()=>{let e=await fetch(Me).then(e=>e.arrayBuffer());return await O(),new h(e,{headers:{"Content-Length":e.byteLength.toString(),"Content-Type":`image/png`}})}),r.delete(`http://localhost:3000/api/v3/itemdata/image/:imageId`,async()=>(await O(),h.text(`Image deleted`))),r.post(`http://localhost:3000/api/v3/itemdata/:itemId/images/primary`,async()=>(await O(),h.text(`Image set as primary`))),r.post(`http://localhost:3000/api/v3/comicdata/additem`,async()=>(await O(),h.text(`Item added to comic`))),r.post(`http://localhost:3000/api/v3/comicdata/removeitem`,async()=>(await O(),h.text(`Item removed from comic`))),r.get(`http://localhost:3000/api/v3/log/item`,async({request:e})=>{let t=Number(new URL(e.url).searchParams.get(`page`));return await O(),h.json({...D,page:t})})],G=async()=>(await O(),h.text(`Server Error`,{status:500})),K=[r.get(`http://localhost:3000/api/v3/itemdata/`,G),r.get(`http://localhost:3000/api/v3/itemdata/:itemId`,G),r.patch(`http://localhost:3000/api/v3/itemdata/:itemId`,G),r.get(`http://localhost:3000/api/v3/itemdata/:itemId/images`,G),r.get(`http://localhost:3000/api/v3/itemdata/:itemId/friends`,G),r.get(`http://localhost:3000/api/v3/itemdata/:itemId/locations`,G),r.get(`http://localhost:3000/api/v3/itemdata/image/:imageId`,G),r.delete(`http://localhost:3000/api/v3/itemdata/image/:imageId`,G),r.post(`http://localhost:3000/api/v3/comicdata/additem`,G),r.post(`http://localhost:3000/api/v3/comicdata/removeitem`,G),r.get(`http://localhost:3000/api/v3/log/item`,G)],q={id:4,shortName:`Test Arc`,name:`Test Arc`,type:`storyline`,color:`ffaabb`,startComicId:100,endComicId:110,first:100,last:109,appearances:10,totalComics:10,presence:100,hasImage:!1,primaryImage:null},J={...q},ze={component:Fe,args:{initialItemId:4,onClose:()=>{alert(`In the userscript, this window would close now.`)}},loaders:[e=>{let t=p.getState();p.dispatch(ue.util.resetApiState()),(!t.dialog.showItemDetailsDialogFor||t.dialog.showItemDetailsDialogFor!==e.args.initialItemId)&&p.dispatch(d(e.args.initialItemId)),t.comic.current!==666&&p.dispatch(c(666))}]},Y={parameters:{msw:{handlers:W}},loaders:[()=>{p.dispatch(v(s.DEFAULTS))}]},X={parameters:{msw:{handlers:W}},loaders:[()=>{p.dispatch(v({...s.DEFAULTS,editMode:!0,editModeToken:`00000000-0000-0000-0000-000000000000`}))}]},Z={parameters:{msw:{handlers:K}},loaders:[()=>{p.dispatch(v(s.DEFAULTS))}],play:async({canvasElement:e})=>{let t=U(e);await ve(`Got unexpected response from server`,async()=>{await H(()=>V(t.getAllByText(/An error occurred loading the item data/)[0]).toBeInTheDocument(),{timeout:15e3}),await g(15e3)})}},Q={parameters:{msw:{handlers:W}},loaders:[()=>{p.dispatch(v(s.DEFAULTS))}],play:async({canvasElement:e})=>{let t=U(e);(await H(()=>t.getByText(`Comics item is featured in`))).click(),(await H(()=>t.getByText(/Comic 4805:/),{timeout:15e3})).click(),await H(()=>V(p.getState().comic.current).toBe(4805))}},$={parameters:{msw:{handlers:[...Re(),...W]}},loaders:[()=>{Le(),p.dispatch(v({...s.DEFAULTS,editMode:!0,editModeToken:`00000000-0000-0000-0000-000000000000`}))}],play:async({canvasElement:e})=>{let t=U(e);await H(()=>V(t.getByLabelText(/End comic/)).toHaveValue(109),{timeout:15e3}),await p.dispatch(b.endpoints.patchItem.initiate({item:4,body:{endComicId:121}})),await H(()=>V(t.getByLabelText(/End comic/)).toHaveValue(120),{timeout:15e3})}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: successHandlers
    }
  },
  loaders: [() => {
    store.dispatch(setSettings(Settings.DEFAULTS));
  }]
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: successHandlers
    }
  },
  loaders: [() => {
    store.dispatch(setSettings({
      ...Settings.DEFAULTS,
      editMode: true,
      editModeToken: '00000000-0000-0000-0000-000000000000'
    }));
  }]
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: errorHandlers
    }
  },
  loaders: [() => {
    store.dispatch(setSettings(Settings.DEFAULTS));
  }],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // All \`errorHandlers\` respond 500, which the store logs via
    // apiSlice's \`error(...)\` call - expected here, so suppress it to
    // keep it from showing up as test-runner noise.
    await withSuppressedExpectedErrorAsync('Got unexpected response from server', async () => {
      await waitFor(() => expect(canvas.getAllByText(/An error occurred loading the item data/)[0]).toBeInTheDocument(), {
        timeout: 15000
      });

      // The error text can render as soon as the *first* query
      // fails, while slower ones are still in flight - keep
      // suppressing until all of them have settled too, so their
      // logs can't leak into the next story's captured output.
      await waitForPendingQueriesToSettle(15000);
    });
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: successHandlers
    }
  },
  loaders: [() => {
    store.dispatch(setSettings(Settings.DEFAULTS));
  }],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const summary = await waitFor(() => canvas.getByText('Comics item is featured in'));
    summary.click();
    const comicButton = await waitFor(() => canvas.getByText(/Comic 4805:/), {
      timeout: 15000
    });
    comicButton.click();
    await waitFor(() => expect(store.getState().comic.current).toBe(4805));
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [...createResyncTestHandlers(), ...successHandlers]
    }
  },
  loaders: [() => {
    resetResyncTestState();
    store.dispatch(setSettings({
      ...Settings.DEFAULTS,
      editMode: true,
      editModeToken: '00000000-0000-0000-0000-000000000000'
    }));
  }],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // \`endComicId\` 110 is exclusive on the wire, displayed as the
    // inclusive 109 in the editor.
    await waitFor(() => expect(canvas.getByLabelText(/End comic/)).toHaveValue(109), {
      timeout: 15000
    });

    // Simulate another part of the UI (e.g. ItemNavigation's
    // "attach out-of-range storyline" flow) patching this same item's
    // endComicId while this dialog is still open on it — this must
    // re-sync the editor fields, not leave them showing stale data.
    await store.dispatch(itemApiSlice.endpoints.patchItem.initiate({
      item: 4,
      body: {
        endComicId: 121
      }
    }));
    await waitFor(() => expect(canvas.getByLabelText(/End comic/)).toHaveValue(120), {
      timeout: 15000
    });
  }
}`,...$.parameters?.docs?.source}}},Be=[`Default`,`Editor`,`Error`,`NavigatesToFeaturedComic`,`ResyncsAfterBackgroundPatch`]}))();export{Y as Default,X as Editor,Z as Error,Q as NavigatesToFeaturedComic,$ as ResyncsAfterBackgroundPatch,Be as __namedExportsOrder,ze as default};