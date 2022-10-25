export default function (mind) {
  mind.canvas.addEventListener('click', e => {
    mind.unSelectNode()
    // 节点展开按钮
    if(e.target.nodeName === 'EXPAND') {
      mind.expandNode(e.target.previousSibling)
    }
    // 节点
    if(e.target.nodeName === 'TEXT') {
      mind.selectNode(e.target)
    }
  })

  mind.canvas.addEventListener('dblclick', e => {
    e.preventDefault();
    if(e.target.nodeName === 'TEXT') {
      mind.createInputBox(e.target)
    }
  })
}