const INITIAL_LIST = [
    {itemKey: 1, text: 'Item1', selected: false},
    {itemKey: 2, text: 'Item2', selected: false},
    {itemKey: 3, text: 'Item3', selected: false},
    {itemKey: 4, text: 'Item4', selected: false}  
  ];

let list = INITIAL_LIST;
let undoList = INITIAL_LIST;
let hideInput = true;
let newText = "";
const elementAddBtn = document.getElementById('addBtn');
const elementDeleteBtn = document.getElementById('deleteBtn');
const elementUndoBtn = document.getElementById('undoBtn');
const elementList = document.getElementById('list');
const listInitialHTML = elementList.innerHTML;

updateListElements()
updateListEventListeners()


//buttons event listeners

elementAddBtn.addEventListener('click', handleClickAdd);
elementDeleteBtn.addEventListener('click', () => handleDelete());
elementUndoBtn.addEventListener('click', handleUndo);


//list update functions

function updateListElements () {
    elementList.innerHTML = "";
    let i = 0;
    let listItemHTML;
    list.forEach (item => {
        listItemHTML = `<li id=${i} key=${item.itemKey} class='App-body-list-item${(item.selected)?" App-body-list-item-selected'":"'"}>${item.text}</li>\n`;
        elementList.innerHTML += listItemHTML;
        i++;
    })
    if (!hideInput) {
        elementList.innerHTML += listInitialHTML;
    }
}

function updateListEventListeners() {
    const elementsListItems = document.getElementsByClassName('App-body-list-item');
    const numItems = elementsListItems.length-(!hideInput?1:0)
    for (let i = 0; i < numItems; i++) {
        elementsListItems[i].addEventListener('click', (e) => {
            (e.detail === 1) && handleSelect(e);
            (e.detail === 2) && handleDelete(e);
        })
    }
    if (!hideInput) {
        const elementListInput = document.getElementById('listInput');
        elementListInput.addEventListener('change', (e) => {newText=e.target.value})
        elementListInput.addEventListener('keypress', (e) => {
            const keyPressed = e.key;
            const text = e.target.value;
            handleItemAdd (keyPressed,text);
        });
        elementListInput.focus();
    }
}


//handler functions

function handleSelect(e) {
    const id = e.target.getAttribute('id');
    let listUpdated = [...list];
    listUpdated[id].selected = !listUpdated[id].selected;
    list = listUpdated;
    updateListElements()
    updateListEventListeners()
}

function handleUndo() {
    list = undoList;
    hideInput = true;
    newText = "";
    updateListElements()
    updateListEventListeners()
}

function handleDelete(e = null) {
    let listUpdated = [...list];
    if (e===null) {
        // Delete all selected items (same as filter all not selected)
        listUpdated = listUpdated.filter(item => item.selected === false);
    } else {
        // Delete only item with specific id
        const id = e.target.getAttribute('id');
        listUpdated.splice (id,1);
    }
    undoList = list;
    list = listUpdated;
    hideInput = true;
    newText = "";
    updateListElements()
    updateListEventListeners()
}

function handleClickAdd() {
    if (newText.length>0) {
        handleItemAdd('Enter', newText)
    } 
    hideInput = !hideInput;
    updateListElements()
    updateListEventListeners()
}

function handleItemAdd(keyPressed, text) {
    if (text.length>0 && keyPressed==='Enter') {
        const maxKey = (list.length>0)?Math.max(...list.map(item => item.itemKey)):0
        undoList = list;
        list = [...list, {"itemKey": (maxKey+1), "text": text, "selected": false}];
        newText = "";
        updateListElements()
        updateListEventListeners()
    }
}
