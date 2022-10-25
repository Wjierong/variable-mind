import {removeNodeObj, moveNodeObj} from './index'
import {createVirtualELe} from  './dom'

function throttle(fn, delay) {
  let timer = null;
  return function() {
    let that = this;
    let args = arguments;
    if(timer) {
      return;
    }
    fn.apply(that, args);
    timer = setTimeout(()=>{
      timer = null
    },delay)
  }
}

export default function(mind) {
  let originType = null; // 虚拟节点类型
  let curType = null;
  let dragGroupELe = null;
  let contrastEle = null; // 对照节点
  let originELe = null;
  let virtualELe = createVirtualELe()
  // mind.canvas.appendChild(virtualELe)
  mind.canvas.addEventListener('dragstart', (e)=>{
    const el = e.target;
    if(!el) {
      return;
    }
    const groupELe = el.parentElement.parentElement
    groupELe.style.opacity = 0.5;
    // groupELe.classList.remove('right-group')
    // groupELe.removeAttribute('position')
    e.dataTransfer.effectAllowed = 'move'
    // e.dataTransfer.setData('text/plain', e.target.id)
    dragGroupELe = groupELe;
  })

  // mind.canvas.addEventListener('dragend', (e)=>{
  //   console.log('---end',e);
  // })

  mind.canvas.addEventListener('dragover', function (e) {
    e.preventDefault();
    const el = e.target;
    virtualELe.style.display = ''
    const isRootContain = mind.root.contains(el)
    if(el.nodeName === 'svg' || dragGroupELe.contains(el) || isRootContain) {
      return;
    }else {
      virtualELe.style.display = ''
    }
    if(el.nodeName === 'TOPIC') {
      const point = el.point;
      if(e.offsetX > point.x) {
        curType = 'child'
      }else if(e.offsetY < point.y){
        curType = 'before'
      }else {
        curType = 'after'
      }
      contrastEle = el;
    }
    if(el.nodeName === 'TEXT') {
      if(e.offsetY < el.line) {
        curType = 'before'
      }else {
        curType = 'after'
      }
      contrastEle = el.parentElement
    }
    if(curType !== originType) {
      originType = curType;
      insertBeforeTopic.call(mind,virtualELe,contrastEle,curType)
      originType = curType;
    }else {
      if(originELe !== contrastEle) {
        insertBeforeTopic.call(mind,virtualELe,contrastEle,curType)
        originELe = contrastEle;
      }
    }
  })

  mind.canvas.addEventListener('drop', (e)=>{
    // dragGroupELe： 被拖拽的节点
    // virtualELe: 虚拟节点
    let el = virtualELe;
    const parentELe = el.parentElement;
    let curNodeObj = null;
    if(!curType) {
      dragGroupELe.style.opacity = 1
      return;
    }
    const dragNodeObj = dragGroupELe.children[0].children[0].nodeObj;
    removeNodeObj(dragNodeObj) // 将拖拽节点数据对象从原父节点移除
    if(curType === 'child') {
      curNodeObj = el.parentElement.previousSibling.children[0].nodeObj;
      dragNodeObj.parent = curNodeObj;
      if(!curNodeObj.children) {
        curNodeObj.children = [dragNodeObj]
      }else {
        curNodeObj.children.push(dragNodeObj)
      }
    }

    let dragGroupPosition = '';
    if(curType === 'before') {
      const nextSiblingEle = el.nextSibling;
      const position = nextSiblingEle.getAttribute('position');
      if(position) {
        dragGroupPosition = position
      }
      curNodeObj = nextSiblingEle.children[0].children[0].nodeObj;
      moveNodeObj(curNodeObj,dragNodeObj)
    }

    if(curType === 'after') {
      const preSiblingEle = el.previousSibling;
      const position = preSiblingEle.getAttribute('position');
      if(position) {
        dragGroupPosition = position
      }
      curNodeObj = preSiblingEle.children[0].children[0].nodeObj;
      moveNodeObj(curNodeObj,dragNodeObj,false)
    }

    if(dragGroupELe.lastChild.nodeName === 'svg') dragGroupELe.lastChild.remove()
    if(dragGroupPosition) {
      const className = dragGroupPosition === 'left' ? 'left-group' : 'right-group'
      dragGroupELe.setAttribute('position', dragGroupPosition);
      dragNodeObj.direction = dragGroupPosition;
      dragGroupELe.classList.add(className)
    }
    parentELe.insertBefore(dragGroupELe,el)
    dragGroupELe.style.opacity = 1
    parentELe.removeChild(el) 
    mind.linkTopic()
    console.log('---nodeData',mind.nodeData);

  })  
}

function insertBeforeTopic(virtualELe,contrastEle,type) {
  if(type === 'child') {
    let children = contrastEle.nextSibling;
    if(!children) {
      const childrenELe = document.createElement('children')
      contrastEle.parentElement.appendChild(childrenELe)
      children = childrenELe
    }
    children.appendChild(virtualELe)
    this.linkTopic()
  }
  if(type === 'before') {
    const groupEle = contrastEle.parentElement;
    const parentElement = groupEle.parentElement;
    parentElement.insertBefore(virtualELe,groupEle);
    this.linkTopic()
  }

  if(type === 'after') {
    const groupEle = contrastEle.parentElement;
    const parentElement = groupEle.parentElement;
    parentElement.insertBefore(virtualELe,groupEle.nextSibling);
    this.linkTopic()
  }
}

function nodeObjIndex(obj,mind) {
  const parent = obj.parent;
  const index = parent.children.indexOf(obj);
  return index;
}