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

  //w-[calc-size(auto)]

  return (
    <aside
      className={`bg-white flex-shrink-0 transition-all duration-300 ${
        openedHistory ? "min-w-[15vw] max-w-[15vw]" : "w-[calc-size(auto)]"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center flex-wrap">
          {openedHistory && <span className="">Versions</span>}
          <div
            onClick={() => setOpenedHistory((prev) => !prev)}
            className="hover:bg-gray-200 p-2 rounded border cursor-pointer transition-colors"
          >
            {openedHistory ? <ChevronsLeft /> : <ChevronsRight />}
          </div>
        </div>
      </div>
      <section className="p-4">
        {openedHistory ? (
          <div className="flex flex-col space-y-2">
            {formVersions.map((formVersion) => (
              <div
                key={formVersion.version}
                className="py-2 hover:bg-gray-200 rounded transition-colors cursor-pointer border"
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
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {formVersions.map((formVersion) => (
              <div
                key={formVersion.version}
                className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer border"
              >
                <div className="flex justify-center items-center">
                  <span>v{formVersion.version}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
};

export default HistorySidebar;
