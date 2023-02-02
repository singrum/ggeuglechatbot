function init(){
    const CHAT = document.querySelector(".chat-window");
    const INPUT = document.querySelector(".text-input");
    const ALLWORDSDICT = {'a' : ['ab', 'bc'], 'b' : ['bc', 'ba']}
    const WINCHAR = []
    const LOSCHAR = []
    const CIRCHAR = []
    const HISTORY = []
    
    function loadComputerChat(text){
        CHAT.innerHTML += `<div class = "computer-chat">
            <div class = "icon-wrap">
                <div class = "icon"></div>
            </div>
            <div class = "nickname">끝파고</div>
            <div class = "content">
            <div class = "talkbubble">${text}</div>
        </div>
        </div>`;
    }
    
    function loadMyChat(text){
        CHAT.innerHTML += `<div class = "my-chat">
            <div class = "my-content">
                <div class = "my-talkbubble">${text}</div>
            </div>
        </div>`
    }

    function checkAndLoad(text){
        if(text !== ""){
            loadMyChat(text);
            CHAT.scrollTop = CHAT.scrollHeight;
            INPUT.click();
    };}

    CHAT.addEventListener("click", ()=>{CHAT.scrollTop = CHAT.scrollHeight;})
    document.querySelector(".chat-right").addEventListener("click", whenEntertheWord);
    window.addEventListener("keydown", e=> {if (e.code === "Enter"){whenEntertheWord()}})
    


    function loadInitChat(){
        loadComputerChat("안녕하세요.<br>끝말잇기 인공지능 끝파고입니다.<br>먼저 단어를 제시해주세요!")
    }
    loadInitChat()


    
    function whenEntertheWord(){
        let word = INPUT.value
        checkAndLoad(word);
        INPUT.value = "";
        if(isInvalid(word)){
            loadComputerChat("존재하지 않는 단어입니다!");
            return;
        }
        else if(isUsed(word)){
            loadComputerChat("이미 사용한 단어입니다!");
            return;
        }
        else{
            HISTORY.push(word)
            if(isWin(word[word.length - 1])){
                
            }
            else if(isLos(word[word.length - 1])){
                
            }
            else{

            }
        }
        
    }

    function isInvalid(word){
        if(ALLWORDSDICT[word[0]] === undefined){return true};
        if(!ALLWORDSDICT[word[0]].includes(word)){return true};
        return false;
    }
    function isUsed(word){
        if(HISTORY.includes(word)){return true}
        return false
    }
    function isWin(char){
        WINCHAR.includes(char);
    }
    function isLos(char){
        LOSCHAR.includes(char);
    }

}

window.onload = init;