const domStructure1 = document.head;
const domStructure2 = document.body;
const childesElements1 = domStructure2.firstChild;
const childesElements2 = domStructure2.lastChild;
const childesNodes = domStructure2.childNodes;
const childesNodesFRLS1 = domStructure2.firstChild;
const childesNodesFRLS2 = domStructure2.lastChild;

const htmlId1 = document.getElementById("words1");
const htmlId2 = document.getElementById("words2");
const htmlId3 = document.getElementById("words3");
const htmlId4 = document.getElementById("words4");

const htmlSelector = document.querySelectorAll('.list');
const htmlSelectorTag = document.querySelectorAll('title');

const htmlSelectorTagSubsidiary = document.querySelectorAll('.list> .loremText');
const htmlSelectorId = document.querySelector('#words1')

console.log(domStructure1, domStructure2);
console.log(htmlId1, htmlId2, htmlId3, htmlId4);
console.log(childesElements1, childesElements2, childesNodes, childesNodesFRLS1, childesNodesFRLS2);


for (let node of childesNodes) {
    console.log(node);
}


