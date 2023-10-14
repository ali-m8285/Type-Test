const api_url = `https://api.api-ninjas.com/v1/quotes`;
const api_key = "fMLExSSadUeokrb2mFrq0Q==QZcXR8OWU37Lvp7n";
let quote, author, category;

async function getQuote() {
    document.querySelector("body").style.cursor = "wait";

    // const response = await fetch(api_url, {
    //     method: "GET",
    //     headers: {
    //         "X-Api-Key": api_key,
    //     },
    // });

    // const data = await response.json();
    // quote = data[0].quote;
    // author = data[0].author;
    // category = data[0].category;

    quote = "hello world";
    author = "ali majidi";
    category = "fucked up";
}

getQuote().then(() => {
    const quoteContainer = document.querySelector(".quoteContainer");
    const quoteWritePlace = document.getElementById("writePlace");
    const authorElement = document.querySelector(".author");
    const categoryElement = document.querySelector(".category");
    const modal = document.querySelector(".endModal");
    const btnCloseModal = document.querySelector(".closeModal");
    const overlay = document.querySelector(".overlay");
    const correctLetterElement = document.querySelector(".correctLetters");
    const falseLetterElement = document.querySelector(".falseLetters");
    const wordCountElement = document.querySelector(".wordCount");
    const timeElement = document.querySelector(".time")
    const wordCount = quote.split(" ").length;
    let timer = false, time = 0 ;
    let wpm;
    let correctLetterCounter = 0;
    let falseLetterCounter = 0;

    for (let letter in quote) {
        quoteContainer.innerHTML += `<span id="letter${letter}">${quote[letter]}<span>`;
    }

    document.querySelector("body").style.cursor = "default";
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
        clearInterval(timer)
        timer = false;
        
        document
            .getElementById(`letter${quoteWritePlace.value.length}`)
            .classList.remove("focus");
    });

    quoteWritePlace.addEventListener("keypress", e => {
        // ***************************************************************************** KH.darman inja :)
        if (!timer) {
            timer = setInterval(() => {
                time++;
                console.log(time);
            }, 1000)
        }
        // ************************************************************************************************
        
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

        // disable the input to end test
        if (quoteWritePlace.value.length >= quote.length - 1) {
            quoteWritePlace.disabled = true;

            correctLetterElement.textContent += correctLetterCounter;
            falseLetterElement.textContent += falseLetterCounter;
            timeElement.textContent = time + "s"
            
            modal.style.display = "flex";
            overlay.style.display = "block";
            correctLetterCounter >= falseLetterCounter
                ? (modal.style.backgroundColor = "rgb(64, 209, 64)")
                : null;
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

    // just for close the modal using button or click on overlay to close modal and reload whole page to take test again
    const closeModal = function () {
        modal.style.display = "none";
        overlay.style.display = "none";
        location.reload();
    };

    btnCloseModal.addEventListener("click", closeModal);

    overlay.addEventListener("click", closeModal);

    // to close modal using 'Esc' key press
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
});
