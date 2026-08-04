const urlTKB =
"https://docs.google.com/spreadsheets/d/1ysNYpooAXu07MsLfL3XNxVSbzBlntueaXgRcksx5nXk/gviz/tq?tqx=out:csv&gid=0";

const urlMonHoc =
"https://docs.google.com/spreadsheets/d/1ysNYpooAXu07MsLfL3XNxVSbzBlntueaXgRcksx5nXk/gviz/tq?tqx=out:csv&gid=757851887";

async function fetchCSV(url){

    const response = await fetch(url);

    const text = await response.text();

    const rows = text
        .trim()
        .split(/\r?\n/)
        .map(r=>r.split(","));

    return rows;

}

async function init(){

    const tkb = await fetchCSV(urlTKB);

    const monHoc = await fetchCSV(urlMonHoc);

    console.log("===== TKB =====");
    console.table(tkb);

    console.log("===== MON HOC =====");
    console.table(monHoc);

}

init();
