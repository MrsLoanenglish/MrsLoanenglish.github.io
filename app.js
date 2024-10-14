  
//các mảng được lưu từ (sửa tay)
let class1 = ['waves', 'lift', 'motive', 'concur', 'Let go', 'pronunciation', 'time'];
let class2 = ['Got it', 'Fear', 'have not', 'Softer', 'centimental'];
let class3 = ['Put it', 'pretend', 'swallow', 'expensive', 'exclusive'];
let class4 = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'wave', 'swimming pool', 'ticket', 'cinema', 'stairs', 'balcony', 'lift'];
let class5 = ['grocery', 'restaurant', 'cathedral', 'theatre', 'square', 'railway station', 'art gallery'];
//
























const referrer = document.referrer;

        // Kiểm tra xem referrer có phải là Trang A hay không
        if (referrer === 'http://mrsloanenglish.atwebpages.com/') {
            // Hiển thị nội dung nếu đến từ Trang A
            //document.body.style.display = 'block';
        } else {
            // Nếu không, điều hướng về Trang A hoặc hiển thị cảnh báo
            //alert('Vui lòng đăng nhập !');
            //window.location.href = 'http://mrsloanenglish.atwebpages.com/';
        }




localStorage.setItem('class1', JSON.stringify(class1));
localStorage.setItem('class2', JSON.stringify(class2));
localStorage.setItem('class3', JSON.stringify(class3));
localStorage.setItem('class4', JSON.stringify(class4));
localStorage.setItem('class5', JSON.stringify(class5));

let storedClass1 = JSON.parse(localStorage.getItem('class1'));
let storedClass2 = JSON.parse(localStorage.getItem('class2'));
let storedClass3 = JSON.parse(localStorage.getItem('class3'));
let storedClass4 = JSON.parse(localStorage.getItem('class4'));
let storedClass5 = JSON.parse(localStorage.getItem('class5'));
const speakButton = document.getElementById('speakButton');
const stopButton = document.getElementById('stopButton');
const classSelect = document.getElementById('standard-select');
const recordButton = document.getElementById('recordButton');
const changeWordButton = document.getElementById('changeWordButton'); // Nút đổi từ
const resultDiv = document.getElementById('result');
const wordToPronounceElement = document.getElementById('wordToPronounce');
const botToken = '5804977775:AAEZ-ag6Be9-8Qb3QUmpuoeceEQtlsEz3tM';  // Thay bằng token từ BotFather
const chatId = '-4529879312';      // Thay bằng chat_id của người nhận
let message = 'Duongcheck!';

let wordToPronounce = wordToPronounceElement.innerText;

// Mảng các từ đã lưu sẵn (sửa tay)
let wordList = [];
classSelect.addEventListener('change', (event) => {
    const selectedClass = event.target.value;

    // Đặt màu nền tùy theo giá trị đã chọn
    switch (selectedClass) {
        case '1':  // Class 1
            wordList= storedClass1;
            break;
        case '2':  // Class 2
            wordList= storedClass2;
            break;
        case '3':  // Class 3
            wordList= storedClass3;
            break;
        case '4':  // Class 4
            wordList= storedClass4;
            break;
        case '5':  // Class 5
            wordList= storedClass5;
            break;
        default:   // Mặc định không đổi màu
            wordList= [];
    }
     if (wordList.length > 0) {
        wordToPronounce = wordList[0];  // Lấy từ đầu tiên của mảng mới
        wordToPronounceElement.innerText = wordToPronounce;  // Cập nhật hiển thị
        wordsToPronounce = wordToPronounce.toLowerCase().split(' ');  // Cập nhật mảng từ cần phát âm
        resultDiv.innerHTML = '';  // Xóa kết quả cũ nếu có
    } else {
        wordToPronounceElement.innerText = '';  // Nếu không có từ, để trống
    }
});


// Tách các từ ra thành mảng
let wordsToPronounce = wordToPronounce.toLowerCase().split(' ');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';  // Ngôn ngữ nhận diện
//recognition.lang = 'zh-CN';  // Ngôn ngữ nhận diện

recordButton.addEventListener('click', () => {
    if ((wordList.length == 0) || (document.getElementById('student_name').value === ''))
    {
        showCustomAlert();
        return;
    }
    document.getElementById("recordButton").style.backgroundColor = "#b3b3b3";
    recognition.start();  // Bắt đầu ghi âm
});

stopButton.addEventListener('click', () => {
    document.getElementById("recordButton").style.backgroundColor = "#4CAF50";
    recognition.stop(); 
});

recognition.onresult = function(event) {
    recordButton.innerHTML = 'Start Recording';
    const transcript = event.results[0][0].transcript.toLowerCase();
    resultDiv.innerHTML = `You Just Pronounced: <b>${transcript}</b>`;
    recordButton.innerHTML = 'Start Recording';
    recognition.stop();  // Dừng ghi âm sau khi có kết quả
    document.getElementById("recordButton").style.backgroundColor = "#4CAF50";
    // Tách các từ được phát âm ra thành mảng
    const spokenWords = transcript.split(' ');

    // Tính số từ đúng
    let correctWords = 0;
    wordsToPronounce.forEach((word, index) => {
        if (spokenWords[index] && spokenWords[index] === word) {
            correctWords++;
        }
    });
    // Tính điểm trên thang điểm 10
    const score = (correctWords / wordsToPronounce.length) * 10;
    resultDiv.innerHTML += `<br>Your Point: <b>${score.toFixed(1)}/10</b>`;
    message = `${studentname}: ${score.toFixed(1)}đ : (${transcript} / ${wordToPronounce} )`
    sendMessage();

    // Đưa ra phản hồi dựa trên điểm
    if (score === 10) {
        resultDiv.innerHTML += `<br> <h2 style="color: green">🎉 Good, very good pronunciation! </h2>`;
    } else if (score >= 7) {
        resultDiv.innerHTML += `<br> <h2 style="color: #ff730b">👍 Pretty good, but still needs improvement.</h2>`;
    } else {
        resultDiv.innerHTML += `<br>❌ <h2 style="color: red"> Incorrect pronunciation. </h2>`;
    }
};

recognition.onerror = function(event) {
    resultDiv.innerHTML = 'Error occurred in recognition: ' + event.error;
    document.getElementById("recordButton").style.backgroundColor = "#4CAF50";
};

// Đổi từ cần phát âm khi nhấn nút "Đổi từ khác"
changeWordButton.addEventListener('click', () => {
    if (wordList.length == 0)
    {
        showCustomAlert();
        return;
    }
    // Lấy ngẫu nhiên một từ từ danh sách wordList
    //const randomIndex = Math.floor(Math.random() * wordList.length);
    //wordToPronounce = wordList[randomIndex];
    // Ví dụ gọi hàm để lấy từ tiếp theo
    getNextWord();
    // Cập nhật nội dung của thẻ h2
    wordToPronounceElement.innerText = wordToPronounce;

    // Cập nhật lại mảng wordsToPronounce
    wordsToPronounce = wordToPronounce.toLowerCase().split(' ');

    // Xóa kết quả cũ
    resultDiv.innerHTML = '';
});

let currentIndex = 0;

function getNextWord() {
    wordToPronounce = wordList[currentIndex];
    currentIndex = (currentIndex + 1) % wordList.length; // Khi đến hết danh sách, quay lại từ đầu
}
speakButton.addEventListener('click', () => {
    if (wordToPronounce) {
        speak(wordToPronounce); // Gọi hàm phát âm
    }
});

// Hàm phát âm sử dụng Web Speech API
function speak(text) {
    responsiveVoice.speak(text, "US English Female");
}

// Hàm gửi tin nhắn
async function sendMessage() {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Message sent successfully:', data);
    } else {
        console.error('Error sending message:', response.statusText);
    }
}
function showCustomAlert() {
        document.getElementById('customAlert').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }

    function closeCustomAlert() {
        document.getElementById('customAlert').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }

