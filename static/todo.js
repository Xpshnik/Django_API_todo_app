const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const btnAdd = document.getElementById('add-item');

const chooseTask = (event) => {
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
            const listEl = document.getElementById(id);
            const task = {
                "id": id.substring(4),
                "task": input.value
            };
            updateTask(task)
            listEl.firstChild.innerText = input.value;
            listEl.classList.remove('selected');
        } else {
            const id = 'task' + Math.round((list.childElementCount + 1) / 2);
            const textNode = document.createTextNode(input.value);
            const pTag = document.createElement('p');
            pTag.appendChild(textNode);
            const listEl = document.createElement('li');
            listEl.id = id;
            listEl.addEventListener('click', chooseTask);
            listEl.appendChild(pTag);
            const deletePicture = document.createElement('img');
            deletePicture.src = '/static/delete-btn.png';
            deletePicture.width = '45';
            deletePicture.addEventListener('click', deleteTask);
            list.appendChild(deletePicture);
            list.appendChild(listEl);
            const task = {
                "id": id.substring(4),
                "task": pTag.innerText
            };
            createTask(task)
        }
        input.value = '';
        id = undefined;
    }
}

const deleteTask = (event) => {
    if (confirm(`The task '${event.target.nextElementSibling.innerText}' will be removed.'`)) {
        console.log('TODO: Send DELETE request to API')
        list.removeChild(event.target.nextElementSibling);
        list.removeChild(event.target);
    }
}

const getCSRF = () => {
    const CSRF_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    return CSRF_token
  }

const createTask = (task) => {
    const csrfToken = getCSRF();
    console.log(csrfToken);
    fetch('http://127.0.0.1:8000/tasks/api/list', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                "X-Requested-With": "XMLHttpRequest",
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(task),
        })
    .then(response => response.json())
    .then(task => {
    console.log('Success:', task);
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}

const updateTask = (task) => {
    console.log('TODO PUT request')
    console.dir(task)
}

input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addOrModifyTask()
    }
});

btnAdd.addEventListener('click', addOrModifyTask);
