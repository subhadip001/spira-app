"use client"

import React from "react"

type TableViewComponentProps = {
  tableData: any
}

const TableViewComponent: React.FC<TableViewComponentProps> = ({
  tableData,
}) => {
  const headers = Object.keys(tableData[0])
  return (
    <div className="relative h-full rounded-md border border-gray-200">
      <div className="absolute inset-0 overflow-auto rounded-md">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 border-b border-gray-200">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {tableData?.map((response: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Object.values(response).map((value: any, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableViewComponent
