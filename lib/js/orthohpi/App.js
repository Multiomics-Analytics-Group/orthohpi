export let App = function () {
 
 let _App = function(container) {
  this.container = container;
  this.ui = new phluid.UI(this);

  this.ui.cyRoot = document.createElement('div');
  this.ui.cyRoot.classList.add('cytoscape')
  this.ui.appendToParent(this.ui.cyRoot,this.ui.mainLayer);

  let query = '9606.ENSP00000317379%0A5833.PF10_0221%0A5833.MAL13P1.281%0A5833.PF14_0286'

  fetch('https://api.jensenlab.org/network?entities='+query)
  .then(response => response.json())
  .then(data => {
   console.log(data);
   let cyData = {
    nodes: data.nodes.map(node => ({ data: { id:node['@id'].replace(/^stringdb:/,'') } }))
   ,edges: data.edges.map(node => ({ data: {
     id: node['source']+'_'+node['target']
    ,source: node['source']
    ,target: node['target']
   } }))
   }
   console.log(cyData);
   
   this.cy = orthohpi.dist.cytoscape({
    container: this.ui.cyRoot
   ,elements: cyData
   ,layout: {
     name:'breadthfirst'
    ,circle: true
    }
   ,style: [{
      selector: 'node'
     ,style: {
      'label': 'data(id)'
      }
    }]
   })
  });
 }

 return _App;
}();