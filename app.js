let boxes=document.querySelectorAll(".box");
let reset=document.querySelector("#reset");
let turno=true;
const winpatterns=[
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [3,4,5],
    [6,7,8]
];

boxes.forEach((box)=> {
    box.addEventListener("click",()=> {
        console.log("box was clicked")
        if(turno) {
            box.innerText="o";
            turno=false;

        } else {
            box.innerText="x";
            turno=true;

        }
        box.disabled=true;

    });
});
const checkwinner= () => {
    for(let pattern of winpatterns) {
        //console.log(pattern[0],pattern[1],pattern[2]);
        //console.log(boxes[pattern[0]].innerText,boxes[pattern[1]].innerText,boxes[pattern[2]].innerText);
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;
        if(pos1val!="" && pos2val!="" && pos3val!="") {
            if(pos1val==pos2val && pso2val==pos3val) {
                console.log("winner",pos1val);
            }
        }

    }
}