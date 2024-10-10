let nameInput = document.getElementById("name");
let ageInput = document.getElementById("age");
let levelSelector = document.getElementById("level");
let submitBtn = document.getElementById("submit");
let dataDiv = document.getElementById("data-form");
let rateDiv = document.getElementById("rate-form");
let questionDiv = document.getElementById("rate");
let numOfQuestion = 3
let students = [];
let finish = false;
let toArchiveBtn = document.getElementById("toArchive");
let toTrashBtn = document.getElementById("toTrash");
let dataperant = document.getElementById("result-div");
let showArchiveBtn = document.getElementById("showArchiveBtn");

if (localStorage.getItem("Students") !== null) {
    students = JSON.parse(localStorage.getItem("Students"));
    showResult();
}

toArchiveBtn.onmouseenter = () => {
    toArchiveBtn.style.opacity = 1;
}

toArchiveBtn.onmouseleave = () => {
    toArchiveBtn.style.opacity = .6;
}

toTrashBtn.onmouseenter = () => {
    toTrashBtn.style.opacity = 1;
}

toTrashBtn.onmouseleave = () => {
    toTrashBtn.style.opacity = .6;
}


submitBtn.onmouseenter = () => {
    submitBtn.style.opacity = 1;
}

submitBtn.onmouseleave = () => {
    submitBtn.style.opacity = .6;
}

submitBtn.onclick = () => {
    if (nameInput.value !== "" && ageInput.value !== "" && !isNaN(parseInt(ageInput.value)) && parseInt(ageInput.value) >= 3 && parseInt(ageInput.value) <= 90) {
        setNumOfQuestion(levelSelector.options[levelSelector.selectedIndex].value);
        goToQuiz();
    } else {
        alert("برجاء مراجعة البيانات \n علما بأن : \n*العمر من 3 سنوات ل90 سنه\n*وجميع الحقول مطلوبة ")
    }
}

toTrashBtn.onclick = () => {
    finishQuiz();
}

toArchiveBtn.onclick = () => {
    let code = prompt("برجاء إدخال كود المسابقة");
    if (code === null || code === "" || code === "students") {
        alert("البيانات لم تسجل لوجود خطأ في كود المسابقة!");
    } else {
        addToArchive(code)
    }
}

function goToQuiz() {
    nameInput.disabled = true;
    ageInput.disabled = true;
    levelSelector.disabled = true;
    submitBtn.style.display = "none";
    rateDiv.style.display = "block";
    rateCreation();
}

function rateCreation() {

    let saveBtn = document.createElement("button");

    questionDiv.style.direction = "rtl";

    saveBtn.id = "finish";
    saveBtn.classList = "submit col-2";
    saveBtn.innerHTML = `حفظ النتائج <i class="fa - solid fa - floppy - disk"></i>`;
    saveBtn.onmouseenter = () => {
        saveBtn.style.opacity = 1;
    }

    saveBtn.onmouseleave = () => {
        saveBtn.style.opacity = .6;
    }


    for (let i = 0; i < numOfQuestion; i++) {
        let questionLable = document.createElement("label");
        let questionRateDiv = document.createElement("div");
        let hefzeLable = document.createElement("label");
        let hefzeRate = document.createElement("input");
        let telawaLable = document.createElement("label");
        let telawaRate = document.createElement("input");

        questionRateDiv.className = "col-10";

        questionLable.style.display = "block";
        questionLable.innerText = `السؤال رقم ${i + 1} :`;
        questionLable.style.margin = ".5rem";

        hefzeLable.innerText = `الحفظ`;
        hefzeLable.style.margin = ".3rem";

        telawaLable.innerText = `التلاوة`;
        telawaLable.style.marginLeft = ".3rem";

        hefzeRate.type = "number";
        hefzeRate.className = "rate-counter";
        hefzeRate.min = 0;
        hefzeRate.max = 10;
        hefzeRate.id = `hefzeRate${i + 1}`

        telawaRate.type = "number";
        telawaRate.min = 0;
        telawaRate.max = 10;
        telawaRate.className = "rate-counter";
        telawaRate.id = `telawaRate${i + 1}`;

        questionRateDiv.appendChild(hefzeLable);
        questionRateDiv.appendChild(hefzeRate);
        questionRateDiv.appendChild(telawaLable);
        questionRateDiv.appendChild(telawaRate);

        questionDiv.appendChild(questionLable);
        questionDiv.appendChild(questionRateDiv);
    }

    questionDiv.appendChild(saveBtn);
    rateDiv.appendChild(questionDiv);


    saveBtn.onclick = () => {
        finish = isfinish();
        if (finish) {
            saveData()
        }
    }
}

function saveData() {
    let student = {
        nameStd: "string",
        ageStd: "number",
        levelStd: "string",
        rate: "number"
    }
    let oldLength = students.length;
    student.nameStd = nameInput.value;
    student.ageStd = parseInt(ageInput.value);
    student.levelStd = levelSelector.options[levelSelector.selectedIndex].value;
    student.rate = Math.ceil(calculateRate());

    let ok = confirm(`  الإسم : ${student.nameStd}
        السن : ${student.ageStd}
        المستوى : ${student.levelStd}
        النتيجة : ${student.rate}`);
    if (ok) {
        let std = student
        students.push(std);
        const myJson = JSON.stringify(students);
        localStorage.setItem("Students", myJson);
        if (oldLength < students.length) {
            questionDiv.innerHTML = "";
            showResult();
            console.info(students);
            nextStudent();
        }

    }
}

function calculateRate() {
    if (finish) {
        let totalRate = 0;
        for (let i = 0; i < numOfQuestion; i++) {
            let hefze = parseInt(document.getElementById(`hefzeRate${i + 1}`).value);
            let telawa = parseInt(document.getElementById(`telawaRate${i + 1}`).value);
            totalRate += hefze;
            totalRate += telawa;
            console.log(totalRate);
        }
        return (totalRate / (2 * numOfQuestion)) * 10;
    }
}



function nextStudent() {
    nameInput.value = "";
    ageInput.value = "";
    nameInput.disabled = false;
    ageInput.disabled = false;
    levelSelector.disabled = false;
    submitBtn.style.display = "block";
    rateDiv.style.display = "none";
    finish = false;
}

function showResult() {
    let dataperant = document.getElementById("result-div");
    let toExcelBtn = document.getElementById("toexcel");
    let dataTable = document.getElementById("result-show");
    if (dataperant !== null) {
        dataperant.style.display = "block";
    }
    dataTable.innerHTML = `<thead id="header">
                <tr>
                <th scope="col">الاسم</th>
                <th scope="col">السن</th>
                <th scope="col">المستوى</th>
                <th scope="col">النتيجة</th>
                </tr>
                </thead>`;
    students.forEach((ele) => {
        let row = document.createElement("tr");
        let nameData = document.createElement("td");
        let ageData = document.createElement("td");
        let levelData = document.createElement("td");
        let rateData = document.createElement("td");

        nameData.scope = "col";
        ageData.scope = "col";
        levelData.scope = "col";
        rateData.scope = "col";

        nameData.innerText = ele.nameStd
        ageData.innerText = ele.ageStd;
        levelData.innerText = ele.levelStd;
        rateData.innerText = ele.rate;

        row.appendChild(nameData);
        row.appendChild(ageData);
        row.appendChild(levelData);
        row.appendChild(rateData);
        dataTable.appendChild(row);
    })
    toExcelBtn.onmouseenter = () => {
        toExcelBtn.style.opacity = 1;
    }

    toExcelBtn.onmouseleave = () => {
        toExcelBtn.style.opacity = .6;
    }
    toExcelBtn.onclick = () => {
        let fileName = 'exported.xlsx';
        let wb = XLSX.utils.table_to_book(dataTable);
        XLSX.writeFile(wb, fileName);
    }
}

function isfinish() {
    for (let i = 0; i < numOfQuestion; i++) {
        if (isNaN(parseInt(document.getElementById(`hefzeRate${i + 1}`).value)) ||
            isNaN(parseInt(document.getElementById(`telawaRate${i + 1}`).value)) ||
            parseInt(document.getElementById(`hefzeRate${i + 1}`).value) > 10 ||
            parseInt(document.getElementById(`telawaRate${i + 1}`).value) > 10 ||
            parseInt(document.getElementById(`hefzeRate${i + 1}`).value) < 0 ||
            parseInt(document.getElementById(`telawaRate${i + 1}`).value) < 0) {
            alert("برجاء مراجعة التقيمات \n علما بأن : \n*التقييم من 0 ل 10 \n*وجميع التقيمات لازمة")
            return false;
        }
    }
    return true;
}

function setNumOfQuestion(value) {
    switch (value) {
        case "one":
            numOfQuestion = 3;
            break;
        case "two":
            numOfQuestion = 4;
            break;
        case "three":
            numOfQuestion = 5;
            break;
        case "four":
            numOfQuestion = 6;
            break;
        case "fifth":
            numOfQuestion = 7;
            break;
        case "six":
            numOfQuestion = 8;
            break;
        case "seven":
            numOfQuestion = 9;
            break;
    }
}

function addToArchive(code) {
    if (localStorage.getItem(code) !== null) {
        const oldData = JSON.parse(localStorage.getItem(code));
        const data = [...oldData, ...students];
        localStorage.setItem(code, JSON.stringify(data));
    } else {
        localStorage.setItem(code, localStorage.getItem("Students"))
    }
    finishQuiz()
}

function finishQuiz() {
    localStorage.removeItem("students");
    students = [];
    dataperant.style.display = "none";
}


showArchiveBtn.onmouseenter = () => {
    showArchiveBtn.style.opacity = 1;
}

showArchiveBtn.onmouseleave = () => {
    showArchiveBtn.style.opacity = .6;
}

showArchiveBtn.onclick = () => {
    if (true) {
        const archive = document.getElementById("archive");
        archive.style.zIndex = 1;
        archive.style.display = "block";
        const allContainer = document.getElementsByClassName("container");
        for (let i = 0; i < allContainer.length; i++) {
            allContainer.item(i).classList.add("blur");
        }

    }

}