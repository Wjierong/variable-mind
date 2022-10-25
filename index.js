import MindMap from './mind.js'; 
import mindData from './src/const/data.js'
const options = {
    el: '#minder',
    editable: true,
    draggable: true,
    theme: 'primary',
    newTopicName: '是新的节点',
    direction: 'diffuse'
}
const mindExample = new MindMap(options)
mindExample.init(mindData)
