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
    response = await fetch('https://singrum.github.io/mcts-wordchain/json/cir_words_dict.json');
    const CIRWORDSDICT = await response.json()
    const CIRGRAPH = makeChangableNode(makeGraph(CIRWORDSDICT))

    const HISTORY = []
    window.onresize = function(){CHAT.style.height = "calc(100% - 120px)";} // 모바일 적용되는지 확인
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
        CHAT.scrollTop = CHAT.scrollHeight;
    }
    
    function loadMyChat(text){
        CHAT.innerHTML += `<div class = "my-chat">
            <div class = "my-content">
                <div class = "my-talkbubble">${text}</div>
            </div>
        </div>`
        CHAT.scrollTop = CHAT.scrollHeight;
    }


    document.querySelector(".chat-right").addEventListener("click", whenEntertheWord);
    window.addEventListener("keydown", e=> {if (e.code === "Enter"){whenEntertheWord()}})
    


    function loadInitChat(){
        loadComputerChat("안녕하세요.<br>끝말잇기 인공지능 끝파고입니다.<br>먼저 단어를 제시해주세요!")
    }
    loadInitChat()


    
    function whenEntertheWord(){
        let word = INPUT.value
        if (word.replace(/\s/g, '').length === 0){
            // 공백만 포함 돼 있으면
            return;
        }
        loadMyChat(word);
        INPUT.click();
        
        INPUT.value = "";
        if(isInvalid(word)){
            loadComputerChat("존재하지 않는 단어입니다!");
            return;
        }
        if(isNotConnect(word)){
            let last = HISTORY[HISTORY.length - 1]
            
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
            choice = nextLosWord(curr_char);
        }
        else{
            /* 순환음절 */
            choice = nextCirWord(curr_char);
        }
        HISTORY.push(choice)
        loadComputerChat(choice);
        if(nextWords(choice[choice.length - 1]).length === 0){
            loadComputerChat("Game Over!<br>제가 승리했습니다!");
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

    function nextCirWord(char){
        let graph = makeGraph();
    }

    function makeGraph(dict){
        let graph = {}
        for(let char in dict){
            graph[char] = {};
            for(let nextword of dict[char]){
                counterIncrease(graph[char], nextword[nextword.length - 1])
            }
        }
        return graph;
    }

    function counterIncrease(counter, char){
        counter[char] = counter[char] ?? 0;
        counter[char] ++;
    }
    
    function copyGraph(graph){
        return JSON.parse(JSON.stringify(graph))
    }

    function makeChangableNode(graph){
        subgraph = {};
        for(let char in graph){
            let chans = changable(char)
            if(chans.length > 1){
                let chan = chans[1];
                if(graph[chan]){
                    subgraph[`${char}-${chan}`] = {};
                    counterIncrease(subgraph[`${char}-${chan}`], chan);
                    counterIncrease(graph[char], `${char}-${chan}`);
                }
            }
        }
        for(let chanNode in subgraph){
            graph[chanNode] = subgraph[chanNode]
        }
        return graph
    }
    
    function removeZero(counter){
        for(let key in counter){
            if(counter[key] === 0){
                delete counter[key]
            }
        }
    }
    class Node{
        constructor(curr_char, history, parent = undefined){
            this.n = 0;
            this.w = 0;
            this.curr_char = curr_char;
            this.history = history;
            this.parent = parent;
            this.next_char = this.getNextChar(); /*Counter*/

            this.children = {};
        }
        getNextChar(){
            let result = {...CIRGRAPH[this.curr_char]};
            if(this.history[this.curr_char]){
                for(let char in this.history[this.curr_char]){
                    result[char] -= this.history[this.curr_char][char];
                    removeZero(result);
                }
            }
            return result
        }
        select(){
            return Object.values(this.children).reduce((a, b)=>{ return a.UTC() > b.UTC() ? a:b;});
        }
        UTC(){
            return this.w / this.n + Math.sqrt(2 * Math.log(this.parent.n) / this.n)
        }
        expand(){
            for(let char in this.next_char){
                if(!this.children[char]){
                    let child = this.makeChild(char);
                    this.children[char] = child;
                    return child;
                }
            }
        }
        makeChild(char){
            let history_copy = copyGraph(this.history)
            if(this.curr_char.length === 1 && char.length === 1){
                if(!history_copy[this.curr_char]){
                    history_copy[this.curr_char]={}
                }
                counterIncrease(history_copy[this.curr_char], char)
            }
            let child = new Node(char, history_copy, this)
            return child
        }
        isEnd(){
            if(Object.keys(this.next_char).length === 0) return true;
        }
        isComplete(){
            return Object.keys(this.children).length === Object.keys(this.next_char).length;
        }
        winProb(){
            return 1 - this.w / this.n
        }
        
    }

    function simulate(node, stack){
        let ptr = node;
        stack.push(ptr);
        while(true){
            ptr = ptr.isComplete() ? ptr.select() : ptr.expand();
            stack.push(ptr);
            if(ptr.isEnd()) break;

        }
    }

    function backprop(stack){
        let alter = true;
        let node;
        while(stack.length !== 0){
            node = stack.pop();
            node.n++;
            
            if(alter){
                node.w++;
            }
            alter = !alter;
        }
    }

    function learn(node, iter = 10){
        let stack = []
        console.log(`...learning start(${iter} times)`)
        let j = 1;
        for(let i = 0; i < iter; i++){
            if(i + 1 === parseInt(iter * j / 10)){
                console.log(`...learning ${j}0%`);
                j++;
            }
            simulate(node, stack);
            backprop(stack);
        }
    }
    let n = new Node("증", {})
    // learn(n,3000)
    
    console.log(n)


    // print(f'...learning start ({expand} times)')
    // j = 1
    // for i in range(expand):
    //     if (i+1) == expand * j// 10:
    //         print(f'...learning {j}0%')
    //         j += 1
    //     simulate(node, stack)
    //     backpropagate(stack)
}

window.onload = init;