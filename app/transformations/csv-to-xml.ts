import { parse } from "csv-parse/sync"
import { escapeXml } from "./utils"

export const csvToXml = (csv: string) => {
  try {
    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
    })

    if (records.length === 0) {
      return "<table-response><table-data>No data found in the CSV file.</table-data></table-response>"
    }

    const headers = Object.keys(records[0])

    let xml = "<table-response>\n<table-metadata>\n"
    xml += `<total-rows>${records.length}</total-rows>\n`
    xml += `<total-columns>${headers.length}</total-columns>\n`
    xml += "</table-metadata>\n<table-data>\n"

    xml += `0. ${headers.map((header) => `[${escapeXml(header)}]`).join(" ")}\n`

    records.forEach((record: any, index: any) => {
      xml += `${index + 1}. ${headers
        .map((header) => `[${escapeXml(record[header] || "")}]`)
        .join(" ")}\n`
    })

    xml += "</table-data>\n</table-response>"

    return xml
  } catch (error) {
    console.error(error)
    return "<table-response><table-data>Error parsing CSV file.</table-data></table-response>"
  }
}
