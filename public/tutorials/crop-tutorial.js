function fetchCrops() {
    return new Promise((resolve, reject) => {
        fetch('/getCrops', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
        }) 
        .then(response => {
            if (!response.ok) {
                throw new Error ('Network response was not ok');
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

function populateCrops() {
fetchCrops()
.then(data => {
    setTimeout(function() {
        let htmlContent = '';
        data.forEach((crop) => {
            htmlContent += 
            `
            <div class="crop" id="crops">
                <button class="button" id="${crop.tutorial_cropID}" onclick="toggleCrop(${crop.tutorial_cropID})">
                    <p>${crop.cropName}</p>
                    <svg class="arrow-icon" width="40" height="40" viewBox="0 0 70 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M49.023 35.1966L27.5012 56.0737C27.3013 56.2677 27.0639 56.4216 26.8026 56.5266C26.5414 56.6315 26.2614 56.6856 25.9786 56.6856C25.6958 56.6856 25.4158 56.6315 25.1545 56.5266C24.8932 56.4216 24.6559 56.2677 24.4559 56.0737C24.2559 55.8798 24.0973 55.6495 23.9891 55.3961C23.8809 55.1426 23.8252 54.871 23.8252 54.5967C23.8252 54.3224 23.8809 54.0507 23.9891 53.7973C24.0973 53.5439 24.2559 53.3136 24.4559 53.1196L44.4577 33.7195L24.4559 14.3194C24.0521 13.9276 23.8252 13.3963 23.8252 12.8423C23.8252 12.2883 24.0521 11.757 24.4559 11.3652C24.8597 10.9735 25.4075 10.7534 25.9786 10.7534C26.5497 10.7534 27.0974 10.9735 27.5012 11.3652L49.023 32.2424C49.2231 32.4363 49.3818 32.6666 49.4901 32.92C49.5984 33.1735 49.6542 33.4451 49.6542 33.7195C49.6542 33.9938 49.5984 34.2655 49.4901 34.519C49.3818 34.7724 49.2231 35.0027 49.023 35.1966Z"/>
                    </svg>
                </button>
            </div>
            `;
        });

        document.getElementById('crops').innerHTML += htmlContent;
    }, 100);
})
.catch(error => {
    console.error('Error fetching crop data:', error);
});
}

populateCrops();
        
function toggleCrop(cropID) {
fetchCrops()
.then(data => {
    const crop = data.find(c => c.tutorial_cropID === cropID);

    if (!crop) {
        console.error('Crop not found');
        return;
    }

    let htmlContent = '';
    setTimeout(function() {
        let htmlContent = 
        `
        <div class="crop" id="crop">
            <div class="top-section"> 
                <button class="button" id="backButton">Back</button>   
            </div>
            <h1>${crop.cropName}</h1>
            <div class="crop-row">
                <iframe class="crop-video" width="45%" height="300px" style="border-radius: 10px" src="${crop.videoLink}" frameborder="0" allowfullscreen></iframe>

                <div class="conditions"> 
                    <div class="details-item"><span class="details-label">ph Value</span>:<span class="details-info name" style="white-space: nowrap">${crop.phValue}</span></div>
                    <div class="details-item"><span class="details-label">Water requirements</span>:<span class="details-info name">${crop.waterRequirements}</span></div>
                    <div class="details-item"><span class="details-label">Sunlight</span>:<span class="details-info name">${crop.sunlight}</span></div>
                    <div class="details-item"><span class="details-label">Fertilizer</span>:<span class="details-info name" style="white-space: nowrap">${crop.fertilizer}</span></div>
                    <div class="details-item"><span class="details-label">Soil type</span>:<span class="details-info name">${crop.soilType}</span></div>
                    <div class="details-item"><span class="details-label">Optimal temperature</span>:<span class="details-info name">${crop.optimalTemperature}</span></div>
                    <div class="details-item"><span class="details-label">Planting period</span>:<span class="details-info name">${crop.plantingPeriod}</span></div>
                    <div class="details-item"><span class="details-label">Article</span>:<span class="details-info name"><a href=${crop.articleLink}>${crop.articleName}</a></span></div>
                </div>   
            </div>
        </div>
        `;
        
        document.getElementById('crops').style.display = 'none';
        document.getElementById('crop').innerHTML = htmlContent;
        document.getElementById('crop').style.display = 'block';

        document.getElementById('backButton').addEventListener('click', function() { 
            document.getElementById('crop').style.display = 'none';
            document.getElementById('crops').style.display = 'block';
        }); 
    }, 100);
})
.catch(error => {
    console.error('Error fetching crop data:', error);
});
}