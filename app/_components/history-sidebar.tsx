"use client";

import useFormVersionStore from "@/store/formVersions";
import { ChevronsLeft, ChevronsRight, FileClock } from "lucide-react";
import { useEffect, useState } from "react";

const HistorySidebar = () => {
  const [openedHistory, setOpenedHistory] = useState(true);
  const formVersionsData = useFormVersionStore(
    (state) => state.formVersionsData
  );
  const { selectedFormVersion, setSelectedFormVersion } = useFormVersionStore(
    (state) => ({
      selectedFormVersion: state.selectedFormVersion,
      setSelectedFormVersion: state.setSelectedFormVersion,
    })
  );

  useEffect(() => {
    if (formVersionsData && formVersionsData.length > 0) {
      setSelectedFormVersion(formVersionsData[0]);
    }
  }, [formVersionsData.length]);

  useEffect(() => {
    const handleResize = () => {
      setOpenedHistory(window.innerWidth >= 920);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

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
            {formVersionsData?.map((formVersion, index) => (
              <div
                key={index}
                className={`py-2 rounded ${
                  selectedFormVersion?.version_number ===
                  formVersion.version_number
                    ? "border border-blue-500"
                    : ""
                } transition-colors cursor-pointer border`}
                onClick={() => setSelectedFormVersion(formVersion)}
              >
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center space-x-2">
                    <div>
                      <FileClock className="h-4 w-4 text-gray-500" />
                    </div>
                    <span>v{formVersion.version_number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {formVersionsData?.map((formVersion) => (
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
