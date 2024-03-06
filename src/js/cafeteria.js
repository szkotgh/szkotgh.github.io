let body = document.querySelector('body');

let plusDayBtn = document.getElementById("plus-day-btn");
let minDayBtn = document.getElementById("minus-day-btn");
let resetDayBtn = document.getElementById("reset-day-btn");

let datePicker = document.getElementById('date-picker');
let applyDateBtn = document.getElementById('apply-date-btn');

let homeBtn = document.getElementById('home-btn')
let moveBtn = document.getElementById('move-btn')

let tableTitle = document.getElementById("table-title");

const refreshDelay = 1000;
const changeDelay  = 700;

let day_edit = 0;

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function get_schedule(offset) {
    // date
    const newDate = addDays(Date(), offset);
    const newYear = newDate.getFullYear();
    const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
    const newDay = String(newDate.getDate()).padStart(2, '0');

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeekIndex = newDate.getDay();
    const dayOfWeek = daysOfWeek[dayOfWeekIndex];

    const formattedDateForApi = `${newYear}${newMonth}${newDay}`;
    const formattedDateForTitle = `${newMonth}월 ${newDay}일 ${dayOfWeek}요일`;
    const formattedDate = `${newYear}년 ${newMonth}월 ${newDay}일 ${dayOfWeek}요일`;


    const apiKey = '521523f71bb84eb2bb2546940ffcc8e3';
    const apiUrl = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
    const params = {
        KEY: apiKey,
        Type: 'json',
        pIndex: 1,
        pSize: 1,

        ATPT_OFCDC_SC_CODE: 'J10',
        SD_SCHUL_CODE: '7531328',
        MLSV_YMD: formattedDateForApi
    };

    let schulName;
    let cafMenus;
    let cafDate;
    const tableBody = document.getElementById('timetableData');

    tableBody.innerHTML = ''
    tableTitle.innerHTML = '<h1 id="table-title-text">급식표</h1><div class="spinner"></div>'

    tableBody.innerHTML = ''
    const errorRow = tableBody.insertRow();
    const errorCell = errorRow.insertCell();
    errorCell.colSpan = 4;
    errorCell.textContent = '불러오는 중...';

    fetch(`${apiUrl}?${new URLSearchParams(params)}`)
        .then(response => response.json())
        .then(data => {
            const cafeTableData = data.mealServiceDietInfo[1].row[0];

            if (cafeTableData['SCHUL_NM']) {
                schulName = cafeTableData['SCHUL_NM'];
            }
            if (cafeTableData['DDISH_NM']) {
                cafMenus = cafeTableData['DDISH_NM'];
            }
            if (cafeTableData['MLSV_YMD']) {
                cafDate = cafeTableData['MLSV_YMD'];
            }

            tableBody.innerHTML = ''
            const row = tableBody.insertRow();
            row.style.opacity = '0';
            row.style.transition = 'opacity 0.5s ease-in-out';

            // animation
            setTimeout(() => {
                row.style.opacity = '1';
            }, 50);

            const cell = row.insertCell();
            cell.innerHTML = cafMenus;

            tableTitle.innerHTML = '<h1 id="table-title-text">급식표</h1><p id="table-sub-title">' + formattedDateForTitle + '</p>'
            document.getElementById('footer-text').innerText = formattedDate + (' (' + schulName + ')');

            setTimeout(() => {
                enabled_all_btn();
            }, refreshDelay)
        })
        .catch(error => {
            console.error('error: ', error);

            tableBody.innerHTML = ''
            const errorRow = tableBody.insertRow();
            const errorCell = errorRow.insertCell();
            errorCell.colSpan = 4;
            tableTitle.innerHTML = '<h1 id="table-title-text">급식표</h1><p id="table-sub-title">' + formattedDateForTitle + '</p>'
            errorCell.textContent = '데이터가 없거나 가져올 수 없습니다.';

            document.getElementById('footer-text').innerText = formattedDate

            setTimeout(() => {
                enabled_all_btn();
            }, refreshDelay)
        });
}

function disabled_all_btn() {
    plusDayBtn.setAttribute("disabled", "true");
    minDayBtn.setAttribute("disabled", "true");
    resetDayBtn.setAttribute("disabled", "true");
    applyDateBtn.setAttribute("disabled", "true");
}

function enabled_all_btn() {
    plusDayBtn.removeAttribute("disabled");
    minDayBtn.removeAttribute("disabled");
    resetDayBtn.removeAttribute("disabled");
    applyDateBtn.removeAttribute("disabled")
}

plusDayBtn.addEventListener("click", function () {
    disabled_all_btn();
    day_edit += 1;
    get_schedule(day_edit);
});

minDayBtn.addEventListener("click", function () {
    disabled_all_btn();
    day_edit -= 1;
    get_schedule(day_edit);
});

resetDayBtn.addEventListener("click", function () {
    disabled_all_btn();
    day_edit = 0;
    get_schedule(day_edit);
});

applyDateBtn.addEventListener('click', () => {
    const today = new Date();
    const selectedDate = new Date(document.getElementById('selected-date').value);

    const timeDiff = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (isNaN(diffDays)) {
        console.error("no select date")
        return
    }

    disabled_all_btn();
    day_edit = diffDays;
    get_schedule(day_edit);
});

let animateDuration = '.7s'

homeBtn.addEventListener('click', () => {
    body.classList.replace('animate__fadeIn', 'animate__fadeOut');
    body.style.setProperty('--animate-duration', animateDuration);

    setTimeout(function () {
        location.href = 'index.html'
    }, changeDelay)
})
moveBtn.addEventListener('click', () => {
    body.classList.replace('animate__fadeIn', 'animate__fadeOut');
    body.style.setProperty('--animate-duration', animateDuration);

    setTimeout(function () {
        location.href = 'schedule.html';
    }, changeDelay)
})

get_schedule(day_edit);
