import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from "react";
import {api} from "../data/api";
type Language="es"|"yua";
const Context=createContext<{language:Language;setLanguage:(l:Language)=>void;pending:boolean;error:string}>({language:"es",setLanguage:()=>{},pending:false,error:""});
type Entry={element:Node;attribute?:string;source:string;applied?:string};
const excluded='[translate="no"], [data-no-translate], script, style, textarea, code, pre, option[value="yua"]';
export function LanguageProvider({children}:{children:ReactNode}) {
 const [language,setLang]=useState<Language>(()=>{try{return localStorage.getItem("voces-language")==="yua"?"yua":"es";}catch{return "es";}});
 const [pending,setPending]=useState(false);const [error,setError]=useState("");const cache=useRef(new Map<string,string>());const entries=useRef(new Map<Node,Map<string,Entry>>());const epoch=useRef(0);
 function setLanguage(l:Language){setLang(l);setError("");try{localStorage.setItem("voces-language",l);}catch{}}
 useEffect(()=>{
  const generation=++epoch.current;let stopped=false,running=false,again=false,timer:ReturnType<typeof setTimeout>;
  document.documentElement.lang=language;
  function value(e:Entry){return e.attribute?(e.element as Element).getAttribute(e.attribute)||"":e.element.nodeValue||"";}
  function put(e:Entry,v:string){if(value(e)===v)return;if(e.attribute)(e.element as Element).setAttribute(e.attribute,v);else e.element.nodeValue=v;}
  function collect():Entry[]{
   for(const [node] of entries.current)if(!node.isConnected)entries.current.delete(node);
   const found:Entry[]=[];
   function add(node:Node,attribute?:string){const parent=node instanceof Element?node:node.parentElement;if(!parent||parent.closest(excluded))return;const key=attribute||"text";const current=attribute?(node as Element).getAttribute(attribute)||"":node.nodeValue||"";
    if(!/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(current)||/^(https?:|\/|\S+@\S+)/.test(current.trim())||current.trim().length<2||current.length>3000)return;
    let map=entries.current.get(node);if(!map){map=new Map();entries.current.set(node,map);}let e=map.get(key);
    if(!e||current!==e.applied){e={element:node,attribute,source:current};map.set(key,e);}found.push(e);
   }
   const walk=document.createTreeWalker(document.getElementById("root")!,NodeFilter.SHOW_TEXT);let n:Node|null;while((n=walk.nextNode()))add(n);
   document.querySelectorAll('#root [placeholder],#root [aria-label],#root [title],#root img[alt]').forEach(el=>{for(const a of ["placeholder","aria-label","title","alt"])if(el.hasAttribute(a))add(el,a);});return found;
  }
  async function run(){if(stopped)return;if(running){again=true;return;}running=true;
   try {let all=collect();if(language==="es"){all.forEach(e=>{put(e,e.source);e.applied=e.source;});setPending(false);return;}
    const needed=[...new Set(all.map(e=>e.source.trim()))].filter(s=>!cache.current.has(s));if(needed.length)setPending(true);
    // Small batches are accepted by Azure v3 and avoid repeatedly translating the same labels.
    while(needed.length&&!stopped){const texts:string[]=[];let size=0;while(needed.length&&texts.length<25&&size+needed[0].length<=4500){const t=needed.shift()!;texts.push(t);size+=t.length;}
     if(!texts.length)break;const result=await api<{texts:string[]}>("translate/page","POST",{texts});if(stopped||generation!==epoch.current)return;
     if(result.texts.length!==texts.length)throw new Error("No se pudo completar la traducción de la página.");texts.forEach((t,i)=>cache.current.set(t,result.texts[i]));
     all.forEach(e=>{const t=cache.current.get(e.source.trim());if(t&&e.element.isConnected&&(value(e)===e.source||value(e)===e.applied)){const before=e.source.match(/^\s*/)?.[0]||"";const after=e.source.match(/\s*$/)?.[0]||"";put(e,before+t+after);e.applied=before+t+after;}});
    }
    all.forEach(e=>{const t=cache.current.get(e.source.trim());if(t&&e.element.isConnected&&(value(e)===e.source||value(e)===e.applied)){const before=e.source.match(/^\s*/)?.[0]||"";const after=e.source.match(/\s*$/)?.[0]||"";put(e,before+t+after);e.applied=before+t+after;}});
    setError("");
   }catch(e){if(!stopped)setError(`Traducción incompleta: ${(e as Error).message}`);}
   finally{running=false;if(!stopped){setPending(false);if(again){again=false;timer=setTimeout(()=>void run(),250);}}}
  }
  const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>void run(),350);});observer.observe(document.getElementById("root")!,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["placeholder","aria-label","title","alt"]});void run();
  return ()=>{stopped=true;observer.disconnect();clearTimeout(timer);};
 },[language]);
 return <Context.Provider value={{language,setLanguage,pending,error}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);
