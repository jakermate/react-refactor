import { parse, parseExpression, ParseResult } from "@babel/parser"
import {expect} from 'chai'
const parsers = require("../parse")

const assert = require('assert/strict')
const codeBlock = `<div><p>this <strong>is</strong> a para</p></div>`
describe("test string to ast node", ()=>{
    it("should return a ast node object", () => {
        expect(parsers.JSXtoAST(codeBlock)).to.be.a('object')
    })
    it("should return JSX string from an AST", () => {
        expect(parsers.ASTtoJSX(codeBlock)).to.be.a('string')
    })
})
