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
        .filter(r => r.trim() != "")
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
// LẤY THÔNG TIN MÔN
//=========================

function getSubjectInfo(monhoc,name){

    return monhoc.find(x=>x["Môn"]===name);

}
//=========================
// HIỂN THỊ THỜI KHÓA BIỂU
//=========================

function drawSchedule(tkb, monhoc){

    if(tkb.length===0) return;

    let html = "<table>";

    // Tiêu đề
    html += "<tr>";

    Object.keys(tkb[0]).forEach(h=>{

        html += `<th>${h}</th>`;

    });

    html += "</tr>";

    // Nội dung
    tkb.forEach(row=>{

        html += "<tr>";

        Object.values(row).forEach(value=>{

            const info = getSubjectInfo(monhoc,value);

            if(info){

                const color = info["Màu"] || "#eeeeee";

                html += `
                <td
                    style="
                        background:${color};
                        color:#ffffff;
                        font-weight:bold;
                        border:1px solid ${color};
                    ">
                    ${value}
                </td>
                `;

            }else{

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

function drawBag(tkb, monhoc){

    const today = getTodayColumn();

    let html = "";

    tkb.forEach(row=>{

        const mon = row[today];

        if(!mon || mon=="") return;

        const info = getSubjectInfo(monhoc, mon);

        if(!info) return;

        const color = info["Màu"] || "#2196F3";

        const tools = (info["Đồ dùng"] || "")
            .split("|")
            .filter(x=>x.trim()!="")
            .map(x=>`<div>🧰 ${x}</div>`)
            .join("");

        html += `
        <div class="item"
            style="border-left:8px solid ${color};">

            <h3 style="color:${color}">
                ${mon}
            </h3>

            ${
                info["Sách Giáo Khoa"]=="TRUE"
                ?"<div>📘 Sách Giáo Khoa</div>"
                :""
            }

            ${
                info["Sách Bài Tập"]=="TRUE"
                ?"<div>📗 Sách Bài Tập</div>"
                :""
            }

            ${
                info["Vở"]!="-"
                ?`<div>📒 ${info["Vở"]}</div>`
                :""
            }

            ${tools}

        </div>
        `;

    });

    document.getElementById("todayBag").innerHTML = html;

}



//=========================
// KHỞI ĐỘNG
//=========================

async function init(){

    const tkb = await fetchCSV(urlTKB);

    const monhoc = await fetchCSV(urlMON);

    drawSchedule(tkb, monhoc);

    drawBag(tkb, monhoc);

}

init();
