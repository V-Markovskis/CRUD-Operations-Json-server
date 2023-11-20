import axios, { all } from 'axios'; // library, HTTP requests execution

const formContainer = document.querySelector<HTMLDivElement>('.js-movie-container');

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
            <div>
                <p>${movie.nickname}</p>
                <p>${movie.movie}</p>
                <p>${movie.review}</p>
                <p>${movie.evaluation}</p>
                <button class="delete-button-js" data-movie-id=${movie.id}>Delete</button>
            </div>
        `;
        });
        const movieDeleteButton = document.querySelectorAll<HTMLButtonElement>('.delete-button-js');
        
        movieDeleteButton.forEach((deleteButton) => {

            deleteButton.addEventListener('click', () => {
                //dataset DOM property, providing access to the data-attributes of the element
                //data attributes in HTML must begin with the prefix "data-"
                // const id = deleteButton.dataset.movieId;

                //Destructurization
                const { movieId } = deleteButton.dataset;
                
                console.log('deleteButton.dataset', deleteButton.dataset);

                axios.delete(`http://localhost:3004/movies/${movieId}`).then(() => {
                    allMovies();
                });
            });
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

    axios.post<Movie>('http://localhost:3004/movies', {
        nickname: formValues[0],
        movie: formValues[1],
        review: formValues[2],
        evaluation: formValues[3],
    }).then(() => {
        allMovies();
        //clear value of (input, textarea)
        formElements.forEach((element) => {
            element.value = '';
        });
    })
    .catch((error) => {
        console.error('Error posting data:', error);
    });
});