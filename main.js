async function init(){
    const CHAT = document.querySelector(".chat-window");
    const INPUT = document.querySelector(".text-input");
    let response
    response = await fetch('https://singrum.github.io/mcts-wordchain/json/all_words_dict.json');
    const ALLWORDSDICT = await response.json();
    response = await fetch('https://singrum.github.io/mcts-wordchain/json/char_class.json');
    const CHARCLASS = await response.json();
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
            let curr_char = word[word.length - 1]
            if(isWin(curr_char)){
                let choiceword = nextWords(curr_char).filter(isLos).reduce((a, b) => losIndex(b) > losIndex(b) ? a:b);
                loadComputerChat(choiceword)
            }
            else if(isLos(curr_char)){
                
            }
            else{

            }
        }
        
    }
    let sc = (char)=>char.charCodeAt(0);//string to charcode
    let cs = (code)=>String.fromCharCode(code);//code to string
    function changable(char){
        if(sc(char) >= sc("랴") && sc(char) <= sc("럏") ||
        sc(char) >= sc("려") && sc(char) <= sc("렿") ||
        sc(char) >= sc("료") && sc(char) <= sc("룧") ||
        sc(char) >= sc("류") && sc(char) <= sc("륳") ||
        sc(char) >= sc("리") && sc(char) <= sc("맇") ||
        sc(char) >= sc("례") && sc(char) <= sc("롛")) 
            return [char, cs(sc(char) + sc("아") - sc("라"))];
        if(sc(char) >= sc("라") && sc(char) <= sc("랗") ||
        sc(char) >= sc("래") && sc(char) <= sc("랳") ||
        sc(char) >= sc("로") && sc(char) <= sc("롷") ||
        sc(char) >= sc("루") && sc(char) <= sc("뤃") ||
        sc(char) >= sc("르") && sc(char) <= sc("릏") ||
        sc(char) >= sc("뢰") && sc(char) <= sc("뢰")) 
            return [char, cs(sc(char) + sc('나') - sc("라"))];
        if(sc(char) >= sc("녀") && sc(char) <= sc("녛") ||
        sc(char) >= sc("뇨") && sc(char) <= sc("눃") ||
        sc(char) >= sc("뉴") && sc(char) <= sc("늏") ||
        sc(char) >= sc("니") && sc(char) <= sc("닣")) 
            return [char, cs(sc(char) + sc('아') - sc("나"))];
        return [char];
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
    function winIndex(char){
        for(let i in CHARCLASS.win){
            if(CHARCLASS.win.includes(char)){
                return i
            }
        }
    }
    function losIndex(char){
        for(let i in CHARCLASS.los){
            if(CHARCLASS.los.includes(char)){
                return i
            }
        }
    }
    
    function nextWords(char){
        return changable(char).reduce((a,b) => ALLWORDSDICT[a].concat(ALLWORDSDICT[b]))
    }


}

window.onload = init;