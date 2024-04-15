import {reactive} from 'vue'
// 重构object数据，转换成列表+object, 场景：label的转换
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

export const list2Object = (list) => {
    console.log("要转换的list:",list)
    const obj = {}
    if ( list == null || list == undefined){
        return obj
    }
    for (let i =0;i<list.length;i++){
        const item = list[i]
        // item: {key: "xxx", value: "xxxx"} ==>{xxx: "xxxx"}
        if (item.key == ""){
            continue
        }
        obj[item.key] = item.value
    }
    console.log("转换后的obj",obj)
    return obj
}


// 传入两个值，table列表、所删行的index
// index可通过scope.$index获取
export const deleteTableRow = (list,index) => {
    list.splice(index, 1)
}

export const addTableRow = (list) => {
    console.log("初始list:",list)

    const Obj = {}
    list.unshift(Obj)

    console.log("添加后的table内容: ",list)
}