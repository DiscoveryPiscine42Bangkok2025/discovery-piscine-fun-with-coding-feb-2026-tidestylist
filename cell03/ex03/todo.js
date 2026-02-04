// --- ส่วนจัดการ Cookie ---

// ฟังก์ชันดึงค่า Cookie ตามชื่อ
function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            // แปลงรหัสกลับเป็นข้อความปกติ (Decode)
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// ฟังก์ชันบันทึก Cookie
function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    // บันทึกโดยแปลงข้อความให้ปลอดภัย (Encode)
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// --- ส่วนการทำงานหลัก ---

var list = document.getElementById("ft_list");

// 1. โหลดข้อมูลเมื่อเปิดหน้าเว็บ (Window On Load)
window.onload = function() {
    var savedList = getCookie("todo_list");
    if (savedList) {
        // แปลงข้อความ JSON กลับเป็น Array
        var todos = JSON.parse(savedList);
        // วนลูปสร้างรายการ (ต้องวนย้อนหลัง เพราะเราใช้ prepend แทรกข้างบน)
        for (var i = todos.length - 1; i >= 0; i--) {
            addTodoToDOM(todos[i]);
        }
    }
};

// 2. ฟังก์ชันเพิ่มรายการลงในหน้าจอ (DOM)
function addTodoToDOM(text) {
    var div = document.createElement("div");
    div.innerHTML = text;

    // เพิ่มเหตุการณ์คลิกเพื่อลบ (Event Listener)
    div.onclick = function() {
        if (confirm("Do you want to remove this TO DO?")) {
            this.remove(); // ลบออกจากหน้าจอ
            saveList();    // บันทึกสถานะใหม่ลง Cookie
        }
    };

    // แทรกไว้บนสุด (Prepend)
    list.prepend(div);
}

// 3. ฟังก์ชันเมื่อกดปุ่ม New
function newTodo() {
    var text = prompt("Enter new TO DO:");
    // เช็คว่ามีข้อความและไม่ได้กด Cancel
    if (text && text.trim() !== "") {
        addTodoToDOM(text);
        saveList(); // บันทึกลง Cookie
    }
}

// 4. ฟังก์ชันบันทึกรายการทั้งหมดลง Cookie
function saveList() {
    var todos = [];
    var items = list.getElementsByTagName("div");
    // วนลูปเก็บข้อความจากทุก div
    for (var i = 0; i < items.length; i++) {
        todos.push(items[i].innerHTML);
    }
    // แปลง Array เป็นข้อความ JSON แล้วบันทึก
    setCookie("todo_list", JSON.stringify(todos), 365);
}