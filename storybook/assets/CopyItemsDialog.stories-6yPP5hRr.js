import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{i as r,t as i}from"./core-BZngjW6Y.js";import{B as a,F as o,K as s,N as c,Q as l,i as u,lt as d,nt as f,o as p,qt as m,t as h,ut as g,z as _}from"./iframe-BUsqzLvk.js";import{D as v,E as y,a as b,t as x}from"./mocks-E977bbNC.js";import{n as S,t as C}from"./mockNetworkDelay-BJNPRY8o.js";import{n as w,t as T}from"./testUtils-UIS43-hk.js";import{n as E,t as D}from"./Button-DMUzCpJg.js";import{t as O}from"./query-Dd3NvAg0.js";import{r as k,t as A}from"./hooks-DNVZbieZ.js";import{n as j,t as M}from"./ModalDialog-DARihu8Y.js";import{n as N,t as P}from"./useHydratedItemData-j8gt0QF3.js";import{n as F,t as I}from"./CopyItemsDialogPanel-KF5levo2.js";function L({show:e,onClose:t}){let n=k(e=>e.settings.values),r=k(e=>e.comic.current),i=k(e=>e.dialog.showCopyItemsDialogFor),{data:a,isFetching:o,isLoading:s}=f(e?void 0:z.skipToken),c=(0,R.useMemo)(()=>{if(a){let e=[...a];return e.reverse(),e}},[a]),[u,d]=(0,R.useState)(i),[p,m]=(0,R.useState)(u);u===i?!p&&c&&m(c[0].comic):(d(i),i&&m(i>1?i-1:i));let{comicItems:h,isLoading:g,isFetching:_}=N(p??0,n,e),[v,y]=(0,R.useState)({}),[b,x]=(0,R.useState)(h);if(h!==b&&(x(h),h)){let e={};for(let t of h)e[t.id]=!0;y(e)}let[S,{isLoading:C}]=l(),[w,T]=(0,R.useState)(!1);return(0,B.jsx)(M,{onCloseClicked:t,header:(0,B.jsx)(`h5`,{className:`m-0 text-xl font-medium leading-normal text-gray-800`,children:`Copy items from another comic`}),body:(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(I,{allComics:c,isLoading:s||g,isFetching:o||_||C,selectedComic:p??void 0,comicItems:h,onChangeSelectedComic:m,selectedItems:v,onUpdateSelectedItems:y}),w&&(0,B.jsx)(`p`,{className:`text-red-600 m-0`,children:`Failed to copy items. See notification for details.`})]}),footer:(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(D,{onClick:async()=>{let e=[];for(let t in v)v[t]&&e.push(Number(t));`data`in await S({comicId:r,items:e.map(e=>({new:!1,itemId:e}))})?(T(!1),t()):T(!0)},children:`Copy selected into current comic`}),(0,B.jsx)(D,{onClick:t,children:`Close`})]})})}var R,z,B,V=t((()=>{R=e(n()),E(),P(),j(),z=O(),s(),A(),F(),B=h(),L.__docgenInfo={description:``,methods:[],displayName:`CopyItemsDialog`,props:{show:{required:!0,tsType:{name:`boolean`},description:``},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),H,U,W,G,K,q,J,Y;t((()=>{i(),g(),_(),c(),u(),v(),C(),T(),V(),{expect:H,userEvent:U,waitFor:W,within:G}=__STORYBOOK_MODULE_TEST__,K={component:L,argTypes:{show:{table:{disable:!0}}},args:{show:!0,onClose:()=>{alert(`In the userscript, this window would close now.`)}},parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/itemdata/`,()=>{let e=[...x],t=`This is a mocked API response and will only be accurate for comic 666`;return e.push({id:-1,name:t,shortName:t,count:0,type:`storyline`,color:`ffaabb`,startComicId:null,endComicId:null}),m.json(e)}),r.get(`http://localhost:3000/api/v3/comicdata/:comicId`,async({params:e})=>{let{comicId:t}=e;if(await S(),t===`666`)return m.json(b);{let e={...b,items:[...b.items,{id:-1,first:0,last:0,next:0,previous:0}]};return m.json(e)}}),r.get(`http://localhost:3000/api/v3/comicdata/`,()=>m.json(y(1e3))),r.post(`http://localhost:3000/api/v3/comicdata/additems`,async()=>(await S(),m.text(`Items added to comic`)))]}},loaders:[()=>{p.dispatch(d.util.resetApiState());let e=p.getState();e.dialog.showCopyItemsDialogFor||p.dispatch(o(666)),e.comic.current!==667&&p.dispatch(a(667))}]},q={},J={parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/itemdata/`,()=>m.json(x)),r.get(`http://localhost:3000/api/v3/comicdata/:comicId`,()=>m.json(b)),r.get(`http://localhost:3000/api/v3/comicdata/`,()=>m.json(y(1e3))),r.post(`http://localhost:3000/api/v3/comicdata/additems`,async()=>(await S(500),m.text(`Server Error`,{status:500})))]}},play:async({canvasElement:e})=>{let t=G(e);await W(()=>H(t.getByRole(`heading`,{name:`Copy items from another comic`})).toBeInTheDocument()),await W(()=>H(t.getByRole(`button`,{name:`Copy selected into current comic`})).not.toBeDisabled()),await w(`Got unexpected response from server`,async()=>{await U.click(t.getByRole(`button`,{name:`Copy selected into current comic`})),await W(()=>H(t.getByText(`Failed to copy items. See notification for details.`)).toBeInTheDocument())}),await H(t.getByRole(`heading`,{name:`Copy items from another comic`})).toBeInTheDocument()}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/itemdata/', () => {
        return HttpResponse.json(ALL_ITEMS);
      }), http.get('http://localhost:3000/api/v3/comicdata/:comicId', () => {
        return HttpResponse.json(COMIC_DATA_666);
      }), http.get('http://localhost:3000/api/v3/comicdata/', () => {
        return HttpResponse.json(getComicListMocks(1000));
      }), http.post('http://localhost:3000/api/v3/comicdata/additems', async () => {
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
      name: 'Copy items from another comic'
    })).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByRole('button', {
      name: 'Copy selected into current comic'
    })).not.toBeDisabled());
    await withSuppressedExpectedErrorAsync('Got unexpected response from server', async () => {
      await userEvent.click(canvas.getByRole('button', {
        name: 'Copy selected into current comic'
      }));
      await waitFor(() => expect(canvas.getByText('Failed to copy items. See notification for details.')).toBeInTheDocument());
    });

    // A failed copy must not close the dialog.
    await expect(canvas.getByRole('heading', {
      name: 'Copy items from another comic'
    })).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source}}},Y=[`Default`,`CopyFails`]}))();export{J as CopyFails,q as Default,Y as __namedExportsOrder,K as default};