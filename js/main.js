window.onload = () =>{
    "use strict";
    themeManager.init();
    const csInterface = new CSInterface();
    const extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;

    const PSURL = "http://localhost:8000/";
    const AIURL = "http://localhost:3000/";
    const toAI = document.getElementById("toAI");
    
    const http = require("http");
    const fs = require("fs");
    const url = require("url");
    const ejs = require("ejs");
    
    const indexPage = fs.readFileSync(`${extensionPath}/ejs/index.ejs`,"utf8");
    
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    const server = http.createServer((req,res)=>{
        console.log(req.url);
        const url_parts = url.parse(req.url);
        switch(url_parts.pathname){
            case "/":
                if(req.method == "GET"){
                    const content = ejs.render(indexPage,{
                        title:"Ps server listening",
                        content:"from ps"
                    });
                    res.writeHead(200,{"Content-Type": "text/html"});
                    res.write(content);
                    res.end();
                }else if(req.method == "POST"){
                    let body = "";
                    req.on("data",chunk=>{
                        body += chunk;
                    });    
                    req.on("end",response=>{
                        response = JSON.parse(body);
                        console.log(response);
                        openImages(response);
                        res.end();
                    });
                }else{
                    alert("error");
                }
            break;
                
            default:
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.end("no page...");
                break;
        }
    });
    
    toAI.addEventListener("click",sentAi);

    async function sentAi(){
        const documents = await getDocs().catch(error => alert(error));
        fetch(AIURL,{
            method:"POST",
            body:JSON.stringify(documents),
            header:{"Content-Type": "application/json"}
        })
        .then(res => console.log(res))
        .catch(error => alert(error));

        function getDocs(){
            return new Promise((resolve,reject)=>{
                csInterface.evalScript(`$.evalFile("${extensionRoot}getDocments.jsx")`,(o)=>{
                    if(o === "false"){
                        reject("the image is invalid");
                    }
                    const documents = JSON.parse(o);
                    resolve(documents);
                });
            });
        }
    }

    function openImages(array){
        csInterface.evalScript(`openImages(${JSON.stringify(array)})`,()=>{
            alert("open");
        });
    }
    
    server.listen(8000);
}
    
