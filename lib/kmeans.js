// The MIT License (MIT)
//
// Copyright (c) 2018 Yoshiki Shinagawa
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var KMeans = function(obj){
    var n_clusters = 9;
    
    var count = 0;
    runClusterLoop();

    
    ////////////////////////////////////
    // private function
    ////////////////////////////////////
    
    function runClusterLoop(){
        var buffer = grvArr.slice();
        var result  = calcClaster(ptnMap,grvArr);
        if(isEqualArray(buffer,grvArr)){
            return;
        }
        count++;
        runClusterLoop();
    }
    
    // @brief 配列の比較
    // @param arr1 array
    // @param arr2 array
    // @retrun result bool
    function isEqualArray(arr1,arr2){
        var a = JSON.stringify(arr1);
        var b = JSON.stringify(arr2);
        return (a === b);
    }
    
    // @brief クラスタの計算
    // @param node array
    // @param clusters array
    // @retrun calcedCluster array
    function calcClaster(node,clusters){
        //配列初期化
        var store = new Array(clusters.length);
        for(var i=0;i<store.length;i++){
            store[i] = []; 
        }
        //ノードループ
        for(var i = 0;i<node.length;i++){
            var minVal = calcDistance(node[i],clusters[0]);
            //var minVal = calcDistance(ptnMap[i],grvArr[0]);
            var minCount = 0;
            
            //クラスタループ
            for(var j= 0;j<clusters.length;j++){
                if(calcDistance(node[i],clusters[j])< minVal){
                    minCount = j;
                    minVal = calcDistance(node[i],clusters[j]);
                }
            }
            store[minCount].push(node[i].slice());
        }
        
        for(var i = 0;i<clusters.length;i++){
            clusters[i] = calcGravity(store[i]);
        }
        
        return clusters;
    }
    
    // @brief クラスタの計算
    // @param node array
    // @param clusters array
    // @retrun calcedCluster array
    function calcGravity(vec){
        var sum = vec[0];
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
    
    // @brief vector間の最短距離を計算
    // @param vector array1
    // @param vector array2
    // @retrun calcedCluster array
    function calcDistance(vec1,vec2){
        var result = 0;
        for(var i=0;i<vec1.length;i++){
            result += Math.pow(2,Math.abs(vec1[i] - vec2[i]));
        }
        return (Math.sqrt(result));
    }
}
