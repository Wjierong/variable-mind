// 将画布置于视图中间
export const toCenter = function () {
  this.container.scrollTo(
    this.canvas.offsetWidth / 2 - this.container.offsetWidth / 2,
    this.canvas.offsetHeight / 2 - this.container.offsetHeight / 2,
  )
}

// 展开收缩节点
export const expandNode = function(el, isExpand) {
  el.nodeObj.expanded = !el.nodeObj.expanded;
  this.layout(this.nodeData);
  this.linkTopic(true)
}

// 选择节点
export const selectNode = function(el) {
  if(!el) {
    return;
  }
  if(this.currentNode) {
    this.currentNode.classList.remove('selected') 
  }
  this.currentNode = el;
  this.currentNode.classList.add('selected')
}

// 不选择节点
export const unSelectNode = function(){
  const el = this.currentNode;
  if(!el) {
    return;
  }
  el.classList.remove('selected');
  this.currentNode = null;
}