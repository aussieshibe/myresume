var doc = {
    'pgmCtr': document.getElementById("pgmCtr"),
    'memO': function() {
        var memO = {
            'label': [],
            'data': []
        };
        for (var i = 0; i <= 10; i++) {
            memO.label.push(document.getElementById("memO-label-" + i));
            memO.data.push(document.getElementById("memO-data-" + i));
        }
        return memO;
    }(),
    'program': document.getElementById('bfProgram')
    
};

var vm = new BFVM(doc.program.textContent);

vm.out = function writeOutputToDiv (o) {
    document.getElementById("bfOutput").innerHTML += String.fromCharCode(o);
};

vm.extUpdate = function updateVMView(pgmCtr, memPtr, mem) {
    doc.pgmCtr.innerHTML = pgmCtr;
    
    var memOOffset = (doc.memO.label.length - 1) / 2 - memPtr;
    
    for (var i in doc.memO.label) {
        if ( i - memOOffset < 0) {
            doc.memO.label[i].innerHTML = '*';
            doc.memO.data[i].innerHTML = '*';
        } else {
            doc.memO.label[i].innerHTML = i - memOOffset;
            doc.memO.data[i].innerHTML = mem[i - memOOffset] || 0;
        }
    }
    
    doc.program.selectionStart = pgmCtr;
    doc.program.selectionEnd = pgmCtr + 1;
    
};

doc.program.oninput = function() {
    vm.program = doc.program.value;
    console.log(doc.program.value);
};