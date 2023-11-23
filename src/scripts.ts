import axios, { all } from 'axios'; // library, HTTP requests execution
import { formatDistanceToNow } from 'date-fns';

// const globalContainer = document.querySelector<HTMLDivElement>('.js-global-container');
const formContainer = document.querySelector<HTMLDivElement>('.js-movie-container');
// const imageContainer = document.querySelector<HTMLDivElement>('.js-image-container');
// const imageButton = document.querySelector<HTMLButtonElement>('.image-button');
// let currentImageUrl = '';
const defaultImgPath = './assets/images/default-image-icon.jpg';

type Movie = {
    id: number;
    image: string;
    nickname: string;
    movie: string;
    review: string;
    evaluation: number;
    creationTime: Date;
}

// type Image = {
//     id: number;
//     image: string;
// }

const allMovies = () => {
    const result = axios.get<Movie[]>('http://localhost:3004/movies');

    formContainer.innerHTML = '';
    
    result.then(({ data }) => {
        data.forEach((movie) => {
            
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
            if (!urlRegex.test(movie.image)) {
                movie.image = defaultImgPath;
            }
            
            //https://date-fns.org/v2.16.1/docs/formatDistanceToNow
            const createdAt = formatDistanceToNow(new Date(movie.creationTime), { addSuffix: true });
            console.log(createdAt);


            formContainer.innerHTML += `
            <div>
                <img src=${movie.image} alt="Image here" width=200;/>
                <p>User: ${movie.nickname}</p>
                <p>Movie name: ${movie.movie}</p>
                <p>${movie.review}</p>
                <p>${movie.evaluation} out of 10</p>
                <p>Created at: ${createdAt}</p>
                <button class="delete-button-js" data-movie-id=${movie.id}>Delete</button>
                <button class="edit-button-js" data-movie-id=${movie.id}>Edit</button>
                <button class="js-save-button" data-movie-id=${movie.id}>Save</button>
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
    const createdAt = new Date();
    //element.value is used to retrieve the value of each form element (input field or text field)
    const formValues = Array.from(formElements).map((element) => element.value);
    
    console.log('Form values: ', formValues);
    
    axios.post<Movie>('http://localhost:3004/movies', {
        nickname: formValues[0],
        movie: formValues[1],
        review: formValues[2],
        evaluation: formValues[3],
        image: formValues[4],
        creationTime: createdAt,
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


// edit data part
const editMovie = (movieId: string) => {
    const movie = axios.get<Movie>(`http://localhost:3004/movies/${movieId}`).then(({ data }) => {
        // Get the movie data you want to change
        // Fill the form with values from the received movie
        const formElements = movieForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.review-main-details');
        formElements[0].value = data.nickname;
        formElements[1].value = data.movie;
        formElements[2].value = data.review;
        formElements[3].value = String(data.evaluation);
        formElements[4].value = data.image;
        
        const saveButtonn = document.querySelectorAll<HTMLButtonElement>('.js-save-button');
        //add save logic
        saveButtonn.forEach((save) => {
                // Add an event handler to the form to submit the changed data
                save.addEventListener('click', (event) => {
                event.preventDefault();

                const formValues = Array.from(formElements).map((element) => element.value);

                axios.put(`http://localhost:3004/movies/${movieId}`, {
                    nickname: formValues[0],
                    movie: formValues[1],
                    review: formValues[2],
                    evaluation: formValues[3],
                    image: formValues[4],
                    creationTime: data.creationTime, // save the original creation time
                }).then(() => {
                    allMovies();
                    formElements.forEach((element) => {
                        element.value = '';
                    });
                }).catch((error) => {
                    console.error('Error updating data:', error);
                });
            });
        });
    }).catch((error) => {
        console.error('Error fetching movie data:', error);
    });
};


formContainer.addEventListener('click', (event) => {
    const editButton = event.target as HTMLElement;
    
    if (editButton.classList.contains('edit-button-js')) {
        const { movieId } = editButton.dataset;
        if (movieId) {
            console.log('Edit button clicked');
            editMovie(movieId);
        }
    }
});












































// const allImages = () => {
//     const result = axios.get<Image[]>('http://localhost:3004/images');

//     imageContainer.innerHTML = '';

//     result.then(({ data }) => {
//         data.forEach((image) => {
//             imageContainer.innerHTML += `
//                 <div>
//                     <img src="${image.image}" alt="Image" class="image" style="width: 200px; height: auto;">
//                     <br>
//                     <button class="delete-image-button" data-image-id=${image.id}>Delete</button>
//                 </div>
//             `;
//         });

//         const imageDeleteButtons = document.querySelectorAll<HTMLButtonElement>('.delete-image-button');

//         imageDeleteButtons.forEach((deleteButton) => {
//             deleteButton.addEventListener('click', () => {
//                 const { imageId } = deleteButton.dataset;
//                 axios.delete(`http://localhost:3004/images/${imageId}`).then(() => {
//                     allImages();
//                 });
//             });
//         });
//     });
// };

// function appendToGlobalContainer() {
//     const globalContainer = document.querySelector('.global-test');

//     globalContainer.appendChild(imageContainer);
//     globalContainer.appendChild(formContainer);

//     allImages();
//     allMovies();
// }

// appendToGlobalContainer();

// allImages();


// event for image
// imageButton.addEventListener('click', (event) => {
//     event.preventDefault();
//     try {
//         // URL request
//         // eslint-disable-next-line no-alert
//         const imageUrl = prompt('Enter the URL of the image:');

//         if (imageUrl) {
//             currentImageUrl = imageUrl;
//         } else {
//             // If no URL is provided, use the default image
//             currentImageUrl = defaultImgPath;
//         }

//         // Send a request to the server to add the image
//         axios.post<Image>('http://localhost:3004/images', {
//             image: currentImageUrl,
//         }).then(() => {
//             allImages();

//             currentImageUrl = defaultImgPath;
//         })
//         .catch((error) => {
//             console.error('Error posting data:', error);
//         });

//         // Create an image element and append it to the container
//         const imageElement = document.createElement('img');
//         imageElement.style.width = '200px';
//         imageElement.style.height = 'auto';
//         imageElement.src = currentImageUrl;

//         imageContainer.appendChild(imageElement);
//     } catch (error) {
//         console.error('Error adding image:', error);
//     }
// });
