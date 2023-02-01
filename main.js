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
    


    function loadInitChat(){
        loadComputerChat("안녕하세요.<br>저는 끝말잇기 인공지능 끝파고입니다.<br>데이터베이스는 (구)표준국어대사전을 기준으로 하며 먼저 단어를 제시해주면 됩니다.")
    }
    loadInitChat()




}

window.onload = init;