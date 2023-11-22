import axios, { all } from 'axios'; // library, HTTP requests execution

const formContainer = document.querySelector<HTMLDivElement>('.js-movie-container');
const imageContainer = document.querySelector<HTMLDivElement>('.js-image-container');
const imageButton = document.querySelector<HTMLButtonElement>('.image-button');
let currentImageUrl = '';
const defaultImgPath = './assets/images/default-image-icon.jpg';

type Movie = {
    id: number;
    nickname: string;
    movie: string;
    review: string;
    evaluation: number;
}

type Image = {
    id: number;
    image: string;
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

const allImages = () => {
    const result = axios.get<Image[]>('http://localhost:3004/images');

    imageContainer.innerHTML = '';

    result.then(({ data }) => {
        data.forEach((image) => {
            imageContainer.innerHTML += `
                <div>
                    <img src="${image.image}" alt="Image" class="image" style="width: 200px; height: auto;">
                    <br>
                    <button class="delete-image-button" data-image-id=${image.id}>Delete</button>
                </div>
            `;
        });

        const imageDeleteButtons = document.querySelectorAll<HTMLButtonElement>('.delete-image-button');

        imageDeleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener('click', () => {
                const { imageId } = deleteButton.dataset;
                axios.delete(`http://localhost:3004/images/${imageId}`).then(() => {
                    allImages();
                });
            });
        });
    });
};

allImages();
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
        // image: currentImageUrl,
    }).then(() => {
        allMovies();
        //clear value of (input, textarea)
        formElements.forEach((element) => {
            element.value = '';
        });

        // currentImageUrl = defaultImgPath;
    })
    .catch((error) => {
        console.error('Error posting data:', error);
    });
});


// event for image
imageButton.addEventListener('click', (event) => {
    event.preventDefault();
    try {
        // URL request
        // eslint-disable-next-line no-alert
        const imageUrl = prompt('Enter the URL of the image:');

        if (imageUrl) {
            currentImageUrl = imageUrl;
        } else {
            // If no URL is provided, use the default image
            currentImageUrl = defaultImgPath;
        }

        // Send a request to the server to add the image
        axios.post<Image>('http://localhost:3004/images', {
            image: currentImageUrl,
        }).then(() => {
            allImages();

            currentImageUrl = defaultImgPath;
        })
        .catch((error) => {
            console.error('Error posting data:', error);
        });

        // Create an image element and append it to the container
        const imageElement = document.createElement('img');
        imageElement.style.width = '200px';
        imageElement.style.height = 'auto';
        imageElement.src = currentImageUrl;

        imageContainer.appendChild(imageElement);
    } catch (error) {
        console.error('Error adding image:', error);
    }
});
