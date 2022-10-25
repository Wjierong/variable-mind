export default function(mind) {
  const keyObj = {
    13: () => {
      // enter
      mind.addSibling ()
    },
    9: () => {
      // tab
      mind.addChild()
    },
    32: ()=>{
      if(!mind.currentNode) {
        return;
      }
      mind.createInputBox(mind.currentNode)
    }
  }
  mind.canvas.onkeydown = e =>{
    e.preventDefault();
    if(!mind.editable) return;
    if (e.target !== e.currentTarget) { // 不知道是什么意思
      // input
      return
    }
    if (e.keyCode === 8 || e.keyCode === 46) {
      // if(mind.currentLink) mind.removeLink()
      // else mind.removeNode()
      mind.removeNode()
    }else {
      keyObj[e.keyCode] && keyObj[e.keyCode](e)
    }
  }
}