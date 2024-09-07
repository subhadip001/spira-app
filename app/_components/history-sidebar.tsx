"use client";

import React, { useState } from "react";

import { ChevronsLeft, ChevronsRight, FileClock } from "lucide-react";

const HistorySidebar = () => {
  const [openedHistory, setOpenedHistory] = useState(true);

  const formVersions = [
    {
      version: 1,
      date: "2021-10-10",
    },
    {
      version: 2,
      date: "2021-10-11",
    },
    {
      version: 3,
      date: "2021-10-12",
    },
    {
      version: 4,
      date: "2021-10-13",
    },
  ];
  return (
    <aside
      className={`bg-white transition-all ${
        openedHistory ? "w-[15%]" : "w-[5%]"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          {openedHistory ? (
            <div className="">
              <span>Versions</span>
            </div>
          ) : (
            <></>
          )}
          <div
            onClick={() => {
              setOpenedHistory((prev) => !prev);
            }}
            className="hover:bg-gray-200 p-1 rounded border cursor-pointer"
          >
            {openedHistory ? (
              <div className="">
                <ChevronsLeft className="h-4 w-4" />
              </div>
            ) : (
              <div>
                <ChevronsRight className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>
      <section>
        {openedHistory ? (
          <div className="p-4">
            <ul className="mt-2">
              {formVersions.map((formVersion) => (
                <li key={formVersion.version} className="py-2">
                  <div className="flex justify-between">
                    <div className="">v {formVersion.version}</div>
                    <div>{formVersion.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </section>
    </aside>
  );
};

export default HistorySidebar;
