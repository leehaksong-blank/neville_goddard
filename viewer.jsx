const { useState, useEffect } = React;

// 1. 네빌 고다드 14권 정규 저서 (book1.json ~ book14.json 매칭)
const BOOKS = [
  { bookNum: 1, year: 1939, title: "At Your Command", koTitle: "당신의 명령대로" },
  { bookNum: 2, year: 1941, title: "Your Faith Is Your Fortune", koTitle: "당신의 믿음이 당신의 행운이다" },
  { bookNum: 3, year: 1942, title: "Freedom For All", koTitle: "모두를 위한 자유" },
  { bookNum: 4, year: 1944, title: "Feeling Is The Secret", koTitle: "느낌이 비밀이다" },
  { bookNum: 5, year: 1945, title: "Prayer, The Art Of Believing", koTitle: "기도, 믿음의 기술" },
  { bookNum: 6, year: 1946, title: "The Search", koTitle: "탐구" },
  { bookNum: 7, year: 1949, title: "Out Of This World", koTitle: "이 세상의 것이 아닌" },
  { bookNum: 8, year: 1952, title: "The Power Of Awareness", koTitle: "자각의 힘" },
  { bookNum: 9, year: 1954, title: "Awakened Imagination", koTitle: "깨어난 상상력" },
  { bookNum: 10, year: 1956, title: "Seedtime And Harvest", koTitle: "씨 뿌릴 때와 거둘 때" },
  { bookNum: 11, year: 1961, title: "The Law And The Promise", koTitle: "법칙과 약속" },
  { bookNum: 12, year: 1965, title: "I Know My Father", koTitle: "나는 내 아버지를 안다" },
  { bookNum: 13, year: 1966, title: "Resurrection", koTitle: "부활, 신앙 고백" },
  { bookNum: 14, year: 1970, title: "He Breaks The Shell", koTitle: "그가 껍질을 깨뜨리다" }
];

// 2. 네빌 고다드 294개 강의 (vol1.json ~ vol6.json 매칭)
const VOLUMES = [
  { vol: 1, title: "제1권 (001 ~ 050번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1" },
  { vol: 2, title: "제2권 (051 ~ 100번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2" },
  { vol: 3, title: "제3권 (101 ~ 150번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3" },
  { vol: 4, title: "제4권 (151 ~ 200번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4" },
  { vol: 5, title: "제5권 (201 ~ 250번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5" },
  { vol: 6, title: "제6권 (251 ~ 294번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6" }
];

function ViewerApp() {
  const [openBooksMenu, setOpenBooksMenu] = useState(true);
  const [openVol, setOpenVol] = useState(1);
  const [loadingVol, setLoadingVol] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState({});

  const [volLectures, setVolLectures] = useState({});
  const [store, setStore] = useState({});
  const [selectedLec, setSelectedLec] = useState({
    isBook: false,
    num: 1,
    title: "A Divine Event"
  });
  const [quizMode, setQuizMode] = useState(false);

  // JSON 데이터를 store에 병합 (배열 형태와 객체 형태 모두 호환)
  const mergeDataToStore = (publicData, fallbackTitle) => {
    if (!publicData) return;
    setStore(prev => {
      const merged = { ...prev };
      if (Array.isArray(publicData) && fallbackTitle) {
        const locArr = Array.isArray(prev[fallbackTitle]) ? prev[fallbackTitle] : [];
        merged[fallbackTitle] = publicData.length >= locArr.length ? publicData : locArr;
        return merged;
      }
      if (typeof publicData === "object") {
        Object.keys(publicData).forEach(key => {
          const pubArr = Array.isArray(publicData[key]) ? publicData[key] : [];
          const locArr = Array.isArray(prev[key]) ? prev[key] : [];
          merged[key] = pubArr.length >= locArr.length ? pubArr : locArr;
        });
      }
      return merged;
    });
  };

  // 지정한 JSON 파일(vol1~6.json, book1~14.json, neville_data.json) 불러오기
  const loadJsonFile = async (fileName, fallbackTitle, showSpinner = false) => {
    if (loadedFiles[fileName]) return;
    if (showSpinner) setLoadingData(true);
    try {
      const res = await fetch("./" + fileName + "?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        mergeDataToStore(data, fallbackTitle);
        setLoadedFiles(prev => ({ ...prev, [fileName]: true }));
      }
    } catch (e) {
    } finally {
      if (showSpinner) setLoadingData(false);
    }
  };

  // 앱 첫 실행 시: vol1.json, neville_data.json 및 14권 책 JSON 확인 + 제1권 목차 로드
  useEffect(() => {
    loadJsonFile("vol1.json", null, true);
    loadJsonFile("neville_data.json");
    BOOKS.forEach(b => {
      loadJsonFile("book" + b.bookNum + ".json", b.title);
    });
    fetchVolumeList(VOLUMES[0]);
  }, []);

  const handleToggleBooksMenu = () => {
    const nextState = !openBooksMenu;
    setOpenBooksMenu(nextState);
    if (nextState) {
      BOOKS.forEach(b => {
        loadJsonFile("book" + b.bookNum + ".json", b.title);
      });
    }
  };

  const fetchVolumeList = async (volObj) => {
    if (volLectures[volObj.vol] && volLectures[volObj.vol].length > 0) return;
    setLoadingVol(true);
    try {
      const res = await fetch("https://r.jina.ai/" + volObj.indexUrl);
      const text = await res.text();
      const lines = text.split("\n");
      const list = [];
      const seen = {};
      let startNum = (volObj.vol - 1) * 50 + 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const openBracket = line.indexOf("[");
        const closeBracket = line.indexOf("](http");
        if (openBracket !== -1 && closeBracket !== -1) {
          const title = line.slice(openBracket + 1, closeBracket).trim();
          const rest = line.slice(closeBracket + 2);
          const endUrl = rest.search(/[\s)"]/);
          const rawUrl = (endUrl !== -1 ? rest.slice(0, endUrl) : rest).trim();
          const url = rawUrl.replace("http://", "https://");

          if (
            (url.indexOf("/neville-goddard-lectures/") !== -1 || url.indexOf("/neville-goddard-books/") !== -1) &&
            url.indexOf("read-neville-goddard-lectures-on-line") === -1 &&
            title !== "Neville Goddard Original" &&
            title !== "Neville Goddard Lectures" &&
            title !== "Neville Goddard Books + Audio" &&
            title !== "Read Here" &&
            !seen[url]
          ) {
            seen[url] = true;
            list.push({ num: startNum++, title: title });
          }
        }
      }
      setVolLectures(prev => ({ ...prev, [volObj.vol]: list }));
    } catch (e) {
    } finally {
      setLoadingVol(false);
    }
  };

  const handleToggleVolume = (volObj) => {
    if (openVol === volObj.vol) {
      setOpenVol(null);
      return;
    }
    setOpenVol(volObj.vol);
    loadJsonFile("vol" + volObj.vol + ".json", null, true);
    fetchVolumeList(volObj);
  };

  const sentences = store[selectedLec.title] || [];

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  const handleDownloadPdf = () => {
    if (sentences.length === 0) return;
    if (quizMode) setQuizMode(false);
    const originalTitle = document.title;
    const prefix = selectedLec.isBook
      ? "Book" + String(selectedLec.num).padStart(2, "0") + "_"
      : selectedLec.num ? String(selectedLec.num).padStart(3, "0") + "_" : "";
    document.title = prefix + selectedLec.title + "_강독노트";
    setTimeout(() => {
      window.print();
      document.
