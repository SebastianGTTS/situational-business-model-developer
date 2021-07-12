function (doc) {
  var featureMap = {};
  var featureStack = [];
  
  if(doc.features) {
    featureStack =  doc.features;
  }
  
  while(featureStack.length > 0){
    var f = featureStack.pop();
    featureMap[f.id] = f.name;

    for(var i = 0; i < f.features.length; i++){
        featureStack.push(f.features[f.features.length - 1 -i]);
    }
  }
    
  
  
  emit(doc._id, featureMap);
}