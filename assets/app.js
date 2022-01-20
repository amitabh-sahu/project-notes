showNotes();

function Obj() {
    let notes = localStorage.getItem(`notes`);
    if (notes == null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
    }
    return notesObj
}

document.getElementById(`create_btn`).addEventListener(`click`, function () {
    let newNoteTitle = document.getElementById(`note_title`);
    let newNoteText = document.getElementById(`note_text`);
    let important = document.getElementById(`important`);
    let notesObj = Obj();
    if (newNoteTitle.value || newNoteText.value) {
        notesObj.push({ 'title': newNoteTitle.value, 'text': newNoteText.value, 'imp': important.checked});
        localStorage.setItem(`notes`, JSON.stringify(notesObj));
        newNoteTitle.value = '';
        newNoteText.value = '';
        important.checked = false;
        showNotes();
    }
});

function showNotes() {
    let html = '';
    let notesObj = Obj();
    notesObj.forEach(function (element, index) {
        let bg = element.imp ? `style="border-color: #FF6347;"` : '';
        html += `<div class="note note_${index}" ${bg}>
                    <h3 class="note_${index}_title" ondblclick="editNote(${index}, 'title')">${element.title}</h3>
                    <p class="note_${index}_text" ondblclick="editNote(${index}, 'text')">${element.text}</p>
                    <button class="btn_2" onclick="deleteNote(${index})">Delete Note</button>
                </div>`;
    });
    let allNotes = document.querySelector(`.all_notes`);
    if (notesObj.length != 0) {
        allNotes.innerHTML = html;
    }
    else {
        allNotes.innerHTML = `There are no Notes.`;
    }
}

function editNote(ind, str) {
    let target = document.querySelector(`.note_${ind}`);
    let subTarget = target.querySelector(`.note_${ind}_${str}`);
    let subtargetFontSize = parseFloat(window.getComputedStyle(subTarget, null).getPropertyValue(`font-size`));
    let toEdit = document.createElement(`textarea`);
    toEdit.rows = subTarget.clientHeight / subtargetFontSize;
    toEdit.setAttribute(`class`, `note_${ind}_${str}`);
    toEdit.innerHTML = subTarget.innerHTML;
    target.replaceChild(toEdit, subTarget);
    let edited = target.querySelector(`.note_${ind}_${str}`);
    edited.addEventListener(`blur`, function () {
        let notesObj = Obj();
        notesObj[ind][str] = edited.value;
        subTarget.innerHTML = edited.value;
        target.replaceChild(subTarget, toEdit);
        localStorage.setItem(`notes`, JSON.stringify(notesObj));
    });
}

function deleteNote(ind) {
    let notesObj = Obj();
    notesObj.splice(ind, 1);
    localStorage.setItem(`notes`, JSON.stringify(notesObj));
    showNotes();
}

document.getElementById(`search_txt`).addEventListener(`keypress`, function (e) {
    if (e.key == `Enter`) {
        let inputVal = document.getElementById(`search_txt`).value.toLowerCase();
        searchText(inputVal);
    }
});

document.getElementById(`search_btn`).addEventListener(`click`, function () {
    let inputVal = document.getElementById(`search_txt`).value.toLowerCase();
    searchText(inputVal);
});

function searchText(inputVal) {
    let allNotes = document.querySelectorAll(`.note`);
    Array.from(allNotes).forEach(function (element) {
        let noteTitle = element.getElementsByTagName(`h3`)[0].innerText.toLowerCase();
        let noteText = element.getElementsByTagName(`p`)[0].innerText.toLowerCase();
        if (noteTitle.includes(inputVal) || noteText.includes(inputVal)) {
            element.style.display = `grid`;
        }
        else {
            element.style.display = `none`;
        }
        document.getElementById(`search_txt`).value = '';
    });
    allNotes = document.querySelector(`.all_notes`);
    let noMatch = allNotes.parentNode.querySelector(`.no_match`);
    if (allNotes.clientHeight == 0 && !noMatch) {
        allNotes.parentNode.innerHTML += `<p class="no_match">No Match Found.</p>`;
    }
    else if (allNotes.clientHeight != 0 && noMatch) {
        allNotes.parentNode.removeChild(noMatch);
    }
}