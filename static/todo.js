const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const btnAdd = document.getElementById('add-item');

const chooseTask = (event) => {
    console.log(event)
    if (typeof elementSelected !== 'undefined' && elementSelected.id == event.target.id) {
        //unchoose task by clicking at it
        input.value = '';
        elementSelected.classList.remove('selected');
        elementSelected = undefined;
        id = undefined;
    } else {
        //unchoose task by clicking at another task
        if (typeof elementSelected !== 'undefined') {
            elementSelected.classList.remove('selected');
        }
        //choose task
        input.value = event.target.innerText;
        elementSelected = event.target;
        id = elementSelected.id;
        elementSelected.classList.add('selected');
    }
}

const addOrModifyTask = () => {
    if (input.value !== '') {
        if (typeof id !== 'undefined') {
            let listEl = document.getElementById(id);
            listEl.firstChild.innerText = input.value;
            for (const task of tasks) {
                if (task.id === id.substr(4)) {
                    task.description = input.value;
                }
            }
            listEl.classList.remove('selected');
        } else {
            let listEl = document.createElement('li');
            listEl.id = 'task' + (tasks.length + 1);
            listEl.addEventListener('click', chooseTask);
            let p_tag = document.createElement('p');
            let textNode = document.createTextNode(input.value);
            p_tag.appendChild(textNode);
            listEl.appendChild(p_tag);
            let deletePicture = document.createElement('img');
            deletePicture.src = 'Delete-Button.png';
            deletePicture.width = '45';
            deletePicture.addEventListener('click', deleteTask);
            list.appendChild(deletePicture);
            list.appendChild(listEl);
            const task = {
                "id": listEl.id.substring(4),
                "description": listEl.firstChild.innerText
            };
        }
        input.value = '';
        id = undefined;
        save()
    }
}

const deleteTask = (event) => {
    if (confirm(`The task '${event.target.nextElementSibling.innerText}' will be removed.'`)) {
        list.removeChild(event.target.nextElementSibling);
        list.removeChild(event.target);
        console.log('TODO: Send DELETE request to API')
    }
}

const save = () => {
    console.log('TODO: Send POST to API');
}

input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addOrModifyTask()
    }
});

btnAdd.addEventListener('click', addOrModifyTask);
