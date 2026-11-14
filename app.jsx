const { useState, useEffect, useMemo } = React;

// 14권 정규 출간 저서 목록
const BOOKS = [
  { bookNum: 1, year: 1939, title: "At Your Command", koTitle: "당신의 명령대로", url: "https://www.neville-goddard.com/neville-goddard-books/neville-goddard-at-your-command-audio-book-mp3-and-pdf" },
  { bookNum: 2, year: 1941, title: "Your Faith Is Your Fortune", koTitle: "당신의 믿음이 당신의 행운이다", url: "https://www.neville-goddard.com/neville-goddard-books/your-faith-is-your-fortune-neville-goddard-book/" },
  { bookNum: 3, year: 1942, title: "Freedom For All", koTitle: "모두를 위한 자유", url: "https://www.neville-goddard.com/neville-goddard-books/freedom-for-all-neville-goddard-book/" },
  { bookNum: 4, year: 1944, title: "Feeling Is The Secret", koTitle: "느낌이 비밀이다", url: "https://www.neville-goddard.com/neville-goddard-books/feeling-is-the-secret-neville-goddard-book/" },
  { bookNum: 5, year: 1945, title: "Prayer, The Art Of Believing", koTitle: "기도, 믿음의 기술", url: "https://www.neville-goddard.com/neville-goddard-books/prayer-the-art-of-believing-neville-goddard-book/" },
  { bookNum: 6, year: 1946, title: "The Search", koTitle: "탐구", url: "https://www.neville-goddard.com/neville-goddard-books/the-search-neville-goddard-book/" },
  { bookNum: 7, year: 1949, title: "Out Of This World", koTitle: "이 세상의 것이 아닌", url: "https://www.neville-goddard.com/neville-goddard-books/out-of-this-world-neville-goddard-book/" },
  { bookNum: 8, year: 1952, title: "The Power Of Awareness", koTitle: "자각의 힘", url: "https://www.neville-goddard.com/neville-goddard-books/the-power-of-awareness-neville-goddard-book/" },
  { bookNum: 9, year: 1954, title: "Awakened Imagination", koTitle: "깨어난 상상력", url: "https://www.neville-goddard.com/neville-goddard-books/awakened-imagination-neville-goddard-book/" },
  { bookNum: 10, year: 1956, title: "Seedtime And Harvest", koTitle: "씨 뿌릴 때와 거둘 때", url: "https://www.neville-goddard.com/neville-goddard-books/seedtime-and-harvest-neville-goddard-book/" },
  { bookNum: 11, year: 1961, title: "The Law And The Promise", koTitle: "법칙과 약속", url: "https://www.neville-goddard.com/neville-goddard-books/the-law-and-the-promise-neville-goddard-book/" },
  { bookNum: 12, year: 1965, title: "I Know My Father", koTitle: "나는 내 아버지를 안다", url: "https://www.neville-goddard.com/neville-goddard-books/i-know-my-father-neville-goddard-book/" },
  { bookNum: 13, year: 1966, title: "Resurrection", koTitle: "부활, 신앙 고백", url: "https://www.neville-goddard.com/neville-goddard-books/resurrection-neville-goddard-book/" },
  { bookNum: 14, year: 1970, title: "He Breaks The Shell", koTitle: "그가 껍질을 깨뜨리다", url: "https://www.neville-goddard.com/neville-goddard-books/he-breaks-the-shell-neville-goddard-book/" }
];

// 6개 권(Volume 1 ~ 6 : 총 294개 강의)
const VOLUMES = [
  { vol: 1, title: "제1권 (001 ~ 050번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1" },
  { vol: 2, title: "제2권 (051 ~ 100번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2" },
  { vol: 3, title: "제3권 (101 ~ 150번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3" },
  { vol: 4, title: "제4권 (151 ~ 200번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4" },
  { vol: 5, title: "제5권 (201 ~ 250번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5" },
  { vol: 6, title: "제6권 (251 ~ 294번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6" }
];

// 성경 66권 정렬 순서 매핑 (창세기 1 ~ 요한계시록 66)
const BIBLE_BOOK_ORDER = {
  "genesis": 1, "exodus": 2, "leviticus": 3, "numbers": 4, "deuteronomy": 5,
  "joshua": 6, "judges": 7, "ruth": 8, "1 samuel": 9, "2 samuel": 10,
  "1 kings": 11, "2 kings": 12, "1 chronicles": 13, "2 chronicles": 14, "ezra": 15,
  "nehemiah": 16, "esther": 17, "job": 18, "psalms": 19, "psalm": 19, "proverbs": 20,
  "ecclesiastes": 21, "song of solomon": 22, "isaiah": 23, "jeremiah": 24, "lamentations": 25,
  "ezekiel": 26, "daniel": 27, "hosea": 28, "joel": 29, "amos": 30,
  "obadiah": 31, "jonah": 32, "micah": 33, "nahum": 34, "habakkuk": 35,
  "zephaniah": 36, "haggai": 37, "zechariah": 38, "malachi": 39,
  "matthew": 40, "mark": 41, "luke": 42, "john": 43, "acts": 44,
  "romans": 45, "1 corinthians": 46, "2 corinthians": 47, "galatians": 48, "ephesians": 49,
  "philippians": 50, "colossians": 51, "1 thessalonians": 52, "2 thessalonians": 53,
  "1 timothy": 54, "2 timothy": 55, "titus": 56, "philemon": 57, "hebrews": 58,
  "james": 59, "1 peter": 60, "2 peter": 61, "1 john": 62, "2 john": 63,
  "3 john": 64, "jude": 65, "revelation": 66
};

// 초기 샘플 성경 인용 데이터
const INITIAL_BIBLE_SAMPLE = [
  {
    id: "sample_1",
    sourceTitle: "A Divine Event",
    sentenceNo: 5,
    bookNameEn: "1 Corinthians",
    bookNameKo: "고린도전서",
    chapter: 12,
    verse: 3,
    ref: "1 Corinthians 12:3",
    refKo: "고린도전서 12:3",
    en: "Paul tells us in his letter to the Corinthians that “No one can say ‘Jesus is Lord’ except by the Holy Spirit.”",
    ko: "바울은 고린도인들에게 보낸 서신에서 “성령으로 아니하고는 누구도 ‘예수는 주님이시다’라고 말할 수 없다”라고 우리에게 말합니다.",
    quoteInText: "No one can say ‘Jesus is Lord’ except by the Holy Spirit.",
    kjv: "Wherefore I give you to understand, that no man speaking by the Spirit of God calleth Jesus accursed: and that no man can say that Jesus is the Lord, but by the Holy Ghost.",
    krv: "그러므로 내가 너희에게 알리노니 하나님의 영으로 말하는 자는 누구든지 예수를 저주할 자라 하지 아니하고 또 성령으로 아니하고는 누구든지 예수를 주시라 할 수 없느니라",
    nevilleContext: "네빌은 '예수(주님)'를 외부의 역사적 인물이 아니라 각 사람의 내면에 있는 'I AM(자각/현존 의식)'으로 해석하며, '성령'은 이 신비적 사건을 직접 겪는 영적 체험을 의미합니다."
  }
];

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
    ],
    bible: []
  }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 영문 장절(예: "1 Corinthians 12:3") 파싱 도우미
const parseBibleRef = (refStr) => {
  if (!refStr) return { bookEn: "John", chapter: 1, verse: 1, order: 99 };
  const cleaned = refStr.trim();
  const lastSpace = cleaned.lastIndexOf(" ");
  if (lastSpace === -1) return { bookEn: cleaned, chapter: 1, verse: 1, order: 99 };
  const bookEn = cleaned.slice(0, lastSpace).trim();
  const chapVerse = cleaned.slice(lastSpace + 1).split(":");
  const chapter = parseInt(chapVerse[0], 10) || 1;
  const verse = parseInt(chapVerse[1], 10) || 1;
  const order = BIBLE_BOOK_ORDER[bookEn.toLowerCase()] || 99;
  return { bookEn: bookEn, chapter: chapter, verse: verse, order: order };
};

// 안전한 JSON 복구 파서 (정규표현식 미사용)
const safeParseJSON = (rawStr) => {
  if (!rawStr) return [];
  let text = rawStr.trim();
  if (text.indexOf("```") !== -1) {
    text = text.split("```json").join("").split("```JSON").join("").split("```").join("").trim();
  }
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
  // 상단 메인 탭: 'study' (강독 스튜디오) | 'bible_menu' (네빌성경구문 독립 메뉴)
  const [activeMenu, setActiveMenu] = useState("study");

  const [openBooksMenu, setOpenBooksMenu] = useState(false);
  const [openVol, setOpenVol] = useState(1);
  const [loadingVol, setLoadingVol] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState({});

  const [volLectures, setVolLectures] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_vol_menus");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
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
  const [scanningBible, setScanningBible] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [quizMode, setQuizMode] = useState(false);
  const [resumeChunkIdx, setResumeChunkIdx] = useState(0);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");

  // 강의/저서 강독 데이터 저장소
  const [store, setStore] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_vol_accordion_store");
      return saved ? JSON.parse(saved) : { "A Divine Event": INITIAL_LECTURE };
    } catch (e) {
      return { "A Divine Event": INITIAL_LECTURE };
    }
  });

  // 별도 bible.json 전용 저장소
  const [bibleList, setBibleList] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_bible_json_store");
      return saved ? JSON.parse(saved) : INITIAL_BIBLE_SAMPLE;
    } catch (e) {
      return INITIAL_BIBLE_SAMPLE;
    }
  });

  // [네빌성경구문] 메뉴에서 현재 선택된 문장 인덱스 & 앞절/다음절 이동 상태
  const [selectedBibleIdx, setSelectedBibleIdx] = useState(0);
  const [viewChapter, setViewChapter] = useState(12);
  const [viewVerse, setViewVerse] = useState(3);
  const [liveVerseData, setLiveVerseData] = useState({ kjv: "", loading: false });

  // 데이터 병합 도우미 (문장 수나 bible 정보가 더 풍부한 쪽을 유지)
  const mergeDataToStore = (publicData, fallbackTitle) => {
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

  // 외부 JSON 파일(vol1~6.json, book1~14.json, bible.json) 로드
  const loadJsonFile = async (fileName, fallbackTitle) => {
    if (loadedFiles[fileName]) return;
    try {
      const res = await fetch("./" + fileName + "?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (fileName === "bible.json" && Array.isArray(data)) {
          setBibleList(prev => (data.length >= prev.length ? data : prev));
        } else {
          mergeDataToStore(data, fallbackTitle);
        }
        setLoadedFiles(prev => Object.assign({}, prev, { [fileName]: true }));
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadJsonFile("vol1.json", null);
    loadJsonFile("neville_data.json", null);
    loadJsonFile("bible.json", null);
    BOOKS.forEach(b => loadJsonFile("book" + b.bookNum + ".json", b.title));
  }, []);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_menus", JSON.stringify(volLectures)); } catch (e) {}
  }, [volLectures]);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_accordion_store", JSON.stringify(store)); } catch (e) {}
  }, [store]);

  useEffect(() => {
    try { localStorage.setItem("neville_bible_json_store", JSON.stringify(bibleList)); } catch (e) {}
  }, [bibleList]);

  // store 안의 문장들에 포함된 bible 배열도 자동으로 bibleList에 합치고 성경 분류순 정렬
  const sortedBibleItems = useMemo(() => {
    const map = {};
    bibleList.forEach(item => {
      const key = (item.sourceTitle || "") + "_" + (item.ref || "") + "_" + (item.en || "").slice(0, 30);
      map[key] = item;
    });

    Object.keys(store).forEach(title => {
      const arr = store[title] || [];
      arr.forEach((s, idx) => {
        if (Array.isArray(s.bible) && s.bible.length > 0) {
          s.bible.forEach(b => {
            const parsed = parseBibleRef(b.ref);
            const key = title + "_" + b.ref + "_" + (s.en || "").slice(0, 30);
            map[key] = {
              id: key,
              sourceTitle: title,
              sentenceNo: idx + 1,
              bookNameEn: parsed.bookEn,
              bookNameKo: (b.refKo || "").split(" ")[0] || parsed.bookEn,
              chapter: parsed.chapter,
              verse: parsed.verse,
              ref: b.ref,
              refKo: b.refKo,
              en: s.en,
              ko: s.ko,
              quoteInText: b.quoteInText,
              kjv: b.kjv,
              krv: b.krv,
              nevilleContext: b.nevilleContext
            };
          });
        }
      });
    });

    const combined = Object.values(map);
    combined.sort((a, b) => {
      const pa = parseBibleRef(a.ref);
      const pb = parseBibleRef(b.ref);
      if (pa.order !== pb.order) return pa.order - pb.order;
      if (pa.chapter !== pb.chapter) return pa.chapter - pb.chapter;
      return pa.verse - pb.verse;
    });
    return combined;
  }, [bibleList, store]);

  const currentBibleItem = sortedBibleItems[selectedBibleIdx] || null;

  useEffect(() => {
    if (currentBibleItem) {
      const parsed = parseBibleRef(currentBibleItem.ref);
      setViewChapter(parsed.chapter);
      setViewVerse(parsed.verse);
      setLiveVerseData({ kjv: currentBibleItem.kjv || "", loading: false });
    }
  }, [selectedBibleIdx, currentBibleItem && currentBibleItem.ref]);

  // [앞절 / 다음절] 클릭 시 실시간 성경 원문 조회 (bible-api.com)
  const handleMoveVerse = async (delta) => {
    if (!currentBibleItem) return;
    const parsed = parseBibleRef(currentBibleItem.ref);
    const nextVerse = Math.max(1, viewVerse + delta);
    setViewVerse(nextVerse);

    if (nextVerse === parsed.verse && viewChapter === parsed.chapter) {
      setLiveVerseData({ kjv: currentBibleItem.kjv, loading: false });
      return;
    }

    setLiveVerseData({ kjv: "", loading: true });
    try {
      const queryRef = parsed.bookEn + " " + viewChapter + ":" + nextVerse;
      const res = await fetch("https://bible-api.com/" + encodeURIComponent(queryRef) + "?translation=kjv");
      if (res.ok) {
        const data = await res.json();
        setLiveVerseData({
          kjv: (data && data.text) ? data.text.trim() : "해당 절의 원문을 찾을 수 없습니다.",
          loading: false
        });
      } else {
        setLiveVerseData({ kjv: "이 장의 마지막 절을 지났거나 원문을 불러올 수 없습니다.", loading: false });
      }
    } catch (e) {
      setLiveVerseData({ kjv: "성경 API 연결 오류가 발생했습니다.", loading: false });
    }
  };

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  const sentences = store[selectedLec.title] || [];

  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  // PDF 인쇄/다운로드
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

  // JSON 파일 다운로드 공통 함수
  const downloadJson = (dataObj, filename) => {
    const jsonString = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // bible.json 전용 백업 다운로드
  const handleExportBibleJson = () => {
    downloadJson(sortedBibleItems, "bible.json");
  };

  // bible.json 불러오기
  const handleImportBibleJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setBibleList(imported);
          alert("✅ bible.json 파일(" + imported.length + "개 성경 구문)을 성공적으로 불러왔습니다!");
        } else {
          alert("올바른 bible.json 배열 형식이 아닙니다.");
        }
      } catch (err) {
        alert("JSON 파일 읽기 오류: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // 전체 강독 데이터 JSON 백업
  const handleExportAllJson = () => {
    downloadJson(store, "neville_data.json");
  };

  // 현재 권(vol1~6.json) 또는 책(book1~14.json) 개별 백업
  const handleExportCurrentTargetJson = () => {
    if (selectedLec.isBook) {
      const bookData = { [selectedLec.title]: store[selectedLec.title] || [] };
      downloadJson(bookData, "book" + selectedLec.num + ".json");
    } else {
      const targetVol = openVol || 1;
      const list = volLectures[targetVol] || [];
      const volData = {};
      list.forEach(item => {
        if (store[item.title] && store[item.title].length > 0) {
          volData[item.title] = store[item.title];
        }
      });
      if (store[selectedLec.title] && store[selectedLec.title].length > 0) {
        volData[selectedLec.title] = store[selectedLec.title];
      }
      downloadJson(volData, "vol" + targetVol + ".json");
    }
  };

  // 강독 데이터 JSON 복원
  const handleImportAllJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        mergeDataToStore(imported, selectedLec.title);
        alert("✅ 강독 노트가 성공적으로 병합되었습니다!");
      } catch (err) {
        alert("올바른 JSON 파일이 아닙니다.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ★ 핵심: 3중 프록시 자동 우회 웹 크롤러 (Jina Reader ➔ AllOrigins ➔ Codetabs)
  const fetchWebTextWithFallback = async (targetPageUrl) => {
    let cleanUrl = (targetPageUrl || "").trim();
    if (cleanUrl.indexOf("http://") === 0) {
      cleanUrl = "https://" + cleanUrl.slice(7);
    }
    if (!cleanUrl) throw new Error("유효한 URL이 없습니다.");

    // 1순위: Jina Reader API
    try {
      const res1 = await fetch("https://r.jina.ai/" + cleanUrl);
      if (res1.ok) {
        const txt = await res1.text();
        if (txt && txt.length > 100) return txt;
      }
    } catch (e) {}

    // HTML을 마크다운 링크 + 본문 텍스트로 변환하는 보조 파서
    const htmlToCleanText = (htmlStr) => {
      const doc = new DOMParser().parseFromString(htmlStr, "text/html");
      const removeSelectors = ["script", "style", "nav", "header", "footer", ".sidebar", "#genesis-sidebar-primary"];
      removeSelectors.forEach(sel => {
        doc.querySelectorAll(sel).forEach(el => el.remove());
      });
      doc.querySelectorAll("a").forEach(a => {
        if (a.href && a.textContent) {
          a.replaceWith(" [" + a.textContent.trim() + "](" + a.href + ") ");
        }
      });
      const mainContent = doc.querySelector("main, article, .entry-content, #genesis-content") || doc.body;
      return (mainContent ? mainContent.innerText || mainContent.textContent : "").trim();
    };

    // 2순위: AllOrigins 프록시 우회
    try {
      const res2 = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(cleanUrl));
      if (res2.ok) {
        const json = await res2.json();
        if (json && json.contents && json.contents.length > 100) {
          return htmlToCleanText(json.contents);
        }
      }
    } catch (e) {}

    // 3순위: Codetabs 프록시 우회
    try {
      const res3 = await fetch("https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(cleanUrl));
      if (res3.ok) {
        const html = await res3.text();
        if (html && html.length > 100) {
          return htmlToCleanText(html);
        }
      }
    } catch (e) {}

    throw new Error("모든 우회 프록시 서버 접속이 지연되고 있습니다. 원문 주소를 새 창에서 열어 본문을 복사해 아래 입력창에 붙여넣어 주세요.");
  };

  // 권별 목록 불러오기 (3중 프록시 자동 우회 적용)
  const handleToggleVolume = async (volObj) => {
    if (openVol === volObj.vol) {
      setOpenVol(null);
      return;
    }
    setOpenVol(volObj.vol);
    loadJsonFile("vol" + volObj.vol + ".json", null);

    if (!volLectures[volObj.vol] || volLectures[volObj.vol].length === 0) {
      setLoadingVol(true);
      try {
        const text = await fetchWebTextWithFallback(volObj.indexUrl);
        const lines = text.split("\n");
        const list = [];
        const seen = {};
        let startNum = (volObj.vol - 1) * 50 + 1;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          let pos = 0;
          while (pos < line.length) {
            const openBracket = line.indexOf("[", pos);
            const closeBracket = line.indexOf("](http", openBracket);
            if (openBracket === -1 || closeBracket === -1) break;

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
              list.push({ num: startNum++, title: title, url: url });
            }
            pos = closeBracket + 6;
          }
        }
        setVolLectures(prev => Object.assign({}, prev, { [volObj.vol]: list }));
      } catch (e) {
        alert("강의 목록 불러오기 오류: " + e.message);
      } finally {
        setLoadingVol(false);
      }
    }
  };

  // 본문 크롤링 (3중 프록시 자동 우회 적용)
  const handleFetchLectureBody = async (urlToFetch, titleToSet) => {
    const finalUrl = urlToFetch || targetUrl;
    setFetching(true);
    setResumeChunkIdx(0);
    setStatusMsg("🌐 [" + (titleToSet || selectedLec.title) + "] 영어 원문을 3중 우회 서버로 읽어오는 중...");
    try {
      const fullText = await fetchWebTextWithFallback(finalUrl);

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
      cleanBody = lines.join("\n\n");

      setRawText(cleanBody.trim());
      setStatusMsg("✅ 원문 추출 완료! 이제 [⚡ 2. 강독 노트 + 성경구문 생성]을 눌러주세요.");
    } catch (err) {
      alert("실시간 읽어오기 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setFetching(false);
    }
  };

  // ★ 최신 Gemini 3.1 Pro Preview 1순위 + Flash 자동 우회 호출기
  const callGeminiWithFallback = async (promptText, schemaObj, chunkInfo) => {
    // 기존 코드 (삭제):
  // const models = ["gemini-3.1-pro-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

  // ★ 수정 코드 (아래 한 줄로 교체):
  const models = ["gemini-3.1-pro-preview", "gemini-3.5-pro", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
    let lastErr = "";

    for (let attempt = 1; attempt <= 2; attempt++) {
      for (let m = 0; m < models.length; m++) {
        const modelName = models[m];
        try {
          setStatusMsg("⏳ AI 분석 중 (" + modelName + ") " + chunkInfo);
          const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey.trim(),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: schemaObj,
                  temperature: 0.15
                }
              })
            }
          );

          const data = await res.json();
          if (data.error) {
            lastErr = data.error.message || "모델 응답 오류";
            await sleep(900);
            continue;
          }

          const textOutput = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) || "[]";
          return safeParseJSON(textOutput);
        } catch (err) {
          lastErr = err.message;
          await sleep(1000);
        }
      }
    }
    throw new Error(lastErr || "AI 모델 응답 실패. API Key를 확인해 주세요.");
  };

  // 신규 강의/책 전체 강독 노트 + 성경 구문 동시 생성
  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      alert("상단 노란색 칸에 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }
    if (!rawText.trim()) {
      alert("먼저 왼쪽에서 강의나 저서를 선택해 본문을 불러와 주세요.");
      return;
    }

    setAnalyzing(true);
    try {
      const paragraphs = rawText.split("\n\n");
      const chunks = [];
      let currentChunk = "";

      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        if ((currentChunk + "\n\n" + p).length > 3000 && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = p;
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + p;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());

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
            },
            bible: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  ref: { type: "STRING" },
                  refKo: { type: "STRING" },
                  quoteInText: { type: "STRING" },
                  kjv: { type: "STRING" },
                  krv: { type: "STRING" },
                  nevilleContext: { type: "STRING" }
                },
                required: ["ref", "refKo", "quoteInText", "kjv", "krv", "nevilleContext"]
              }
            }
          },
          required: ["en", "ko", "vocab", "grammar", "bible"]
        }
      };

      let allParsedSentences = resumeChunkIdx > 0 ? (store[selectedLec.title] || []) : [];
      if (resumeChunkIdx === 0) {
        setStore(prev => Object.assign({}, prev, { [selectedLec.title]: [] }));
      }

      for (let i = resumeChunkIdx; i < chunks.length; i++) {
        const prompt = [
          "당신은 네빌 고다드(Neville Goddard) 전문 번역가이자 영어 구문·성경 주석가입니다.",
          "아래 본문 문장을 한 문장도 빠짐없이 순서대로 분리하여 JSON 배열로 반환하세요.",
          "1. 반복 기초 어휘는 제외하고 핵심 어휘만 vocab에 넣으세요.",
          "2. 1~5형식 분류는 쓰지 말고 직관적인 구문 구조와 성경적 맥락을 grammar에 해설하세요.",
          "3. 문장에 성경 구절의 직접/간접 인용이 있으면 bible 배열에 영문장절(ref, 예: 'John 14:20'), 한글장절(refKo, 예: '요한복음 14:20'), 인용어구(quoteInText), KJV영어원문(kjv), 개역개정한글원문(krv), 네빌의 해석(nevilleContext)을 정확히 넣으세요. 인용이 없으면 빈 배열([])로 두세요.",
          "본문:",
          chunks[i]
        ].join("\n");

        const parsed = await callGeminiWithFallback(
          prompt,
          strictSchema,
          "[" + (i + 1) + "/" + chunks.length + " 구간]"
        );

        allParsedSentences = allParsedSentences.concat(parsed);
        setResumeChunkIdx(i + 1);
        setStore(prev => Object.assign({}, prev, { [selectedLec.title]: allParsedSentences.slice() }));

        if (i < chunks.length - 1) await sleep(1000);
      }

      setResumeChunkIdx(0);
      setStatusMsg("🎉 총 " + allParsedSentences.length + "문장 강독 노트 및 성경 구문 추출 완료!");
    } catch (err) {
      alert("AI 분석 일시 정지: " + err.message);
      setStatusMsg("⚠️ 완료된 구간까지 자동 저장되었습니다. 다시 버튼을 누르면 이어서 진행됩니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  // ★ 이미 번역된 현재 노트에서 성경 인용 문장만 추출하여 매핑하는 함수
  const handleExtractBibleFromCurrent = async () => {
    if (!apiKey.trim()) {
      alert("상단 노란색 칸에 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }
    if (sentences.length === 0) {
      alert("현재 선택된 강의/책에 저장된 문장이 없습니다.");
      return;
    }

    setScanningBible(true);
    try {
      const updated = sentences.slice();
      const batchSize = 30;
      const totalBatches = Math.ceil(updated.length / batchSize);

      const scanSchema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            idx: { type: "INTEGER" },
            bible: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  ref: { type: "STRING" },
                  refKo: { type: "STRING" },
                  quoteInText: { type: "STRING" },
                  kjv: { type: "STRING" },
                  krv: { type: "STRING" },
                  nevilleContext: { type: "STRING" }
                },
                required: ["ref", "refKo", "quoteInText", "kjv", "krv", "nevilleContext"]
              }
            }
          },
          required: ["idx", "bible"]
        }
      };

      for (let b = 0; b < totalBatches; b++) {
        const start = b * batchSize;
        const slice = updated.slice(start, start + batchSize).map((s, offset) => ({
          idx: start + offset,
          en: s.en
        }));

        const scanPrompt = [
          "아래 네빌 고다드의 문장 목록(idx, en)에서 성경 구절을 직접 인용하거나 간접 인용·패러프레이징한 문장만 찾아 성경 원문 정보를 반환하세요.",
          "성경 인용이 없는 일반 문장은 결과 배열에서 제외하세요.",
          "ref는 반드시 'John 14:20', '1 Corinthians 12:3'처럼 영문 성경이름 장:절 형식으로 작성하세요.",
          JSON.stringify(slice)
        ].join("\n");

        const foundList = await callGeminiWithFallback(
          scanPrompt,
          scanSchema,
          "- 성경 구절 스캔 중 (" + (b + 1) + "/" + totalBatches + ")"
        );

        foundList.forEach(found => {
          if (updated[found.idx] && Array.isArray(found.bible) && found.bible.length > 0) {
            updated[found.idx] = Object.assign({}, updated[found.idx], { bible: found.bible });
          }
        });

        setStore(prev => Object.assign({}, prev, { [selectedLec.title]: updated.slice() }));
        if (b < totalBatches - 1) await sleep(800);
      }

      setStatusMsg("🎉 [" + selectedLec.title + "] 성경 구절 추출 완료! [📖 네빌성경구문] 메뉴에서 확인하세요.");
    } catch (err) {
      alert("성경 구절 스캔 오류: " + err.message);
    } finally {
      setScanningBible(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 좌측 사이드바 */}
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Neville Goddard Studio</div>
        <h1 className="text-lg font-bold mb-3">네빌 고다드 강독 & 성경구문</h1>

        {/* 상단 핵심 메뉴 분리 버튼: [강의·저서 강독] vs [네빌성경구문] */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-800 p-1.5 rounded-xl mb-4">
          <button
            onClick={() => setActiveMenu("study")}
            className={"py-2.5 px-2 rounded-lg text-xs font-bold transition " + (activeMenu === "study" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-300 hover:bg-slate-700")}
          >
            📚 강의·저서 강독
          </button>
          <button
            onClick={() => setActiveMenu("bible_menu")}
            className={"py-2.5 px-2 rounded-lg text-xs font-bold transition " + (activeMenu === "bible_menu" ? "bg-amber-500 text-slate-950 shadow" : "text-amber-300 hover:bg-slate-700")}
          >
            📖 네빌성경구문 ({sortedBibleItems.length})
          </button>
        </div>

        {/* 사이드바 1: 강의·저서 목록 */}
        {activeMenu === "study" && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {/* 14권 저서 아코디언 */}
            <div className="rounded-lg overflow-hidden border border-emerald-700/60 mb-2">
              <button
                onClick={() => setOpenBooksMenu(!openBooksMenu)}
                className={"w-full text-left px-3 py-2.5 text-xs font-bold transition flex justify-between items-center " + (openBooksMenu ? "bg-emerald-500 text-slate-950" : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200")}
              >
                <span>📖 정규 단행본 저서 (14권)</span>
                <span>{openBooksMenu ? "▲" : "▼"}</span>
              </button>
              {openBooksMenu && (
                <div className="bg-slate-950 p-2 space-y-1 max-h-64 overflow-y-auto">
                  {BOOKS.map(b => {
                    const savedCount = (store[b.title] || []).length;
                    const isSelected = selectedLec.isBook && selectedLec.title === b.title;
                    return (
                      <button
                        key={b.bookNum}
                        onClick={() => {
                          setSelectedLec({ isBook: true, num: b.bookNum, title: b.title, url: b.url });
                          setTargetUrl(b.url);
                          loadJsonFile("book" + b.bookNum + ".json", b.title);
                          handleFetchLectureBody(b.url, b.title);
                        }}
                        className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                      >
                        <span className="truncate pr-2">Book {b.bookNum}. {b.title}</span>
                        {savedCount > 0 ? (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold shrink-0">{savedCount}문장</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 shrink-0">읽기</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 제1권 ~ 제6권 (294 강의) 아코디언 */}
            {VOLUMES.map(v => {
              const isOpen = openVol === v.vol;
              const subList = volLectures[v.vol] || [];
              return (
                <div key={v.vol} className="rounded-lg overflow-hidden border border-slate-800">
                  <button
                    onClick={() => handleToggleVolume(v)}
                    className={"w-full text-left px-3 py-2.5 text-xs font-bold transition flex justify-between items-center " + (isOpen ? "bg-amber-500 text-slate-900" : "bg-slate-800 hover:bg-slate-700 text-slate-200")}
                  >
                    <span>📚 {v.title}</span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="bg-slate-950 p-2 space-y-1 max-h-72 overflow-y-auto">
                      {loadingVol && subList.length === 0 ? (
                        <div className="text-xs text-amber-400 p-3 text-center">⏳ 3중 우회 서버로 목록 로딩 중...</div>
                      ) : (
                        subList.map((lec, i) => {
                          const isSelected = !selectedLec.isBook && selectedLec.title === lec.title;
                          const savedCount = (store[lec.title] || []).length;
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedLec({ isBook: false, num: lec.num, title: lec.title, url: lec.url });
                                setTargetUrl(lec.url);
                                handleFetchLectureBody(lec.url, lec.title);
                              }}
                              className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                            >
                              <span className="truncate pr-2">{lec.num}. {lec.title}</span>
                              {savedCount > 0 ? (
                                <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-bold shrink-0">{savedCount}문장</span>
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
        )}

        {/* 사이드바 2: [네빌성경구문] 선택 시 성경 1, 2, 3... 빠른 목차 표시 */}
        {activeMenu === "bible_menu" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="text-xs text-amber-300 font-bold mb-2">
              📜 성경 분류순 (창세기 ➔ 요한계시록)
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {sortedBibleItems.map((item, idx) => {
                const isSelected = selectedBibleIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedBibleIdx(idx)}
                    className={"w-full text-left p-2.5 rounded-lg text-xs transition border " + (isSelected ? "bg-amber-500 text-slate-950 font-bold border-amber-300" : "bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-800")}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span>{idx + 1}. {item.refKo} ({item.ref})</span>
                    </div>
                    <div className={"text-[11px] truncate " + (isSelected ? "text-slate-800" : "text-slate-400")}>
                      {item.en}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* 우측 메인 영역 */}
      <main className="print-container flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* 상단 Gemini API Key 입력바 */}
        <div className="no-print bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-amber-900">🔑 Gemini API Key (3.1 Pro 자동 호환):</span>
          <div className="flex gap-2 flex-1 max-w-md">
            <input
              type="password"
              placeholder="무료 Gemini API Key 입력"
              value={apiKey}
              onChange={e => saveApiKey(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-amber-300 bg-white"
            />
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="shrink-0 px-3 py-1.5 bg-amber-600 text-white rounded font-bold">
              발급 ↗
            </a>
          </div>
        </div>

        {/* ============================================================
            화면 1: [📖 네빌성경구문] 독립 메뉴 화면
           ============================================================ */}
        {activeMenu === "bible_menu" && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-stone-300">
              <div>
                <div className="text-xs font-bold text-amber-700 uppercase">Neville Goddard Scripture Archive</div>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22pt", color: "#292929" }} className="font-bold">
                  📖 네빌성경구문 ({sortedBibleItems.length}문장)
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportBibleJson}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  💾 bible.json 저장
                </button>
                <label className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer shadow-sm">
                  📂 bible.json 불러오기
                  <input type="file" accept=".json" onChange={handleImportBibleJson} className="hidden" />
                </label>
              </div>
            </div>

            {/* 상단: 성경 분류순 1, 2, 3... 문장 리스트 */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-stone-100 px-4 py-2.5 border-b text-xs font-bold text-stone-700 flex justify-between items-center">
                <span>📋 성경 분류순 인용 문장 목록 (문장을 클릭하면 아래에 성경 원문 장/절이 열립니다)</span>
                <span>현재 선택: {selectedBibleIdx + 1} / {sortedBibleItems.length}</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                {sortedBibleItems.map((item, idx) => {
                  const active = selectedBibleIdx === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedBibleIdx(idx)}
                      className={"p-4 cursor-pointer transition " + (active ? "bg-amber-50/90 border-l-4 border-amber-600" : "hover:bg-stone-50")}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {idx + 1}. {item.refKo} ({item.ref})
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          출처: {item.sourceTitle} ({item.sentenceNo}번 문장)
                        </span>
                      </div>
                      <p style={{ fontFamily: "Georgia, serif", fontSize: "13.5pt", lineHeight: "1.5" }} className="text-stone-900 font-medium">
                        {item.en}
                      </p>
                      <p className="text-xs text-stone-600 mt-1">{item.ko}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 하단: 클릭한 문장의 [성경 원문 장/절 뷰어] + [앞절 / 다음절 이동 버튼] */}
            {currentBibleItem && (
              <div className="bg-amber-50/80 rounded-2xl border-2 border-amber-300 p-6 shadow-md space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-amber-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase">Selected Sentence & Bible Original</span>
                    <h3 className="text-lg font-bold text-amber-950">
                      📜 {currentBibleItem.refKo} ({currentBibleItem.ref}) — 원문 대조 뷰어
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBibleIdx(prev => Math.max(0, prev - 1))}
                      disabled={selectedBibleIdx === 0}
                      className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-900 disabled:opacity-40"
                    >
                      ▲ 이전 인용문장
                    </button>
                    <button
                      onClick={() => setSelectedBibleIdx(prev => Math.min(sortedBibleItems.length - 1, prev + 1))}
                      disabled={selectedBibleIdx === sortedBibleItems.length - 1}
                      className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-900 disabled:opacity-40"
                    >
                      ▼ 다음 인용문장
                    </button>
                  </div>
                </div>

                {/* 네빌의 인용 문장 박스 */}
                <div className="bg-white p-4 rounded-xl border border-amber-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-stone-500">
                      네빌 고다드 본문 문장 ({currentBibleItem.sourceTitle})
                    </span>
                    <button
                      onClick={() => speak(currentBibleItem.en)}
                      className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold"
                    >
                      🔊 문장 발음 듣기
                    </button>
                  </div>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "14pt", lineHeight: "1.55" }} className="text-stone-900 mb-2">
                    {currentBibleItem.en}
                  </p>
                  <p style={{ fontSize: "13pt", lineHeight: "1.55" }} className="text-stone-700 p-3 bg-stone-50 rounded-lg border-l-4 border-stone-700">
                    {currentBibleItem.ko}
                  </p>
                </div>

                {/* 성경 장/절 앞절·다음절 컨트롤 바 */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-200/70 px-4 py-3 rounded-xl border border-amber-300">
                  <button
                    onClick={() => handleMoveVerse(-1)}
                    disabled={viewVerse <= 1}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold disabled:opacity-40 transition"
                  >
                    ◀ 앞절 보기 ({viewChapter}:{Math.max(1, viewVerse - 1)})
                  </button>

                  <div className="text-center">
                    <span className="text-sm font-bold text-amber-950">
                      📖 현재 열람 중인 성경 장/절: {currentBibleItem.bookNameKo} ({currentBibleItem.bookNameEn}) {viewChapter}장 {viewVerse}절
                    </span>
                  </div>

                  <button
                    onClick={() => handleMoveVerse(1)}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold transition"
                  >
                    다음절 보기 ({viewChapter}:{viewVerse + 1}) ▶
                  </button>
                </div>

                {/* 성경 원본 (KJV 영어 & 개역개정 한글) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-amber-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        KJV 영어 성경 원문 ({viewChapter}:{viewVerse})
                      </span>
                      <button
                        onClick={() => speak(liveVerseData.kjv || currentBibleItem.kjv)}
                        className="text-xs text-amber-800 font-bold hover:underline"
                      >
                        🔊 KJV 발음 듣기
                      </button>
                    </div>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "13.5pt", lineHeight: "1.55" }} className="italic text-slate-900">
                      {liveVerseData.loading ? "⏳ 해당 절의 성경 원문을 불러오는 중..." : "“" + (liveVerseData.kjv || currentBibleItem.kjv) + "”"}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        개역개정 한국어 성경 원문 (인용 본절)
                      </span>
                      <a
                        href={"https://www.biblegateway.com/passage/?search=" + encodeURIComponent(currentBibleItem.bookNameEn + " " + viewChapter) + "&version=KJV"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-amber-800 font-bold underline"
                      >
                        {viewChapter}장 전체 보기 ↗
                      </a>
                    </div>
                    <p style={{ fontSize: "13pt", lineHeight: "1.6" }} className="text-slate-800">
                      “{currentBibleItem.krv}”
                    </p>
                  </div>
                </div>

                {/* 네빌의 성경 해석 포인트 */}
                {currentBibleItem.nevilleContext && (
                  <div className="p-4 bg-amber-100/80 rounded-xl border border-amber-300 text-xs text-amber-950 leading-relaxed">
                    <b>💡 네빌 고다드의 성경 해석 핵심:</b> {currentBibleItem.nevilleContext}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            화면 2: 기존 [📚 강의·저서 강독] 스튜디오 화면
           ============================================================ */}
        {activeMenu === "study" && (
          <div>
            <div className="no-print bg-white border rounded-xl p-4 mb-6 shadow-sm">
              <div className="text-xs font-bold text-slate-600 mb-2">🌐 선택된 강의/저서 웹페이지 주소(URL):</div>
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
                  {fetching ? "⏳ 본문 읽는 중..." : "🌐 1. 사이트 실시간 읽어오기 (3중 우회)"}
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={e => {
                  setRawText(e.target.value);
                  setResumeChunkIdx(0);
                }}
                rows={4}
                placeholder="왼쪽에서 강의나 저서를 클릭하면 영어 원문이 자동으로 채워집니다."
                className="w-full p-3 border rounded-lg text-xs font-mono bg-stone-50 mb-2"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-700">{statusMsg}</span>
                <div className="flex flex-wrap gap-2">
                  {sentences.length > 0 && (
                    <button
                      onClick={handleExtractBibleFromCurrent}
                      disabled={scanningBible}
                      className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                    >
                      {scanningBible ? "⏳ 성경 스캔 중..." : "🔍 현재 노트에서 성경 인용만 추출"}
                    </button>
                  )}
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    {analyzing
                      ? "⏳ AI 분석 중..."
                      : resumeChunkIdx > 0
                      ? "⚡ 2. 이어서 생성 (" + (resumeChunkIdx + 1) + "구간~)"
                      : "⚡ 2. 강독 노트 + 성경구문 생성"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22pt", color: "#292929" }} className="font-bold">
                {selectedLec.isBook ? "Book " + selectedLec.num + ". " : (selectedLec.num ? "#" + String(selectedLec.num).padStart(3, "0") + ". " : "")}
                {selectedLec.title}
              </h2>
              <div className="no-print flex flex-wrap gap-2">
                <button
                  onClick={handleExportCurrentTargetJson}
                  className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  💾 {selectedLec.isBook ? "book" + selectedLec.num + ".json" : "vol" + (openVol || 1) + ".json"} 백업
                </button>
                <button
                  onClick={handleExportAllJson}
                  className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
                >
                  💾 전체 백업
                </button>
                <label className="px-3 py-2 rounded bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold cursor-pointer shadow-sm">
                  📂 JSON 복원
                  <input type="file" accept=".json" onChange={handleImportAllJson} className="hidden" />
                </label>
                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                >
                  📄 PDF
                </button>
                <button
                  onClick={() => setQuizMode(!quizMode)}
                  className="px-3 py-2 rounded bg-slate-800 text-white text-xs font-bold"
                >
                  {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {sentences.map((s, idx) => (
                <div key={idx} className="print-card bg-white p-6 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-2 border-b pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span style={{ fontFamily: "Georgia, serif", fontSize: "16pt", color: "#292929" }} className="font-bold">
                        Sentence {String(idx + 1).padStart(2, "0")}
                      </span>
                      {Array.isArray(s.bible) && s.bible.map((b, bi) => (
                        <button
                          key={bi}
                          onClick={() => setActiveMenu("bible_menu")}
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                        >
                          📜 {b.refKo} ({b.ref}) ➔
                        </button>
                      ))}
                    </div>
                    <button onClick={() => speak(s.en)} className="no-print px-3 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold">
                      🔊 발음 듣기
                    </button>
                  </div>

                  <p style={{ fontFamily: "Georgia, serif", fontSize: "14pt", lineHeight: "1.55", color: "#292929" }} className="mb-3">
                    {s.en}
                  </p>

                  <p style={{ fontSize: "13.5pt", lineHeight: "1.55", color: "#292929" }} className={"p-3 bg-stone-50 border-l-4 border-stone-800 rounded mb-4 " + (quizMode ? "blur-sm hover:blur-none transition cursor-pointer" : "")}>
                    {s.ko}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-dashed" style={{ fontSize: "13.5pt", lineHeight: "1.55", color: "#292929" }}>
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
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
// === END OF FILE ===
