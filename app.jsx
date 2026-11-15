const { useState, useEffect, useMemo } = React;

// 1. 네빌 고다드 14권 정규 저서 (출간 연도순: 1939 ~ 1970, book1.json ~ book14.json 매칭)
const BOOKS = [
  { bookNum: 1, year: 1939, title: "At Your Command", koTitle: "당신의 명령대로", url: "https://www.neville-goddard.com/neville-goddard-books/neville-goddard-at-your-command-audio-book-mp3-and-pdf" },
  { bookNum: 2, year: 1941, title: "Your Faith Is Your Fortune", koTitle: "당신의 믿음이 당신의 행운이다", url: "" },
  { bookNum: 3, year: 1942, title: "Freedom For All", koTitle: "모두를 위한 자유", url: "" },
  { bookNum: 4, year: 1944, title: "Feeling Is The Secret", koTitle: "느낌이 비밀이다", url: "" },
  { bookNum: 5, year: 1945, title: "Prayer, The Art Of Believing", koTitle: "기도, 믿음의 기술", url: "" },
  { bookNum: 6, year: 1946, title: "The Search", koTitle: "탐구", url: "" },
  { bookNum: 7, year: 1949, title: "Out Of This World", koTitle: "이 세상의 것이 아닌", url: "" },
  { bookNum: 8, year: 1952, title: "The Power Of Awareness", koTitle: "자각의 힘", url: "" },
  { bookNum: 9, year: 1954, title: "Awakened Imagination", koTitle: "깨어난 상상력", url: "" },
  { bookNum: 10, year: 1956, title: "Seedtime And Harvest", koTitle: "씨 뿌릴 때와 거둘 때", url: "" },
  { bookNum: 11, year: 1961, title: "The Law And The Promise", koTitle: "법칙과 약속", url: "" },
  { bookNum: 12, year: 1965, title: "I Know My Father", koTitle: "나는 내 아버지를 안다", url: "" },
  { bookNum: 13, year: 1966, title: "Resurrection", koTitle: "부활, 신앙 고백", url: "" },
  { bookNum: 14, year: 1970, title: "He Breaks The Shell", koTitle: "그가 껍질을 깨뜨리다", url: "" }
];

// 2. 연도별 6기 분류 (기존 vol1.json ~ vol6.json 파일명과 1:1 매칭)
const VOLUMES = [
  { vol: 1, period: "1939~1953", title: "제1기 (1939 ~ 1953년) : 초기 법칙 정립기", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1" },
  { vol: 2, period: "1954~1958", title: "제2기 (1954 ~ 1958년) : 깨어난 상상력 심화기", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2" },
  { vol: 3, period: "1959~1963", title: "제3기 (1959 ~ 1963년) : 약속(The Promise) 전환기", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3" },
  { vol: 4, period: "1964~1966", title: "제4기 (1964 ~ 1966년) : 성경의 내적 드라마 해석기", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4" },
  { vol: 5, period: "1967~1968", title: "제5기 (1967 ~ 1968년) : 후기 원숙기 강연", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5" },
  { vol: 6, period: "1969~1972", title: "제6기 (1969 ~ 1972년) : 말년 최종 강연", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6" }
];

// 3. 이미 분석 완료된 30개 강의를 포함한 강연 연도 사전 (제1기~제6기 자동 배치)
const KNOWN_LECTURE_YEARS = {
  "At Your Command": 1939,
  "Changing The Feeling of I": 1953,
  "Awakened Imagination Barabbas or Jesus": 1954,
  "The Pruning Shears of Revision": 1954,
  "Arise": 1955,
  "Mental Diets": 1955,
  "Seedtime and Harvest": 1956,
  "Blake On Religion": 1958,
  "Awake o Sleeper 2": 1963,
  "All That is Divine": 1964,
  "Believe It In": 1966,
  "A Lesson in Scripture": 1967,
  "A Movement Within God": 1967,
  "A Parabolic Revelation": 1967,
  "All Powerful Human Word": 1967,
  "All Things are Possible 1": 1967,
  "An Inner Conviction": 1967,
  "Awake o Sleeper 1": 1967,
  "A Movement of Mind": 1968,
  "A Prophecy": 1968,
  "A Riddle": 1968,
  "A State Called Moses": 1968,
  "All That You Behold": 1968,
  "An Assured Understanding": 1968,
  "Bear Ye One Another's Burdens": 1968,
  "Believe In Him": 1968,
  "Biblical Language": 1968,
  "Brazen Impudence": 1968,
  "Catch The Mood": 1968,
  "Christ Bears Our Sins": 1968,
  "Christ in Man": 1969,
  "Christ in You": 1969,
  "Christ is Your Life": 1968,
  "Christ Unveiled": 1968,
  "Christmas - Man's Birth As God": 1968,
  "Come o Blessed": 1968,
  "Conception": 1967,
  "Consigned To Disobedience": 1967,
  "Control Your Inner Conversations": 1954,
  "Creation Faith": 1968,
  "Divine Signs": 1968,
  "Election And Change Of Consciousness": 1967,
  "Enter The Dream": 1968,
  "Esau And Jacob": 1967,
  "A Divine Event": 1969,
  "All Things are Possible 2": 1969,
  "All Things Exist": 1969,
  "Be Imitators of God": 1969,
  "Before Abraham was I AM": 1969,
  "Behold The Dreamer Cometh": 1969
};

// 연도에 따른 기수(1~6기) 판별 함수
const getTargetVolByYear = (year, fallbackVol) => {
  if (!year) return fallbackVol || 1;
  if (year <= 1953) return 1;
  if (year <= 1958) return 2;
  if (year <= 1963) return 3;
  if (year <= 1966) return 4;
  if (year <= 1968) return 5;
  return 6;
};

// 본문 텍스트에서 강연 연도를 자동 추정하는 함수
const detectYearFromText = (title, rawBody) => {
  if (KNOWN_LECTURE_YEARS[title]) return KNOWN_LECTURE_YEARS[title];
  if (!rawBody) return null;
  const headerArea = rawBody.slice(0, 600);
  const dateMatch = headerArea.match(/\b(19[3-7]\d)\b/);
  if (dateMatch) return parseInt(dateMatch[1], 10);
  if (rawBody.indexOf("1969") !== -1) return 1969;
  if (rawBody.indexOf("1968") !== -1) return 1968;
  if (rawBody.indexOf("1967") !== -1) return 1967;
  if (rawBody.indexOf("birth from above") !== -1 || rawBody.indexOf("serpentine form") !== -1) return 1968;
  return null;
};

// 초기 기본 메뉴 (크롤링 전에도 30개 완료 강의가 제자리에 즉시 표시되도록 구성)
const INITIAL_VOL_MENUS = {
  1: [
    { num: 18, year: 1939, title: "At Your Command", url: "https://www.neville-goddard.com/neville-goddard-books/neville-goddard-at-your-command-audio-book-mp3-and-pdf" }
  ],
  2: [
    { num: 21, year: 1954, title: "Awakened Imagination Barabbas or Jesus", url: "https://www.neville-goddard.com/neville-goddard-lectures/barabbas-or-jesus-neville-goddard-lecture/" },
    { num: 17, year: 1955, title: "Arise", url: "https://www.neville-goddard.com/neville-goddard-lectures/arise-neville-goddard-lecture/" },
    { num: 29, year: 1958, title: "Blake On Religion", url: "https://www.neville-goddard.com/neville-goddard-lectures/blake-on-religion-neville-goddard-lecture/" }
  ],
  3: [
    { num: 20, year: 1963, title: "Awake o Sleeper 2", url: "https://www.neville-goddard.com/neville-goddard-lectures/awake-o-sleeper-2-neville-goddard-lecture/" }
  ],
  4: [
    { num: 10, year: 1964, title: "All That is Divine", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-that-is-divine-neville-goddard-lecture/" },
    { num: 27, year: 1966, title: "Believe It In", url: "https://www.neville-goddard.com/neville-goddard-lectures/believe-it-in-neville-goddard-lecture/" }
  ],
  5: [
    { num: 2, year: 1967, title: "A Lesson in Scripture", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-lesson-in-scripture-neville-goddard-lecture/" },
    { num: 4, year: 1967, title: "A Movement Within God", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-movement-within-god-neville-goddard-lecture/" },
    { num: 5, year: 1967, title: "A Parabolic Revelation", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-parabolic-revelation-neville-goddard-lectures/" },
    { num: 9, year: 1967, title: "All Powerful Human Word", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-powerfull-human-words-neville-goddard-lecture/" },
    { num: 12, year: 1967, title: "All Things are Possible 1", url: "https://www.neville-goddard.com/neville-goddard-lectures/att-things-are-possible-1-neville-goddard-lecture/" },
    { num: 16, year: 1967, title: "An Inner Conviction", url: "https://www.neville-goddard.com/neville-goddard-lectures/an-inner-conviction-neville-goddard-lecture/" },
    { num: 19, year: 1967, title: "Awake o Sleeper 1", url: "https://www.neville-goddard.com/neville-goddard-lectures/awake-o-sleeper-1-neville-goddard-lecture/" },
    { num: 3, year: 1968, title: "A Movement of Mind", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-movement-of-mind-neville-goddard-lecture/" },
    { num: 6, year: 1968, title: "A Prophecy", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-prophecy-neville-goddard-lecture/" },
    { num: 7, year: 1968, title: "A Riddle", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-riddle-neville-goddard-lecture/" },
    { num: 8, year: 1968, title: "A State Called Moses", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-state-called-moses-neville-goddard-lecture/" },
    { num: 11, year: 1968, title: "All That You Behold", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-that-you-behold-neville-goddard-lecture/" },
    { num: 15, year: 1968, title: "An Assured Understanding", url: "https://www.neville-goddard.com/neville-goddard-lectures/an-assured-understanding-neville-goddard-lecture/" },
    { num: 23, year: 1968, title: "Bear Ye One Another's Burdens", url: "https://www.neville-goddard.com/neville-goddard-lectures/bear-ye-one-anothers-burdens-neville-goddard-lecture/" },
    { num: 26, year: 1968, title: "Believe In Him", url: "https://www.neville-goddard.com/neville-goddard-lectures/believe-in-him-neville-goddard-lecture/" },
    { num: 28, year: 1968, title: "Biblical Language", url: "https://www.neville-goddard.com/neville-goddard-lectures/biblical-language-neville-goddard-lecture/" },
    { num: 30, year: 1968, title: "Brazen Impudence", url: "https://www.neville-goddard.com/neville-goddard-lectures/brazen-impudence-neville-goddard-lecture/" }
  ],
  6: [
    { num: 1, year: 1969, title: "A Divine Event", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-divine-event-neville-goddard-lecture/" },
    { num: 13, year: 1969, title: "All Things are Possible 2", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-things-are-possible-2-neville-goddard-lecture/" },
    { num: 14, year: 1969, title: "All Things Exist", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-things-exist-neville-goddard-lecture/" },
    { num: 22, year: 1969, title: "Be Imitators of God", url: "https://www.neville-goddard.com/neville-goddard-lectures/be-imitators-of-god-neville-goddard-lecture/" },
    { num: 24, year: 1969, title: "Before Abraham was I AM", url: "https://www.neville-goddard.com/neville-goddard-lectures/before-abraham-was-i-am-neville-goddard-lecture/" },
    { num: 25, year: 1969, title: "Behold The Dreamer Cometh", url: "https://www.neville-goddard.com/neville-goddard-lectures/behold-the-dreamer-cometh-neville-goddard-lecture/" }
  ]
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const safeParseJSON = (rawStr) => {
  if (!rawStr) return [];
  let text = rawStr.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
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
  const [openBooksMenu, setOpenBooksMenu] = useState(true);
  const [openVol, setOpenVol] = useState(5); // 17개 강의가 밀집된 제5기를 기본 펼침
  const [loadingVol, setLoadingVol] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState({});
  const [selectedTier, setSelectedTier] = useState("pro");

  // 새 캐시 키(v2_chronological)를 사용하여 기존 알파벳순 메뉴 캐시와 충돌 방지
  const [volLectures, setVolLectures] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_vol_menus_v2_chrono");
      return saved ? JSON.parse(saved) : INITIAL_VOL_MENUS;
    } catch (e) {
      return INITIAL_VOL_MENUS;
    }
  });

  const [selectedLec, setSelectedLec] = useState({
    isBook: false,
    num: 2,
    year: 1967,
    vol: 5,
    title: "A Lesson in Scripture",
    url: "https://www.neville-goddard.com/neville-goddard-lectures/a-lesson-in-scripture-neville-goddard-lecture/"
  });
  const [targetUrl, setTargetUrl] = useState("https://www.neville-goddard.com/neville-goddard-lectures/a-lesson-in-scripture-neville-goddard-lecture/");
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
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
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

  // 최초 실행 시 vol1.json ~ vol6.json 및 book1~14.json을 모두 로드하여 어느 기수에 있든 즉시 표시
  useEffect(() => {
    [1, 2, 3, 4, 5, 6].forEach(v => loadJsonFile("vol" + v + ".json", null));
    loadJsonFile("neville_data.json", null);
    BOOKS.forEach(b => loadJsonFile("book" + b.bookNum + ".json", b.title));
  }, []);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_menus_v2_chrono", JSON.stringify(volLectures)); } catch (e) {}
  }, [volLectures]);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_accordion_store", JSON.stringify(store)); } catch (e) {}
  }, [store]);

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  // 현재 선택된 강의가 속한 기수(1~6기) 번호 계산
  const currentVolNum = selectedLec.vol || getTargetVolByYear(selectedLec.year, openVol || 1);

  // 특정 기수(vol1.json ~ vol6.json)의 강의 데이터만 추출하여 백업 다운로드
  const handleExportVolJson = () => {
    const targetVol = currentVolNum;
    const subList = volLectures[targetVol] || [];
    const exportObj = {};

    // 1) 해당 기수 메뉴에 속한 강의 수집
    subList.forEach(lec => {
      if (store[lec.title] && store[lec.title].length > 0) {
        exportObj[lec.title] = store[lec.title];
      }
    });

    // 2) KNOWN_LECTURE_YEARS 기준으로도 해당 기수에 속하는 강의 보충
    Object.keys(store).forEach(title => {
      const y = KNOWN_LECTURE_YEARS[title];
      if (y && getTargetVolByYear(y, null) === targetVol && store[title] && store[title].length > 0) {
        exportObj[title] = store[title];
      }
    });

    const fileName = "vol" + targetVol + ".json";
    const jsonString = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 전체 통합 백업
  const handleExportAllJson = () => {
    const jsonString = JSON.stringify(store, null, 2);
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
        mergePublicDataToStore(imported, null);
        alert("✅ [" + file.name + "] 강독 노트가 성공적으로 복원·병합되었습니다!");
      } catch (err) {
        alert("올바른 JSON 파일이 아닙니다.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // 단일 인덱스 페이지에서 강의 링크들을 추출하여 연도별 기수(1~6기)로 분배하는 함수
  const fetchAndDistributeIndexPage = async (volObj) => {
    const res = await fetch("https://r.jina.ai/" + volObj.indexUrl);
    const text = await res.text();
    const lines = text.split("\n");
    const seen = {};
    let startNum = (volObj.vol - 1) * 50 + 1;
    const distributed = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const openBracket = line.indexOf("[");
      const closeBracket = line.indexOf("](http");
      if (openBracket !== -1 && closeBracket !== -1) {
        const title = line.slice(openBracket + 1, closeBracket).trim();
        const rest = line.slice(closeBracket + 2);
        let rawUrl = rest.split(" ")[0].split(")")[0].split('"')[0];
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
          const knownYear = KNOWN_LECTURE_YEARS[title] || null;
          const targetVol = getTargetVolByYear(knownYear, volObj.vol);
          distributed[targetVol].push({
            num: startNum++,
            year: knownYear,
            vol: targetVol,
            title: title,
            url: url
          });
        }
      }
    }
    return distributed;
  };

  const mergeDistributedMenus = (distributed) => {
    setVolLectures(prev => {
      const next = Object.assign({}, prev);
      [1, 2, 3, 4, 5, 6].forEach(vKey => {
        const existing = next[vKey] ? [...next[vKey]] : [];
        (distributed[vKey] || []).forEach(item => {
          const idx = existing.findIndex(e => e.title === item.title);
          if (idx === -1) {
            existing.push(item);
          } else {
            existing[idx] = Object.assign({}, existing[idx], item, {
              year: item.year || existing[idx].year
            });
          }
        });
        existing.sort((a, b) => (a.year || 9999) - (b.year || 9999) || a.title.localeCompare(b.title));
        next[vKey] = existing;
      });
      return next;
    });
  };

  // 294개 전체 강의 목차 일괄 동기화
  const handleSyncAll294Lectures = async () => {
    setSyncingAll(true);
    setStatusMsg("⏳ 1~6권 전체 294개 강의 목록을 읽어와 제1기~제6기로 분류하는 중...");
    try {
      for (let i = 0; i < VOLUMES.length; i++) {
        const dist = await fetchAndDistributeIndexPage(VOLUMES[i]);
        mergeDistributedMenus(dist);
      }
      setStatusMsg("✅ 294개 전체 강의 목차 동기화 및 연도별 분류 완료!");
    } catch (e) {
      alert("목차 동기화 중 오류: " + e.message);
    } finally {
      setSyncingAll(false);
    }
  };

  const handleToggleVolume = async (volObj) => {
    if (openVol === volObj.vol) {
      setOpenVol(null);
      return;
    }
    setOpenVol(volObj.vol);
    loadJsonFile("vol" + volObj.vol + ".json", null);

    setLoadingVol(true);
    try {
      const dist = await fetchAndDistributeIndexPage(volObj);
      mergeDistributedMenus(dist);
    } catch (e) {
    } finally {
      setLoadingVol(false);
    }
  };

  const handleFetchLectureBody = async (urlToFetch, titleToSet) => {
    const finalUrl = urlToFetch || targetUrl;
    if (!finalUrl) return;
    setFetching(true);
    setResumeChunkIdx(0);
    const currentTitle = titleToSet || selectedLec.title;
    setStatusMsg("🌐 [" + currentTitle + "] 강의의 영어 본문 전체를 읽어오는 중...");
    try {
      const response = await fetch("https://r.jina.ai/" + finalUrl);
      if (!response.ok) throw new Error("사이트 접속 실패");
      const fullText = await response.text();

      let cleanBody = fullText;
      const startMarker = cleanBody.indexOf("Markdown Content:");
      if (startMarker !== -1) cleanBody = cleanBody.slice(startMarker + 17);

      const endMarkers = ["### Neville Goddard Lectures 1-50:", "#### About[Neville Goddard]", "## Primary Sidebar", "### **Appreciation Snippets**"];
      for (let m = 0; m < endMarkers.length; m++) {
        const idx = cleanBody.indexOf(endMarkers[m]);
        if (idx !== -1) cleanBody = cleanBody.slice(0, idx);
      }

      const lines = cleanBody.split("\n").filter(line => {
        const t = line.trim();
        if (!t) return false;
        if (t.indexOf("*   [") === 0 || t.indexOf("[Got it!]") === 0 || t.indexOf("This website uses cookies") === 0 || t.indexOf("[Cookie Consent") === 0) return false;
        return true;
      });
      cleanBody = lines.join("\n\n").trim();
      setRawText(cleanBody);

      // 본문에서 강연 연도를 자동 추출하여 제1기~제6기 소속 자동 업데이트
      const detectedYear = detectYearFromText(currentTitle, cleanBody);
      if (detectedYear) {
        const targetVol = getTargetVolByYear(detectedYear, selectedLec.vol || 1);
        setSelectedLec(prev => Object.assign({}, prev, { year: detectedYear, vol: targetVol }));
        setStatusMsg("✅ 원문 추출 완료! (강연 연도: " + detectedYear + "년 ➔ 제" + targetVol + "기 자동 배정)");
      } else {
        setStatusMsg("✅ 원문 추출 완료! 오른쪽의 [⚡ 2. 강독 노트 생성]을 눌러주세요.");
      }
    } catch (err) {
      alert("실시간 읽어오기 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setFetching(false);
    }
  };

  const callGeminiWithFallback = async (promptText, chunkIdx, totalChunks) => {
    const models = selectedTier === "pro"
      ? ["gemini-2.5-pro", "gemini-3.5-pro", "gemini-3.5-flash", "gemini-2.5-flash"]
      : ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"];

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
          setStatusMsg("👑 [" + modelName + "] 정밀 분석 중... (" + (chunkIdx + 1) + "/" + totalChunks + " 구간)");
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
            lastErrorMsg = data.error.message || "오류";
            await sleep(1000);
            continue;
          }
          const textOutput = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) || "[]";
          return safeParseJSON(textOutput);
        } catch (err) {
          lastErrorMsg = err.message;
          await sleep(1000);
        }
      }
      await sleep(2000);
    }
    throw new Error(lastErrorMsg || "서버 응답 지연");
  };

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      alert("상단 노란색 칸에 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }
    if (!rawText.trim()) {
      alert("먼저 왼쪽에서 강의를 선택해 본문을 불러와 주세요.");
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
          "당신은 네빌 고다드(Neville Goddard) 강의 전문 번역가이자 영어 구문 강독 전문가입니다.",
          "아래 텍스트에서 웹사이트 메뉴나 링크를 제외하고 실제 네빌 고다드의 영어 강의 본문 문장만 한 문장도 빠짐없이 순서대로 분리하여 JSON 배열로 반환하세요.",
          "규칙:",
          "1. 반복 기초 어휘는 제외하고 핵심 어휘/숙어만 vocab에 넣으세요.",
          "2. 기계적인 1~5형식 분류는 절대 쓰지 말고, 직관적인 독해/구문 구조와 성경적·신비주의적 맥락을 깊이 있게 grammar에 설명하세요.",
          "3. 설명 안에 큰따옴표(\") 대신 작은따옴표(')를 사용하여 JSON 문법 오류를 방지하세요.",
          "강의 본문:",
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
      setStatusMsg("⚠️ 완료된 구간까지 자동 저장되었습니다! [이어서 강독 생성]을 누르면 계속됩니다.");
    } finally {
      setAnalyzing(false);
    }
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
    const yearPrefix = selectedLec.year ? "[" + selectedLec.year + "]_" : "";
    document.title = yearPrefix + selectedLec.title + "_강독노트";
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Chronological Pro Studio</div>
        <h1 className="text-lg font-bold mb-1">네빌 고다드 연대기 스튜디오</h1>
        <div className="text-xs text-slate-400 mb-3">1939년 초기 법칙부터 1972년 말년 약속까지 연도별(1기~6기)로 관리합니다.</div>

        <button
          onClick={handleSyncAll294Lectures}
          disabled={syncingAll}
          className="w-full mb-3 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
        >
          {syncingAll ? "⏳ 294개 전체 강의 동기화 중..." : "🔄 294개 전체 강의 목차 불러오기"}
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {/* 1. 14권 정규 저서 (출간 연도순) */}
          <div className="mb-3">
            <div className="text-[11px] text-emerald-400 font-bold mb-1">📖 정규 출간 단행본 (1939 ~ 1970)</div>
            <div className="rounded-lg overflow-hidden border border-emerald-700/60">
              <button
                onClick={() => setOpenBooksMenu(!openBooksMenu)}
                className={"w-full text-left px-3 py-2.5 text-xs font-bold transition flex justify-between items-center " + (openBooksMenu ? "bg-emerald-500 text-slate-950" : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200")}
              >
                <span>📖 14권 정규 저서 (연도순)</span>
                <span>{openBooksMenu ? "▲" : "▼"}</span>
              </button>

              {openBooksMenu && (
                <div className="bg-slate-950 p-2 space-y-1 max-h-64 overflow-y-auto border-t border-emerald-800/50">
                  {BOOKS.map((b) => {
                    const isSelected = selectedLec.isBook && selectedLec.title === b.title;
                    const savedCount = (store[b.title] || []).length;
                    return (
                      <button
                        key={b.bookNum}
                        onClick={() => {
                          const targetV = getTargetVolByYear(b.year, 1);
                          setSelectedLec({ isBook: true, num: b.bookNum, year: b.year, vol: targetV, title: b.title, koTitle: b.koTitle, url: b.url });
                          if (b.url) setTargetUrl(b.url);
                          loadJsonFile("book" + b.bookNum + ".json", b.title);
                        }}
                        className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" : savedCount > 0 ? "text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-900")}
                      >
                        <div className="truncate pr-2">
                          <div><span className="text-emerald-400 font-bold">[{b.year}]</span> {b.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">{b.bookNum}권 · {b.koTitle}</div>
                        </div>
                        {savedCount > 0 ? (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold shrink-0">{savedCount}문장</span>
                        ) : (
                          <span className="text-[10px] text-slate-600 shrink-0">준비중</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. 연도별 6기 강의록 (vol1.json ~ vol6.json) */}
          <div className="text-[11px] text-amber-400 font-bold mb-1 pt-2 border-t border-slate-800">
            📅 연도별 강의록 (제1기 ~ 제6기)
          </div>
          {VOLUMES.map(v => {
            const isOpen = openVol === v.vol;
            const subList = volLectures[v.vol] || [];
            const completedInVol = subList.filter(l => (store[l.title] || []).length > 0).length;

            return (
              <div key={v.vol} className="rounded-lg overflow-hidden border border-slate-800">
                <button
                  onClick={() => handleToggleVolume(v)}
                  className={"w-full text-left px-3 py-3 text-xs font-bold transition flex justify-between items-center " + (isOpen ? "bg-amber-500 text-slate-900" : "bg-slate-800 hover:bg-slate-700 text-slate-200")}
                >
                  <span className="truncate pr-1">📅 {v.title}</span>
                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-black/20">
                    {completedInVol > 0 ? completedInVol + "개 완료" : (isOpen ? "▲" : "▼")}
                  </span>
                </button>

                {isOpen && (
                  <div className="bg-slate-950 p-2 space-y-1 max-h-80 overflow-y-auto border-t border-slate-800">
                    {loadingVol && subList.length === 0 ? (
                      <div className="text-xs text-amber-400 p-3 text-center">⏳ 강의 목록 가져오는 중...</div>
                    ) : (
                      subList.map((lec, i) => {
                        const isSelected = !selectedLec.isBook && selectedLec.title === lec.title;
                        const savedCount = (store[lec.title] || []).length;
                        const lecYear = lec.year || KNOWN_LECTURE_YEARS[lec.title];
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedLec({ isBook: false, num: lec.num, year: lecYear, vol: v.vol, title: lec.title, url: lec.url });
                              setTargetUrl(lec.url || "");
                              loadJsonFile("vol" + v.vol + ".json", null);
                              if (lec.url) handleFetchLectureBody(lec.url, lec.title);
                            }}
                            className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : savedCount > 0 ? "text-slate-200 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-900")}
                          >
                            <span className="truncate pr-2">
                              {lecYear ? <b className="text-amber-400">[{lecYear}] </b> : ""}{lec.title}
                            </span>
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
              <option value="flash">Flash 최우선 (3.5 Flash / 2.5 Flash)</option>
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
          <div className="text-xs font-bold text-slate-600 mb-2">
            🌐 선택된 강의의 실제 웹페이지 주소(URL):
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={() => handleFetchLectureBody(targetUrl, selectedLec.title)}
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
            rows={4}
            placeholder="왼쪽에서 제1기~제6기 강의를 클릭하면 영어 원문이 자동으로 채워지며, 강연 연도도 자동 인식합니다!"
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
                  : "⚡ 2. 강독 노트 생성"}
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

        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
          <div>
            <div className="text-xs font-bold text-amber-700 mb-1">
              {"📅 제" + currentVolNum + "기 (" + VOLUMES[currentVolNum - 1].period + "년)" + (selectedLec.year ? " · 강연/출간 연도: " + selectedLec.year + "년" : "")}
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
              {selectedLec.year ? "[" + selectedLec.year + "] " : ""}{selectedLec.title}
            </h2>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <button
              onClick={handleExportVolJson}
              className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
              title="현재 기수(제1기~제6기)의 강의만 vol1.json ~ vol6.json 이름으로 저장합니다"
            >
              {"💾 제" + currentVolNum + "기(vol" + currentVolNum + ".json) 백업"}
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
