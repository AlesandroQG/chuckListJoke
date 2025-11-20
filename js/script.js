/*
API: https://api.chucknorris.io/jokes/random

- Obtener botón y lista del DOM
- Fetch -> console.log()
- LOCALSTORAGE
-> Botón
-> Pasar a html

*/

const fetchJoke = document.querySelector('#fetchJoke');
const deleteJokes = document.querySelector('#deleteJokes');
const jokeList = document.getElementById('jokeList');

const getJokes = JSON.parse(localStorage.getItem('jokes')) || [];
const setJokes = (jokes) => {
    const arrString = JSON.stringify(jokes);
    localStorage.setItem('jokes', arrString);
};

let lista = getJokes;

const addJoke = (lista, joke) => {
    lista.push(joke);
    setJokes(lista);
};

const deleteJoke = (lista, i) => {
    lista.splice(i, 1);
    setJokes(lista);
};

function obtenerChiste() {
    fetch('https://api.chucknorris.io/jokes/random')
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data.value);
        addJoke(lista, data.value);
        cargarChistes();
    })
    .catch(err => console.log(err));
}

function cargarChistes() {
    const template = (chiste, i) => {
        return `<li>
            <p>${chiste}</p>
            <button class='eliminar' id='joke-${i}'>Eliminar</button>
        </li>`;
    };
    const structure = lista.map((joke, i) => template(joke, i)).reverse().join('');
    jokeList.innerHTML = structure;
    const btnsEliminar = Array.from(document.getElementsByClassName('eliminar')); // Convertir HTMLCollection -> Array
    btnsEliminar.map(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Asegura de que el código se ejecute solo una vez y no se repita
            const id = e.target.id; // e es el evento, target es el elemento que seleccionamos
            const i = parseFloat(id.split('-')[1]);
            deleteJoke(lista, i);
            cargarChistes();
        });
    });
}

window.onload = function() {
    lista = getJokes;
    fetchJoke.addEventListener("click", obtenerChiste);
    deleteJokes.addEventListener("click", () => {
        setJokes([]);
        lista = [];
        cargarChistes();
    });
    cargarChistes();
}