import { Header, Footer } from "@/components/site-chrome";
import { SandboxDemo } from "@/components/sandbox-demo";
export default function Demo(){return <><Header/><main className="page shell demo-page"><div className="eyebrow">ACCORD SANDBOX</div><h1>Route a test payment.</h1><p className="lede">A merchant asks for exact EUR. A buyer pays test USD. Virtual providers compete, then a signed Value Packet closes the loop.</p><SandboxDemo/></main><Footer/></>}
