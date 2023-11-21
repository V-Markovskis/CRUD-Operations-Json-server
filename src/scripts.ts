import axios, { all } from 'axios'; // library, HTTP requests execution

const formContainer = document.querySelector<HTMLDivElement>('.js-movie-container');
const blockImage = document.querySelector('.js-block-image');
const defaultImgPath = './assets/images/default-image-icon.jpg';

type Movie = {
    id: number;
    image: string;
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
                <img src="${movie.image}" alt="Movie Image" style="width: 200px; height: auto;">
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

    const formElements = movieForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.review-main-details');
    const formValues = Array.from(formElements).map((element) => element.value);
    
    console.log('Form values: ', formValues);

    axios.post<Movie>('http://localhost:3004/movies', {
        nickname: formValues[0],
        movie: formValues[1],
        review: formValues[2],
        evaluation: formValues[3],
        image: 'https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg',
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

const imageButton = document.querySelector<HTMLButtonElement>('.image-button');
// event for image
imageButton.addEventListener('click', () => {
    try {
        const imageUrl = 'https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg';

        const imageElement = document.createElement('img');
        imageElement.style.width = '200px';
        imageElement.style.height = 'auto';
        imageElement.src = imageUrl;

        // add image to container
        formContainer.appendChild(imageElement);
    } catch (error) {
        console.error('Error adding image:', error);
    }
});


