const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// NASA API 
const count = 10;
const apiKey = 'DEMO_KEY'; 
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites= {};

//function to remove loader 
function showContent(page) {
    window.scrollTo({top:0, behavior:'instant'})
    if(page=== 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');

    }
    loader.classList.add('hidden');
}

//function that will creat DOM element 
function createDOMNodes (page) {
    const currentArray =page === 'results' ? resultsArray : Object.values(favorites);
    
    currentArray.forEach((result) => {
        
        //card container
        const card = document.createElement('div');
        card.classList.add('card');
        
        // link
        const link = document.createElement('a');
        link.href=result.hdurl;
        link.title= 'view full image';
        link.target= '_blank';
        
        // image
        const image = document.createElement('img');
        image.src=result.url;
        image.alt = 'nasa picture of the day';
        image.loading= 'lazy';
        image.classList.add('card-img-top');

        //card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent= result.title;
        //save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
       if (page==='results') {
        saveText.textContent= 'add to favorite';
        saveText.setAttribute ('onclick',`saveFavorite('${result.url}')`);
       } else {
        saveText.textContent= 'remove favorites';
        saveText.setAttribute ('onclick',`removeFavorite('${result.url}')`);
       }
        //card text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        //Footer conatiner
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //copyright
        //check if the value of copyright is exist or not and remove the undefined result that appear if the result is epmty
        const copyrightResult = result.copyright === undefined ? '' : result.copyright; 
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        //Append
        footer.append(date,copyright)
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);

    });
}
function updateDOM(page) {
    //Get favoroites from local storage
    if(localStorage.getItem('nasa')) {
        favorites = JSON.parse(localStorage.getItem('nasa'));
        
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    // show content and remove loader when the dom is created
    showContent(page);
    
}

// Get 10 Images from NASA API

async function getNasaPictures() {
    //show loader
    loader.classList.remove('hidden');
    try{
       const response = await fetch(apiUrl);
       resultsArray = await response.json();
       updateDOM('results');

    } catch(error) {
        //catch error here
    }
}

// Add result favories
function saveFavorite(itemUrl) {
    // loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            console.log(favorites);
    // show save confirmation for 2 seconds
    saveConfirmed.hidden = false;
    setTimeout(()=> {
        saveConfirmed.hidden=true;
    },2000);
    // set favorites in local storage
    localStorage.setItem('nasa',JSON.stringify(favorites));

}
});
}

//Remove item from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // set favorites in local storage
    localStorage.setItem('nasa',JSON.stringify(favorites));
    updateDOM('favorites');
    }

} 

// on load 
getNasaPictures();