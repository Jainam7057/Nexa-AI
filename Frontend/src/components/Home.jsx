import React, { useState } from "react";

import Sidebar from "./Sidebar.jsx";
import Promt from "./Promt.jsx";

import { Menu } from "lucide-react";

function Home() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="h-screen flex bg-[#1e1e1e] text-white overflow-hidden">

      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <div
        className={`
          fixed md:static top-0 left-0 z-50
          h-full
          w-[280px]
          bg-[#232327]
          border-r border-gray-700
          transform transition-transform duration-300
          ${openSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-[#232327]">

          <button
            onClick={() => setOpenSidebar(true)}
            className="text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-bold">
            Nexa AI
          </h1>

          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-hidden">
          <Promt />
        </div>
      </div>
    </div>
  );
}

export default Home;













// import React from 'react'
// import Sidebar from './Sidebar.jsx'
// import Promt from './Promt.jsx'

// function Home() {
//   return (
//     <div className="flex h-screen bg-[#1e1e1e] text-white">
      
//       <div className="w-64 bg-[#232327]">
//         <Sidebar />
//       </div>

//       <div className="flex-1 flex flex-col w-full">
//         <div  className="flex-1 flex items-center justify-center px-6">
//         <Promt />
//         </div>
//       </div>

//     </div>
//   )
// }

// export default Home;