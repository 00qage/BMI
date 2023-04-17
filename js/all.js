import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// 指定 dom
var textHeight = document.querySelector('#userheight');
var textWeight = document.querySelector('#userweight');
var sendData = document.querySelector('#sendId');
var list = document.querySelector('.BMI-Record-List');
var body = document.body;

var BMIdata = [];
var webData = [];

//firebase
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB5z9bpL7W4X2V8jBuGsvmqcMimFYOVebs",
    authDomain: "bmi-test-f77db.firebaseapp.com",
    projectId: "bmi-test-f77db",
    storageBucket: "bmi-test-f77db.appspot.com",
    messagingSenderId: "136678421371",
    appId: "1:136678421371:web:0ac6d6b9e4490ee1fb03de",
    measurementId: "G-T0PS32NEK2"
};
// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
getData();

function getData() {
    getDocs(collection(db, "bmi")).then(
        docSnap => {
            let bmis = [];
            docSnap.forEach(doc => {
                bmis.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            webData = bmis;
            updateList(webData);
            console.log(webData);
        }
    );
};

// 更新網頁內容
function updateList(data) {
    list.textContent = '';
    for (const i in data) {
        var createLi = document.createElement('li');
        createLi.setAttribute('class', 'ToDelete animate1')
        list.appendChild(createLi);
        // createLi.textContent = ;
        var createA = document.createElement('a');
        var createDiv = document.createElement('div');
        var createEm = document.createElement('em');
        createLi.appendChild(createA);
        createA.setAttribute('data-number', i);
        createA.setAttribute('data-id', data[i].id);
        if (data[i].B <= 18.5) {
            createA.setAttribute('class', 'color Underweight');
            createDiv.setAttribute('class', 'BMI-Record-List-box');
            createEm.textContent = "過輕";
            createDiv.appendChild(createEm.cloneNode(true));
            createLi.appendChild(createDiv.cloneNode(true));
        } else if (data[i].B >= 18.5 && data[i].B < 24) {
            createA.setAttribute('class', 'color NormalRange');
            createDiv.setAttribute('class', 'BMI-Record-List-box');
            createEm.textContent = "理想";
            createDiv.appendChild(createEm.cloneNode(true));
            createLi.appendChild(createDiv.cloneNode(true));
        } else if (data[i].B >= 24 && data[i].B < 27) {
            createA.setAttribute('class', 'color Overweight');
            createDiv.setAttribute('class', 'BMI-Record-List-box');
            createEm.textContent = "過重";
            createDiv.appendChild(createEm.cloneNode(true));
            createLi.appendChild(createDiv.cloneNode(true));
        } else if (data[i].B >= 27 && data[i].B < 30) {
            createA.setAttribute('class', 'color Overweight-AtRisk');
            createDiv.setAttribute('class', 'BMI-Record-List-box');
            createEm.textContent = "輕度肥胖";
            createDiv.appendChild(createEm.cloneNode(true));
            createLi.appendChild(createDiv.cloneNode(true));
        } else if (data[i].B >= 30 && data[i].B < 35) {
            createA.setAttribute('class', 'color Overweight-ModeratelyObese');
            createDiv.setAttribute('class', 'BMI-Record-List-box');
            createEm.textContent = "中度肥胖";
            createDiv.appendChild(createEm.cloneNode(true));
            createLi.appendChild(createDiv.cloneNode(true));
        } else if (data[i].B >= 35) {
            createA.setAttribute('class', 'color Overweight-SeverelyObese');
            createDiv.setAttribute('class', 'BMI-Record-List-box');
            createEm.textContent = "重度肥胖";
            createDiv.appendChild(createEm.cloneNode(true));
            createLi.appendChild(createDiv.cloneNode(true));
        }

        createEm.textContent = data[i].B;
        createDiv.textContent = 'BMI';
        createDiv.appendChild(createEm.cloneNode(true));
        createLi.appendChild(createDiv.cloneNode(true));

        createEm.textContent = data[i].W + 'kg';
        createDiv.textContent = 'weight';
        createDiv.appendChild(createEm.cloneNode(true));
        createLi.appendChild(createDiv.cloneNode(true));

        createEm.textContent = data[i].H + 'cm';
        createDiv.textContent = 'height';
        createDiv.appendChild(createEm.cloneNode(true));
        createLi.appendChild(createDiv.cloneNode(true));

        createDiv.textContent = data[i].M + "-" + data[i].D + "-" + data[i].Y;
        createLi.appendChild(createDiv.cloneNode(true));
    }
}

function clickBtn(e) {
    console.log(e);
}

// var BMIdata = getData() || [];
// console.log(BMIdata);

$(document).ready(function () {
    var bmiBtn = document.querySelector('.color');

    // 監聽與更新
    sendData.addEventListener('click', addData);
    body.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            addData();
        }
    });
    $('.color').click(function (e) {
        e.preventDefault();
        clickBtn(e);
    });
    // bmiBtn.addEventListener('click', clickBtn);

    textHeight.addEventListener('focus', sendReset);
    textWeight.addEventListener('focus', sendReset);
    // list.addEventListener('click', toggleDone);
    //加入列表，並同步更新網頁與 localstorage
    // function addDataEnter(e) {
    //     if (e.keyCode == 13 ) {
    //         addData();
    //     }
    // }
    function addData() {
        if (textHeight.value == '' || textWeight.value == '') {
            alert('您的資料未填妥')
            return;
        }
        if (isNaN(textHeight.value) || isNaN(textWeight.value)) {
            alert('您只能輸入阿拉伯數字')
            return;
        }
        var Hei = parseInt(textHeight.value);
        var Wei = parseInt(textWeight.value);
        var BMI = Math.round(Wei / ((Hei * Hei) / 10000) * 100) / 100;
        var Time = new Date().getTime();

        var Year = new Date(Time).getFullYear();
        var Month = new Date(Time).getMonth() + 1;
        // 月份從0開始算 12月=11
        var Day = new Date(Time).getDate();
        var BMIchange = {
            B: BMI,
            W: Wei,
            H: Hei,
            T: Time,
            Y: Year,
            M: Month,
            D: Day,
        };
        console.log(BMIchange);
        addDoc(collection(db, "bmi"), BMIchange);
        webData.push(BMIchange);
        // localStorage.setItem('BMIData', JSON.stringify(data));

        updateList(webData);
        sendChange(BMI);
        textHeight.value = '';
        textWeight.value = '';
    }
    //按鍵變色
    function sendChange(BMI) {
        sendData.textContent = BMI;
        var createSpan = document.createElement('span');
        var createDiv = document.createElement('div');
        createSpan.textContent = 'BMI';
        sendData.appendChild(createSpan);
        var createH2 = document.createElement('h2');
        createH2.setAttribute('class', 'animated bounceInDown');
        sendData.appendChild(createH2);
        //icon
        createDiv.setAttribute('class', 'send-icon animated bounceInDown');
        sendData.appendChild(createDiv);
        var createI = document.createElement('i');
        createI.setAttribute('class', 'fa fa-refresh fa-spin');
        createDiv.appendChild(createI);


        if (BMI <= 18.5) {
            sendData.setAttribute('class', 'send-onclick send-Underweight animated bounceInDown');
            createH2.textContent = '過輕';
        } else if (BMI >= 18.5 && BMI < 24) {
            sendData.setAttribute('class', 'send-onclick send-NormalRange animated bounceInDown');
            createH2.textContent = '理想';
        } else if (BMI >= 24 && BMI < 27) {
            sendData.setAttribute('class', 'send-onclick send-Overweight animated bounceInDown');
            createH2.textContent = '過重';
        } else if (BMI >= 27 && BMI < 30) {
            sendData.setAttribute('class', 'send-onclick send-Overweight-AtRisk animated bounceInDown');
            createH2.textContent = '輕度肥胖';
        } else if (BMI >= 30 && BMI < 35) {
            sendData.setAttribute('class', 'send-onclick send-Overweight-ModeratelyObese animated bounceInDown');
            createH2.textContent = '中度肥胖';
        } else if (BMI >= 35) {
            sendData.setAttribute('class', 'send-onclick send-Overweight-SeverelyObese animated bounceInDown');
            createH2.textContent = '重度肥胖';
        }
    }

    //按text恢復
    function sendReset() {
        if (sendData.textContent !== '看結果') {
            sendData.setAttribute('class', 'send animated bounceInUp');
            sendData.textContent = '看結果';
        }

    }

    // 刪除代辦事項

    // function toggleDone(e) {
    //     e.preventDefault();
    //     if (e.target.nodeName !== 'A') {
    //         return
    //     }
    //     // console.log(e.target.nodeName);
    //     var key = e.target.dataset.number;
    //     BMIdata.child(key).remove();
    //     updateList(BMIdata);
    // }
    $(list).on('click', '.color', function (e) {
        $(this).parent('.ToDelete').fadeOut(1000, function () {
            $(this).remove();
            var key = e.target.dataset.id;
            deleteDoc(doc(db, "bmi", key));
            getData();
        });
    });

    // function toggleDone(e) {
    //     e.preventDefault();
    //     if (e.target.nodeName !== 'A') {
    //         return
    //     }
    //     // console.log(e.target.nodeName);
    //     var num = e.target.dataset.number;
    //     data.splice(num, 1);
    //     localStorage.setItem('BMIData', JSON.stringify(data));
    //     updateList(data);
    // }



});