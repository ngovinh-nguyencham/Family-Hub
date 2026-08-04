//======================================================
// FAMILY HUB
// app.js
// Part 1/4
//======================================================

//=========================
// GOOGLE SHEET
//=========================

const sheetID = "1ysNYpooAXu07MsLfL3XNxVSbzBlntueaXgRcksx5nXk";

const urlTKB =
`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&gid=0`;

const urlMON =
`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&gid=757851887`;


//=========================
// ĐỌC FILE CSV
//=========================

async function fetchCSV(url){

    const res = await fetch(url + "&t=" + Date.now());

    const text = await res.text();

    const rows = text
        .split(/\r?\n/)
        .filter(r => r.trim() !== "")
        .map(r =>
            r
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map(c => c.replace(/^"(.*)"$/, "$1"))
        );

    const header = rows[0];

    return rows.slice(1).map(row=>{

        let obj = {};

        header.forEach((h,i)=>{

            obj[h] = row[i] || "";

        });

        return obj;

    });

}



//=========================
// HÔM NAY LÀ THỨ MẤY
//=========================

function getTodayColumn(){

    const day = new Date().getDay();

    switch(day){

        case 1: return "Thứ 2";
        case 2: return "Thứ 3";
        case 3: return "Thứ 4";
        case 4: return "Thứ 5";
        case 5: return "Thứ 6";
        case 6: return "Thứ 7";

        default:
            return "Chủ Nhật";

    }

}



//=========================
// MAP MÔN HỌC
//=========================

function createSubjectMap(monhoc){

    const map = {};

    monhoc.forEach(item=>{

        map[item["Môn"]] = item;

    });

    return map;

}
//=========================
// HIỂN THỊ THỜI KHÓA BIỂU
//=========================

function drawSchedule(tkb, subjectMap){

    if(tkb.length === 0){

        document.getElementById("schedule").innerHTML =
            "<p>Không có dữ liệu.</p>";

        return;

    }

    let html = "<table>";

    // Tiêu đề
    html += "<tr>";

    Object.keys(tkb[0]).forEach(col=>{

        html += `<th>${col}</th>`;

    });

    html += "</tr>";



    // Nội dung
    tkb.forEach(row=>{

        html += "<tr>";

        Object.values(row).forEach(value=>{

            const info = subjectMap[value];

            if(info){

                const color = info["Màu"] || "#eeeeee";

                html += `
                    <td
                        style="
                            background:${color};
                            color:#333;
                            font-weight:600;
                            border:1px solid ${color};
                        ">
                        ${value}
                    </td>
                `;

            }
            else{

                html += `<td>${value}</td>`;

            }

        });

        html += "</tr>";

    });

    html += "</table>";

    document.getElementById("schedule").innerHTML = html;

}
//=========================
// HÔM NAY CẦN MANG
//=========================

function drawBag(tkb, subjectMap){

    const today = getTodayColumn();

    let html = "";

    // Chỉ lấy mỗi môn 1 lần
    const usedSubjects = new Set();

    tkb.forEach(row=>{

        const mon = row[today];

        // Bỏ ô trống hoặc dấu -
        if(!mon || mon.trim()==="" || mon==="-" ) return;

        // Nếu môn đã có thì bỏ qua
        if(usedSubjects.has(mon)) return;

        usedSubjects.add(mon);

        const info = subjectMap[mon];

        if(!info) return;

        const color = info["Màu"] || "#64B5F6";

        // Danh sách đồ dùng
        const tools = (info["Đồ dùng"] || "")
            .split("|")
            .map(x=>x.trim())
            .filter(x=>x!=="")
            .map(x=>`<div>🧰 ${x}</div>`)
            .join("");

        html += `

        <div class="item"
            style="
                border-left:8px solid ${color};
                background:#ffffff;
            ">

            <h3
                style="
                    background:${color};
                    color:#333;
                    padding:8px;
                    border-radius:8px;
                    text-align:center;
                    margin-bottom:10px;
                ">
                ${mon}
            </h3>

            ${
                info["Sách Giáo Khoa"]==="TRUE"
                ?"<div>📘 Sách Giáo Khoa</div>"
                :""
            }

            ${
                info["Sách Bài Tập"]==="TRUE"
                ?"<div>📗 Sách Bài Tập</div>"
                :""
            }

            ${
                info["Vở"] &&
                info["Vở"]!=="-"
                ?`<div>📒 ${info["Vở"]}</div>`
                :""
            }

            ${
                tools
                ?`<hr>${tools}`
                :""
            }

        </div>

        `;

    });

    if(html===""){

        html = `
        <div class="item">
            Hôm nay không có dữ liệu.
        </div>
        `;

    }

    document.getElementById("todayBag").innerHTML = html;

}
//=========================
// KHỞI ĐỘNG
//=========================

async function init(){

    try{

        // Đọc dữ liệu từ Google Sheet
        const [tkb, monhoc] = await Promise.all([
            fetchCSV(urlTKB),
            fetchCSV(urlMON)
        ]);

        // Không có dữ liệu
        if(tkb.length === 0){

            document.getElementById("schedule").innerHTML =
                "<p>Không có dữ liệu thời khóa biểu.</p>";

            document.getElementById("todayBag").innerHTML =
                "<p>Không có dữ liệu.</p>";

            return;

        }

        // Tạo Subject Map
        const subjectMap = createSubjectMap(monhoc);

        // Hiển thị thời khóa biểu
        drawSchedule(tkb, subjectMap);

        // Hiển thị đồ cần mang
        drawBag(tkb, subjectMap);

    }
    catch(err){

        console.error("Family Hub Error:", err);

        document.getElementById("schedule").innerHTML = `
            <div class="item">
                ❌ Không tải được Google Sheet
            </div>
        `;

        document.getElementById("todayBag").innerHTML = `
            <div class="item">
                ❌ Không tải được dữ liệu
            </div>
        `;

    }

}



//=========================
// REFRESH TỰ ĐỘNG
//=========================

// Làm mới dữ liệu mỗi 5 phút
setInterval(init, 5 * 60 * 1000);



//=========================
// REFRESH KHI TAB ĐƯỢC MỞ LẠI
//=========================

document.addEventListener("visibilitychange", ()=>{

    if(!document.hidden){

        init();

    }

});



//=========================
// START
//=========================

document.addEventListener("DOMContentLoaded", ()=>{

    init();

});
