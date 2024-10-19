import { escapeXml } from "./utils"

export const jsonArrayToXml = (jsonArray: any[]): string => {
  try {
    if (jsonArray.length === 0) {
      return "<table-response><table-data>No data found in the JSON array.</table-data></table-response>"
    }

    const headers = Object.values(jsonArray[0].response_data).map(
      (item: any) => item.label
    )

    let xml = "<table-response>\n<table-metadata>\n"
    xml += `<total-rows>${jsonArray.length}</total-rows>\n`
    xml += `<total-columns>${headers.length}</total-columns>\n`
    xml += "</table-metadata>\n<table-data>\n"

    xml += `0. ${headers.map((header) => `[${escapeXml(header)}]`).join(" ")}\n`

    jsonArray.forEach((entry, index) => {
      const rowData = Object.values(entry.response_data).map((item: any) =>
        escapeXml(item.value || "")
      )
      xml += `${index + 1}. ${rowData.map((value) => `[${value}]`).join(" ")}\n`
    })

    xml += "</table-data>\n</table-response>"

    return xml
  } catch (error) {
    console.error(error)
    return "<table-response><table-data>Error parsing JSON array.</table-data></table-response>"
  }
}
