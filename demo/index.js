(function(){
    
    //クラスタ数
    var classNode = 9;
    //次元数
    var dim = 2;
    var animationFrame = 10;
    var textArrayMax = 5300;
    
    var range = 512;
    
    //point matrix
    var ptnMap = initMat(dim,textArrayMax); 
    var ptnMapBuffer = new Array(textArrayMax) ;
    var grvArr = initMat(dim,classNode);            //nodeの重心
    var grvArrColor = initMat(3,classNode,0,255);   //nodeの重心
    
    main();
    
    function init(){
        classNode = parseInt(document.getElementById("claster").value,10);
        textArrayMax= parseInt(document.getElementById("node").value,10);
        animationFrame = parseInt(document.getElementById("frame").value,10);
    }
    
    function main(){
        init()
        
        ptnMap = initMat(dim,textArrayMax); 
        ptnMapBuffer = new Array(textArrayMax) ;
        grvArr = initMat(dim,classNode); 
        grvArrColor = initMat(3,classNode,0,255);
        
        var count = 0;
        try{
            logic();
            document.getElementById("msg").innerHTML= "";
        }catch(e){
            document.getElementById("msg").innerHTML= e;
            setTimeout(main, animationFrame);
        }
        
        function logic(){
            clearCanvas();
            //showPoints(ptnMap,3,"rgb(0,0,0)");
            var buffer = JSON.stringify(grvArr);
            calcClaster();
            var result = JSON.stringify(grvArr);
            //showPoints(grvArr,10,"rgb(255,0,0)");
            for(var i=0;i<grvArr.length;i++){
                drawPoint(grvArr[i],7,vec2rgb(grvArrColor[i],true));
                //drawPoint(grvArr[i],8,"rgb(255,0,0)");
            }
            if(buffer === result){
                //showPoints(grvArr,10,"rgb(255,0,0)");
                setTimeout(main, animationFrame);
                return;
            }
            count++;
            setTimeout(logic, animationFrame);
        }
    }
    function calcClaster(){
        //配列初期化
        var addedVec = new Array(classNode);
        for(var i=0;i<addedVec.length;i++){
            addedVec[i] = [];
        }
        
        //ノードループ
        for(var i = 0;i<ptnMap.length;i++){
            var minVal = calcDistance(ptnMap[i],grvArr[0]);
            var minCount = 0;
            //クラスタループ
            for(var j= 0;j<grvArr.length;j++){
                if(calcDistance(ptnMap[i],grvArr[j])< minVal){
                    minCount = j;
                    minVal = calcDistance(ptnMap[i],grvArr[j]);
                }
            }
            //参照渡し対策
            addedVec[minCount].push(ptnMap[i].slice());
            drawLine(ptnMap[i],grvArr[minCount],3,vec2rgb(grvArrColor[minCount]));
            drawPoint(ptnMap[i],4,vec2rgb(grvArrColor[minCount]));
        }
        
         
        for(var i = 0;i<addedVec.length;i++){
            grvArr[i] = calcGravity(addedVec[i]);
        }
    }
    
    
    function initMat(n,m,min,max){
        if(min === undefined || min === null){
            min = 0;max = 512;
        }
        if(max === undefined){
            max = 512;
        }
        var array = [];
        for(var i = 0;i<m;i++){
            var tmp=  [];
            for(var j=0;j<n;j++){
                tmp.push(getRandomInt(min,max));
            }
            array.push(tmp);
        }
        return array;
    }
    
    function calcGravity(vec){
        var sum = vec[0];
        var normal = 1000;
        for(var i = 1;i<vec.length;i++){
            for(var j = 0;j<sum.length;j++){
                sum[j] += vec[i][j];
            }
        }
        for(var j = 0;j<sum.length;j++){
            sum[j] /= vec.length;
        }
        return sum;
    }
    
    function calcDistance(vec1,vec2){
        if(vec1.length !== vec2.length){
            throw "wrong argument";
        }
        
        var result = 0;
        for(var i=0;i<vec1.length;i++){
            result += Math.pow(2,Math.abs(vec1[i] - vec2[i]));
        }
        return (Math.sqrt(result));
    }
    
    
    function getRandomInt(min, max) {
      return Math.floor( Math.random() * (max - min + 1) ) + min;
    }
    
    
    
    ////////////描画/////////////
    function showPoints(array,rad,color){
        for(var i=0;i<array.length;i++){
            drawPoint(array[i],rad,color);
        }
    }
    
    function drawPoint(point,rad,color){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = color; 
        ctx.arc(point[0], point[1], rad, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    }
    
    function drawLine(p1,p2,thick,color){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = thick;
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
    }
    
    function clearCanvas(){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,range,range);
    }
    
    function vec2rgb(v3,r){
        if(r === true){
            return "rgb("+(255-v3[0])+","+(255-v3[1])+","+(255-v3[2])+")";
        }else{
            return "rgb("+v3[0]+","+v3[1]+","+v3[2]+")";
        }
        
    }
})();