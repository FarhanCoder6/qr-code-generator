let qrtext=document.getElementById("qrtext");
let channelId=document.getElementById("channelid");
let imgBox=document.getElementById("imgBox");
let qrimag=document.getElementById("qrImage");
let historyUrl=document.getElementById("historyurl")
let historybtn=document.querySelector(".history-button");
let history=document.querySelector(".history")

function genrateQR(){
    if(qrtext.value.length>0){
        console.log("function will be start");
        let videoUrl=qrtext.value.trim();
        let videoMatch=videoUrl.match(/[?&]v=([^&#]+)/)||videoUrl.match(/youtu\.be\/([^?&#]+)/);
        let videoId=videoMatch? videoMatch[1]:null;
        if(!videoId){
            qrimag.src = "";
            imgBox.classList.remove("show-img")
            channelId.innerHTML="Invalid video link";
            console.log("ERROR");
            return;
        }
        
        let history = JSON.parse(localStorage.getItem("videoHistory")) || [];
        history.push(videoUrl);
        localStorage.setItem("videoHistory", JSON.stringify(history));
        
        qrimag.src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+videoUrl;
        imgBox.classList.add("show-img");

        const apikey = window.YT_API_KEY;
        let   apiurl=(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apikey}`)
        fetch (apiurl)
        .then(res=>res.json())
        .then(data=>{
        console.log(data)
        channelId.innerHTML=data.items[0].snippet.channelTitle;
        })
        showhistory();
    }
}

function showhistory() {
    let history = JSON.parse(localStorage.getItem("videoHistory")) || [];
    let uniqueHistory = Array.from(new Set(history));
    historyUrl.innerHTML = "";

    if (uniqueHistory.length > 0) {
        uniqueHistory.forEach(url => {
            let div = document.createElement("div"); 
            div.innerHTML = url; 
            div.style.marginBottom = "8px";  
            div.style.cursor = "pointer";
            
            div.addEventListener("click", function() {
                qrtext.value = url; 
                genrateQR();
            });
            historyUrl.appendChild(div);            
        });
    } 
}

window.addEventListener("load", showhistory);

historybtn.addEventListener('click',()=>{
    history.style.display="block";
})
