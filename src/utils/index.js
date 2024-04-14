// 重构object数据，转换成列表+object
export const object2List=(obj)=>{
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