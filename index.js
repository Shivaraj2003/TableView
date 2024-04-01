const page_limit = 5;
var currentPage = 1;
var totalPages = 1;
var filterDropdown = document.getElementById('filterDropdown');
var data;
var startIndex, endIndex;
const btns = document.querySelectorAll('.page-link');
var dropdown = document.getElementById('dropdown');


for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', () => {
        let pageNum = btns[i].textContent;

        if (pageNum === 'Prev') {
            if (currentPage == 1)
                // document.getElementById("prev").disabled = true;
                console.log(Number(btns[btns.length - 1].textContent) > 3);
            else {
                updatePageNum(pageNum);
                currentPage -= 1;
            }
        }
        else if (pageNum == 'Next') {
            if (currentPage == totalPages) {
                document.getElementById("next").disabled = true;
            }
            else {
                currentPage += 1;
                updatePageNum(pageNum);
                document.getElementById("next").disabled = false;
            }

        }
        else {
            currentPage = Number(pageNum);
            document.getElementById("prev").disabled = false;
        }
        if (currentPage > 1) {
            dropdown.style.display = 'none';
        }
        else {
            dropdown.style.display = 'block';
        }
        renderData();
    }
    )
}

function updatePageNum(btn) {
    if (btn == 'Next') {
        if (totalPages <= 3) {
            return;
        }
        for (let i = 1; i < btns.length - 1; i++) {
            btns[i].textContent = Number(btns[i].textContent) + 1;
        }
        console.log(currentPage);
    }
    else if (btn == 'Prev') {
        if (totalPages <= 3) {
            return;
        }
        for (let i = 1; i < btns.length - 1; i++) {
            btns[i].textContent = Number(btns[i].textContent) - 1;
        }
    }
}


async function loadDataAndDisplay(currentPage = 1) {
    try {
        const response = await fetch("movies.json");
        data = await response.json();
        totalPages = Math.ceil(data.length / page_limit);

        const tableBody = document.querySelector("#tableBody");
        //data.sort((a, b) => b.imdb.rating - a.imdb.rating);
        tableBody.innerHTML = "";
        // startIndex = (currentPage - 1) * 5;
        // endIndex = currentPage * 5 - 1;
        // for (let i = startIndex; i <= endIndex; i++) {
        //     {
        //         const row = document.createElement("tr");
        //         row.innerHTML = `
        //         <td>${i + 1}</td>
        //         <td>${data[i].title}</td>
        //         <td>${data[i].imdb.rating}</td>
        //         <td>${data[i].tomatoes.viewer.rating}</td>
        //         <td>${(data[i].imdb.rating + data[i].tomatoes.viewer.rating).toFixed(2)}</td>
        //         <td>${data[i].plot}</td>
        //         `;
        //         tableBody.appendChild(row);
        //     }
        // }   
        renderData();
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
}

filterDropdown.addEventListener('click', function (e) {

    if (e.target.classList.contains('dropdown-item')) {
        var selectedValue = e.target.getAttribute('data-value');
        sortItems(selectedValue);
        console.log('Selected Value:', selectedValue);
    }
});


async function sortItems(sI) {
    const originalData = JSON.parse(JSON.stringify(data));
    data = originalData.filter(item => item.imdb.rating >= sI);
    console.log(data);

    await renderData(true);
    //data = originalData;
}


function renderData(sort = false) {

    const tableBody = document.querySelector("#tableBody");
    totalPages = Math.ceil(data.length / 5);
    if (sort) {

        currentPage = 1;
        startIndex = (currentPage - 1) * 5;
        endIndex = currentPage * 5 - 1;
    }
    else {
        startIndex = (currentPage - 1) * 5;
        endIndex = currentPage * 5 - 1;
    }

    //data.sort((a, b) => b.imdb.rating - a.imdb.rating);
    tableBody.innerHTML = "";
    for (let i = startIndex; i <= endIndex; i++) {
        {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${i + 1}</td>
        <td>${data[i].title}</td>
        <td>${data[i].imdb.rating}</td>
        <td>${data[i].tomatoes.viewer.rating}</td>
        <td>${((data[i].imdb.rating + (data[i].tomatoes.viewer.rating) * 2).toFixed(2) / 2)}</td>
        <td>${data[i].plot}</td>
      `;
            tableBody.appendChild(row);
        }
    }
}



document.getElementById("titleButton").addEventListener("click", function () {
    if (document.getElementById("titleButton").textContent == 'Sort Now') {
        data.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();

            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;

        });

        renderData();
        document.getElementById("titleButton").textContent = 'Sorted';
    }
    else {
        document.getElementById("titleButton").textContent = 'Sort Now'
        loadDataAndDisplay();
    }
});





loadDataAndDisplay();
