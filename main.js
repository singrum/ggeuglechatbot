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

    let checkAndLoad = ()=> {if(INPUT.value !== ""){loadMyChat(INPUT.value)}; INPUT.value = ""; INPUT.click()}

    document.querySelector(".chat-right").addEventListener("click", checkAndLoad);
    window.addEventListener("keydown", e=> {if (e.code === "Enter"){checkAndLoad()}})
    
}

window.onload = init;