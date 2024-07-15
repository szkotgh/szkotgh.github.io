// const rand_arr_btn = document.getElementById('rand_arr_btn')
const sort_btn = document.getElementById('sort_btn')
const size_range = document.getElementById('size_range')
const delay_range = document.getElementById('delay_range')
const size_range_value = document.getElementById('size_range_value')
const delay_range_value = document.getElementById('delay_range_value')
const result_field = document.getElementById('result')

let array = [];
let sort_size = 20;
let sort_delay = 100;
let sort_finished = false

// rand_arr_btn.onclick = generateRandomArray
sort_btn.onclick = quickSort

generateRandomArray()

size_range.addEventListener('input', (e) => {
    size_range_value.value = e.target.value
    sort_size = e.target.value
    generateRandomArray()
    sort_finished = false
})
size_range_value.addEventListener('input', (e) => {
    size_range.value = e.target.value
    sort_size = e.target.value
    generateRandomArray()
    sort_finished = false
})
delay_range.addEventListener('input', (e) => {
    delay_range_value.value = e.target.value
    sort_delay = e.target.value
})
delay_range_value.addEventListener('input', (e) => {
    delay_range.value = e.target.value
    sort_delay = e.target.value
})

function status_normal() {
    // rand_arr_btn.disabled = false;
    sort_btn.disabled = false;
    size_range.disabled = false;
    size_range_value.disabled = false;
    delay_range.disabled = false;
    delay_range_value.disabled = false;
}
function status_sorting() {
    // rand_arr_btn.disabled = true;
    sort_btn.disabled = true;
    size_range.disabled = true;
    size_range_value.disabled = true;
    delay_range.disabled = false;
    delay_range_value.disabled = false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createBars(arr, pivotIndex, activeIndex) {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '';

    for (let i = 0; i < arr.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${arr[i] * 3}px`;

        if (i === pivotIndex) {
            bar.classList.add('pivot');
        }
        else if (i === activeIndex) {
            bar.classList.add('active');
        }

        chartContainer.appendChild(bar);
    }
}

function generateRandomArray() {
    const size = sort_size;
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(getRandomInt(1, 100));
    }
    createBars(array, -1, -1);
}

async function quickSort() {
    let active_val_count = 0

    status_sorting()

    if (sort_finished){
        generateRandomArray()
    }

    async function partition(arr, left, right) {
        let pivot = arr[Math.floor((right + left) / 2)];
        let i = left;
        let j = right;

        while (i <= j) {
            while (arr[i] < pivot) {
                i++;
            }
            while (arr[j] > pivot) {
                j--;
            }
            if (i <= j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                createBars(arr, i, j);
                await new Promise(resolve => setTimeout(resolve, sort_delay));
                active_val_count++;
                i++;
                j--;
            }
        }
        return i;
    }

    async function quickSortHelper(arr, left, right) {
        let index;
        if (arr.length > 1) {
            index = await partition(arr, left, right);
            if (left < index - 1) {
                await quickSortHelper(arr, left, index - 1);
            }
            if (index < right) {
                await quickSortHelper(arr, index, right);
            }
        }
    }

    await quickSortHelper(array, 0, array.length - 1);
    createBars(array, -1, -1);
    Array.from(document.getElementsByClassName('bar')).forEach((bar) => {
        bar.classList.add('complete')
    })
    status_normal();
    result_field.innerText = "개수: " + sort_size + " |" + " 값 변경 횟수: " + active_val_count;
    sort_finished = true
}