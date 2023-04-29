const bhagavadGitaChapters = [
  { chapter: 1, verses: 47 },
  { chapter: 2, verses: 72 },
  { chapter: 3, verses: 43 },
  { chapter: 4, verses: 42 },
  { chapter: 5, verses: 29 },
  { chapter: 6, verses: 47 },
  { chapter: 7, verses: 30 },
  { chapter: 8, verses: 28 },
  { chapter: 9, verses: 34 },
  { chapter: 10, verses: 42 },
  { chapter: 11, verses: 55 },
  { chapter: 12, verses: 20 },
  { chapter: 13, verses: 35 },
  { chapter: 14, verses: 27 },
  { chapter: 15, verses: 20 },
  { chapter: 16, verses: 24 },
  { chapter: 17, verses: 28 },
  { chapter: 18, verses: 78 },
];

const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");

chapterSelect.addEventListener("change", () => {
  const chapterNumber = parseInt(chapterSelect.value);
  if (chapterNumber) {
    // Clear existing options
    verseSelect.innerHTML = "";
    // Add option for each verse in selected chapter
    for (let i = 1; i <= bhagavadGitaChapters[chapterNumber - 1].verses; i++) {
      const option = document.createElement("option");
      option.text = "Verse " + i;
      option.value = i;
      verseSelect.add(option);
    }
  }
});

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const chapterNumber = chapterSelect.value;
  const verseNumber = verseSelect.value;
  const resultContainer = document.getElementById("result");
  const meaningContainer = document.getElementById("meaning");
  const currentChapterContainer = document.getElementById("currentChapter");
  const currentVerseContainer = document.getElementById("currentVerse");
  const speakButton = document.getElementById("speakButton");
  const whichVerse = document.getElementById("whichVerse");
  const nextVerse = document.getElementById("nextButton");

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "9892626e54msh5fda951b290e0c2p1e343fjsn1291936e2614",
      "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
    },
  };

  fetch(
    `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/${verseNumber}/`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      resultContainer.innerHTML = data.text;
      meaningContainer.innerHTML = data.translations[5].description;
      currentChapterContainer.innerHTML = data.chapter_number;
      currentVerseContainer.innerHTML = data.verse_number;

      whichVerse.hidden = false;
      speakButton.hidden = false;
      speakButton.addEventListener("click", () => {
        chrome.tts.speak(data.text, { lang: "en-US", rate: 2.0 });
      });
      nextVerse.hidden = false;
    })
    .catch((err) => console.error("not found"));
});

//for random verse in random chapter
function showRandomVerse() {
  const resultContainer = document.getElementById("result");
  const meaningContainer = document.getElementById("meaning");
  const whichVerse = document.getElementById("whichVerse");
  const currentChapterContainer = document.getElementById("currentChapter");
  const currentVerseContainer = document.getElementById("currentVerse");
  const speakButton = document.getElementById("speakButton");
  const nextVerse = document.getElementById("nextButton");

  const maxChapters = 18;
  const maxVerses = [
    47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
  ];
  const randomChapterNumber = Math.floor(Math.random() * maxChapters) + 1;
  const randomVerseNumber =
    Math.floor(Math.random() * maxVerses[randomChapterNumber - 1]) + 1;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "9892626e54msh5fda951b290e0c2p1e343fjsn1291936e2614",
      "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
    },
  };

  fetch(
    `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${randomChapterNumber}/verses/${randomVerseNumber}/`,
    options
  )
    .then((response) => response.json())

    .then((data) => {
      resultContainer.innerHTML = data.text;
      meaningContainer.innerHTML = data.translations[5].description;
      currentChapterContainer.innerHTML = data.chapter_number;
      currentVerseContainer.innerHTML = data.verse_number;
      whichVerse.hidden = false;
      speakButton.hidden = false;
      
      speakButton.addEventListener("click", () => {
        chrome.tts.speak(data.meaning, { lang: "en-US", rate: 2.0 });
      });

      nextVerse.hidden = false;
    })
    .catch((err) => console.error("not found"));
}

const randomForm = document.getElementById("randomForm");

randomForm.addEventListener("submit", (e) => {
  e.preventDefault();

  showRandomVerse();
});

// latest for showing next verse

function showNextVerse() {
  const chapterNumber = chapterSelect.value;
  let verseNumber = parseInt(verseSelect.value);
  if (verseNumber < bhagavadGitaChapters[chapterNumber - 1].verses) {
    verseNumber++;
    verseSelect.value = verseNumber;
  } else {
    // go to next chapter if end of current chapter is reached
    if (chapterNumber < bhagavadGitaChapters.length) {
      chapterSelect.value = parseInt(chapterSelect.value) + 1;
      verseSelect.innerHTML = "";
      for (let i = 1; i <= bhagavadGitaChapters[chapterNumber].verses; i++) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber = 1;
      verseSelect.value = verseNumber;
    } else {
      // reached end of Bhagavad Gita, reset to first chapter and verse
      chapterSelect.value = 1;
      verseSelect.innerHTML = "";
      for (let i = 1; i <= bhagavadGitaChapters[0].verses; i++) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber = 1;
      verseSelect.value = verseNumber;
    }
  }

  form.dispatchEvent(new Event("submit"));
}
document.getElementById("nextButton").addEventListener("click", showNextVerse);

//to show previous verse
function showPreviousVerse() {
  const chapterNumber = chapterSelect.value;
  let verseNumber = parseInt(verseSelect.value);
  if (verseNumber > 1) {
    verseNumber--;
    verseSelect.value = verseNumber;
  } else {
    // go to previous chapter if beginning of current chapter is reached
    if (chapterNumber > 1) {
      chapterSelect.value = parseInt(chapterSelect.value) - 1;
      verseSelect.innerHTML = "";
      for (
        let i = 1;
        i <= bhagavadGitaChapters[chapterNumber - 2].verses;
        i++
      ) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber = bhagavadGitaChapters[chapterNumber - 2].verses;
      verseSelect.value = verseNumber;
    } else {
      // reached beginning of Bhagavad Gita, go to last chapter and verse
      chapterSelect.value = bhagavadGitaChapters.length;
      verseSelect.innerHTML = "";
      for (
        let i = 1;
        i <= bhagavadGitaChapters[bhagavadGitaChapters.length - 1].verses;
        i++
      ) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber =
        bhagavadGitaChapters[bhagavadGitaChapters.length - 1].verses;
      verseSelect.value = verseNumber;
    }
  }
  form.dispatchEvent(new Event("submit"));
}

document
  .getElementById("previousButton")
  .addEventListener("click", showPreviousVerse);
