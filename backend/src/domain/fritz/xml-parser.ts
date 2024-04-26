import { parseStringPromise } from 'xml2js'

export class XmlParser {
  /**
     * Parses an XML string and returns a JSON object.
     * @param xml The XML string to be parsed.
     * @returns A JSON object representing the XML structure or null if the XML is empty.
     */
  async parseXmlToJson (xml: string): Promise<any | null> {
    try {
      const json = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true })
      return json
    } catch (error) {
      console.error('Error parsing XML:', error)
      throw error
    }
  }
}
