const oneOfNumber = (array: any[], mod: number) => {
    return array.filter((element : string | number, index : number) => {
        return index % mod === 0
    })
}

const filterFunctions = {
    oneOfNumber
}

export default filterFunctions