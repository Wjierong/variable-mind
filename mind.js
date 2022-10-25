import './src/style/mind.less';
import { toCenter,expandNode,selectNode,unSelectNode } from './src/utils/interaction'
import {createLinkSvg} from './src/utils/svg'
import {
  layout, 
  createInputBox,
  createGroup,
  createTopic,
  createChildTopic,
  selectNodeText,
} from './src/utils/dom'
import {linkTopic} from './src/utils/linkTopic'
import initMouseEvent from './src/utils/mouse'
import contextMenu from './src/utils/contextMenu'
import {
  addChild,
  addSibling,
  removeNode,
} from './src/utils/nodeOperation'
import {generateNewObj,addParentLink} from './src/utils/index'
import keypress from './src/utils/keypress'
import nodeDraggable from './src/utils/nodeDraggable'

function MindMap(options) {
  if(!options) {
    return new Error('缺少配置')
  }
  if(!options.el) {
    return new Error('缺少"el"配置')
  }
  const mindEle = document.querySelector(options.el)
  if(!mindEle) {
    return new Error('挂载节点不存在')
  }
  this.container = document.createElement('div'); // 外壳
  this.container.className = 'mind-container';

  this.canvas = document.createElement('div') // 画布
  this.canvas.className = 'mind-canvas';
  // this.canvas.id = 'mind-canvas'
  //tabindex="0" ，表示元素是可聚焦的，并且可以通过键盘导航来聚焦到该元素
  this.canvas.setAttribute('tabindex', '0')

  this.root = document.createElement('root');
  this.root.className = 'root'

  this.childrenBox = document.createElement('children')
  this.childrenBox.className = 'children-box'

  this.mainTopicSvgLink = createLinkSvg('main-topic-svg')

  this.canvas.appendChild(this.root)
  this.canvas.appendChild(this.childrenBox)
  this.canvas.appendChild(this.mainTopicSvgLink);
  this.container.appendChild(this.canvas)
  mindEle.appendChild(this.container)

  this.currentNode = '';

  this.theme = options.theme;
  this.editable = options.editable;
  this.newTopicName = options.newTopicName;
  this.draggable = options.draggable;
  this.direction = options.direction; // 方向
  this.contextMenu = contextMenu;
  this.keypress = keypress;
  this.contextMenuOption = options.contextMenuOption
  initMouseEvent(this)
}
MindMap.prototype = {
  toCenter,
  layout,
  linkTopic,
  expandNode,
  selectNode,
  unSelectNode,
  createInputBox,
  addChild,
  generateNewObj,
  createGroup,
  addSibling,
  addParentLink,
  removeNode,
  createTopic,
  createChildTopic,
  selectNodeText,
  init(data) {
    if(!data || !data.nodeData) {
      return new Error('节点数据为空')
    }
    this.contextMenu && this.contextMenu(this, this.contextMenuOption);
    this.keypress &&  this.keypress(this);
    this.draggable && nodeDraggable(this)
    this.nodeData = data.nodeData // 节点数据
    addParentLink(this.nodeData)
    this.toCenter()
    this.layout(this.nodeData)
    this.linkTopic()
  }
}
export default MindMap