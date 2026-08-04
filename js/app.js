//==============================
// MÔN HỌC
//==============================

const subjects={

"Toán":{

color:"#4CAF50",

sgk:true,

vbt:true,

vo:"Vở số 1",

tools:["Thước","Bút chì"]

},

"TV":{

color:"#2196F3",

sgk:true,

vbt:true,

vo:"Vở số 2",

tools:["Bút"]

},

"Anh":{

color:"#FF9800",

sgk:true,

vbt:true,

vo:"Vở số 3",

tools:["Bút"]

},

"Tin":{

color:"#9C27B0",

sgk:true,

vbt:false,

vo:"Vở số 4",

tools:["USB"]

},

"Thể dục":{

color:"#F44336",

sgk:false,

vbt:false,

vo:null,

tools:["Quần áo TD"]

},

"Mỹ thuật":{

color:"#795548",

sgk:true,

vbt:false,

vo:null,

tools:["Màu","Cọ"]

},

"Âm nhạc":{

color:"#E91E63",

sgk:true,

vbt:false,

vo:null,

tools:["Sáo"]

}

};

//==============================
// THỜI KHÓA BIỂU
//==============================

const timetable=[

["Tiết","T2","T3","T4","T5","T6"],

["1","Toán","TV","Toán","Anh","TV"],

["2","TV","Âm nhạc","Tin","Toán","Mỹ thuật"],

["3","Anh","Toán","TV","Tin","Toán"],

["4","Tin","TV","Thể dục","Toán","Anh"],

["5","","","","",""]

];

//==============================
// HIỂN THỊ THỜI KHÓA BIỂU
//==============================

const tb=document.getElementById("timetable");

let html='<div class="grid">';

timetable.forEach((row,r)=>{

row.forEach((cell,c)=>{

if(r==0){

html+=`<div class="cell header">${cell}</div>`;

}else{

if(c==0){

html+=`<div class="cell">${cell}</div>`;

}else{

let bg="";

if(subjects[cell])

bg=`background:${subjects[cell].color}`;

html+=`<div class="cell lesson" style="${bg}">${cell}</div>`;

}

}

});

});

html+="</div>";

tb.innerHTML=html;

//==============================
// HÔM NAY CẦN MANG
//==============================

//Thử giả lập hôm nay là Thứ 3

let todayColumn=2;

let lessons=[];

for(let i=1;i<timetable.length;i++){

let s=timetable[i][todayColumn];

if(s!="") lessons.push(s);

}

let sgk=[];

let vbt=[];

let vo=[];

let tools=[];

lessons.forEach(s=>{

let x=subjects[s];

if(!x) return;

if(x.sgk) sgk.push("SGK "+s);

if(x.vbt) vbt.push("VBT "+s);

if(x.vo) vo.push(x.vo);

tools.push(...x.tools);

});

//xóa trùng

sgk=[...new Set(sgk)];

vbt=[...new Set(vbt)];

vo=[...new Set(vo)];

tools=[...new Set(tools)];

function make(title,list){

return `<div class="section">

<h3>${title}</h3>

<ul>

${list.map(i=>`<li>✅ ${i}</li>`).join("")}

</ul>

</div>`;

}

document.getElementById("todayItems").innerHTML=

make("📚 Sách giáo khoa",sgk)+

make("📖 Sách bài tập",vbt)+

make("📝 Vở",vo)+

make("🎒 Đồ dùng",tools);
