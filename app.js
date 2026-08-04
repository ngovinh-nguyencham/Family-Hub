//==================================================
// FAMILY HUB
// APP.JS
// PART 1/3
//==================================================


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
            r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map(c => c.replace(/^"(.*)"$/, "$1"))
        );

    const header = rows[0];

    return rows.slice(1).map(r=>{

        let obj = {};

        header.forEach((h,i)=>{

            obj[h] = r[i] || "";

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
// TẠO SUBJECT MAP
//=========================

function createSubjectMap(monhoc){

    const map = {};

    monhoc.forEach(m=>{

        const tenMon = (m["Môn"] || "")
            .trim()
            .toLowerCase();

        map[tenMon] = m;

    });

    return map;

}



//=========================
// HIỂN THỊ THỜI KHÓA BIỂU
//=========================

function drawSchedule(tkb, subjectMap){

    if(tkb.length===0){

        document.getElementById("schedule").innerHTML =
        "<p>Không có dữ liệu.</p>";

        return;

    }

    let html = "<table>";

    html += "<tr>";

    Object.keys(tkb[0]).forEach(h=>{

        html += `<th>${h}</th>`;

    });

    html += "</tr>";



    tkb.forEach(row=>{

        html += "<tr>";

        Object.entries(row).forEach(([key, value])=>{

            // Cột Tiết
            if(key === "Tiết"){

                const tietColor = {
                    "1":"#E8F5E9",
                    "2":"#E3F2FD",
                    "3":"#FFF3E0",
                    "4":"#F3E5F5",
                    "5":"#FCE4EC",
                    "6":"#FFF9C4",
                    "7":"#E0F2F1",
                    "8":"#ECEFF1",
                    "9":"#F1F8E9",
                    "10":"#EDE7F6"
                };

                html += `
                    <td style="
                        background:${tietColor[value] || "#eeeeee"};
                        font-weight:bold;
                        text-align:center;
                    ">
                        Tiết ${value}
                    </td>
                `;

            }
            else{

                const info = subjectMap[
                    (value || "")
                        .trim()
                        .toLowerCase()
                ];

                if(info){

                    const color = info["Màu"] || "#eeeeee";

                    html += `
                        <td style="
                            background:${color};
                            color:#333;
                            font-weight:600;
                        ">
                            ${value}
                        </td>
                    `;

                }else{

                    html += `<td>${value}</td>`;

                }

            }

        });

        html += "</tr>";

    });

    html += "</table>";

    document.getElementById("schedule").innerHTML = html;

}
//==================================================
// PART 2/3
// HÔM NAY CẦN MANG
//==================================================

function drawBag(tkb, subjectMap){

    const today = getTodayColumn();

    let html = "";
    // Gom đồ dùng trùng nhau
    const toolSet = new Set();
    // Danh sách môn đã hiển thị
    const usedSubjects = new Set();

    tkb.forEach(row=>{

        const mon = row[today];

        if(!mon || mon.trim()==="" || mon==="-") return;

        // Nếu môn đã có rồi thì bỏ qua
        if(usedSubjects.has(mon)) return;

        usedSubjects.add(mon);

        const info = subjectMap[
            (mon || "")
                .trim()
                .toLowerCase()
        ];

        if(!info) return;

        const color = info["Màu"] || "#64B5F6";

        // Gom đồ dùng
            (info["Đồ dùng"] || "")
                .split("|")
                .map(x=>x.trim())
                .filter(x=>x!=="")
                .forEach(x=>toolSet.add(x));

        html += `

        <div class="item"
            style="
                border-left:8px solid ${color};
                background:#ffffff;
            ">

            <h3
                style="
                    background:${color};
                    color:#333333;
                    padding:8px;
                    border-radius:8px;
                    margin-bottom:10px;
                    text-align:center;
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

        </div>

        `;

    });

            // Hiển thị đồ dùng chung
            if(toolSet.size > 0){

                html += `

                <div class="item">

                    <h3
                        style="
                            background:#90CAF9;
                            color:#333;
                            padding:8px;
                            border-radius:8px;
                            text-align:center;
                        ">
                        🧰 Đồ dùng cần mang
                    </h3>

                    ${[...toolSet]
                        .sort()
                        .map(x=>`<div>🧰 ${x}</div>`)
                        .join("")}

                </div>

                `;

            }

    if(html===""){

        html = `
        <div class="item">
            Hôm nay không có dữ liệu.
        </div>
        `;

    }

    document.getElementById("todayBag").innerHTML = html;

}
//==================================================
// PART 3/3
// KHỞI ĐỘNG
//==================================================

async function init(){

    try{

        // Đọc đồng thời 2 Google Sheet
        const [tkb, monhoc] = await Promise.all([
            fetchCSV(urlTKB),
            fetchCSV(urlMON)
        ]);

        // Không có dữ liệu
        if(tkb.length===0){

            document.getElementById("schedule").innerHTML =
                "<p>Không có dữ liệu thời khóa biểu.</p>";

            document.getElementById("todayBag").innerHTML =
                "<p>Không có dữ liệu.</p>";

            return;

        }

        // Tạo Map môn học để tìm nhanh
        const subjectMap = createSubjectMap(monhoc);

        // Hiển thị
        drawSchedule(tkb, subjectMap);

        drawBag(tkb, subjectMap);

    }
    catch(err){

        console.error(err);

        document.getElementById("schedule").innerHTML =
            "<p>Lỗi kết nối Google Sheet.</p>";

        document.getElementById("todayBag").innerHTML =
            "<p>Không tải được dữ liệu.</p>";

    }

}


//==================================================
// REFRESH TỰ ĐỘNG
//==================================================

// Cập nhật mỗi 5 phút
setInterval(init, 5 * 60 * 1000);


//==================================================
// START
//==================================================

document.addEventListener("DOMContentLoaded", () => {

    init();

});
