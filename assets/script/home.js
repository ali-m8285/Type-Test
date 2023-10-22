const api_url = `https://api.api-ninjas.com/v1/quotes`;
const api_key = "fMLExSSadUeokrb2mFrq0Q==QZcXR8OWU37Lvp7n";
let quote, author, category;

async function getQuote() {
    document.body.style.cursor = "wait";

    const response = await fetch(api_url, {
        method: "GET",
        headers: {
            "X-Api-Key": api_key,
        },
    });

    if (response.status !== 200) {
        throw response;
    }

    const data = await response.json();

    quote = data[0].quote;
    author = data[0].author;
    category = data[0].category;

    // quote = "hello world"; // }
    // author = "ali majidi"; // }==> placeholder
    // category = "fucked up"; // }
}

getQuote()
    .then(program)
    .catch(response => {
        const quoteContainer = document.querySelector(".quoteContainer");
        let status;

        response.status ? (status = response.status) : (status = 403);

        quoteContainer.style.backgroundImage = `url('https://http.cat/${status}')`;

        if (document.body.classList.contains("dark-mode")) {
            quoteContainer.style.boxShadow = "0px 0px 15px 0px white";
        }
    });

function program() {
    // ----------------------------------------------------------------- input
    const quoteContainer = document.querySelector(".quoteContainer");
    const quoteWritePlace = document.getElementById("writePlace");
    const authorElement = document.querySelector(".author");
    const categoryElement = document.querySelector(".category");
    const modal = document.querySelector(".endModal");
    const btnCloseModal = document.querySelector(".closeModal");
    const overlay = document.querySelector(".overlay");
    const btnDarkMode = document.querySelector(".dark-mode-btn");
    const correctLetterElement = document.querySelector(".correctLetters");
    const falseLetterElement = document.querySelector(".falseLetters");
    const wordCountElement = document.querySelector(".wordCount");
    const timeElement = document.querySelector(".time");
    const wpmElement = document.querySelector(".wpm");
    const accuracyElement = document.querySelector(".accuracy");
    const wordCount = quote.split(" ").length;
    const letterCount = quote.length;
    let timer = false,
        time = 0;
    let wpm; // word per minute
    let accuracy;
    let correctLetterCounter = 0;
    let falseLetterCounter = 0;

    // ----------------------------------------------------------------- function

    // just for close the modal using button or click on overlay to close modal and reload whole page to take test again
    const closeModal = () => {
        modal.style.display = "none";
        overlay.style.display = "none";
        location.reload();
    };

    // make <p> tags hide or appear when user types
    const paragraphs = {
        paragraphsList: document.querySelectorAll("p"),
        hide: function () {
            for (let paragraph of this.paragraphsList) {
                paragraph.classList.add("hidden");
            }
        },
        appear: function () {
            for (let paragraph of this.paragraphsList) {
                paragraph.classList.remove("hidden");
            }
        },
    };

    // ----------------------------------------------------------------- process
    for (let letter in quote) {
        quoteContainer.innerHTML += `<span id="letter${letter}">${quote[letter]}<span>`;
    }

    document.body.style.cursor = "default";
    quoteWritePlace.value = "";
    authorElement.textContent += author;
    categoryElement.textContent += category;
    document.getElementById("letter0").classList.add("focus");
    wordCountElement.textContent += wordCount;

    quoteWritePlace.addEventListener("focus", () => {
        document
            .getElementById(`letter${quoteWritePlace.value.length}`)
            .classList.add("focus");
    });

    quoteWritePlace.addEventListener("focusout", () => {
        clearInterval(timer);
        timer = false;

        paragraphs.appear();

        document
            .getElementById(`letter${quoteWritePlace.value.length}`)
            .classList.remove("focus");
    });

    quoteWritePlace.addEventListener("keypress", e => {
        if (!timer) {
            timer = setInterval(() => {
                time++;
            }, 1000);

            paragraphs.hide();
        }

        const letterElement = document.getElementById(
            `letter${quoteWritePlace.value.length}`
        );

        // check entered letter that is correct or not
        if (e.key === letterElement.textContent) {
            letterElement.classList.add("correct");
            correctLetterCounter++;
        } else {
            letterElement.classList.add("false");
            falseLetterCounter++;
        }

        // handle focus or un-focus the letter for better experience
        letterElement.classList.remove("focus");
        quoteWritePlace.value.length + 1 < quote.length &&
            document
                .getElementById(`letter${quoteWritePlace.value.length + 1}`)
                .classList.add("focus");

        // finish test
        if (quoteWritePlace.value.length >= quote.length - 1) {
            quoteWritePlace.disabled = true;

            let minute = time / 60;
            minute < 1 ? (minute = 1) : (minute = Math.round(minute));
            wpm = wordCount / minute;

            accuracy =
                ((correctLetterCounter - falseLetterCounter) * 100) /
                letterCount;

            correctLetterElement.textContent += correctLetterCounter;
            falseLetterElement.textContent += falseLetterCounter;
            timeElement.textContent += time + "s";
            wpmElement.textContent += wpm;
            accuracyElement.textContent += Math.abs(Math.floor(accuracy)) + "%";

            modal.style.display = "flex";
            overlay.style.display = "block";
            correctLetterCounter >= falseLetterCounter
                ? (modal.style.backgroundColor = "rgb(64, 209, 64)")
                : null;

            clearInterval(timer);
        }
    });

    // Manage 'Backspace' key press
    quoteWritePlace.addEventListener("keyup", e => {
        const letterClasses = document.getElementById(
            `letter${quoteWritePlace.value.length}`
        ).classList;

        if (e.key === "Backspace" || e.keyCode === 8) {
            document
                .getElementById(`letter${quoteWritePlace.value.length + 1}`)
                .classList.remove("focus");

            letterClasses.add("focus");
            letterClasses.remove(letterClasses[0]);
        }
    });

    // disable 'Enter' and 'CTRL' key && make 'Tab' key to reload whole page
    quoteWritePlace.addEventListener("keydown", e => {
        if (e.key === "Tab") {
            e.preventDefault();
            location.reload();
        }

        if (
            (e.target.type === "text" &&
                (e.key === "Enter" || e.keyCode === 13)) ||
            e.ctrlKey
        ) {
            e.preventDefault();
        }
    });

    // DarkMode process
    btnDarkMode.addEventListener("click", function () {
        const body = document.body;

        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
            this.classList.add("turn-on");
        } else {
            this.classList.remove("turn-on");
        }
    });

    // Modal process
    btnCloseModal.addEventListener("click", closeModal);

    overlay.addEventListener("click", closeModal);

    // to close modal using 'Esc' OR 'Enter' key press
    document.addEventListener("keydown", e => {
        if (
            (e.key === "Escape" || e.key === "Enter") &&
            modal.style.display === "flex"
        ) {
            closeModal();
        }
    });
}

// ***************************************************************************documentation
// ***************************************************************************************
// https://www.cbse.gov.in/newsite/attach//Typing%20Test%20Formula%20and%20Illustration.pdf
