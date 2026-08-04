const urlTKB =
"https://docs.google.com/spreadsheets/d/1ysNYpooAXu07MsLfL3XNxVSbzBlntueaXgRcksx5nXk/gviz/tq?tqx=out:csv&gid=0";

const urlMonHoc =
"https://docs.google.com/spreadsheets/d/1ysNYpooAXu07MsLfL3XNxVSbzBlntueaXgRcksx5nXk/gviz/tq?tqx=out:csv&gid=757851887";

async function fetchCSV(url) {

    const res = await fetch(url + "&t=" + Date.now());

    const text = await res.text();

    const rows = text
        .split(/\r?\n/)
        .filter(r => r.trim() !== "")
        .map(row =>
            row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
               .map(c => c.replace(/^"(.*)"$/, "$1"))
        );

    return rows;
}

async function init() {

    try{

        const tkb = await fetchCSV(urlTKB);

        const monHoc = await fetchCSV(urlMonHoc);

        console.log(tkb);

        console.log(monHoc);

        document.body.innerHTML +=
        `<pre>
TKB:
${JSON.stringify(tkb,null,2)}

----------------------------

MON_HOC:
${JSON.stringify(monHoc,null,2)}
</pre>`;

    }
    catch(e){

        console.error(e);

        document.body.innerHTML +=
        `<h2 style="color:red">${e}</h2>`;

    }

}

init();
