import { XmlParser } from './xml-parser'

describe('XmlParser', () => {
  let parser: XmlParser

  beforeEach(() => {
    parser = new XmlParser()
  })

  test('should correctly parse simple XML to JSON', async () => {
    const xml = '<note><to>User</to><from>Library</from><heading>Reminder</heading><body>Don\'t forget the books</body></note>'
    const expectedJson = {
      note: {
        to: 'User',
        from: 'Library',
        heading: 'Reminder',
        body: "Don't forget the books"
      }
    }
    await expect(parser.parseXmlToJson(xml)).resolves.toEqual(expectedJson)
  })

  test('should handle XML attributes and merge them into JSON', async () => {
    const xml = '<book type="fiction"><name>Harry Potter</name><author>J.K. Rowling</author></book>'
    const expectedJson = {
      book: {
        type: 'fiction',
        name: 'Harry Potter',
        author: 'J.K. Rowling'
      }
    }
    await expect(parser.parseXmlToJson(xml)).resolves.toEqual(expectedJson)
  })

  test('should throw an error if XML is empty', async () => {
    const xml = ''
    await expect(parser.parseXmlToJson(xml)).resolves.toEqual(null)
  })

  test('should handle malformed XML', async () => {
    const xml = '<book><title>Unclosed tag</title>'
    await expect(parser.parseXmlToJson(xml)).rejects.toThrow()
  })

  test('should correctly parse complex XML structures', async () => {
    const xml = '<library><book id="1"><title>1984</title><author>George Orwell</author></book><book id="2"><title>Animal Farm</title><author>George Orwell</author></book></library>'
    const expectedJson = {
      library: {
        book: [
          { id: '1', title: '1984', author: 'George Orwell' },
          { id: '2', title: 'Animal Farm', author: 'George Orwell' }
        ]
      }
    }
    await expect(parser.parseXmlToJson(xml)).resolves.toEqual(expectedJson)
  })
})
