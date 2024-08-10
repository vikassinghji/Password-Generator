// fetching element by custome attribute

const inputSlide=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#upperCase");
const lowercaseCheck=document.querySelector("#lowerCase");
const symbolCheck=document.querySelector("#Symbols");
const numberCheck=document.querySelector("#Numbers")
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allcheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='!~*&%([)]{}/+-><^$#@s';

//initially
let password="";
let passwordLength=10;
let checkCount=0;
setIndicator("#ccc");
handleSlider();

function handleSlider(){
    inputSlide.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    let mini=inputSlide.min;
    let maxi=inputSlide.max;
    inputSlide.style.backgroundSize=( (passwordLength-mini)*100/(maxi-mini) )+"% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateRandomLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateRandomUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateRandomSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch{
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    }, 1000);

}

function sufflePassword(arr){
    // fisher yates method
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      const temp=arr[i];
      arr[i]=arr[j];
      arr[j]=temp;
    }
    let str="";
    arr.forEach((ele)=> (str+=ele) );
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allcheckBox.forEach(  (checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allcheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlide.addEventListener('input', (e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
        copyContent();
});


generateBtn.addEventListener('click', ()=>{
    if(checkCount<=0){
        return;
    }

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    password="";

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateRandomUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateRandomLowerCase);
    }

    if(symbolCheck.checked){
        funcArr.push(generateRandomSymbol);
    }

    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    // cumpulsory
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    // remaining
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let rndIndx=getRndInteger(0,funcArr.length);
        password+=funcArr[rndIndx]();
    }

    password=sufflePassword(Array.from(password));

    passwordDisplay.value=password;

    calcStrength();
});
