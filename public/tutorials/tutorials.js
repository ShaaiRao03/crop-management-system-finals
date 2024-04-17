function fetchArticles() {
    return new Promise((resolve, reject) => {
        fetch('/getArticles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function populateArticles() {
    fetchArticles()
    .then(data => {
        let htmlContent = '';
        data.forEach((article) => {
            htmlContent +=
            `
            <div class="article">
                <img class="article-pic" src="${article.imageLink}">
                <div class="article-name">
                    <a href="${article.articleLink}">${article.articleName}</a>
                </div>
            </div>
            `;
        });

        document.getElementById('article-row').innerHTML = htmlContent;
    })
    .catch(error => {
        console.error('Error fetching video data:', error);
    });
}

function fetchWebsites() {
    return new Promise((resolve, reject) => {
        fetch('/getWebsites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function populateWebsites() {
    fetchWebsites()
    .then(data => {
        let htmlContent = '';
        data.forEach((website) => {
            htmlContent +=
            `
            <div class="website">
                <h3>${website.websiteName}</h3>
                <hr>
                <div class="website-description">
                    <p>${website.websiteDescription}</p>
                    <button><a href="${website.websiteLink}">Learn More</a></button>
                </div>
            </div>
            `;
        });

        document.getElementById('website-row').innerHTML = htmlContent;
    })
    .catch(error => {
        console.error('Error fetching website data:', error);
    });
}

function filter() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const cropButtons = document.querySelectorAll('.button');

    cropButtons.forEach(button => {
        const cropName = button.querySelector('p').innerText.toLowerCase();
        if(cropName.includes(searchInput)) {
            button.parentElement.style.display = 'block';
        } else {
            button.parentElement.style.display = 'none';
        }
    });
}

document.getElementById('search-input').addEventListener('input', filter);

populateArticles();
populateWebsites();