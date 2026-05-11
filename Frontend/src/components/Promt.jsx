import React, { useState, useEffect, useRef } from "react";
import { Paperclip, ArrowUp, Globe, Bot  } from "lucide-react";
import Logo from "../assets/Logo.png";
import axios from 'axios'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../components/Promt.css"


function Promt() {
  const [inputValue, setInputValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

  const [promt,setPromt]=useState([]);
  const [loading,setLoading]=useState(false)
   const promtEndRef = useRef();

  console.log(promt)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const storedPromt = localStorage.getItem(`promtHistory_${user._id}`);
      if (storedPromt) {
        setPromt(JSON.parse(storedPromt));
      }
    }
  }, []);

  
   useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(`promtHistory_${user._id}`, JSON.stringify(promt));
    }
  }, [promt]);


   useEffect(() => {
    promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promt, loading]);


  const handleSend = async() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setTypeValue(trimmed);
    setInputValue("");

    setLoading(true)

    try {
      const token=localStorage.getItem("token")
      const {data}= await axios.post("http://localhost:3000/api/promt",
               {prompt:trimmed},{
                headers:{
                  Authorization:`Bearer ${token}`
                },
                withCredentials:true
               }
      )
      setPromt((prev) => [
        ...prev,
        {role:"user",prompt:trimmed},
        {role:"assistant",prompt:data.result}
      ])
    } catch (error) {
      setPromt((prev) => [
        ...prev,
        {role:"user",prompt:trimmed},
        {role:"assistant",prompt:"❌Somtehing went wrong! ,Please try again."}
      ])
    }finally{
         setLoading(false)
         setTypeValue(null)
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };



  return (
    <div className="h-screen overflow-hidden flex flex-col items-center  flex-1  px-4 pb-4 md:pb-8">
      <div className="mt-8 md:mt-16 text-center">
        <div className="flex items-center justify-center gap-1 mr-10">
          <img src={Logo} alt="Logo" className="h-10 md:h-15" />
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Hi I'm Nexa AI
          </h1>
        </div>
        <p className="text-gray-400 text-base md:text-sm mt-2">
          💬 How can I help you today?
        </p>
      </div>
      <div className="w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 
scrollbar-hide max-h-[60vh] px-1">
        {promt.map((msg,index)=>(
          <div key={index} className={`w-full flex ${msg.role === "user"?"justify-end":"justify-start"}`}>
            {msg.role === "assistant"?(<div  className="w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap"><ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2 overflow-auto"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.prompt}
                </ReactMarkdown></div>):(<div className="max-w-[75%] bg-blue-600 text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap break-words self-start">{msg.prompt}</div>)}
          </div>
        ))}
        {loading && typeValue && (
          <div  className="whitespace-pre-wrap px-4 py-3 rounded-2xl text-sm wrap-break-words
           bg-blue-600 text-white self-end ml-auto max-w-[40%]">{typeValue}</div>
        )}
        
        {loading && (
          <div className="flex justify-start w-full">
          <div className="bg-[#232323] text-white px-4 py-2 rounded-xl text-sm animate-pulse">🤖 Thinking...</div>
          </div>
          
        )}
        <div ref={promtEndRef}/>
      </div>
      <div className="w-full max-w-4xl relative mt-auto">
        <div className="bg-[#2f2f2f] rounded-[2rem] px-4 md:px-6 py-6 md:py-8 shadow-md">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=" 💬Message Nexa AI"
            className="bg-transparent w-full text-white placeholder-gray-400 text-base md:text-lg outline-none"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Bot className="w-4 h-4" />
                DeepThink (R1)
              </button>
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Globe className="w-4 h-4" />
                Search
              </button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="text-gray-400 hover:text-white transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                className="bg-gray-500 hover:bg-blue-600 p-2 rounded-full text-white transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promt;
