import defaultOptions from '../const/contextMenuOptions'
import '../style/contextMenu.less'

export default function(mind, options) {
  const createLi = function(id,name,keyName) {
    const li = document.createElement('li');
    li.id = id;
    li.innerHTML =`<span>${name}</span><span>${keyName}</span>`
    return li;
  }

  const addChild = createLi('add_child', defaultOptions['addChild'], 'tab');
  const addSibling = createLi('add_sibling', defaultOptions['addSibling'], 'enter');
  const removeNode = createLi('remove_node', defaultOptions['removeNode'], 'delete');

  const menuUl = document.createElement('ul');
  menuUl.className = 'menu-list';
  menuUl.appendChild(addChild);
  menuUl.appendChild(addSibling);
  menuUl.appendChild(removeNode);

  mind.container.appendChild(menuUl)
  const menuContainer = document.createElement('div')
  menuContainer.appendChild(menuUl);
  menuContainer.classList.add('context-menu')
  mind.container.appendChild(menuContainer)
  menuContainer.hidden = true;

  let isRoot = false;

  mind.container.oncontextmenu = function(e) {
    // 阻止右键默认菜单
    e.preventDefault();
    if (!mind.editable) return;
    const target = e.target;
    if(target.tagName === 'TEXT') {
      const topicTag = e.target.parentElement.tagName;
      if(topicTag === 'ROOT') {
        isRoot = true;
        addSibling.classList.add('disabled');
        removeNode.classList.add('disabled');
      }else{
        isRoot = false;
        addSibling.classList.remove('disabled');
        removeNode.classList.remove('disabled');
      }
      mind.selectNode(target)
      menuContainer.hidden = false;

      const height = menuUl.offsetHeight;
      const width = menuUl.offsetWidth;
      const containerLeft = mind.container.getBoundingClientRect().left;
      const containerTop = mind.container.getBoundingClientRect().top;
      const containerHeight = mind.container.offsetHeight;
      const containerWidth = mind.container.offsetWidth;
      const top = e.clientY - containerTop;
      const left = e.clientX - containerLeft;
      if(top + height > containerTop + containerHeight) {
        menuUl.style.top = '';
        menuUl.style.bottom = '0px';
      }else {
        menuUl.style.top = top + 'px';
        menuUl.style.bottom = '';
      }

      if(left + width > containerLeft + containerWidth) {
        menuUl.style.left = '';
        menuUl.style.right = '0px';
      }else {
        menuUl.style.left = left + 'px';
        menuUl.style.right = '';
      }
    }
  }

  mind.container.onclick = function(e) {
    if (e.target === menuContainer) menuContainer.hidden = true
  }

  addChild.onclick = function(e) {
    mind.addChild()
    menuContainer.hidden = true
  }

  addSibling.onclick = function(e) {
    if(isRoot) return;
    mind.addSibling();
    menuContainer.hidden = true
  }

  removeNode.onclick = function(e) {
    if(isRoot) return;
    mind.removeNode();
    menuContainer.hidden = true
  }
}