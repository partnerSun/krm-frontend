// 重构object数据，转换成列表+object
export const object2List = (obj) => {
    let list = []
    if (obj == null){
        return list
    }
    for (let [key,value] of Object.entries(obj)){
        const o = {
            key: key,
            value: value
        }
        list.push(o)
    }
    return list
}
// 传入两个值，table列表、所删行的index
// index可通过scope.$index获取
export const deleteTableRow = (list,index) => {
    list.splice(index, 1)
}

export const addTableRow = (list) => {
    // if (type == "label"){
    //     const labelObj = {
    //         key:"",
    //         value:"",
            
    //     }
    //     list.push(labelObj)
    // }else if (type == "taint"){
    //     const taintObj = {
    //         key:"",
    //         value:"",
    //         effect:""
    //     }
    //     list.push(taintObj)
    // }
    const Obj = {}
    list.push(Obj)
    console.log("添加后的table内容: ",list)
}