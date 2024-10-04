"use client";

import React, { useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight, FileClock } from "lucide-react";
import useSelectedFormVersionStore from "@/store/seletedFormVersions";
import useFormVersionStore from "@/store/formVersions";
type formVersions = {
  created_at: string;
  form_id: string;
  form_schema_string: string;
  id: string;
  query: string;
  version_number: number;
}[];

const HistorySidebar = () => {
  const [openedHistory, setOpenedHistory] = useState(true);
  const [formVersions, setFormVersions] = useState<formVersions>([]);
  const formVersionsData = useFormVersionStore(
    (state) => state.formVersionsData
  );
  console.log(formVersionsData, "formVersionsData123");
  const setSelectedFormVersion = useSelectedFormVersionStore(
    (state) => state.setSelectedFormVersion
  );
  console.log(formVersionsData, "formVersionsData123");
  useEffect(() => {
    if (formVersionsData && formVersionsData?.length > 0) {
      setFormVersions(formVersionsData);
    }
  }, [formVersionsData]);

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
                key={formVersion.version_number}
                className="py-2 hover:bg-gray-200 rounded transition-colors cursor-pointer border"
                onClick={() => setSelectedFormVersion(formVersion)}
              >
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center space-x-2">
                    <div>
                      <FileClock className="h-4 w-4 text-gray-500" />
                    </div>
                    <span>v{formVersion.version_number}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {/* {formVersion.created_at} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {formVersions.map((formVersion) => (
              <div
                key={formVersion.version_number}
                className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer border"
                onClick={() => setSelectedFormVersion(formVersion)}
              >
                <div className="flex justify-center items-center">
                  <span>v{formVersion.version_number}</span>
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
