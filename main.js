function init(){
    const CHAT = document.querySelector(".chat-window");
    const INPUT = document.querySelector(".text-input");
    
    function loadComputerChat(text){
        CHAT.innerHTML += `<div class = "computer-chat">
            <div class = "icon-wrap">
                <div class = "icon"></div>
            </div>
            <div class = "nickname">끝파고</div>
            <div class = "content">
                <span class = "talkbubble">${text}</span>
            </div>
        </div>`;
    }
    
    function loadMyChat(text){
        CHAT.innerHTML += `<div class = "my-chat">
            <div class = "my-content">
                <span class = "my-talkbubble">${text}</span>
            </div>
        </div>`
    }

    document.querySelector(".chat-right").addEventListener("click", ()=>{if(INPUT.value !== ""){loadMyChat(INPUT.value)}; INPUT.value = ""});
    
    
}

window.onload = init;