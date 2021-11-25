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

const addOrModifyTask = async () => {
    if (input.value !== '') {
        if (typeof id !== 'undefined') {
            const listEl = document.getElementById(id);
            const task = {
                "id": id.substring(4),
                "task": input.value
            };
            updateTask(task)
            listEl.getElementsByTagName('p')[0].innerText = input.value;
            listEl.classList.remove('selected');
        } else {
            let task = {
                "task": input.value
            };
            task = await createTask(task)
            const id = 'task' + task.id;
            const textNode = document.createTextNode(task.task);
            const pTag = document.createElement('p');
            pTag.appendChild(textNode);
            const listEl = document.createElement('li');
            listEl.id = id;
            listEl.addEventListener('click', chooseTask);
            listEl.appendChild(pTag);
            const deletePicture = document.createElement('img');
            deletePicture.src = '/static/delete-btn.png';
            deletePicture.height = '45';
            deletePicture.addEventListener('click', deleteTask);
            list.appendChild(deletePicture);
            list.appendChild(listEl);
        }
        input.value = '';
        id = undefined;
    }
}

const deleteTask = (event) => {
    if (confirm(`The task '${event.target.nextElementSibling.innerText}' will be removed.'`)) {
        const csrfToken = getCSRF();
        fetch(`http://127.0.0.1:8000/tasks/api/list/${event.target.nextElementSibling.id.substring(4)}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            })
        .then(response => console.log(response))
        .catch((error) => {
        console.error('Error:', error);
        });
        list.removeChild(event.target.nextElementSibling);
        list.removeChild(event.target);
    }
}

const getCSRF = () => {
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    return csrfToken
  }

const createTask = async (task) => {
    const csrfToken = getCSRF();
    response = await fetch('http://127.0.0.1:8000/tasks/api/list', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(task),
        })
    .then(response => response.json())
    .catch((error) => {
    console.error('Error:', error);
    });
    console.log(response);
    return response
}

const updateTask = (task) => {
    const csrfToken = getCSRF();
    fetch(`http://127.0.0.1:8000/tasks/api/list/${task.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
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

input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addOrModifyTask()
    }
});

btnAdd.addEventListener('click', addOrModifyTask);
