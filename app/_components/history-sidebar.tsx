"use client";

import React, { useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight, FileClock } from "lucide-react";

const HistorySidebar = () => {
  const [openedHistory, setOpenedHistory] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setOpenedHistory(window.innerWidth >= 920);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formVersions = [
    { version: 1, date: "2021-10-10" },
    { version: 2, date: "2021-10-11" },
    { version: 3, date: "2021-10-12" },
    { version: 4, date: "2021-10-13" },
  ];

  return (
    <aside
      className={`bg-white transition-all duration-300 ${
        openedHistory ? "w-[15%]" : "w-[calc-size(auto)]"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          {openedHistory && <span className="">Versions</span>}
          <button
            onClick={() => setOpenedHistory((prev) => !prev)}
            className="hover:bg-gray-200 p-1 rounded border cursor-pointer transition-colors"
            aria-label={openedHistory ? "Close sidebar" : "Open sidebar"}
          >
            {openedHistory ? (
              <ChevronsLeft className="h-4 w-4" />
            ) : (
              <ChevronsRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {openedHistory && (
        <section className="p-4">
          <ul className="mt-2 space-y-2">
            {formVersions.map((formVersion) => (
              <li
                key={formVersion.version}
                className="py-2 hover:bg-gray-100 rounded transition-colors"
              >
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center space-x-2">
                    <div>
                      <FileClock className="h-4 w-4 text-gray-500" />
                    </div>
                    <span>v{formVersion.version}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formVersion.date}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
};

export default HistorySidebar;
