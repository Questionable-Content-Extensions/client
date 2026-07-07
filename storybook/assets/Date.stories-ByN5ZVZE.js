import{c as e,i as t}from"./preload-helper-B45gAKPr.js";import{t as n}from"./react-DoC9vUy4.js";import{i as r,t as i}from"./core-BZngjW6Y.js";import{$ as a,B as o,K as s,Y as c,gt as l,ht as u,i as d,lt as f,o as p,qt as m,t as h,ut as g,z as _}from"./iframe-BUsqzLvk.js";import{D as v,a as y}from"./mocks-E977bbNC.js";import{n as b,t as x}from"./mockNetworkDelay-BJNPRY8o.js";import{n as S,t as C}from"./testUtils-UIS43-hk.js";import{t as w}from"./query-Dd3NvAg0.js";import{r as T,t as E}from"./hooks-DNVZbieZ.js";import{n as D,t as O}from"./InlineSpinner-DA-ECL0e.js";function k(){let e=T(e=>e.settings.values),t=T(e=>e.comic.current),{data:n,isLoading:r,isFetching:i,isError:o}=a(t===0||!e?j.skipToken:c(t,e)),[s,l]=(0,A.useMemo)(()=>{let e=null,t=!1;return!r&&n?.hasData&&(t=!n.isAccuratePublishDate,n.publishDate&&(e=new Date(n.publishDate))),[e,t]},[n,r]),d=(0,A.useMemo)(()=>{let t=e?.useCorrectTimeFormat??!0;return s?`${u(s,t)}${s&&l?` (Approximately)`:``}`:null},[s,l,e]);return o?(0,M.jsx)(`div`,{className:`qc-ext qc-ext-date`,children:(0,M.jsx)(`div`,{className:`media-object`,children:(0,M.jsx)(`b`,{className:`text-red-500`,children:`Error loading comic data`})})}):(0,M.jsx)(`div`,{className:`qc-ext qc-ext-date`,children:(0,M.jsx)(`div`,{className:`media-object`,children:(0,M.jsxs)(`b`,{children:[d,r?(0,M.jsxs)(M.Fragment,{children:[`Loading...`,(0,M.jsx)(`span`,{className:`inline-block align-middle`,children:(0,M.jsx)(O,{})})]}):i?(0,M.jsx)(`span`,{className:`inline-block align-middle`,children:(0,M.jsx)(O,{})}):(0,M.jsx)(M.Fragment,{})]})})})}var A,j,M,N=t((()=>{A=e(n()),D(),j=w(),s(),E(),l(),M=h(),k.__docgenInfo={description:``,methods:[],displayName:`DateComponent`}})),P,F,I,L,R,z,B,V;t((()=>{i(),g(),_(),d(),v(),x(),C(),N(),P=h(),{expect:F,waitFor:I,within:L}=__STORYBOOK_MODULE_TEST__,R={component:k,render:()=>(0,P.jsx)(`div`,{className:`relative inline-block mt-4 mr-4`,children:(0,P.jsx)(k,{})}),loaders:[()=>{p.dispatch(f.util.resetApiState()),p.getState().comic.current===0&&p.dispatch(o(666))}]},z={parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/comicdata/:comicId`,async()=>(await b(),m.json(y)))]}}},B={parameters:{msw:{handlers:[r.get(`http://localhost:3000/api/v3/comicdata/:comicId`,async()=>(await b(),m.text(`Error!`,{status:500})))]}},play:async({canvasElement:e})=>{let t=L(e);await S(`Got unexpected response from server`,async()=>{await I(()=>F(t.getByText(`Error loading comic data`)).toBeInTheDocument())})}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/comicdata/:comicId', async () => {
        // We pretend this takes 1-2 seconds so we get to
        // observe the loading UX
        await mockNetworkDelay();
        return HttpResponse.json(COMIC_DATA_666);
      })]
    }
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get('http://localhost:3000/api/v3/comicdata/:comicId', async () => {
        await mockNetworkDelay();
        return HttpResponse.text('Error!', {
          status: 500
        });
      })]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await withSuppressedExpectedErrorAsync('Got unexpected response from server', async () => {
      await waitFor(() => expect(canvas.getByText('Error loading comic data')).toBeInTheDocument());
    });
  }
}`,...B.parameters?.docs?.source}}},V=[`Default`,`Error`]}))();export{z as Default,B as Error,V as __namedExportsOrder,R as default};