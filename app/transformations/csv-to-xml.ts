import { parse } from "csv-parse/sync"
import { escapeXml } from "./utils"
import Papa from "papaparse"

export const csvToXml = (csv: string) => {
  let records: any[] = []

  // Helper function to verify parse results
  const verifyParseResults = (results: any[]): boolean => {
    return (
      Array.isArray(results) &&
      results.length > 0 &&
      results.every(
        (row) => row && typeof row === "object" && Object.keys(row).length > 0
      )
    )
  }

  // First try with Papaparse as it handles complex CSVs better
  try {
    const normalizedContent: any = csv
      .replace(/\r\n/g, "\n") // Normalize CRLF to LF
      .replace(/\r/g, "\n") // Normalize CR to LF

    const parseResult = Papa.parse(normalizedContent, {
      header: true,
      skipEmptyLines: "greedy",
      quoteChar: '"',
      escapeChar: "\\",
      delimiter: ",",
      transformHeader: (header) => header.trim(),
      transform: (value) => value?.toString().trim() || "",
    })

    if (verifyParseResults(parseResult.data)) {
      records = parseResult.data
    }
  } catch (firstError) {
    console.error("First parse attempt failed:", firstError)

    // Second attempt with csv-parse if Papaparse fails
    try {
      records = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        skip_records_with_error: true,
        trim: true,
      })
    } catch (secondError) {
      console.error("Second parse attempt failed:", secondError)

      // Final attempt with most permissive settings
      try {
        const superNormalizedContent: any = csv
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n")
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n")

        const finalResult = Papa.parse(superNormalizedContent, {
          header: true,
          skipEmptyLines: "greedy",
          quoteChar: '"',
          escapeChar: "\\",
          delimiter: ",",
          transformHeader: (header) => header.trim(),
          transform: (value) => value?.toString().trim() || "",
        })

        if (verifyParseResults(finalResult.data)) {
          records = finalResult.data
        }
      } catch (finalError) {
        console.error("All parsing attempts failed:", finalError)
        return "<table-response><table-data>Failed to parse CSV file.</table-data></table-response>"
      }
    }
  }

  // Verify we have valid records
  if (!verifyParseResults(records)) {
    return "<table-response><table-data>No valid data found in the CSV file.</table-data></table-response>"
  }

  // Get headers from first record
  const headers = Object.keys(records[0])

  // Build XML output with validation
  try {
    let xml = "<table-response>\n<table-metadata>\n"
    xml += `<total-rows>${records.length}</total-rows>\n`
    xml += `<total-columns>${headers.length}</total-columns>\n`
    xml += "</table-metadata>\n<table-data>\n"

    // Add headers row with validation
    xml += `0. ${headers
      .map((header) => `[${escapeXml(header?.toString().trim() || "")}]`)
      .join(" ")}\n`

    // Add data rows with validation
    records.forEach((record: any, index: number) => {
      const rowData = headers
        .map((header) => {
          const value = record[header]
          return `[${escapeXml(value?.toString().trim() || "")}]`
        })
        .join(" ")
      xml += `${index + 1}. ${rowData}\n`
    })

    xml += "</table-data>\n</table-response>"
    return xml
  } catch (xmlError) {
    console.error("Error generating XML:", xmlError)
    return "<table-response><table-data>Error generating XML output.</table-data></table-response>"
  }
}
