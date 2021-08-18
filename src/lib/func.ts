export function returnFunctionalComponent(name:string, codeBlock: string, newFile: boolean = true): string{
    return `
        ${newFile ? "export default " : ""}function ${name}(${codeBlock.includes('props') ? 'props' : ''}){
            return(
                ${codeBlock}
            )
        }
    `
}
export function returnClassComponent(name: string, codeBlock: string): string{
    return `
        export default class ${name}{
            constructor(props){
                super(props)
            }
            render(){
                return(
                    ${codeBlock}
                )
            }
        }
    `
}
export function returnArrowComponent(name: string, codeBlock: string): string{
    return `
        const ${name} = (${codeBlock.includes('props') ? 'props' : ''}) => {
            ${codeBlock}
        }
    `
}
export function validateComponentName(nameRequest: string): string{
    let name = nameRequest.replace(/\s/g, "").toLowerCase().split("(?!^)").map((l,i)=>{
        if(i == 0) return l.toUpperCase()
        return i
    })
    return name.join()
}