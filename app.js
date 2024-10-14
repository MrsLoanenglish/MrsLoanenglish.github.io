


// URL của Google Sheet CSV
const sheetId = '1ULpKy8M10z9PG8IElWkAcaHG_Hd0u_Bu57GYGBBCBh4'; // Thay YOUR_GOOGLE_SHEET_ID bằng ID Google Sheet của bạn
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
        
// Tạo các mảng cho các class
let class1 = [];
let class2 = [];
let class3 = [];
let class4 = [];
let class5 = [];
let isDataLoaded = false; // Thêm cờ đánh dấu khi dữ liệu được tải
// Hàm lấy dữ liệu từ Google Sheet CSV
fetch(url)
    .then(response => response.text())
    .then(csvData => {
        const rows = csvData.split('\n').slice(1); // Bỏ dòng tiêu đề
        // Duyệt qua từng hàng của CSV
        rows.forEach(row => {
            const columns = row.split(',');
            
            // Chia dữ liệu thành các cột tương ứng với từng class
            if (columns.length >= 5) { // Kiểm tra đủ 5 cột dữ liệu
                class1.push(columns[0].replace(/['"]/g, '').trim());
                class2.push(columns[1].replace(/['"]/g, '').trim());
                class3.push(columns[2].replace(/['"]/g, '').trim());
                class4.push(columns[3].replace(/['"]/g, '').trim());
                class5.push(columns[4].replace(/['"]/g, '').trim());
            }
        });
        //console.log("Dữ liệu được lưu thành công vào localStorage!");
        isDataLoaded = true; // Đặt cờ khi dữ liệu được tải
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

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
        if (!isDataLoaded) { // Kiểm tra xem dữ liệu đã tải chưa
        //console.log("Dữ liệu chưa được tải!");
        return;
    }
    const selectedClass = event.target.value;

    // Đặt màu nền tùy theo giá trị đã chọn
    switch (selectedClass) {
        case '1':  // Class 1
            wordList= class1;
            break;
        case '2':  // Class 2
            wordList= class2;
            break;
        case '3':  // Class 3
            wordList= class3;
            break;
        case '4':  // Class 4
            wordList= class4;
            break;
        case '5':  // Class 5
            wordList= class5;
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
        //console.log('Message sent successfully:', data);
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

