const { useState, useEffect, useMemo } = React;

// 1. 네빌 고다드 14권 정규 저서 (book1.json ~ book14.json)
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

const BOOK_TITLE_SET = new Set(BOOKS.map(b => b.title));

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

// 3. 성경 66권 마스터 목록
const BIBLE_BOOKS_66 = [
  { order: 1, en: "Genesis", ko: "창세기", test: "OT" },
  { order: 2, en: "Exodus", ko: "출애굽기", test: "OT" },
  { order: 3, en: "Leviticus", ko: "레위기", test: "OT" },
  { order: 4, en: "Numbers", ko: "민수기", test: "OT" },
  { order: 5, en: "Deuteronomy", ko: "신명기", test: "OT" },
  { order: 6, en: "Joshua", ko: "여호수아", test: "OT" },
  { order: 7, en: "Judges", ko: "사사기", test: "OT" },
  { order: 8, en: "Ruth", ko: "룻기", test: "OT" },
  { order: 9, en: "1 Samuel", ko: "사무엘상", test: "OT" },
  { order: 10, en: "2 Samuel", ko: "사무엘하", test: "OT" },
  { order: 11, en: "1 Kings", ko: "열왕기상", test: "OT" },
  { order: 12, en: "2 Kings", ko: "열왕기하", test: "OT" },
  { order: 13, en: "1 Chronicles", ko: "역대상", test: "OT" },
  { order: 14, en: "2 Chronicles", ko: "역대하", test: "OT" },
  { order: 15, en: "Ezra", ko: "에스라", test: "OT" },
  { order: 16, en: "Nehemiah", ko: "느헤미야", test: "OT" },
  { order: 17, en: "Esther", ko: "에스더", test: "OT" },
  { order: 18, en: "Job", ko: "욥기", test: "OT" },
  { order: 19, en: "Psalm", ko: "시편", test: "OT" },
  { order: 20, en: "Proverbs", ko: "잠언", test: "OT" },
  { order: 21, en: "Ecclesiastes", ko: "전도서", test: "OT" },
  { order: 22, en: "Song of Solomon", ko: "아가", test: "OT" },
  { order: 23, en: "Isaiah", ko: "이사야", test: "OT" },
  { order: 24, en: "Jeremiah", ko: "예레미야", test: "OT" },
  { order: 25, en: "Lamentations", ko: "예레미야애가", test: "OT" },
  { order: 26, en: "Ezekiel", ko: "에스겔", test: "OT" },
  { order: 27, en: "Daniel", ko: "다니엘", test: "OT" },
  { order: 28, en: "Hosea", ko: "호세아", test: "OT" },
  { order: 29, en: "Joel", ko: "요엘", test: "OT" },
  { order: 30, en: "Amos", ko: "아모스", test: "OT" },
  { order: 31, en: "Obadiah", ko: "오바댜", test: "OT" },
  { order: 32, en: "Jonah", ko: "요나", test: "OT" },
  { order: 33, en: "Micah", ko: "미가", test: "OT" },
  { order: 34, en: "Nahum", ko: "나훔", test: "OT" },
  { order: 35, en: "Habakkuk", ko: "하박국", test: "OT" },
  { order: 36, en: "Zephaniah", ko: "스바냐", test: "OT" },
  { order: 37, en: "Haggai", ko: "학개", test: "OT" },
  { order: 38, en: "Zechariah", ko: "스가랴", test: "OT" },
  { order: 39, en: "Malachi", ko: "말라기", test: "OT" },
  { order: 40, en: "Matthew", ko: "마태복음", test: "NT" },
  { order: 41, en: "Mark", ko: "마가복음", test: "NT" },
  { order: 42, en: "Luke", ko: "누가복음", test: "NT" },
  { order: 43, en: "John", ko: "요한복음", test: "NT" },
  { order: 44, en: "Acts", ko: "사도행전", test: "NT" },
  { order: 45, en: "Romans", ko: "로마서", test: "NT" },
  { order: 46, en: "1 Corinthians", ko: "고린도전서", test: "NT" },
  { order: 47, en: "2 Corinthians", ko: "고린도후서", test: "NT" },
  { order: 48, en: "Galatians", ko: "갈라디아서", test: "NT" },
  { order: 49, en: "Ephesians", ko: "에베소서", test: "NT" },
  { order: 50, en: "Philippians", ko: "빌립보서", test: "NT" },
  { order: 51, en: "Colossians", ko: "골로새서", test: "NT" },
  { order: 52, en: "1 Thessalonians", ko: "데살로니가전서", test: "NT" },
  { order: 53, en: "2 Thessalonians", ko: "데살로니가후서", test: "NT" },
  { order: 54, en: "1 Timothy", ko: "디모데전서", test: "NT" },
  { order: 55, en: "2 Timothy", ko: "디모데후서", test: "NT" },
  { order: 56, en: "Titus", ko: "디도서", test: "NT" },
  { order: 57, en: "Philemon", ko: "빌레몬서", test: "NT" },
  { order: 58, en: "Hebrews", ko: "히브리서", test: "NT" },
  { order: 59, en: "James", ko: "야고보서", test: "NT" },
  { order: 60, en: "1 Peter", ko: "베드로전서", test: "NT" },
  { order: 61, en: "2 Peter", ko: "베드로후서", test: "NT" },
  { order: 62, en: "1 John", ko: "요한일서", test: "NT" },
  { order: 63, en: "2 John", ko: "요한이서", test: "NT" },
  { order: 64, en: "3 John", ko: "요한삼서", test: "NT" },
  { order: 65, en: "Jude", ko: "유다서", test: "NT" },
  { order: 66, en: "Revelation", ko: "요한계시록", test: "NT" }
];

const KNOWN_YEARS = {
  "Consciousness Is the Only Reality": 1948,
  "No One to Change But Self": 1948,
  "Assumptions Harden Into Fact": 1948,
  "Thinking Fourth Dimensionally": 1948,
  "Remain Faithful to Your Idea": 1948,
  "Changing The Feeling of I": 1953,
  "Changing the Feeling of I": 1953,
  "The Pruning Shears of Revision": 1954,
  "Awakened Imagination Barabbas or Jesus": 1954,
  "Barabbas or Jesus": 1954,
  "Mental Diets": 1955,
  "Seedtime and Harvest": 1956,
  "Catch The Mood": 1959,
  "Creation Faith": 1959,
  "Awake o Sleeper 1": 1959,
  "Awake o Sleeper 2": 1959,
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
  "The Pearl of Great Price": 1963,
  "Blake On Religion": 1963,
  "By Water And By Blood": 1964,
  "Christ is Your Life": 1964,
  "Christ Unveiled": 1964,
  "All Things Exist": 1965,
  "The Coin of Heaven": 1966,
  "Be Imitators of God": 1966,
  "Believe It In": 1966,
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

const matchBibleBook = (item, bookObj) => {
  if (!item || !bookObj) return false;
  const ko = (item.bookNameKo || "").trim();
  const en = (item.bookNameEn || "").trim().toLowerCase();
  const ref = (item.ref || "").trim().toLowerCase();
  const refKo = (item.refKo || "").trim();
  const targetEn = bookObj.en.toLowerCase();
  if (ko && ko === bookObj.ko) return true;
  if (en && (en === targetEn || (targetEn === "psalm" && en === "psalms") || (targetEn === "revelation" && en === "revelations"))) return true;
  if (refKo && refKo.startsWith(bookObj.ko + " ")) return true;
  if (ref && (ref.startsWith(targetEn + " ") || (targetEn === "psalm" && ref.startsWith("psalms ")))) return true;
  return false;
};

const getEraForTitle = (title, yearMap) => {
  const y = (yearMap && yearMap[title]) || KNOWN_YEARS[title];
  if (y) {
    const found = ERAS.find(e => y >= e.startYear && y <= e.endYear);
    if (found) return found.era;
  }
  return 1;
};

// 성경 구절 고유 ID 생성
const getBibleItemId = (b) => {
  return b.id || `${b.sourceTitle || ""}_${b.sentenceNo || ""}_${b.ref || ""}_${(b.en || "").slice(0, 20)}`;
};

function ViewerApp() {
  const [activeTab, setActiveTab] = useState("lecture"); // "lecture" | "bible" | "bookmarks"
  const [openBooksMenu, setOpenBooksMenu] = useState(true);
  const [openEra, setOpenEra] = useState(null);
  const [loading, setLoading] = useState(true);

  const [store, setStore] = useState({});
  const [lectureYears, setLectureYears] = useState(KNOWN_YEARS);
  const [bibleList, setBibleList] = useState([]);

  const [selectedLec, setSelectedLec] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [bibleSearch, setBibleSearch] = useState("");
  const [selectedBibleBook, setSelectedBibleBook] = useState("ALL");

  // ★ 다중 책갈피 상태 (강독 문장 + 성경 구절 통합 저장)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_viewer_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [pendingScroll, setPendingScroll] = useState(null);
  const [highlightedIdx, setHighlightedIdx] = useState(null);
  const [highlightedBibleId, setHighlightedBibleId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("neville_viewer_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {}
  }, [bookmarks]);

  // 배포된 JSON 데이터 일괄 로드
  useEffect(() => {
    let isMounted = true;

    const fetchJsonSafe = async (fileName) => {
      try {
        const res = await fetch("./" + fileName + "?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        return null;
      }
    };

    const loadAllData = async () => {
      const mergedStore = {};
      let mergedYears = Object.assign({}, KNOWN_YEARS);
      let loadedBible = [];

      const mergeObj = (data, fallbackTitle) => {
        if (!data) return;
        if (Array.isArray(data) && fallbackTitle) {
          const prevArr = mergedStore[fallbackTitle] || [];
          if (data.length >= prevArr.length) mergedStore[fallbackTitle] = data;
          return;
        }
        if (typeof data === "object") {
          Object.keys(data).forEach(key => {
            if (key === "_lectureYears" && typeof data[key] === "object") {
              mergedYears = Object.assign(mergedYears, data[key]);
              return;
            }
            if (Array.isArray(data[key])) {
              const prevArr = mergedStore[key] || [];
              if (data[key].length >= prevArr.length) mergedStore[key] = data[key];
            }
          });
        }
      };

      const tasks = [
        fetchJsonSafe("bible.json").then(d => { if (Array.isArray(d)) loadedBible = d; }),
        fetchJsonSafe("neville_data.json").then(d => mergeObj(d, null)),
        ...Array.from({ length: 8 }, (_, i) => fetchJsonSafe(`era${i + 1}.json`).then(d => mergeObj(d, null))),
        ...Array.from({ length: 6 }, (_, i) => fetchJsonSafe(`vol${i + 1}.json`).then(d => mergeObj(d, null))),
        ...BOOKS.map(b => fetchJsonSafe(`book${b.bookNum}.json`).then(d => mergeObj(d, b.title)))
      ];

      await Promise.all(tasks);

      if (!isMounted) return;

      setStore(mergedStore);
      setLectureYears(mergedYears);
      setBibleList(loadedBible);

      const firstAvailableBook = BOOKS.find(b => (mergedStore[b.title] || []).length > 0);
      if (firstAvailableBook) {
        setSelectedLec({
          isBook: true,
          num: firstAvailableBook.bookNum,
          title: firstAvailableBook.title,
          koTitle: firstAvailableBook.koTitle
        });
      } else {
        const firstLecTitle = Object.keys(mergedStore).find(k => !BOOK_TITLE_SET.has(k) && mergedStore[k].length > 0);
        if (firstLecTitle) {
          const eraNum = getEraForTitle(firstLecTitle, mergedYears);
          setOpenBooksMenu(false);
          setOpenEra(eraNum);
          setSelectedLec({ isBook: false, title: firstLecTitle });
        }
      }
      setLoading(false);
    };

    loadAllData();
    return () => { isMounted = false; };
  }, []);

  // ★ 책갈피 클릭 후 해당 문장 또는 성경 구절로 부드럽게 스크롤 + 하이라이트
  useEffect(() => {
    if (!pendingScroll) return;

    if (pendingScroll.type === "bible") {
      if (activeTab !== "bible") return;
      const timer = setTimeout(() => {
        const el = document.getElementById("bible-card-" + pendingScroll.bibleId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightedBibleId(pendingScroll.bibleId);
          setTimeout(() => setHighlightedBibleId(null), 2500);
        }
        setPendingScroll(null);
      }, 150);
      return () => clearTimeout(timer);
    }

    if (!selectedLec || selectedLec.title !== pendingScroll.title || activeTab === "bible") return;

    const timer = setTimeout(() => {
      const el = document.getElementById("sentence-" + pendingScroll.sentenceIndex);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedIdx(pendingScroll.sentenceIndex);
        setTimeout(() => setHighlightedIdx(null), 2500);
      }
      setPendingScroll(null);
    }, 120);

    return () => clearTimeout(timer);
  }, [pendingScroll, selectedLec, activeTab]);

  // ★ 강독 문장 책갈피 토글
  const toggleBookmark = (idx, sentenceObj) => {
    if (!selectedLec) return;
    const bmId = `${selectedLec.title}_${idx}`;
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === bmId);
      if (exists) return prev.filter(b => b.id !== bmId);
      const newBm = {
        id: bmId,
        type: "lecture",
        isBook: !!selectedLec.isBook,
        num: selectedLec.num || null,
        title: selectedLec.title,
        koTitle: selectedLec.koTitle || "",
        sentenceIndex: idx,
        enPreview: (sentenceObj.en || "").slice(0, 75),
        koPreview: (sentenceObj.ko || "").slice(0, 55),
        createdAt: Date.now()
      };
      return [newBm, ...prev];
    });
  };

  // ★ 성경 구절 책갈피 토글
  const toggleBibleBookmark = (bibleObj) => {
    const bId = getBibleItemId(bibleObj);
    const bmId = `bible_${bId}`;
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === bmId);
      if (exists) return prev.filter(b => b.id !== bmId);
      const newBm = {
        id: bmId,
        type: "bible",
        bibleId: bId,
        ref: bibleObj.ref || "",
        refKo: bibleObj.refKo || bibleObj.ref || "",
        sourceTitle: bibleObj.sourceTitle || "",
        sentenceNo: bibleObj.sentenceNo || "",
        enPreview: (bibleObj.en || "").slice(0, 75),
        koPreview: (bibleObj.ko || "").slice(0, 55),
        createdAt: Date.now()
      };
      return [newBm, ...prev];
    });
  };

  const removeBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // ★ 책갈피 클릭 시 이동
  const handleJumpToBookmark = (bm) => {
    if (bm.type === "bible") {
      setSelectedBibleBook("ALL");
      setBibleSearch("");
      setActiveTab("bible");
      setPendingScroll({ type: "bible", bibleId: bm.bibleId });
      return;
    }

    setActiveTab("bookmarks");
    if (bm.isBook) {
      setOpenBooksMenu(true);
      setSelectedLec({ isBook: true, num: bm.num, title: bm.title, koTitle: bm.koTitle });
    } else {
      setOpenEra(getEraForTitle(bm.title, lectureYears));
      setSelectedLec({ isBook: false, title: bm.title });
    }
    setPendingScroll({ type: "lecture", title: bm.title, sentenceIndex: bm.sentenceIndex });
  };

  const bookmarkIdSet = useMemo(() => new Set(bookmarks.map(b => b.id)), [bookmarks]);

  // 로드된 강연 목록 (저서 제외)
  const loadedLectures = useMemo(() => {
    return Object.keys(store)
      .filter(title => !BOOK_TITLE_SET.has(title) && Array.isArray(store[title]) && store[title].length > 0)
      .map(title => ({
        title,
        year: lectureYears[title] || KNOWN_YEARS[title] || null,
        era: getEraForTitle(title, lectureYears),
        count: store[title].length
      }))
      .sort((a, b) => {
        if ((a.year || 9999) !== (b.year || 9999)) return (a.year || 9999) - (b.year || 9999);
        return a.title.localeCompare(b.title);
      });
  }, [store, lectureYears]);

  const totalNotesCount = useMemo(() => {
    return Object.keys(store).filter(k => Array.isArray(store[k]) && store[k].length > 0).length;
  }, [store]);

  const sentences = selectedLec ? (store[selectedLec.title] || []) : [];
  const currentEraNum = selectedLec && !selectedLec.isBook
    ? getEraForTitle(selectedLec.title, lectureYears)
    : 1;

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  const handleDownloadPdf = () => {
    if (!selectedLec || sentences.length === 0) return;
    if (quizMode) setQuizMode(false);
    const originalTitle = document.title;
    const prefix = selectedLec.isBook
      ? "Book" + String(selectedLec.num).padStart(2, "0") + "_"
      : "";
    document.title = prefix + selectedLec.title + "_강독노트";
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  };

  const selectedBibleBookObj = BIBLE_BOOKS_66.find(bk => bk.ko === selectedBibleBook) || null;

  const filteredBibleList = useMemo(() => {
    return bibleList.filter(b => {
      if (selectedBibleBookObj && !matchBibleBook(b, selectedBibleBookObj)) return false;
      if (!bibleSearch.trim()) return true;
      const q = bibleSearch.toLowerCase();
      return (
        (b.ref || "").toLowerCase().includes(q) ||
        (b.refKo || "").toLowerCase().includes(q) ||
        (b.en || "").toLowerCase().includes(q) ||
        (b.ko || "").toLowerCase().includes(q) ||
        (b.sourceTitle || "").toLowerCase().includes(q)
      );
    });
  }, [bibleList, selectedBibleBookObj, bibleSearch]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 사이드바 */}
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Neville Goddard Archive</div>
        <h1 className="text-lg font-bold mb-2">네빌 고다드 강독 아카이브</h1>

        {/* 상단 3분할 탭: 강독 / 성경 / 책갈피 */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg mb-3 border border-slate-800">
          <button
            onClick={() => setActiveTab("lecture")}
            className={"py-2 rounded text-[11px] font-bold transition " + (activeTab === "lecture" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            📚 강독 ({totalNotesCount})
          </button>
          <button
            onClick={() => setActiveTab("bible")}
            className={"py-2 rounded text-[11px] font-bold transition " + (activeTab === "bible" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            ✝️ 성경 ({bibleList.length})
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={"py-2 rounded text-[11px] font-bold transition " + (activeTab === "bookmarks" ? "bg-sky-400 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            🔖 책갈피 ({bookmarks.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {activeTab === "bookmarks" ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] text-sky-400 font-bold pb-1 border-b border-slate-800">
                <span>🔖 저장된 책갈피 ({bookmarks.length})</span>
                {bookmarks.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("저장된 모든 책갈피를 삭제할까요?")) setBookmarks([]);
                    }}
                    className="text-[10px] text-slate-400 hover:text-red-400 font-normal"
                  >
                    전체 삭제
                  </button>
                )}
              </div>

              {bookmarks.length === 0 ? (
                <div className="text-xs text-slate-400 bg-slate-950/60 p-4 rounded-lg text-center leading-relaxed">
                  아직 저장된 책갈피가 없습니다.
                  <br />
                  <br />
                  강독 문장이나 성경 구절의
                  <br />
                  <span className="text-amber-400 font-bold">[☆ 책갈피]</span> 버튼을 눌러보세요!
                </div>
              ) : (
                bookmarks.map(bm => (
                  <div
                    key={bm.id}
                    onClick={() => handleJumpToBookmark(bm)}
                    className="group cursor-pointer bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-400/60 rounded-lg p-2.5 transition"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className={"text-xs font-bold truncate " + (bm.type === "bible" ? "text-emerald-300" : "text-amber-300")}>
                        {bm.type === "bible"
                          ? `✝️ ${bm.refKo || bm.ref}`
                          : (bm.isBook ? `📖 Book ${bm.num}. ` : "📅 ") + bm.title}
                      </div>
                      <button
                        onClick={(e) => removeBookmark(bm.id, e)}
                        title="책갈피 삭제"
                        className="text-slate-500 hover:text-red-400 text-xs font-bold px-1 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                    {bm.type === "bible" ? (
                      <div className="inline-block text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold mb-1 truncate max-w-full">
                        성경 · {bm.sourceTitle}
                      </div>
                    ) : (
                      <div className="inline-block text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-bold mb-1">
                        Sentence {String(bm.sentenceIndex + 1).padStart(2, "0")}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-200 line-clamp-2 leading-snug">
                      {bm.koPreview || bm.enPreview}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === "bible" ? (
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedBibleBook("ALL")}
                className={"w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition flex justify-between items-center " + (selectedBibleBook === "ALL" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-slate-200")}
              >
                <span>📖 전체 성경 구절 보기</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">{bibleList.length}</span>
              </button>

              <div className="text-[11px] text-emerald-400 font-bold pt-2 pb-0.5">📜 구약 성경 (창세기 ~ 말라기)</div>
              {BIBLE_BOOKS_66.filter(bk => bk.test === "OT").map(book => {
                const count = bibleList.filter(b => matchBibleBook(b, book)).length;
                if (count === 0) return null;
                const isSel = selectedBibleBook === book.ko;
                return (
                  <button
                    key={book.order}
                    onClick={() => setSelectedBibleBook(book.ko)}
                    className={"w-full text-left px-3 py-2 rounded-lg text-xs transition flex justify-between items-center " + (isSel ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold" : "bg-slate-950/60 text-slate-200 hover:bg-slate-800")}
                  >
                    <span className="truncate pr-2">
                      {book.order}. {book.ko} <span className="text-[10px] text-slate-400">({book.en})</span>
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}

              <div className="text-[11px] text-amber-400 font-bold pt-3 pb-0.5 border-t border-slate-800">✝️ 신약 성경 (마태복음 ~ 요한계시록)</div>
              {BIBLE_BOOKS_66.filter(bk => bk.test === "NT").map(book => {
                const count = bibleList.filter(b => matchBibleBook(b, book)).length;
                if (count === 0) return null;
                const isSel = selectedBibleBook === book.ko;
                return (
                  <button
                    key={book.order}
                    onClick={() => setSelectedBibleBook(book.ko)}
                    className={"w-full text-left px-3 py-2 rounded-lg text-xs transition flex justify-between items-center " + (isSel ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold" : "bg-slate-950/60 text-slate-200 hover:bg-slate-800")}
                  >
                    <span className="truncate pr-2">
                      {book.order}. {book.ko} <span className="text-[10px] text-slate-400">({book.en})</span>
                    </span>
                    <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              {/* 1. 네빌 고다드 14권 정규 저서 */}
              <div className="mb-3">
                <div className="text-[11px] text-emerald-400 font-bold mb-1">📖 정규 출간 단행본</div>
                <div className="rounded-lg overflow-hidden border border-emerald-700/60">
                  <button
                    onClick={() => setOpenBooksMenu(!openBooksMenu)}
                    className={"w-full text-left px-3 py-3 text-xs font-bold transition flex justify-between items-center " + (openBooksMenu ? "bg-emerald-500 text-slate-950" : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200")}
                  >
                    <span>📖 네빌 고다드 14권 저서 (1939~1970)</span>
                    <span>{openBooksMenu ? "▲ 접기" : "▼ 펼치기"}</span>
                  </button>

                  {openBooksMenu && (
                    <div className="bg-slate-950 p-2 space-y-1 max-h-80 overflow-y-auto border-t border-emerald-800/50">
                      {BOOKS.map((b) => {
                        const isSelected = selectedLec && selectedLec.isBook && selectedLec.title === b.title;
                        const savedCount = (store[b.title] || []).length;
                        return (
                          <button
                            key={b.bookNum}
                            onClick={() => {
                              setActiveTab("lecture");
                              setSelectedLec({ isBook: true, num: b.bookNum, title: b.title, koTitle: b.koTitle });
                            }}
                            className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" : savedCount > 0 ? "text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-900")}
                          >
                            <div className="truncate pr-2">
                              <div>{b.bookNum}. [{b.year}] {b.title}</div>
                              <div className="text-[10px] text-slate-400 truncate">{b.koTitle}</div>
                            </div>
                            {savedCount > 0 ? (
                              <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold shrink-0">
                                {savedCount}문장
                              </span>
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

              {/* 2. 연도별 8기 강연 분류 */}
              <div className="text-[11px] text-amber-400 font-bold mb-1 pt-2 border-t border-slate-800">
                📅 연도별 8기 강연 아카이브
              </div>

              {ERAS.map(eObj => {
                const isOpen = openEra === eObj.era;
                const subList = loadedLectures.filter(l => l.era === eObj.era);

                return (
                  <div key={eObj.era} className="rounded-lg overflow-hidden border border-slate-800">
                    <button
                      onClick={() => setOpenEra(isOpen ? null : eObj.era)}
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
                        {subList.length === 0 ? (
                          <div className="text-xs text-slate-500 p-3 text-center">
                            등록된 강독 노트가 아직 없습니다.
                          </div>
                        ) : (
                          subList.map((lec, i) => {
                            const isSelected = selectedLec && !selectedLec.isBook && selectedLec.title === lec.title;
                            return (
                              <button
                                key={lec.title}
                                onClick={() => {
                                  setActiveTab("lecture");
                                  setSelectedLec({ isBook: false, title: lec.title });
                                }}
                                className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                              >
                                <div className="truncate pr-2">
                                  <span>{i + 1}. </span>
                                  <span className={"font-semibold mr-1 " + (lec.year ? "text-amber-400" : "text-slate-500")}>
                                    [{lec.year || "?"}]
                                  </span>
                                  <span>{lec.title}</span>
                                </div>
                                <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-bold shrink-0">
                                  {lec.count}문장
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </aside>

      {/* 오른쪽 메인 뷰어 영역 */}
      <main className="print-container flex-1 p-6 max-w-4xl mx-auto w-full">
        {loading ? (
          <div className="bg-white border rounded-xl p-12 text-center text-slate-500 shadow-sm mt-8">
            <div className="text-base font-bold text-slate-700 mb-2">📚 강독 데이터를 불러오는 중입니다...</div>
            <div className="text-xs">잠시만 기다려 주세요.</div>
          </div>
        ) : activeTab === "bible" ? (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b">
              <div>
                <h2 className="text-2xl font-bold">
                  ✝️ 네빌 고다드 성경 인용 아카이브 {selectedBibleBook !== "ALL" ? `— ${selectedBibleBook}` : ""} ({filteredBibleList.length}구절)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  네빌 고다드의 저서 및 강연에서 인용된 성경 구절과 원문(KJV/개역한글)·영적 해설입니다.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={bibleSearch}
                onChange={e => setBibleSearch(e.target.value)}
                placeholder="성경 장절(예: 요한복음, John 14), 영어/한글 문장, 출처 강의명으로 검색..."
                className="w-full px-3.5 py-2 text-xs border rounded-lg bg-white shadow-sm"
              />
            </div>

            {filteredBibleList.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center text-slate-500">
                검색 조건에 맞는 성경 구절이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBibleList.map((b, idx) => {
                  const bId = getBibleItemId(b);
                  const isBookmarked = bookmarkIdSet.has(`bible_${bId}`);
                  const isHighlighted = highlightedBibleId === bId;
                  return (
                    <div
                      key={bId + "_" + idx}
                      id={"bible-card-" + bId}
                      className={
                        "p-5 rounded-xl border shadow-sm space-y-2 transition-all duration-500 " +
                        (isHighlighted
                          ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400"
                          : "bg-white")
                      }
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-2">
                        <span className="text-sm font-bold text-emerald-800">
                          #{idx + 1}. 📖 {b.refKo || b.ref} ({b.ref})
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => toggleBibleBookmark(b)}
                            className={
                              "px-2.5 py-1 rounded text-xs font-bold transition " +
                              (isBookmarked
                                ? "bg-sky-500 text-white hover:bg-sky-600"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                            }
                          >
                            {isBookmarked ? "★ 저장됨" : "☆ 책갈피"}
                          </button>
                          <button
                            onClick={() => speak(b.en)}
                            className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold hover:bg-amber-200"
                          >
                            🔊 인용문 발음
                          </button>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold">
                            출처: {b.sourceTitle} (문장 #{b.sentenceNo})
                          </span>
                        </div>
                      </div>
                      <p style={{ fontFamily: "Georgia, serif", fontSize: "13.5pt" }} className="text-slate-900">{b.en}</p>
                      <p className="text-sm text-slate-700 bg-stone-50 p-2.5 rounded border-l-4 border-stone-700">{b.ko}</p>
                      {b.kjv && (
                        <div className="text-xs text-slate-700 bg-emerald-50/70 p-3 rounded border border-emerald-200 space-y-1">
                          <div><b>[KJV 성경 원문]</b> {b.kjv}</div>
                          {b.krv && <div><b>[한국어 성경 원문]</b> {b.krv}</div>}
                        </div>
                      )}
                      {b.nevilleContext && (
                        <div className="text-xs text-amber-950 bg-amber-50 p-3 rounded border border-amber-200">
                          <b>💡 네빌 고다드 영적 해설:</b> {b.nevilleContext}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : !selectedLec ? (
          <div className="bg-white border rounded-xl p-12 text-center text-slate-500 shadow-sm mt-8">
            <div className="text-base font-bold text-slate-700 mb-2">왼쪽 메뉴에서 저서나 강연을 선택해 주세요.</div>
            <div className="text-xs">문장별 원문, 한국어 번역, 핵심 어휘 및 구문 해설을 확인하실 수 있습니다.</div>
          </div>
        ) : (
          <div>
            {/* 제목 및 뷰어 컨트롤 바 */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
              <div>
                {selectedLec.isBook ? (
                  <div className="text-xs font-bold text-emerald-700 mb-1">
                    📖 NEVILLE GODDARD BOOK #{String(selectedLec.num).padStart(2, "0")} {selectedLec.koTitle ? "— " + selectedLec.koTitle : ""}
                  </div>
                ) : (
                  <div className="text-xs font-bold text-amber-700 mb-1">
                    📅 제{currentEraNum}기 강연 [{lectureYears[selectedLec.title] || "?"}]
                  </div>
                )}
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
                  {selectedLec.isBook
                    ? "Book " + selectedLec.num + ". " + selectedLec.title
                    : "[" + (lectureYears[selectedLec.title] || "?") + "] " + selectedLec.title}
                </h2>
              </div>

              <div className="no-print flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={sentences.length === 0}
                  className="px-3.5 py-2 rounded bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shadow-sm"
                >
                  📄 PDF 다운로드
                </button>
                <button
                  onClick={() => setQuizMode(!quizMode)}
                  disabled={sentences.length === 0}
                  className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold"
                >
                  {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기"}
                </button>
              </div>
            </div>

            {/* 문장 카드 리스트 */}
            {sentences.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center text-slate-500">
                <div className="text-base font-bold text-slate-700 mb-2">아직 공개된 강독 노트가 없습니다.</div>
                <div className="text-xs">왼쪽 목록에서 문장 수가 표시된 다른 저서나 강연을 선택해 주세요.</div>
              </div>
            ) : (
              <div className="space-y-6">
                {sentences.map((s, idx) => {
                  const isBookmarked = bookmarkIdSet.has(`${selectedLec.title}_${idx}`);
                  const isHighlighted = highlightedIdx === idx;
                  return (
                    <div
                      key={idx}
                      id={"sentence-" + idx}
                      className={
                        "print-card p-6 rounded-xl border shadow-sm transition-all duration-500 " +
                        (isHighlighted
                          ? "bg-amber-50/70 border-amber-400 ring-2 ring-amber-400"
                          : "bg-white")
                      }
                    >
                      <div className="flex justify-between items-center mb-2 border-b pb-2 gap-2">
                        <span style={{ fontFamily: "Georgia, serif", fontSize: "17pt", color: "#292929" }} className="font-bold">
                          Sentence {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="no-print flex items-center gap-1.5">
                          <button
                            onClick={() => toggleBookmark(idx, s)}
                            className={
                              "px-2.5 py-1 rounded text-xs font-bold transition " +
                              (isBookmarked
                                ? "bg-sky-500 text-white hover:bg-sky-600"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                            }
                          >
                            {isBookmarked ? "★ 저장됨" : "☆ 책갈피"}
                          </button>
                          <button
                            onClick={() => speak(s.en)}
                            className="px-3 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold hover:bg-amber-200"
                          >
                            🔊 발음 듣기
                          </button>
                        </div>
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
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ViewerApp />);