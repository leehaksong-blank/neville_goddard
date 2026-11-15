const { useState, useEffect } = React;

// 1. 네빌 고다드 14권 정규 저서 (book1.json ~ book14.json)
const BOOKS = [
  { bookNum: 1, year: 1939, title: "At Your Command", koTitle: "당신의 명령대로", url: "https://thenevillegoddard.com/at-your-command/" },
  { bookNum: 2, year: 1941, title: "Your Faith Is Your Fortune", koTitle: "당신의 믿음이 당신의 행운이다", url: "https://thenevillegoddard.com/your-faith-is-your-fortune/" },
  { bookNum: 3, year: 1942, title: "Freedom For All", koTitle: "모두를 위한 자유", url: "https://thenevillegoddard.com/freedom-for-all/" },
  { bookNum: 4, year: 1944, title: "Feeling Is The Secret", koTitle: "느낌이 비밀이다", url: "https://thenevillegoddard.com/feeling-is-the-secret/" },
  { bookNum: 5, year: 1945, title: "Prayer, The Art Of Believing", koTitle: "기도, 믿음의 기술", url: "https://thenevillegoddard.com/prayer-the-art-of-believing/" },
  { bookNum: 6, year: 1946, title: "The Search", koTitle: "탐구", url: "https://thenevillegoddard.com/the-search/" },
  { bookNum: 7, year: 1949, title: "Out Of This World", koTitle: "이 세상의 것이 아닌", url: "https://thenevillegoddard.com/out-of-this-world/" },
  { bookNum: 8, year: 1952, title: "The Power Of Awareness", koTitle: "자각의 힘", url: "https://thenevillegoddard.com/the-power-of-awareness/" },
  { bookNum: 9, year: 1954, title: "Awakened Imagination", koTitle: "깨어난 상상력", url: "https://thenevillegoddard.com/awakened-imagination/" },
  { bookNum: 10, year: 1956, title: "Seedtime And Harvest", koTitle: "씨 뿌릴 때와 거둘 때", url: "https://thenevillegoddard.com/seedtime-and-harvest/" },
  { bookNum: 11, year: 1961, title: "The Law And The Promise", koTitle: "법칙과 약속", url: "https://thenevillegoddard.com/the-law-and-the-promise/" },
  { bookNum: 12, year: 1965, title: "I Know My Father", koTitle: "나는 내 아버지를 안다", url: "https://thenevillegoddard.com/i-know-my-father/" },
  { bookNum: 13, year: 1966, title: "Resurrection", koTitle: "부활, 신앙 고백", url: "https://thenevillegoddard.com/resurrection/" },
  { bookNum: 14, year: 1970, title: "He Breaks The Shell", koTitle: "그가 껍질을 깨뜨리다", url: "https://thenevillegoddard.com/he-breaks-the-shell/" }
];

// 2. 연도별 8기 분류 마스터 (era1.json ~ era8.json)
const ERAS = [
  { era: 1, title: "제1기 (1948 ~ 1953년)", sub: "초기 강연 & 법칙의 기초", startYear: 1939, endYear: 1953 },
  { era: 2, title: "제2기 (1954 ~ 1956년)", sub: "상상력과 수정 기법 확립", startYear: 1954, endYear: 1956 },
  { era: 3, title: "제3기 (1957 ~ 1959년)", sub: "법칙의 정점과 약속의 개시", startYear: 1957, endYear: 1959 },
  { era: 4, title: "제4기 (1960 ~ 1962년)", sub: "법칙과 약속의 공존", startYear: 1960, endYear: 1962 },
  { era: 5, title: "제5기 (1963 ~ 1964년)", sub: "성경 상징 해독의 확장", startYear: 1963, endYear: 1964 },
  { era: 6, title: "제6기 (1965 ~ 1966년)", sub: "중후기 핵심 신비 강연", startYear: 1965, endYear: 1966 },
  { era: 7, title: "제7기 (1967 ~ 1968년)", sub: "후기 집중 강연 전성기", startYear: 1967, endYear: 1968 },
  { era: 8, title: "제8기 (1969 ~ 1972년)", sub: "말기 강연 & 최종 유산", startYear: 1969, endYear: 1972 }
];

// 백그라운드 목차 수집용 원본 인덱스 URL (화면에는 표시되지 않음)
const INDEX_URLS = [
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6"
];

// 자주 찾는 주요 강의의 알려진 연도 기본값 (원문 클릭 시 본문 날짜로 한번 더 정밀 갱신됨)
const KNOWN_YEARS = {
  // 제1기 (1948~1953)
  "Consciousness Is the Only Reality": 1948,
  "No One to Change But Self": 1948,
  "Assumptions Harden Into Fact": 1948,
  "Thinking Fourth Dimensionally": 1948,
  "Remain Faithful to Your Idea": 1948,
  "Changing The Feeling of I": 1953,
  "Changing the Feeling of I": 1953,

  // 제2기 (1954~1956)
  "The Pruning Shears of Revision": 1954,
  "Awakened Imagination Barabbas or Jesus": 1954,
  "Barabbas or Jesus": 1954,
  "Mental Diets": 1955,
  "Seedtime and Harvest": 1956,

  // 제3기 (1957~1959)
  "Catch The Mood": 1959,
  "Creation Faith": 1959,
  "Awake o Sleeper 1": 1959,
  "Awake o Sleeper 2": 1959,

  // ⭐ 제4기 (1960~1962) — 비어 있던 1960~1962년 대표 강의 추가!
  "A Movement of Mind": 1960,
  "An Inner Conviction": 1960,
  "At Your Command": 1960,
  "Before Abraham was I AM": 1960,
  "Building Your Temple": 1961,
  "Christ in Man": 1961,
  "Christ in You": 1961,
  "Conception": 1961,
  "Control Your Inner Conversations": 1961,
  "Biblical Language": 1962,
  "Brazen Impudence": 1962,
  "Christ Bears Our Sins": 1962,
  "Consigned To Disobedience": 1962,

  // 제5기 (1963~1964)
  "The Pearl of Great Price": 1963,
  "Blake On Religion": 1963,
  "By Water And By Blood": 1964,
  "Christ is Your Life": 1964,
  "Christ Unveiled": 1964,

  // 제6기 (1965~1966)
  "All Things Exist": 1965,
  "The Coin of Heaven": 1966,
  "Be Imitators of God": 1966,
  "Believe It In": 1966,

  // 제7기 (1967~1968)
  "A Lesson in Scripture": 1967,
  "All Things Are Possible": 1967,
  "All Things are Possible 1": 1967,
  "All Things are Possible 2": 1967,
  "A Parabolic Revelation": 1968,
  "A Prophecy": 1968,
  "A State Called Moses": 1968,
  "Arise": 1968,
  "Bear Ye One Another's Burdens": 1968,
  "Behold The Dreamer Cometh": 1968,

  // 제8기 (1969~1972)
  "A Divine Event": 1969,
  "A Movement Within God": 1969,
  "A Riddle": 1969,
  "All Powerful Human Word": 1969,
  "All That is Divine": 1971,
  "All That You Behold": 1970,
  "An Assured Understanding": 1969,
  "Believe In Him": 1969,
  "Christmas - Man's Birth As God": 1969,
  "Come o Blessed": 1970,
  "Divine Signs": 1970,
  "Election And Change Of Consciousness": 1969,
  "Enter The Dream": 1970,
  "Esau And Jacob": 1970
};

const INITIAL_LECTURE = [
  {
    en: "Christmas is the proclamation of a divine event to which all creation aspires.",
    ko: "크리스마스는 모든 피조물이 열망하는 신적 사건을 선포하는 날입니다.",
    vocab: [
      { word: "proclamation", mean: "선언, 선포" },
      { word: "divine", mean: "신성한, 신의" },
      { word: "creation", mean: "(집합적) 모든 피조물, 창조 세계" },
      { word: "aspire to", mean: "~을 열망하다, 염원하다" }
    ],
    grammar: [
      { tag: "전치사 + 관계대명사 (to which)", desc: "선행사 a divine event를 수식합니다. 본래 all creation aspires to the event 구조에서 전치사 to가 관계대명사 which 앞으로 이동하여 결합했습니다." }
    ]
  }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 원문 텍스트 또는 제목에서 연도(1939~1972)를 자동 추출
const extractLectureYear = (text, title) => {
  const sample = (title || "") + " " + (text || "").slice(0, 800);
  const fourDigit = sample.match(/\b(19[3-6]\d|197[0-2])\b/);
  if (fourDigit) return parseInt(fourDigit[1], 10);

  const twoDigit = sample.match(/\b\d{1,2}[-/]\d{1,2}[-/]([4-6]\d|7[0-2])\b/);
  if (twoDigit) return 1900 + parseInt(twoDigit[1], 10);

  return null;
};

// 강의 번호/연도를 기반으로 8개 시대 구간(Era 1~8) 배정
const getEraForLecture = (lec, yearMap) => {
  const y = (yearMap && yearMap[lec.title]) || KNOWN_YEARS[lec.title] || lec.year;
  if (y) {
    const found = ERAS.find(e => y >= e.startYear && y <= e.endYear);
    if (found) return found.era;
  }
  // 아직 한 번도 열어보지 않아 연도가 미확인된 강의는 8개 구간에 균등 초기 배분
  return Math.min(8, Math.max(1, Math.ceil((lec.num || 1) / 37)));
};

const safeParseJSON = (rawStr) => {
  if (!rawStr) return [];
  let text = rawStr.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e1) {
    const firstBracket = text.indexOf("[");
    if (firstBracket !== -1) {
      let cutText = text.slice(firstBracket);
      let searchPos = cutText.length;
      while (searchPos > 0) {
        const lastBrace = cutText.lastIndexOf("}", searchPos - 1);
        if (lastBrace === -1) break;
        const candidate = cutText.slice(0, lastBrace + 1) + "]";
        try {
          const recovered = JSON.parse(candidate);
          if (Array.isArray(recovered) && recovered.length > 0) return recovered;
        } catch (e2) {}
        searchPos = lastBrace;
      }
    }
    throw e1;
  }
};

function App() {
  // 처음 시작할 때 모든 아코디언 메뉴 닫힘 상태 유지
  const [openBooksMenu, setOpenBooksMenu] = useState(false);
  const [openEra, setOpenEra] = useState(null);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState({});
  const [selectedTier, setSelectedTier] = useState("pro");

  // 294개 전체 강의 마스터 목록
  const [allLectures, setAllLectures] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_all_lectures_294");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 강의별 연도 매핑 정보 (자동 감지 + 수동 지정 저장)
  const [lectureYears, setLectureYears] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_lecture_years");
      return saved ? Object.assign({}, KNOWN_YEARS, JSON.parse(saved)) : KNOWN_YEARS;
    } catch (e) {
      return KNOWN_YEARS;
    }
  });

  const [selectedLec, setSelectedLec] = useState({
    isBook: false,
    num: 1,
    title: "A Divine Event",
    url: "https://www.neville-goddard.com/neville-goddard-lectures/a-divine-event-neville-goddard-lecture/"
  });
  const [targetUrl, setTargetUrl] = useState("https://www.neville-goddard.com/neville-goddard-lectures/a-divine-event-neville-goddard-lecture/");
  const [rawText, setRawText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [quizMode, setQuizMode] = useState(false);
  const [resumeChunkIdx, setResumeChunkIdx] = useState(0);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");

  const [store, setStore] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_vol_accordion_store");
      return saved ? JSON.parse(saved) : { "A Divine Event": INITIAL_LECTURE };
    } catch (e) {
      return { "A Divine Event": INITIAL_LECTURE };
    }
  });

  const mergePublicDataToStore = (publicData, fallbackTitle) => {
    if (!publicData) return;
    setStore(prev => {
      const merged = Object.assign({}, prev);
      if (Array.isArray(publicData) && fallbackTitle) {
        const locArr = Array.isArray(prev[fallbackTitle]) ? prev[fallbackTitle] : [];
        merged[fallbackTitle] = publicData.length >= locArr.length ? publicData : locArr;
        return merged;
      }
      if (typeof publicData === "object") {
        Object.keys(publicData).forEach(key => {
          if (key === "_lectureYears" && typeof publicData[key] === "object") {
            setLectureYears(prevY => Object.assign({}, prevY, publicData[key]));
            return;
          }
          const pubArr = Array.isArray(publicData[key]) ? publicData[key] : [];
          const locArr = Array.isArray(prev[key]) ? prev[key] : [];
          merged[key] = pubArr.length >= locArr.length ? pubArr : locArr;
        });
      }
      return merged;
    });
  };

  const loadJsonFile = async (fileName, fallbackTitle) => {
    if (loadedFiles[fileName]) return;
    try {
      const res = await fetch("./" + fileName + "?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        mergePublicDataToStore(data, fallbackTitle);
        setLoadedFiles(prev => Object.assign({}, prev, { [fileName]: true }));
      }
    } catch (e) {}
  };

  // 294개 전체 강의 목록을 백그라운드에서 한 번에 수집
  const fetchAll294Lectures = async () => {
    if (allLectures.length >= 250) return;
    setLoadingLectures(true);
    try {
      const combined = [];
      const seen = {};
      for (let v = 0; v < INDEX_URLS.length; v++) {
        const res = await fetch("https://r.jina.ai/" + INDEX_URLS[v]);
        const text = await res.text();
        const lines = text.split("\n");
        let startNum = v * 50 + 1;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const openBracket = line.indexOf("[");
          const closeBracket = line.indexOf("](http");
          if (openBracket !== -1 && closeBracket !== -1) {
            const title = line.slice(openBracket + 1, closeBracket).trim();
            const rest = line.slice(closeBracket + 2);
            let rawUrl = rest;
            const spaceIdx = rawUrl.indexOf(" ");
            if (spaceIdx !== -1) rawUrl = rawUrl.slice(0, spaceIdx);
            const parenIdx = rawUrl.indexOf(")");
            if (parenIdx !== -1) rawUrl = rawUrl.slice(0, parenIdx);
            const quoteIdx = rawUrl.indexOf('"');
            if (quoteIdx !== -1) rawUrl = rawUrl.slice(0, quoteIdx);
            const url = rawUrl.trim().replace("http://", "https://");

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
              const autoY = extractLectureYear("", title) || KNOWN_YEARS[title] || null;
              combined.push({ num: startNum++, title: title, url: url, year: autoY });
            }
          }
        }
      }
      if (combined.length > 0) {
        setAllLectures(combined);
      }
    } catch (e) {
    } finally {
      setLoadingLectures(false);
    }
  };

  // 앱 최초 실행 시 기존 JSON(neville_data, vol1~6, era1~8) 자동 확인 및 294 목차 준비
  useEffect(() => {
    loadJsonFile("neville_data.json");
    for (let i = 1; i <= 8; i++) loadJsonFile("era" + i + ".json");
    for (let v = 1; v <= 6; v++) loadJsonFile("vol" + v + ".json");
    fetchAll294Lectures();
  }, []);

  useEffect(() => {
    try { localStorage.setItem("neville_all_lectures_294", JSON.stringify(allLectures)); } catch (e) {}
  }, [allLectures]);

  useEffect(() => {
    try { localStorage.setItem("neville_lecture_years", JSON.stringify(lectureYears)); } catch (e) {}
  }, [lectureYears]);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_accordion_store", JSON.stringify(store)); } catch (e) {}
  }, [store]);

  const handleToggleBooksMenu = () => {
    const nextState = !openBooksMenu;
    setOpenBooksMenu(nextState);
    if (nextState) {
      BOOKS.forEach(b => loadJsonFile("book" + b.bookNum + ".json", b.title));
    }
  };

  const handleToggleEra = (eraObj) => {
    if (openEra === eraObj.era) {
      setOpenEra(null);
      return;
    }
    setOpenEra(eraObj.era);
    loadJsonFile("era" + eraObj.era + ".json");
    if (allLectures.length === 0) {
      fetchAll294Lectures();
    }
  };

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  const currentEraNum = selectedLec.isBook
    ? 1
    : openEra || getEraForLecture(selectedLec, lectureYears);

  // 현재 보고 있는 책(book1~14.json) 또는 연도 기수(era1~8.json) 맞춤 백업
  const handleExportCurrentTargetJson = () => {
    if (selectedLec.isBook) {
      const bookData = store[selectedLec.title] || [];
      if (bookData.length === 0) {
        alert("아직 이 책의 강독 노트가 없습니다.");
        return;
      }
      const exportObj = { [selectedLec.title]: bookData };
      const fileName = "book" + selectedLec.num + ".json";
      const jsonString = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const eraLectures = allLectures.filter(l => getEraForLecture(l, lectureYears) === currentEraNum);
    let exportObj = { _lectureYears: lectureYears };

    eraLectures.forEach(lec => {
      if (store[lec.title] && store[lec.title].length > 0) {
        exportObj[lec.title] = store[lec.title];
      }
    });

    const fileName = "era" + currentEraNum + ".json";
    const jsonString = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJson = () => {
    const exportObj = Object.assign({ _lectureYears: lectureYears }, store);
    const jsonString = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neville_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAllJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        mergePublicDataToStore(imported, selectedLec.title);
        alert("✅ [" + file.name + "] 번역 노트 및 연도 분류가 성공적으로 병합되었습니다!");
      } catch (err) {
        alert("올바른 JSON 파일이 아닙니다.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
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
    if (sentences.length === 0) {
      alert("저장할 강독 노트가 없습니다.");
      return;
    }
    if (quizMode) setQuizMode(false);
    const originalTitle = document.title;
    const prefix = selectedLec.isBook
      ? "Book" + String(selectedLec.num).padStart(2, "0") + "_"
      : selectedLec.num ? String(selectedLec.num).padStart(3, "0") + "_" : "";
    document.title = prefix + selectedLec.title + "_강독노트";
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  };

  // 원문 읽어올 때 자동으로 연도를 추출하여 8기 그룹에 반영
  const handleFetchLectureBody = async (urlToFetch, titleToSet, isBookItem) => {
    const finalUrl = urlToFetch || targetUrl;
    const targetTitle = titleToSet || selectedLec.title;
    setFetching(true);
    setResumeChunkIdx(0);
    setStatusMsg("🌐 [" + targetTitle + "] 영어 원문 전체를 읽어오는 중...");
    try {
      const response = await fetch("https://r.jina.ai/" + finalUrl);
      if (!response.ok) throw new Error("사이트 접속 실패");
      const fullText = await response.text();

      let cleanBody = fullText;
      const startMarker = cleanBody.indexOf("Markdown Content:");
      if (startMarker !== -1) cleanBody = cleanBody.slice(startMarker + 17);

      const endMarkers = [
        "### Neville Goddard Lectures 1-50:",
        "#### About[Neville Goddard]",
        "## Primary Sidebar",
        "### **Appreciation Snippets**",
        "Copyright © The Neville Goddard"
      ];
      for (let m = 0; m < endMarkers.length; m++) {
        const idx = cleanBody.indexOf(endMarkers[m]);
        if (idx !== -1) cleanBody = cleanBody.slice(0, idx);
      }

      const lines = cleanBody.split("\n").filter(line => {
        const t = line.trim();
        if (!t) return false;
        if (
          t.indexOf("*   [") === 0 ||
          t.indexOf("[Got it!]") === 0 ||
          t.indexOf("This website uses cookies") === 0 ||
          t.indexOf("[Cookie Consent") === 0 ||
          t.indexOf("[Skip to content]") === 0
        ) return false;
        return true;
      });
      cleanBody = lines.join("\n\n");

      // 강의일 경우 본문 상단에서 연도 자동 추출 후 Era 자동 배정
      if (!isBookItem) {
        const detectedYear = extractLectureYear(cleanBody, targetTitle);
        if (detectedYear) {
          setLectureYears(prev => Object.assign({}, prev, { [targetTitle]: detectedYear }));
          const matchedEra = getEraForLecture({ title: targetTitle, year: detectedYear }, { [targetTitle]: detectedYear });
          setOpenEra(matchedEra);
          setStatusMsg("✅ 원문 추출 완료! (본문에서 [" + detectedYear + "년] 감지 ➔ 제" + matchedEra + "기로 자동 분류됨)");
        } else {
          setStatusMsg("✅ 원문 추출 완료! 오른쪽의 [⚡ 2. 강독 노트 생성]을 눌러주세요.");
        }
      } else {
        setStatusMsg("✅ 단행본 원문 추출 완료! [⚡ 2. 강독 노트 생성]을 눌러주세요.");
      }

      setRawText(cleanBody.trim());
    } catch (err) {
      alert("실시간 읽어오기 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setFetching(false);
    }
  };

  const callGeminiWithFallback = async (promptText, chunkIdx, totalChunks) => {
    const models = selectedTier === "pro"
      ? ["gemini-2.5-pro", "gemini-3.5-pro", "gemini-3.5-flash", "gemini-2.5-flash", "gemini-3.5-flash-lite"]
      : ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-pro"];

    const strictSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          en: { type: "STRING" },
          ko: { type: "STRING" },
          vocab: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: { word: { type: "STRING" }, mean: { type: "STRING" } },
              required: ["word", "mean"]
            }
          },
          grammar: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: { tag: { type: "STRING" }, desc: { type: "STRING" } },
              required: ["tag", "desc"]
            }
          }
        },
        required: ["en", "ko", "vocab", "grammar"]
      }
    };

    let lastErrorMsg = "";
    for (let attempt = 1; attempt <= 3; attempt++) {
      for (let m = 0; m < models.length; m++) {
        const modelName = models[m];
        try {
          setStatusMsg(
            "👑 [" + modelName + "] 정밀 분석 중... (" +
            (chunkIdx + 1) + "/" + totalChunks + " 구간" + (attempt > 1 ? ", 재시도 " + attempt : "") + ")"
          );

          const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey.trim(),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: strictSchema,
                  maxOutputTokens: 65536,
                  temperature: 0.2
                }
              })
            }
          );

          const data = await res.json();
          if (data.error) {
            lastErrorMsg = data.error.message || "알 수 없는 오류";
            const msg = lastErrorMsg.toLowerCase();
            if (msg.indexOf("api key not valid") !== -1 || msg.indexOf("api_key_invalid") !== -1) {
              throw new Error("입력하신 Gemini API Key가 올바르지 않습니다.");
            }
            await sleep(1000);
            continue;
          }

          const textOutput = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) || "[]";
          return safeParseJSON(textOutput);
        } catch (err) {
          lastErrorMsg = err.message;
          if (err.message.indexOf("API Key가 올바르지 않습니다") !== -1) throw err;
          await sleep(1000);
        }
      }
      await sleep(2500);
    }
    throw new Error(lastErrorMsg || "서버 응답 지연 중입니다. 다시 누르시면 이어서 진행됩니다.");
  };

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      alert("상단 노란색 칸에 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }
    if (!rawText.trim()) {
      alert("먼저 왼쪽에서 저서나 강의를 선택해 본문을 불러와 주세요.");
      return;
    }

    setAnalyzing(true);
    try {
      const paragraphs = rawText.split("\n\n");
      const chunks = [];
      let currentChunk = "";

      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        if ((currentChunk + "\n\n" + p).length > 1800 && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = p;
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + p;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());

      let allParsedSentences = resumeChunkIdx > 0 ? (store[selectedLec.title] || []) : [];
      if (resumeChunkIdx === 0) {
        setStore(prev => Object.assign({}, prev, { [selectedLec.title]: [] }));
      }

      for (let i = resumeChunkIdx; i < chunks.length; i++) {
        const prompt = [
          "당신은 네빌 고다드(Neville Goddard) 저서 및 강의 전문 번역가이자 영어 구문 강독 전문가입니다.",
          "아래 텍스트에서 웹사이트 메뉴나 링크를 제외하고 실제 네빌 고다드의 영어 본문 문장만 한 문장도 빠짐없이 순서대로 분리하여 JSON 배열로 반환하세요.",
          "규칙:",
          "1. 반복 기초 어휘는 제외하고 핵심 어휘/숙어만 vocab에 넣으세요.",
          "2. 기계적인 1~5형식 분류는 절대 쓰지 말고, 직관적인 독해/구문 구조와 성경적·신비주의적 맥락을 깊이 있게 grammar에 설명하세요.",
          "3. 설명 안에 큰따옴표(\") 대신 작은따옴표(')를 사용하여 JSON 문법 오류를 방지하세요.",
          "본문:",
          chunks[i]
        ].join("\n");

        const parsed = await callGeminiWithFallback(prompt, i, chunks.length);
        allParsedSentences = allParsedSentences.concat(parsed);
        setResumeChunkIdx(i + 1);

        setStore(prev => Object.assign({}, prev, { [selectedLec.title]: allParsedSentences }));
        if (i < chunks.length - 1) await sleep(1000);
      }

      setResumeChunkIdx(0);
      setStatusMsg("🎉 총 " + allParsedSentences.length + "개 문장 전체의 최고급 강독 노트가 완성되었습니다!");
    } catch (err) {
      alert("분석 중 일시 정지: " + err.message);
      setStatusMsg("⚠️ 완료된 구간까지 자동 저장되었습니다! [⚡ 2. 이어서 강독 생성]을 누르면 남은 부분부터 계속됩니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 사이드바: 14권 저서 + 연도별 8기 아코디언 메뉴 */}
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Neville Goddard Pro Studio</div>
        <h1 className="text-lg font-bold mb-3">네빌 고다드 14권 저서 & 연도별 8기</h1>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {/* 1. 네빌 고다드 14권 정규 저서 */}
          <div className="mb-3">
            <div className="text-[11px] text-emerald-400 font-bold mb-1">📖 정규 출간 단행본 (book1~14.json)</div>
            <div className="rounded-lg overflow-hidden border border-emerald-700/60">
              <button
                onClick={handleToggleBooksMenu}
                className={"w-full text-left px-3 py-3 text-xs font-bold transition flex justify-between items-center " + (openBooksMenu ? "bg-emerald-500 text-slate-950" : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200")}
              >
                <span>📖 네빌 고다드 14권 저서 (1939~1970)</span>
                <span>{openBooksMenu ? "▲ 접기" : "▼ 펼치기"}</span>
              </button>

              {openBooksMenu && (
                <div className="bg-slate-950 p-2 space-y-1 max-h-80 overflow-y-auto border-t border-emerald-800/50">
                  {BOOKS.map((b) => {
                    const isSelected = selectedLec.isBook && selectedLec.title === b.title;
                    const savedCount = (store[b.title] || []).length;
                    return (
                      <button
                        key={b.bookNum}
                        onClick={() => {
                          const bookItem = { isBook: true, num: b.bookNum, title: b.title, koTitle: b.koTitle, url: b.url };
                          setSelectedLec(bookItem);
                          setTargetUrl(b.url);
                          loadJsonFile("book" + b.bookNum + ".json", b.title);
                          handleFetchLectureBody(b.url, b.title, true);
                        }}
                        className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                      >
                        <div className="truncate pr-2">
                          <span>{lec.num}. </span>
                          <span className={"font-semibold mr-1 " + (knownY ? "text-amber-400" : "text-slate-500")}>
                            [{knownY || "?"}]
                          </span>
                          <span>{lec.title}</span>
                        </div>
                        {savedCount > 0 ? (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold shrink-0">
                            {savedCount}문장
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 shrink-0">book{b.bookNum}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. 294개 강의 연도별 8기 분류 (Era 1 ~ Era 8) */}
          <div className="text-[11px] text-amber-400 font-bold mb-1 pt-2 border-t border-slate-800 flex justify-between items-center">
            <span>📅 294개 강의 연도별 8기 분류 (era1~8.json)</span>
            {loadingLectures && <span className="text-[10px] text-amber-300 animate-pulse">목록 동기화중...</span>}
          </div>

          {ERAS.map(eObj => {
            const isOpen = openEra === eObj.era;
            const subList = allLectures.filter(l => getEraForLecture(l, lectureYears) === eObj.era);

            return (
              <div key={eObj.era} className="rounded-lg overflow-hidden border border-slate-800">
                <button
                  onClick={() => handleToggleEra(eObj)}
                  className={"w-full text-left px-3 py-2.5 text-xs font-bold transition flex justify-between items-center " + (isOpen ? "bg-amber-500 text-slate-900" : "bg-slate-800 hover:bg-slate-700 text-slate-200")}
                >
                  <div>
                    <div>📅 {eObj.title}</div>
                    <div className={"text-[10px] font-normal " + (isOpen ? "text-slate-800" : "text-slate-400")}>
                      {eObj.sub} ({subList.length}강)
                    </div>
                  </div>
                  <span className="shrink-0 ml-2">{isOpen ? "▲ 접기" : "▼ 펼치기"}</span>
                </button>

                {isOpen && (
                  <div className="bg-slate-950 p-2 space-y-1 max-h-80 overflow-y-auto border-t border-slate-800">
                    {loadingLectures && subList.length === 0 ? (
                      <div className="text-xs text-amber-400 p-3 text-center">
                        ⏳ 294개 전체 강의를 연도별로 배분하는 중...
                      </div>
                    ) : (
                      subList.map((lec, i) => {
                        const isSelected = !selectedLec.isBook && selectedLec.title === lec.title;
                        const savedCount = (store[lec.title] || []).length;
                        const knownY = lectureYears[lec.title] || lec.year;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedLec({ isBook: false, num: lec.num, title: lec.title, url: lec.url });
                              setTargetUrl(lec.url);
                              handleFetchLectureBody(lec.url, lec.title, false);
                            }}
                            className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                          >
                            <div className="truncate pr-2">
                              <span>{lec.num}. </span>
                              <span className={"font-semibold mr-1 " + (knownY ? "text-amber-400" : "text-slate-500")}>
                                [{knownY || "?"}]
                              </span>
                              <span>{lec.title}</span>
                            </div>
                            {savedCount > 0 ? (
                              <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-bold shrink-0">
                                {savedCount}문장
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 shrink-0">읽기</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main className="print-container flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="no-print bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900">👑 AI 엔진 우선순위:</span>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-amber-400 bg-white font-bold text-slate-900"
            >
              <option value="pro">Pro 최우선 (2.5 Pro / 3.5 Pro ➔ 3.5 Flash)</option>
              <option value="flash">Flash 최우선 (3.5 Flash / 2.5 Flash ➔ 3.5 Lite)</option>
            </select>
          </div>
          <div className="flex gap-2 flex-1 max-w-md">
            <input
              type="password"
              placeholder="Gemini API Key 입력 (자동 저장)"
              value={apiKey}
              onChange={e => saveApiKey(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-amber-300 bg-white"
            />
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 px-3 py-1.5 bg-amber-600 text-white rounded font-bold"
            >
              API 키 관리 ↗
            </a>
          </div>
        </div>

        <div className="no-print bg-white border rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-600">
              🌐 선택된 {selectedLec.isBook ? "단행본 저서" : "강의"}의 실제 웹페이지 주소(URL):
            </span>
            {!selectedLec.isBook && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold">📅 강의 연도 지정:</span>
                <select
                  value={lectureYears[selectedLec.title] || ""}
                  onChange={e => {
                    const y = parseInt(e.target.value, 10);
                    if (y) {
                      setLectureYears(prev => Object.assign({}, prev, { [selectedLec.title]: y }));
                      setOpenEra(getEraForLecture({ title: selectedLec.title, year: y }, { [selectedLec.title]: y }));
                    }
                  }}
                  className="px-2 py-1 border rounded bg-stone-50 font-bold text-amber-900"
                >
                  <option value="">연도 자동감지 대기</option>
                  {Array.from({ length: 25 }, (_, idx) => 1948 + idx).map(yr => (
                    <option key={yr} value={yr}>{yr}년</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={() => handleFetchLectureBody(targetUrl, selectedLec.title, selectedLec.isBook)}
              disabled={fetching}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
            >
              {fetching ? "⏳ 본문 읽는 중..." : "🌐 1. 사이트 실시간 읽어오기"}
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={e => {
              setRawText(e.target.value);
              setResumeChunkIdx(0);
            }}
            rows={5}
            placeholder="왼쪽에서 [14권 저서] 또는 [연도별 8기 강의] 중 원하는 항목을 클릭하면 영어 원문과 강연 연도가 자동으로 추출됩니다!"
            className="w-full p-3 border rounded-lg text-xs font-mono bg-stone-50 mb-2"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-blue-700">{statusMsg}</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                {analyzing
                  ? "⏳ 정밀 분석 중..."
                  : resumeChunkIdx > 0
                  ? "⚡ 2. 이어서 강독 생성 (" + (resumeChunkIdx + 1) + "구간부터)"
                  : "⚡ 2. 강독 노트 생성 (3.5/Pro 호환)"}
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                📄 3. PDF 다운로드
              </button>
            </div>
          </div>
        </div>

        {/* 제목 및 책별(book1~14.json) / 기수별(era1~8.json) 맞춤 백업 버튼 */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
          <div>
            {selectedLec.isBook ? (
              <div className="text-xs font-bold text-emerald-700 mb-1">
                📖 NEVILLE GODDARD BOOK #{String(selectedLec.num).padStart(2, "0")} {selectedLec.koTitle ? "— " + selectedLec.koTitle : ""}
              </div>
            ) : (
              <div className="text-xs font-bold text-amber-700 mb-1">
                📅 제{currentEraNum}기 강연 {lectureYears[selectedLec.title] ? "(" + lectureYears[selectedLec.title] + "년)" : ""}
              </div>
            )}
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
              {selectedLec.isBook
                ? "Book " + selectedLec.num + ". " + selectedLec.title
                : (selectedLec.num ? "#" + String(selectedLec.num).padStart(3, "0") + ". " : "") + selectedLec.title}
            </h2>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <button
              onClick={handleExportCurrentTargetJson}
              className={"px-3 py-2 rounded text-white text-xs font-bold shadow-sm " + (selectedLec.isBook ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700")}
            >
              {selectedLec.isBook
                ? "💾 이 책(book" + selectedLec.num + ".json) 백업"
                : "💾 제" + currentEraNum + "기(era" + currentEraNum + ".json) 백업"}
            </button>
            <button
              onClick={handleExportAllJson}
              className="px-3 py-2 rounded bg-stone-600 hover:bg-stone-700 text-white text-xs font-bold shadow-sm"
            >
              💾 전체 백업
            </button>
            <label className="px-3 py-2 rounded bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold cursor-pointer shadow-sm">
              📂 JSON 불러오기
              <input type="file" accept=".json" onChange={handleImportAllJson} className="hidden" />
            </label>
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
            >
              📄 PDF 다운로드
            </button>
            <button
              onClick={() => setQuizMode(!quizMode)}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기 연습"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {sentences.map((s, idx) => (
            <div key={idx} className="print-card bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center mb-2 border-b pb-2">
                <span style={{ fontFamily: "Georgia, serif", fontSize: "17pt", color: "#292929" }} className="font-bold">
                  Sentence {String(idx + 1).padStart(2, "0")}
                </span>
                <button
                  onClick={() => speak(s.en)}
                  className="no-print px-3 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold hover:bg-amber-200"
                >
                  🔊 발음 듣기
                </button>
              </div>

              <p style={{ fontFamily: "Georgia, serif", fontSize: "14pt", lineHeight: "1.55", color: "#292929" }} className="mb-3">
                {s.en}
              </p>

              <p
                style={{ fontFamily: "Georgia, serif", fontSize: "14pt", lineHeight: "1.55", color: "#292929" }}
                className={"p-3 bg-stone-50 border-l-4 border-stone-800 rounded mb-4 " + (quizMode ? "blur-sm hover:blur-none transition cursor-pointer" : "")}
              >
                {s.ko}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-dashed" style={{ fontSize: "14pt", lineHeight: "1.55", color: "#292929" }}>
                <div>
                  <div className="font-bold mb-1">[핵심 어휘 및 숙어]</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {(s.vocab || []).map((v, i) => (
                      <li key={i}><b>{v.word}</b> : {v.mean}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-bold mb-1">[구문 및 문법 해설]</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {(s.grammar || []).map((g, i) => (
                      <li key={i}><b>{g.tag}</b> — {g.desc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
