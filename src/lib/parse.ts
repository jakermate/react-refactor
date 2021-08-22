import * as parser from '@babel/parser'
import generator, { GeneratorResult } from '@babel/generator'

const parserOptions: parser.ParserOptions = {
    plugins: ['jsx'],
    sourceType: 'script'
}
export function parseJSX(jsxString: string) {
    // Tag parsing
    let parsedJSX = parser.parse(jsxString, {
        plugins: ['jsx'],
        sourceType: 'script'
    })
    console.log(JSON.stringify(parsedJSX))
    return jsxString
}
function JSXtoAST(jsxString: string): any {
    return parser.parse(jsxString, parserOptions)
}
function ASTtoJSX(ast: any): GeneratorResult {
    return generator(ast)
}

module.exports =  {
    JSXtoAST,
    ASTtoJSX
}