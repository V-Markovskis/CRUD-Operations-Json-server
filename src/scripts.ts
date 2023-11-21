import axios, { all } from 'axios'; // library, HTTP requests execution

const formContainer = document.querySelector<HTMLDivElement>('.js-movie-container');
const blockImage = document.querySelector('.js-block-image');
let currentImageUrl = '';
const defaultImgPath = './assets/images/default-image-icon.jpg';

type Movie = {
    id: number;
    image: string;
    nickname: string;
    movie: string;
    review: string;
    evaluation: number;
}
0
const allMovies = () => {
    const result = axios.get<Movie[]>('http://localhost:3004/movies');

    formContainer.innerHTML = '';
    
    
    result.then(({ data }) => {
        data.forEach((movie) => {

            formContainer.innerHTML += `
            <div>
                <img src="${movie.image}" alt="Movie Image" class="movie-image" style="width: 200px; height: auto;">
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
        image: currentImageUrl,
    }).then(() => {
        allMovies();
        //clear value of (input, textarea)
        formElements.forEach((element) => {
            element.value = '';
        });

        currentImageUrl = defaultImgPath;
    })
    .catch((error) => {
        console.error('Error posting data:', error);
    });
});

const imageButton = document.querySelector<HTMLButtonElement>('.image-button');
// event for image
imageButton.addEventListener('click', async () => {
    try {
        // URL request
        // eslint-disable-next-line no-alert
        const imageUrl = prompt('Enter the URL of the image:');

        if (imageUrl) {
            currentImageUrl = imageUrl;

            // GOOGLE HERE
            const formData = new FormData();
            formData.append('image', imageUrl);

            try {
                const response = await axios.post('http://localhost:3004/images', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Get the URL of the image from the server response
                const createdImageUrl = response.data.url;

                const imageElement = document.createElement('img');
                imageElement.style.width = '200px';
                imageElement.style.height = 'auto';
                imageElement.src = createdImageUrl;

                formContainer.appendChild(imageElement);
            } catch (error) {
                console.error('Error creating image:', error);
            }
        } else {
            currentImageUrl = defaultImgPath;
        }
    } catch (error) {
        console.error('Error adding image:', error);
    }
});

// const clearImagesButton = document.querySelectorAll<HTMLButtonElement>('.clear-images-button');

// clearImagesButton.forEach((srcDeleteButton) => {
//     srcDeleteButton.addEventListener('click', () => {
//         console.log('Button clicked!');
//         const id = srcDeleteButton.dataset.imageId;
//         console.log('Trying to delete image with id:', id);

//         if (id) {
//             axios.delete(`http://localhost:3004/images/${id}`)
//                 .then(() => {
//                     console.log('Image deleted successfully.');
//                     allMovies();
//                 })
//                 .catch((error) => {
//                     console.error('Error deleting image:', error);
//                 });
//         } else {
//             console.warn('No image id found in dataset.');
//         }
//     });
// });
