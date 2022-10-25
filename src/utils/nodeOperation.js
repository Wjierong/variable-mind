/**
 * 节点操作 
 */
import {
  insertNodeObj,
  removeNodeObj,
  addParentLink,
} from './index'

// 添加节点
export const addChildFunction = function(el, node){
  if(!el) return;
  const nodeObj = el.nodeObj;
  const newNodeObj = node || this.generateNewObj();
  addParentLink(newNodeObj,nodeObj)
  newNodeObj.direction = 'right';
  if(nodeObj.children) {
    nodeObj.children.push(newNodeObj)
  }else {
    nodeObj.children = [newNodeObj];
  }

  const newGroupEle = this.createGroup(newNodeObj);

  const top = el.parentElement.parentElement;
  // 根节点添加子节点
  if(top.tagName === 'ROOT') {
    // newGroupEle.setAttribute('position', 'right');
    // newGroupEle.classList.add('right-group')
    if(top.nextSibling) {
      top.nextSibling.appendChild(newGroupEle)
    }
  }else {
    // 普通节点添加子节点
    let childrenEle = top.children[1];
    if(!childrenEle) {
      childrenEle = document.createElement('children')
      top.appendChild(childrenEle)
    }
    childrenEle.appendChild(newGroupEle)
  }
  this.linkTopic();
  return newGroupEle;
}

// 添加子节点
export const addChild = function(el, nodeObj) {
  const nodeEl = el || this.currentNode;
  if(!nodeEl) return;
  const newGroupEle = addChildFunction.call(this,nodeEl,nodeObj);
  const textEle = newGroupEle.children[0].children[0]
  this.createInputBox(textEle)
}

// 添加兄弟节点
export const addSibling = function(el, node){
  const nodeEl = el || this.currentNode;
  if(!nodeEl) return;
  const nodeObj = nodeEl.nodeObj;
  const newNodeObj = node || this.generateNewObj();
  insertNodeObj(nodeObj,newNodeObj)
  const newGroupEle = this.createGroup(newNodeObj);
  const topicNode = nodeEl.parentElement;
  const childrenNode = topicNode.parentElement.parentElement;
  childrenNode.insertBefore(newGroupEle,topicNode.parentElement.nextSibling)
  if(childrenNode.classList.contains('children-box')) {
    newNodeObj.direction = 'right';
  }
  this.linkTopic()
  const textEle = newGroupEle.children[0].children[0]
  this.createInputBox(textEle)
}

export const removeNode = function(el, node) {
  const nodeEl = el || this.currentNode;
  if(!nodeEl) return;
  const nodeObj = nodeEl.nodeObj;
  removeNodeObj(nodeObj);
  const parentNode = nodeEl.parentElement.parentElement;
  const preEleSibling = parentNode.previousElementSibling;
  const nextEleSibling = parentNode.nextElementSibling;
  const grandParent = parentNode.parentElement.parentElement;
  let textEle = '';
  // 如果没有子节点了，就选择父节点
  if(!nodeObj.parent.children.length) {
    textEle = grandParent.children[0].children[0];
  }else {
    if(preEleSibling) {
      textEle = preEleSibling.children[0].children[0]
    }else {
      textEle = nextEleSibling.children[0].children[0]
    }
  }
  parentNode.parentElement.removeChild(parentNode)
  this.linkTopic()
  this.selectNode(textEle)
  // this.createInputBox(textEle)
}