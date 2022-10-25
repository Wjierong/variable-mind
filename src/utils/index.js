export const generateUUID = function () {
  return (
    new Date().getTime().toString(16) + Math.random().toString(16).substr(2)
  ).substr(2, 16)
}

export const generateNewObj = function() {
  const id = generateUUID();
  return {
    topic: this.newTopicName || '新节点',
    id,
  }
}

// 为每个节点数据添加父级节点数据
export const addParentLink  = function(data, parent) {
  data.parent = parent;
  const children = data.children;
  if(children && children.length > 0) {
    for(let i = 0 ;i<children.length;i++) {
      addParentLink(children[i],data)
    }
  }
}

// 插入指定对象
export const insertNodeObj = function(obj,newObj) {
  const parent = obj.parent;
  const children = parent.children;
  newObj.parent = parent;
  const index = children.indexOf(obj);
  children.splice(index + 1, 0, newObj)  
}

// 挪动对象
export const moveNodeObj = function(obj, moveObj, isBefore = true) {
  const parent = obj.parent;
  const moveChildren = moveObj.parent.children;
  moveChildren.splice(moveChildren.indexOf(moveObj),1)
  moveObj.parent = parent;
  const children = parent.children;
  if(isBefore) {
    children.splice(children.indexOf(obj),0,moveObj)
  }else {
    children.splice(children.indexOf(obj) + 1,0,moveObj)
  }
}

// 删除指定对象
export const removeNodeObj = function(obj) {
  const children = obj.parent.children;
  const index = children.indexOf(obj);
  children.splice(index,1);
}