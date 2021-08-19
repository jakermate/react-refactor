import * as parser from '@babel/parser'


export function parseJSX(jsxString: string) {
    // Tag parsing
    let parsedJSX = parser.parse(jsxString, {
        plugins: ['jsx'],
        sourceType: 'script'
    })
    console.log(JSON.stringify(parsedJSX))
    return jsxString
}