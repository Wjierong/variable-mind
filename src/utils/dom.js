import {DIRECTION} from '../const/mindOptions'
import {generateUUID} from './index'

// 选中节点文本
export const selectNodeText = function(el) {
  const range = document.createRange();
  range.selectNodeContents(el)
  const getSelection = window.getSelection();
  if(getSelection) {
    getSelection.removeAllRanges();
    getSelection.addRange(range)
  }
}

// 创建节点输入框
export const createInputBox = function(el) {
  if(!el) {
    return;
  }
  const originText = el.textContent;
  const inputEle = document.createElement('div');
  el.appendChild(inputEle)
  inputEle.setAttribute('contenteditable', true);
  inputEle.setAttribute('spellcheck', false);
  inputEle.classList.add('input-box');
  inputEle.textContent = originText;
  inputEle.style.cssText = `min-width: ${el.offsetWidth}px`;
  inputEle.focus();
  selectNodeText(inputEle)

  inputEle.addEventListener('keydown', e=>{
    e.stopPropagation();
    const key = e.key;
    if(key === 'Enter' || key === 'Tab') {
      if(e.shiftKey) return; // 文本换行
      e.preventDefault();
      inputEle.blur()
    }
  })

  inputEle.addEventListener('blur', e => {
    const editText = e.target.textContent;
    el.nodeObj.topic = editText;
    el.textContent = editText;
    inputEle.remove()
    this.layout(this.nodeData)
    this.linkTopic()
  })
}

// 创建普通节点
export const createTopic = function(nodeObj){
  nodeObj.id = nodeObj.id ? nodeObj.id : generateUUID()
  const ele = document.createElement('topic')
  const textEle = document.createElement('text')
  textEle.id = nodeObj.id;
  textEle.draggable = this.draggable
  textEle.nodeObj = nodeObj;
  textEle.className = 'topic-text'
  ele.className = 'topic';
  textEle.innerHTML = nodeObj.topic
  ele.appendChild(textEle)
  return ele
}

// 创建文本节点
export const createTextNode = function(nodeObj) {
  const textEle = document.createElement('text')
  textEle.nodeObj = nodeObj;
  textEle.className = 'topic-text'
  textEle.innerHTML = nodeObj.topic
  return textEle
}

// 创建主节点
export const createChildTopic = function(childrenArr, container,direction) {
  for(let i = 0; i < childrenArr.length; i++) {
    const nodeObj = childrenArr[i];
    // 创建group元素
    const childEle = document.createElement('group');
    if(nodeObj.direction === 'left') {
      childEle.setAttribute('position', 'left')
      childEle.className = 'left-group'
    }else if (nodeObj.direction === 'right') {
      childEle.setAttribute('position', 'right')
      childEle.className = 'right-group'
    }
    //创建topic元素
    const topicEle = this.createTopic(nodeObj);
    container.appendChild(childEle)
    childEle.appendChild(topicEle)
    // 创建text元素
    const textEle = topicEle.children[0];
    const topicEleClientRect = topicEle.getBoundingClientRect();
    const textEleClientRect = textEle.getBoundingClientRect();
    topicEle.point = {
      x: textEleClientRect.width,
      y: topicEleClientRect.height / 2
    }
    textEle.line = textEleClientRect.height / 2;
    // 如果节点数据对象有children数组，且长度大于0的话，也就是说有子节点
    if(nodeObj.children && nodeObj.children.length > 0) {
      if(nodeObj.expanded !== false) {
        nodeObj.expanded = true;
      }
      // 创建展开、收起按钮，添加进topic元素里
      const expandEle = document.createElement('expand');
      expandEle.className = "expand"; 
      topicEle.appendChild(expandEle)
      let topicEleHeight = topicEle.offsetHeight;
      // expand采用绝对定位，计算topic的高度，取一半，设置expand的top
      expandEle.style.top = `${(topicEleHeight - expandEle.offsetHeight) / 2}px`
      if(nodeObj.expanded) {
        expandEle.className = `${expandEle.className} open`; 
        const childrenEle =  document.createElement('children');
        childEle.appendChild(childrenEle)
        // 递归调用创建子节点函数
        this.createChildTopic(nodeObj.children, childrenEle,nodeObj.direction)
      }else {
        expandEle.className = `${expandEle.className} close`; 
      }
    }
  }
}

// 创建所有节点
export const layout = function(nodeData) {
  this.root.innerHTML = '';
  this.childrenBox.innerHTML = '';
  if(nodeData.root) {
    const topicEle = createTextNode(nodeData);
    this.root.appendChild(topicEle)
  }
  let leftCount = 0;
  let rightCount = 0;
  let mainTopicArr = nodeData.children;
  // 如果节点数据没有direction的话，根绝左右节点的数量，给它设置direction属性
  for(let i = 0; i< mainTopicArr.length;i++){
    if(mainTopicArr[i].direction === 'left') {
      leftCount+=1;
    }else if(mainTopicArr[i].direction === 'right') {
      rightCount+=1
    }else {
      if(leftCount <= rightCount) {
        mainTopicArr[i].direction = 'left';
        leftCount+=1;
      }else {
        mainTopicArr[i].direction = 'right';
        rightCount+=1;
      }
    }
  }
  // 调用创建节点方法
  if(nodeData.children && nodeData.children.length > 0 ) {
    this.createChildTopic(nodeData.children, this.childrenBox)
  }
}

// 创建节点组
export const createGroup = function(nodeObj) {
  const group = document.createElement('group');
  const topic = this.createTopic(nodeObj);
  group.appendChild(topic)
  return group;
}

export const createChildren = function(className) {
  const el = document.createElement('children');
  el.classList.add(className);
  return el
}

export const createVirtualELe = function() {
  const group = document.createElement('group')
  const topic = document.createElement('topic');
  group.classList.add('virtual-group');
  topic.classList.add('virtual-topic')
  // group.style.display = 'none';
  group.appendChild(topic)
  return group
}
