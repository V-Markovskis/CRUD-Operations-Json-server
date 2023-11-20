import axios, { all } from 'axios'; // library, HTTP requests execution

const formContainer = document.querySelector<HTMLElement>('.js-movie-container');

type Movie = {
    id: number;
    nickname: string;
    movie: string;
    review: string;
    evaluation: number;
}

const allMovies = () => {
    const result = axios.get<Movie[]>('http://localhost:3004/movies');

    formContainer.innerHTML = '';

    result.then(({ data }) => {
        data.forEach((movie) => {
            formContainer.innerHTML += `
            <p>${movie.nickname}</p>
            <p>${movie.movie}</p>
            <p>${movie.review}</p>
            <p>${movie.evaluation}</p>
        `;
        });
    });
};

allMovies();

const movieForm = document.querySelector('.js-form-container');

movieForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = movieForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    const formValues = Array.from(formElements).map((element) => element.value);
    
    console.log('Form values: ', formValues);

    axios.post('http://localhost:3004/movies', {
        nickname: formValues[0],
        movie: formValues[1],
        review: formValues[2],
        evaluation: formValues[3],
    }).then(() => {
        allMovies();
    });
});