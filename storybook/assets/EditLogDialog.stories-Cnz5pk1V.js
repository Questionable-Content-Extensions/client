import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{i as r,t as i}from"./core-BZngjW6Y.js";import{n as a,t as o}from"./Settings-BA56IXRs.js";import{I as s,N as c,i as l,lt as u,o as d,ot as f,qt as p,st as m,t as h,ut as g}from"./iframe-BUsqzLvk.js";import{D as _,m as v,s as y}from"./mocks-E977bbNC.js";import{n as b,t as x}from"./mockNetworkDelay-BJNPRY8o.js";import{n as S,t as C}from"./testUtils-UIS43-hk.js";import{n as w,t as T}from"./Button-DMUzCpJg.js";import{t as E}from"./query-Dd3NvAg0.js";import{r as D,t as O}from"./hooks-DNVZbieZ.js";import{n as k,t as A}from"./ModalDialog-DARihu8Y.js";import{i as j,n as M,t as N}from"./logApiSlice-Cr2MkIzd.js";import{n as P,t as F}from"./EditLogPanel-DfmxncUi.js";import{n as I,t as L}from"./Pagination-dt2-M7_3.js";function R(e,t){return e.kind===t.kind?e.kind===`comic`&&t.kind===`comic`?e.comicId===t.comicId:!0:!1}function z({showFor:e,onClose:t}){let n=D(e=>e.settings.values),[r,i]=(0,B.useState)({kind:`closed`}),[a,o]=(0,B.useState)(1);e.kind!==`closed`&&!R(r,e)&&(i(e),o(1));let{data:s,isLoading:c,isFetching:l,isError:u,refetch:d}=j(r.kind===`all`&&n?{page:a}:V.skipToken),{data:f,isLoading:p,isFetching:m,isError:h,refetch:g}=M(r.kind===`comic`&&n?{page:a,id:r.comicId}:V.skipToken),_,v,y,b,x;return r.kind===`comic`?(_=f,v=p,y=m,b=h,x=g):(_=s,v=c,y=l,b=u,x=d),(0,H.jsx)(A,{onCloseClicked:t,header:(0,H.jsxs)(`h5`,{className:`m-0 text-xl font-medium leading-normal text-gray-800`,children:[`Edit log`,r.kind===`comic`?` for comic ${r.comicId}`:``]}),body:(0,H.jsx)(F,{logs:_,isLoading:v,isFetching:y,hasError:b,useCorrectTimeFormat:n?.useCorrectTimeFormat??!0}),footer:(0,H.jsxs)(`div`,{className:`flex w-full justify-end`,children:[(0,H.jsx)(`div`,{className:`flex flex-col justify-center grow`,children:_&&_.pageCount>1&&(0,H.jsx)(`div`,{className:`flex justify-center`,children:(0,H.jsx)(L,{page:a,count:_.pageCount,isFetching:y,onGoToPage:e=>o(e),boundaryCount:2,siblingCount:2})})}),(0,H.jsxs)(`div`,{className:`ml-2`,children:[b&&(0,H.jsx)(T,{onClick:()=>x(),className:`mr-2`,children:`Retry loading logs...`}),(0,H.jsx)(T,{onClick:()=>t(),children:`Close`})]})]})})}var B,V,H,U=t((()=>{B=e(n()),w(),k(),V=E(),N(),O(),P(),I(),H=h(),z.__docgenInfo={description:``,methods:[],displayName:`EditLogDialog`,props:{showFor:{required:!0,tsType:{name:`EditLogDialogTarget`},description:``},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),W,G,K,q,J,Y,X,Z;t((()=>{i(),g(),c(),f(),l(),a(),_(),x(),C(),U(),{expect:W,waitFor:G,within:K}=__STORYBOOK_MODULE_TEST__,q={component:z,argTypes:{showFor:{table:{disable:!0}}},args:{onClose:()=>{alert(`In the userscript, this window would close now.`)}},loaders:[()=>{d.dispatch(u.util.resetApiState())}]},J={args:{showFor:{kind:`all`}},parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/log/`,async({request:e})=>{let t=Number(new URL(e.url).searchParams.get(`page`));return await b(),p.json({...v,page:t})})]}},loaders:[()=>{d.getState().dialog.showEditLogDialogFor.kind===`closed`&&(d.dispatch(s({kind:`all`})),d.dispatch(m({...o.DEFAULTS,editMode:!0,editModeToken:`00000000-0000-0000-0000-000000000000`})))}]},Y={args:{showFor:{kind:`comic`,comicId:4269}},parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/log/comic`,async({request:e})=>{let t=Number(new URL(e.url).searchParams.get(`page`));return await b(),p.json({...y,page:t})})]}},loaders:[()=>{d.getState().dialog.showEditLogDialogFor.kind===`closed`&&(d.dispatch(s({kind:`comic`,comicId:666})),d.dispatch(m({...o.DEFAULTS,editMode:!0,editModeToken:`00000000-0000-0000-0000-000000000000`})))}]},X={args:{showFor:{kind:`all`}},parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/log/`,async()=>(await b(),p.text(`Server Error`,{status:500})))]}},loaders:[()=>{d.getState().dialog.showEditLogDialogFor.kind===`closed`&&(d.dispatch(s({kind:`all`})),d.dispatch(m({...o.DEFAULTS,editMode:!0,editModeToken:`00000000-0000-0000-0000-000000000000`})))}],play:async({canvasElement:e})=>{let t=K(e);await S(`Got unexpected response from server`,async()=>{await G(()=>W(t.getByText(`Retry loading logs...`)).toBeInTheDocument())})}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    showFor: {
      kind: 'all'
    }
  },
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/log/', async ({
        request
      }) => {
        const page = Number(new URL(request.url).searchParams.get('page'));
        await mockNetworkDelay();
        return HttpResponse.json({
          ...LATEST_EDIT_LOG,
          page
        });
      })]
    }
  },
  loaders: [() => {
    const state = store.getState();
    if (state.dialog.showEditLogDialogFor.kind === 'closed') {
      store.dispatch(setShowEditLogDialog({
        kind: 'all'
      }));
      store.dispatch(setSettings({
        ...Settings.DEFAULTS,
        editMode: true,
        editModeToken: '00000000-0000-0000-0000-000000000000'
      }));
    }
  }]
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    showFor: {
      kind: 'comic',
      comicId: 4269
    }
  },
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/log/comic', async ({
        request
      }) => {
        const page = Number(new URL(request.url).searchParams.get('page'));
        await mockNetworkDelay();
        return HttpResponse.json({
          ...EDIT_LOG_COMIC_4269,
          page
        });
      })]
    }
  },
  loaders: [() => {
    const state = store.getState();
    if (state.dialog.showEditLogDialogFor.kind === 'closed') {
      store.dispatch(setShowEditLogDialog({
        kind: 'comic',
        comicId: 666
      }));
      store.dispatch(setSettings({
        ...Settings.DEFAULTS,
        editMode: true,
        editModeToken: '00000000-0000-0000-0000-000000000000'
      }));
    }
  }]
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    showFor: {
      kind: 'all'
    }
  },
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/log/', async () => {
        await mockNetworkDelay();
        return HttpResponse.text('Server Error', {
          status: 500
        });
      })]
    }
  },
  loaders: [() => {
    const state = store.getState();
    if (state.dialog.showEditLogDialogFor.kind === 'closed') {
      store.dispatch(setShowEditLogDialog({
        kind: 'all'
      }));
      store.dispatch(setSettings({
        ...Settings.DEFAULTS,
        editMode: true,
        editModeToken: '00000000-0000-0000-0000-000000000000'
      }));
    }
  }],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await withSuppressedExpectedErrorAsync('Got unexpected response from server', async () => {
      await waitFor(() => expect(canvas.getByText('Retry loading logs...')).toBeInTheDocument());
    });
  }
}`,...X.parameters?.docs?.source}}},Z=[`All`,`Comic`,`Error`]}))();export{J as All,Y as Comic,X as Error,Z as __namedExportsOrder,q as default};