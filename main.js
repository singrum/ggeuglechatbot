async function init(){
    const CHECKKOREAN = (char) => {
        
        let isThereLastChar = (char.charCodeAt(0) - 44032) % 28
        if (isThereLastChar) {
          return '으로'
        }
        return '로'
    }
    const CHAT = document.querySelector(".chat-window");
    const INPUT = document.querySelector(".text-input");
    let response
    response = await fetch('https://singrum.github.io/mcts-wordchain/json/all_words_dict.json');
    const ALLWORDSDICT = await response.json();
    response = await fetch('https://singrum.github.io/mcts-wordchain/json/char_class.json');
    const CHARCLASS = await response.json();
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
        if(isNotConnect(word)){
            let last = HISTORY[HISTORY.length - 1]
            console.log(last[last.length - 1])
            loadComputerChat(`'${last[last.length - 1]}'${CHECKKOREAN(last[last.length - 1])} 시작하는 단어를 입력해주세요!`);
            return;
        }
        if(isUsed(word)){
            loadComputerChat("이미 사용한 단어입니다!");
            return;
        }

        HISTORY.push(word)
        let curr_char = word[word.length - 1]
        
        if(nextWords(curr_char).length === 0){
            loadComputerChat("Game Over<br>당신이 승리하셨습니다!");
            return;
        }
        let choice;
        if(winIndex(curr_char) >= 0){
            /* 승리음절 */
            choice = nextWinWord(curr_char);
            if (choice === -1){
                choice = nextLosWord(curr_char)
            }
        }
        else if(losIndex(curr_char) >= 0){
            /* 패배음절 */
            choice = nextLosWord(curr_char)
        }
        else{
            /* 순환음절 */
            
        }
        HISTORY.push(choice)
        loadComputerChat(choice);
        if(nextWords(choice[choice.length - 1]).length === 0){
            loadComputerChat("Game Over<br>제가 승리했습니다!");
            return;
        }
    }

    function changable(char){
        let sc = (char)=>char.charCodeAt(0);//string to charcode
        let cs = (code)=>String.fromCharCode(code);//code to string
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

    function isNotConnect(word){
        if(HISTORY.length === 0) return false;
        let last = HISTORY[HISTORY.length - 1]
        if(nextWords(last[last.length - 1]).includes(word)){return false};
        return true
    }

    function isUsed(word){
        if(HISTORY.includes(word)){return true}
        return false
    }
    
    function winIndex(char){return CHARCLASS.win.findIndex(x => x.includes(char)) /* win이 아니면 -1 반환 */}
    function losIndex(char){return CHARCLASS.los.findIndex(x => x.includes(char)) /* los가 아니면 -1 반환 */}
    function nextWords(char){return changable(char).map(x => ALLWORDSDICT[x]).flat().filter(x=>!HISTORY.includes(x))}

    function nextWinWord(char){
        let win_words = nextWords(char).filter(x => losIndex(x[x.length - 1]) >= 0)
        if(win_words.length === 0){
            return -1
        }
        return win_words.reduce((a, b) => losIndex(a[a.length - 1]) < losIndex(b[b.length - 1]) ? a:b);
    }
    function nextLosWord(char){
        let los_words = nextWords(char).filter(x => winIndex(x[x.length - 1]) >= 0)
        return los_words.reduce((a, b) => winIndex(a[a.length - 1]) > winIndex(b[b.length - 1]) ? a:b);
    }

}

window.onload = init;