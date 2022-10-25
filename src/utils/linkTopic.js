import {createMainPath, createCircle, createLinkSvg} from './svg'

export const linkTopic = function() {
  this.mainTopicSvgLink.innerHTML = ''
  const canvasHeight = this.canvas.offsetHeight;
  const canvasWidth = this.canvas.offsetWidth;
  const rootTop = canvasHeight/2 - this.root.offsetHeight/2;
  const rootLeft = canvasWidth/2 - this.root.offsetWidth/2;
  // 获取画布的中心点，将根节点的位置设置在画布中心
  this.root.style.cssText = `top: ${rootTop}px; left: ${rootLeft}px`;
  const groupList = this.childrenBox.children;
  let offsetHeightLeft = 0;
  let offsetHeightRight = 0;
  let baseLeftY = 0;
  let baseRightY = 0;

  // 计算左右两边所有主节点加起来的高度
  for(let i = 0; i< groupList.length; i++) {
    const position = groupList[i].getAttribute('position')
    if(position === 'left') {
      offsetHeightLeft += groupList[i].offsetHeight;  
    }else{
    // if(position === 'right') {
      offsetHeightRight += groupList[i].offsetHeight;
    }
  }

  // 计算左右两边 Y轴 起始位置的
  baseLeftY = canvasHeight / 2 - offsetHeightLeft / 2;
  baseRightY = canvasHeight / 2 - offsetHeightRight / 2
  let currentLeft = baseLeftY; // 左边节点左上角 Y
  let currentRight = baseRightY; // 右边节点左上角的 Y
  for(let i = 0 ;i <groupList.length;i ++) {
    const el = groupList[i];
    let path = ''; // 绘制的线条路径
    let elPointX = ''; // 节点上线条终点的 X 
    let elPointY = '';// 节点上线条终点的 Y 
    let startPointX = '' ; // 线条的起点 X（在根节点上）
    let startPointY = canvasHeight / 2; // 线条的起点 Y（在根节点上）
    let elCurrentX = '' // 节点左上角 X
    let pathColor = '#666';
    // 左边
    if(el.classList.contains('virtual-group')) {
      pathColor = 'lightskyblue'
    }else {
      pathColor = '#666'
    }
    // 分左右两边进行位置确定
    if(el.getAttribute('position') === 'left') {
      startPointX = canvasWidth / 2 - this.root.offsetWidth / 6  // 连线在根节点上的位置
      elCurrentX = canvasWidth / 2 - this.root.offsetWidth / 2 - el.offsetWidth - 20; //当前主节点的 x轴 位置，根节点左边减去 group 宽度
      // 设置主节点模块的位置
      el.style.cssText = `top: ${currentLeft}px; left: ${elCurrentX}px`;
      // 计算连线在主节点模块的位置
      elPointX = elCurrentX  + el.offsetWidth;
      elPointY = currentLeft + el.offsetHeight / 2;
      // el.point = {
      //   x: topicEle.offsetLeft,
      //   y: topicEle.offsetTop + topicEle.offsetHeight / 2
      // }
      // createCircle(this.mainTopicSvgLink, currentLeft + el.offsetHeight / 2 , elCurrentX + topicEle.offsetWidth, 'red')
      currentLeft = currentLeft + el.offsetHeight;
      path = `M ${startPointX} ${startPointY} C ${startPointX} ${elPointY} ${startPointX} ${elPointY} ${elPointX} ${elPointY}`
      this.mainTopicSvgLink.appendChild(createMainPath(path,pathColor))
    }else{
    // 右边
    // if(el.getAttribute('position') === 'right') {
      startPointX = canvasWidth / 2 + this.root.offsetWidth / 6
      elCurrentX = canvasWidth / 2 + this.root.offsetWidth / 2 + 20
      el.style.cssText = `top: ${currentRight}px; left: ${elCurrentX}px`;
      elPointX = elCurrentX;
      elPointY = currentRight + el.offsetHeight / 2;
      // 拖拽计算点
      // el.point = {
      //   x: topicEle.offsetWidth,
      //   y: topicEle.offsetTop + topicEle.offsetHeight / 2
      // }
      // createCircle(this.mainTopicSvgLink, currentLeft + el.offsetHeight / 2 , elCurrentX + topicEle.offsetWidth, 'red')
      currentRight = currentRight + el.offsetHeight;
      path = `M ${startPointX} ${startPointY} C ${startPointX} ${elPointY} ${startPointX} ${elPointY} ${elPointX} ${elPointY}`
      this.mainTopicSvgLink.appendChild(createMainPath(path,pathColor))
    }
  } 

  // 完成各主节点内的节点连线
  for(let i = 0 ;i < groupList.length; i++) {
    let el = groupList[i];
    if(el.childElementCount) {
      // 如果主节点子节点的话，就新建svg连线元素
      const insideNodeSvg = createLinkSvg('inside-svg');
      // 如果已经有svg元素了，则需要清除
      if (el.lastChild.tagName === 'svg') el.lastChild.remove()
      el.appendChild(insideNodeSvg)
      let parentNode = el.children[0];
      let childrenNode = el.children[1].children
      let direction = el.getAttribute('position')
      if(childrenNode && childrenNode.length > 0) {
        // 遍历所有的子节点，连线，参数有（父节点，子节点数组，方向 ，svg容器）
        traverseNode(parentNode, childrenNode,direction,insideNodeSvg)
      }
    }
  }
}

// 遍历节点
function traverseNode(parent, children, direction,container) {
  let path = '';
  let endPointX = '';
  let endPointY = '';
  let pathColor = '#666';

  // 区分左右两边节点
  if(direction === 'left') {
    let startPointX = parent.offsetLeft; // 父节点上连线的起点 X
    let startPointY = parent.offsetTop + parent.offsetHeight / 2; // 父节点上连线的起点 Y
    if(children.length) {
      path = `M ${startPointX + 15} ${startPointY} H ${startPointX + 5}`;
      container.appendChild(createMainPath(path,pathColor))
    }
    for(let i = 0; i < children.length; i++) {
      let el = children[i];
      if(el.classList.contains('virtual-group')) {
        pathColor = 'lightskyblue'
      }else {
        pathColor = '#666'
      }
      endPointX = el.offsetLeft + el.offsetWidth;
      endPointY = el.offsetTop + el.offsetHeight / 2;
      // createCircle(container,  startPointX , startPointY, 'red')
      path = `M ${startPointX + 5} ${startPointY} Q ${startPointX + 5} ${endPointY} ${endPointX} ${endPointY}`
      container.appendChild(createMainPath(path,pathColor)) 
      if(children[i].children[1]) {
        let parentNode = children[i].children[0]
        let childrenNode = children[i].children[1].children
        traverseNode(parentNode, childrenNode,direction,container)
      }
    }
  }else {
  // if(direction === 'right') {
    let startPointX = parent.offsetLeft + parent.offsetWidth ;
    let startPointY = parent.offsetTop + parent.offsetHeight / 2;
    if(children.length) {
      path = `M ${startPointX - 15} ${startPointY} H ${startPointX  - 5}`;
      container.appendChild(createMainPath(path,pathColor))
    }
    for(let i = 0; i < children.length; i++) {
      let el = children[i];
      if(el.classList.contains('virtual-group')) {
        pathColor = 'lightskyblue'
      }else {
        pathColor = '#666'
      }
      endPointX = el.offsetLeft;
      endPointY = el.offsetTop + el.offsetHeight / 2;
      path = `M ${startPointX - 5 } ${startPointY} Q ${startPointX - 5} ${endPointY} ${endPointX} ${endPointY}`
      container.appendChild(createMainPath(path,pathColor)) 
      if(children[i].children[1]) {
        let parentNode = children[i].children[0]
        let childrenNode = children[i].children[1].children
        traverseNode(parentNode, childrenNode,direction,container)
      }
    }
  }
}