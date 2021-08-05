export let JensenLab = function() {

 const TYPE = {
  CHEMICALS:             -1
 ,WIKIPEDIA:             -11
 ,GO_BIOLOGICAL_PROCESS: -21
 ,GO_CELLULAR_COMPONENT: -22
 ,GO_MOLECULAR_FUNCTION: -23
 ,BTO_TISSUES:           -25
 ,DOID_DISEASES:         -26
 ,ENVO_ENVIRONMENTS:     -27
 ,APO_PHEOTYPES:         -28
 ,FYPO_PHENOTYPES:       -29
 ,MPHENO_PHENOTYPES:     -30
 ,NBO_BEHAVIOURS:        -31
 ,MAMMALIAN_PHEONOTYPES: -36
 }
 Object.defineProperty(TYPE,'name',{value:'TYPE'})

 const TAXONOMY = {
  HOMO_SAPIENS: 9606
 ,PLASMODIUM_FALCIPARUM: 5833
 }
 Object.defineProperty(TAXONOMY,'name',{value:'TAXONOMY'})

 const BTO = {
  BRAIN:  'BTO:0000142'
 ,HEART:  'BTO:0000562'
 ,KIDNEY: 'BTO:0000671'
 ,LIVER:  'BTO:0000759'
 }
 Object.defineProperty(BTO,'name',{value:'BTO'})

 const GO = {
  EXTRACELLULAR_SPACE: 'GO:0005615'
 }
 Object.defineProperty(GO,'name',{value:'GO'})

 let _JensenLab = {};

 _JensenLab.limit = 10000
 
 _JensenLab.getHumanTissueProteins = function(tissue) {
  tissue = getKey(tissue,BTO);
  return queryAPI('integration',{
   type1: TYPE.BTO_TISSUES
  ,id1: BTO[tissue]
  ,score: 3
  ,type2: TAXONOMY.HOMO_SAPIENS
  }).then(data => data[0])
 }

 _JensenLab.getParasiteProteinsByHumanTissue = function(parasite,tissue) {
  parasite = getKey(parasite,TAXONOMY);
  return _JensenLab.getHumanTissueProteins(tissue).then(data => {
   let proteins = Object.keys(data).map(key => TAXONOMY.HOMO_SAPIENS+'.'+key).join('\n');
   return queryAPI('network',{
    entities: proteins
   ,additional: _JensenLab.limit
   ,filter: TAXONOMY[parasite]+'.%%'
   ,score: 0.7
   })
  })
 }

 let getKey = function(key,namespace) {
  key = key.toString().toUpperCase();
  if (key in namespace) return key
  else {
   let newKey;
   if (newKey = Object.values(namespace).find(value => value==key)) return newKey;
   else throw new Error(`Unknown key ${key} in namespace ${namespace.name}`);
  }
 }

 let encodeQuery = function(query) {
  if (!('limit' in query)) query.limit = _JensenLab.limit;
  if (!('format' in query)) query.format = 'json';
  return Object.entries(query)
         .map(([key,value]) => encodeURIComponent(key)+'='+encodeURIComponent(value))
         .join('&')
 }

 let queryAPI = function(evidence,query) {
  let uri = `https://api.jensenlab.org/${evidence}`;
  return fetch(uri, {method: 'POST'
                    ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
                    ,body: encodeQuery(query)
                    }
              ).then(response => response.json())
 }

 return _JensenLab;

}();