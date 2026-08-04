const sheetID="1ysNYpooAXu07MsLfL3XNxVSbzBlntueaXgRcksx5nXk";

const urlTKB=
`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&gid=0`;

const urlMON=
`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&gid=757851887`;

async function fetchCSV(url){

    const res=await fetch(url+"&t="+Date.now());

    const text=await res.text();

    const rows=text
        .split(/\r?\n/)
        .filter(r=>r!="")
        .map(r=>
            r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map(c=>c.replace(/^"(.*)"$/,'$1'))
        );

    const header=rows[0];

    return rows.slice(1).map(r=>{

        let obj={};

        header.forEach((h,i)=>{

            obj[h]=r[i];

        });

        return obj;

    });

}

function getTodayColumn(){

    const d=new Date().getDay();

    switch(d){

        case 1:return "Thứ 2";

        case 2:return "Thứ 3";

        case 3:return "Thứ 4";

        case 4:return "Thứ 5";

        case 5:return "Thứ 6";

        default:return "Thứ 2";

    }

}

async function init(){

    const tkb=await fetchCSV(urlTKB);

    const monhoc=await fetchCSV(urlMON);

    drawSchedule(tkb,monhoc);

    drawBag(tkb,monhoc);

}

function drawSchedule(tkb,monhoc){

    let html="<table>";

    html+="<tr>";

    Object.keys(tkb[0]).forEach(h=>{

        html+=`<th>${h}</th>`;

    });

    html+="</tr>";

    tkb.forEach(r=>{

        html+="<tr>";

        Object.values(r).forEach(v=>{

            let color="";

            monhoc.forEach(m=>{

                if(m["Môn"]==v)

                    color=m["Màu"];

            });

            if(color!="")

                html+=`<td style="background:${color};color:white">${v}</td>`;

            else

                html+=`<td>${v}</td>`;

        });

        html+="</tr>";

    });

    html+="</table>";

    document.getElementById("schedule").innerHTML=html;

}

function drawBag(tkb,monhoc){

    let col=getTodayColumn();

    let list=[];

    tkb.forEach(r=>{

        list.push(r[col]);

    });

    let html="";

    list.forEach(mon=>{

        let m=monhoc.find(x=>x["Môn"]==mon);

        if(!m)return;

        html+=`<div class="item">

<b>${mon}</b><br>

${m["Sách Giáo Khoa"]=="TRUE"?"📘 SGK<br>":""}

${m["Sách Bài Tập"]=="TRUE"?"📗 SBT<br>":""}

📒 ${m["Vở"]}<br>

✏️ ${m["Đồ dùng"]}

</div>`;

    });

    document.getElementById("todayBag").innerHTML=html;

}

init();
