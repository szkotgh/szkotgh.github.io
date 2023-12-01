const today = new Date();

let day_edit = 0

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// 일 수 조작
function get_schedule(offset) {
    const newDate = addDays(today, offset);
    const newYear = newDate.getFullYear();
    const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
    const newDay = String(newDate.getDate()).padStart(2, '0');
    
    const formattedDateForApi = `${newYear}${newMonth}${newDay}`;
    const formattedDate = `${newYear}년 ${newMonth}월 ${newDay}일`;
    
    const apiKey = '521523f71bb84eb2bb2546940ffcc8e3';
    const apiUrl = 'https://open.neis.go.kr/hub/hisTimetable';
    const params = {
        KEY: apiKey,
        Type: 'json',
        pIndex: 1,
        ATPT_OFCDC_SC_CODE: 'J10',
        SD_SCHUL_CODE: '7531328',
        GRADE: 1,
        CLASS_NM: 9,
        ALL_TI_YMD: formattedDateForApi
    };
    
    const tableBody = document.getElementById('timetableData');
    tableBody.innerHTML = ''; // 기존 내용을 지움

    let schulName;
    let grade;
    let classNm;

    fetch(`${apiUrl}?${new URLSearchParams(params)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            const timetableData = data.hisTimetable[1].row;
            const desiredFields = ['GRADE', 'CLASS_NM', 'PERIO', 'ITRT_CNTNT'];
    
            timetableData.forEach(rowData => {
                if (rowData['SCHUL_NM']) {
                    schulName = rowData['SCHUL_NM'];
                }
                if (rowData['GRADE']) {
                    grade = rowData['GRADE'];
                }
                if (rowData['CLASS_NM']) {
                    classNm = rowData['CLASS_NM'];
                }
    
                const row = tableBody.insertRow();
                for (const key in rowData) {
                    if (desiredFields.includes(key)) {
                        const cell = row.insertCell();
                        cell.textContent = rowData[key];
                    }
                }
            });
            document.getElementById('footer-text').innerText = schulName + ' ' + grade + '학년 ' + classNm + '반 ' + formattedDate;
        })
        .catch(error => {
            console.error('에러남: ', error)
        });
}


function plus_day(){
    console.log(day_edit)
    day_edit+=1
    get_schedule(day_edit)
}

function minus_day(){
    day_edit-=1
    get_schedule(day_edit)
}

function reset_day(){
    day_edit=0
    get_schedule(day_edit)
}

window.onload = function () {
    let plus_day_btn = document.getElementById("plus-day-btn");
    let min_day_btn = document.getElementById("minus-day-btn");
    let reset_day_btn = document.getElementById("reset-day-btn");
    
    plus_day_btn.onclick = plus_day
    min_day_btn.onclick = minus_day
    reset_day_btn.onclick = reset_day
}


get_schedule(day_edit);

