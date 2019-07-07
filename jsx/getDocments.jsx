(function(){
    var array = [];
    //alert(decodeURI(documents[0].fullName));
    for(var i=0;i<documents.length;i++){
        array[i] = decodeURI(documents[i].fullName);
    }
    return JSON.stringify(array);
})();