const { useState, useEffect, useMemo } = React;

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

// 3. 성경 66권 마스터 목록 (사이드바 메뉴 및 getbible.net API 번호 호환)
const BIBLE_BOOKS_META = [
  { order: 1, en: "Genesis", ko: "창세기" },
  { order: 2, en: "Exodus", ko: "출애굽기" },
  { order: 3, en: "Leviticus", ko: "레위기" },
  { order: 4, en: "Numbers", ko: "민수기" },
  { order: 5, en: "Deuteronomy", ko: "신명기" },
  { order: 6, en: "Joshua", ko: "여호수아" },
  { order: 7, en: "Judges", ko: "사사기" },
  { order: 8, en: "Ruth", ko: "룻기" },
  { order: 9, en: "1 Samuel", ko: "사무엘상" },
  { order: 10, en: "2 Samuel", ko: "사무엘하" },
  { order: 11, en: "1 Kings", ko: "열왕기상" },
  { order: 12, en: "2 Kings", ko: "열왕기하" },
  { order: 13, en: "1 Chronicles", ko: "역대상" },
  { order: 14, en: "2 Chronicles", ko: "역대하" },
  { order: 15, en: "Ezra", ko: "에스라" },
  { order: 16, en: "Nehemiah", ko: "느헤미야" },
  { order: 17, en: "Esther", ko: "에스더" },
  { order: 18, en: "Job", ko: "욥기" },
  { order: 19, en: "Psalms", ko: "시편" },
  { order: 20, en: "Proverbs", ko: "잠언" },
  { order: 21, en: "Ecclesiastes", ko: "전도서" },
  { order: 22, en: "Song of Solomon", ko: "아가" },
  { order: 23, en: "Isaiah", ko: "이사야" },
  { order: 24, en: "Jeremiah", ko: "예레미야" },
  { order: 25, en: "Lamentations", ko: "예레미야애가" },
  { order: 26, en: "Ezekiel", ko: "에스겔" },
  { order: 27, en: "Daniel", ko: "다니엘" },
  { order: 28, en: "Hosea", ko: "호세아" },
  { order: 29, en: "Joel", ko: "요엘" },
  { order: 30, en: "Amos", ko: "아모스" },
  { order: 31, en: "Obadiah", ko: "오바댜" },
  { order: 32, en: "Jonah", ko: "요나" },
  { order: 33, en: "Micah", ko: "미가" },
  { order: 34, en: "Nahum", ko: "나훔" },
  { order: 35, en: "Habakkuk", ko: "하박국" },
  { order: 36, en: "Zephaniah", ko: "스바냐" },
  { order: 37, en: "Haggai", ko: "학개" },
  { order: 38, en: "Zechariah", ko: "스가랴" },
  { order: 39, en: "Malachi", ko: "말라기" },
  { order: 40, en: "Matthew", ko: "마태복음" },
  { order: 41, en: "Mark", ko: "마가복음" },
  { order: 42, en: "Luke", ko: "누가복음" },
  { order: 43, en: "John", ko: "요한복음" },
  { order: 44, en: "Acts", ko: "사도행전" },
  { order: 45, en: "Romans", ko: "로마서" },
  { order: 46, en: "1 Corinthians", ko: "고린도전서" },
  { order: 47, en: "2 Corinthians", ko: "고린도후서" },
  { order: 48, en: "Galatians", ko: "갈라디아서" },
  { order: 49, en: "Ephesians", ko: "에베소서" },
  { order: 50, en: "Philippians", ko: "빌립보서" },
  { order: 51, en: "Colossians", ko: "골로새서" },
  { order: 52, en: "1 Thessalonians", ko: "데살로니가전서" },
  { order: 53, en: "2 Thessalonians", ko: "데살로니가후서" },
  { order: 54, en: "1 Timothy", ko: "디모데전서" },
  { order: 55, en: "2 Timothy", ko: "디모데후서" },
  { order: 56, en: "Titus", ko: "디도서" },
  { order: 57, en: "Philemon", ko: "빌레몬서" },
  { order: 58, en: "Hebrews", ko: "히브리서" },
  { order: 59, en: "James", ko: "야고보서" },
  { order: 60, en: "1 Peter", ko: "베드로전서" },
  { order: 61, en: "2 Peter", ko: "베드로후서" },
  { order: 62, en: "1 John", ko: "요한일서" },
  { order: 63, en: "2 John", ko: "요한이서" },
  { order: 64, en: "3 John", ko: "요한삼서" },
  { order: 65, en: "Jude", ko: "유다서" },
  { order: 66, en: "Revelation", ko: "요한계시록" }
];

const BIBLE_BOOK_ORDER = {
  "genesis": 1, "창세기": 1, "창": 1,
  "exodus": 2, "출애굽기": 2, "출": 2,
  "leviticus": 3, "레위기": 3, "레": 3,
  "numbers": 4, "민수기": 4, "민": 4,
  "deuteronomy": 5, "신명기": 5, "신": 5,
  "joshua": 6, "여호수아": 6, "수": 6,
  "judges": 7, "사사기": 7, "삿": 7,
  "ruth": 8, "룻기": 8, "룻": 8,
  "1 samuel": 9, "1samuel": 9, "사무엘상": 9, "삼상": 9,
  "2 samuel": 10, "2samuel": 10, "사무엘하": 10, "삼하": 10,
  "1 kings": 11, "1kings": 11, "열왕기상": 11, "왕상": 11,
  "2 kings": 12, "2kings": 12, "열왕기하": 12, "왕하": 12,
  "1 chronicles": 13, "1chronicles": 13, "역대상": 13, "대상": 13,
  "2 chronicles": 14, "2chronicles": 14, "역대하": 14, "대하": 14,
  "ezra": 15, "에스라": 15, "스": 15,
  "nehemiah": 16, "느헤미야": 16, "느": 16,
  "esther": 17, "에스더": 17, "에": 17,
  "job": 18, "욥기": 18, "욥": 18,
  "psalms": 19, "psalm": 19, "시편": 19, "시": 19,
  "proverbs": 20, "잠언": 20, "잠": 20,
  "ecclesiastes": 21, "전도서": 21, "전": 21,
  "song of solomon": 22, "song of songs": 22, "canticles": 22, "아가": 22, "아": 22,
  "isaiah": 23, "이사야": 23, "사": 23,
  "jeremiah": 24, "예레미야": 24, "렘": 24,
  "lamentations": 25, "예레미야애가": 25, "애": 25,
  "ezekiel": 26, "에스겔": 26, "겔": 26,
  "daniel": 27, "다니엘": 27, "단": 27,
  "hosea": 28, "호세아": 28, "호": 28,
  "joel": 29, "요엘": 29, "욜": 29,
  "amos": 30, "아모스": 30, "암": 30,
  "obadiah": 31, "오바댜": 31, "옵": 31,
  "jonah": 32, "요나": 32, "욘": 32,
  "micah": 33, "미가": 33, "미": 33,
  "nahum": 34, "나훔": 34, "나": 34,
  "habakkuk": 35, "하박국": 35, "합": 35,
  "zephaniah": 36, "스바냐": 36, "습": 36,
  "haggai": 37, "학개": 37, "학": 37,
  "zechariah": 38, "스가랴": 38, "슥": 38,
  "malachi": 39, "말라기": 39, "말": 39,
  "matthew": 40, "마태복음": 40, "마": 40,
  "mark": 41, "마가복음": 41, "막": 41,
  "luke": 42, "누가복음": 42, "눅": 42,
  "john": 43, "요한복음": 43, "요": 43,
  "acts": 44, "사도행전": 44, "행": 44,
  "romans": 45, "로마서": 45, "롬": 45,
  "1 corinthians": 46, "1corinthians": 46, "고린도전서": 46, "고전": 46,
  "2 corinthians": 47, "2corinthians": 47, "고린도후서": 47, "고후": 47,
  "galatians": 48, "갈라디아서": 48, "갈": 48,
  "ephesians": 49, "에베소서": 49, "엡": 49,
  "philippians": 50, "빌립보서": 50, "빌": 50,
  "colossians": 51, "골로새서": 51, "골": 51,
  "1 thessalonians": 52, "1thessalonians": 52, "데살로니가전서": 52, "살전": 52,
  "2 thessalonians": 53, "2thessalonians": 53, "데살로니가후서": 53, "살후": 53,
  "1 timothy": 54, "1timothy": 54, "디모데전서": 54, "딤전": 54,
  "2 timothy": 55, "2timothy": 55, "디모데후서": 55, "딤후": 55,
  "titus": 56, "디도서": 56, "딛": 56,
  "philemon": 57, "빌레몬서": 57, "몬": 57,
  "hebrews": 58, "히브리서": 58, "히": 58,
  "james": 59, "야고보서": 59, "약": 59,
  "1 peter": 60, "1peter": 60, "베드로전서": 60, "벧전": 60,
  "2 peter": 61, "2peter": 61, "베드로후서": 61, "벧후": 61,
  "1 john": 62, "1john": 62, "요한일서": 62, "요일": 62,
  "2 john": 63, "2john": 63, "요한이서": 63, "요이": 63,
  "3 john": 64, "3john": 64, "요한삼서": 64, "요삼": 64,
  "jude": 65, "유다서": 65, "유": 65,
  "revelation": 66, "revelations": 66, "요한계시록": 66, "계": 66
};

const INDEX_URLS = [
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5",
  "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6"
];

const KNOWN_YEARS = {
  "Consciousness Is the Only Reality": 1948,
  "No One to Change But Self": 1948,
  "Assumptions Harden Into Fact": 1948,
  "Thinking Fourth Dimensionally": 1948,
  "Remain Faithful to Your Idea": 1948,
  "At Your Command": 1948,
  "Arise": 1951,
  "Changing The Feeling of I": 1953,
  "Changing the Feeling of I": 1953,
  "Fundamentals": 1953,
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const normalizeStr = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const extractLectureYear = (text, title) => {
  const sample = (title || "") + " " + (text || "").slice(0, 800);
  const fourDigit = sample.match(/\b(19[3-6]\d|197[0-2])\b/);
  if (fourDigit) return parseInt(fourDigit[1], 10);

  const twoDigit = sample.match(/\b\d{1,2}[-/]\d{1,2}[-/]([4-6]\d|7[0-2])\b/);
  if (twoDigit) return 1900 + parseInt(twoDigit[1], 10);

  return null;
};

const getEraForLecture = (lec, yearMap) => {
  const y = (yearMap && yearMap[lec.title]) || KNOWN_YEARS[lec.title] || lec.year;
  if (y) {
    const found = ERAS.find(e => y >= e.startYear && y <= e.endYear);
    if (found) return found.era;
  }
  return (((lec.num || 1) - 1) % 8) + 1;
};

// 성경 구절의 책 번호(1~66), 장(chapter), 절 배열(verses: 예 [9, 10]) 정밀 파싱
const parseBibleRefDetails = (item) => {
  let bookOrder = item.bookOrder && item.bookOrder >= 1 && item.bookOrder <= 66 ? Number(item.bookOrder) : null;
  if (!bookOrder) {
    const k1 = (item.bookNameEn || "").toLowerCase().trim();
    const k2 = (item.bookNameKo || "").toLowerCase().trim();
    bookOrder = BIBLE_BOOK_ORDER[k1] || BIBLE_BOOK_ORDER[k2] || null;
  }

  let chap = Number(item.chapter) || 1;
  let verses = [];

  const refStr = (item.ref || item.refKo || "").trim();
  const match = refStr.match(/^([1-3]?\s*[A-Za-z가-힣\s]+?)\s*(\d+)\s*:\s*([\d,\s-]+)/);
  if (match) {
    if (!bookOrder) {
      const parsedBook = match[1].toLowerCase().trim();
      bookOrder = BIBLE_BOOK_ORDER[parsedBook] || 99;
    }
    chap = parseInt(match[2], 10) || chap;
    const vPart = match[3].trim();
    const parts = vPart.split(",");
    parts.forEach(p => {
      const range = p.trim().split("-");
      if (range.length === 2) {
        const s = parseInt(range[0], 10);
        const e = parseInt(range[1], 10);
        if (!isNaN(s) && !isNaN(e) && e >= s && e - s <= 30) {
          for (let v = s; v <= e; v++) verses.push(v);
        }
      } else {
        const vNum = parseInt(p.trim(), 10);
        if (!isNaN(vNum)) verses.push(vNum);
      }
    });
  }

  if (!bookOrder) bookOrder = 99;
  if (verses.length === 0) {
    verses = [Number(item.verse) || 1];
  }
  return { bookOrder, chapter: chap, verses };
};

// ★ 성경 장·절 고유 키 생성 (예: 창세기 1:26 -> "1_1_26", 출애굽기 3:14 -> "2_3_14")
const getVerseUniqueKey = (item) => {
  const { bookOrder, chapter, verses } = parseBibleRefDetails(item);
  return `${bookOrder}_${chapter}_${verses[0] || 1}`;
};

// ★ 기존 bibleList에 이미 있는 장·절은 자동으로 Pass하고, 새로운 장·절만 추가하는 함수
const appendOnlyNewBibleVerses = (prevList, newItems) => {
  const existingVerseKeys = new Set(prevList.map(item => getVerseUniqueKey(item)));
  const added = [];

  newItems.forEach(item => {
    const vKey = getVerseUniqueKey(item);
    // 이미 존재하는 장·절이면 Pass! (없는 장·절만 추가)
    if (!existingVerseKeys.has(vKey)) {
      existingVerseKeys.add(vKey); // 같은 강의 내 중복 인용도 첫 번째만 등록하고 뒤는 Pass
      added.push(item);
    }
  });

  return added.length > 0 ? prevList.concat(added) : prevList;
};

const getBibleSortWeight = (item) => {
  const { bookOrder, chapter, verses } = parseBibleRefDetails(item);
  return bookOrder * 1000000 + chapter * 1000 + (verses[0] || 1);
};

const safeParseJSON = (rawStr) => {
  if (!rawStr) return null;
  let text = rawStr.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(text);
  } catch (e1) {
    const firstBrace = text.indexOf("{");
    const firstBracket = text.indexOf("[");
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      let cutText = text.slice(firstBracket);
      let searchPos = cutText.length;
      while (searchPos > 0) {
        const lastBrace = cutText.lastIndexOf("}", searchPos - 1);
        if (lastBrace === -1) break;
        const candidate = cutText.slice(0, lastBrace + 1) + "]";
        try {
          return JSON.parse(candidate);
        } catch (e2) {}
        searchPos = lastBrace;
      }
    }
    throw e1;
  }
};

// 무료 공개 한국어 성경 API 메모리 캐시 (한 번 불러온 장은 0초 만에 즉시 표시)
const koreanChapterCache = {};

// ★ 개별 성경 구절 카드 컴포넌트: 한국어 성경 한 절(또는 여러 절) 전체 표시 + 앞뒤 절 이동 + 장 전체 보기
function BibleQuoteCard({ item, idx, speak }) {
  const parsed = useMemo(() => parseBibleRefDetails(item), [item]);
  const bookMeta = BIBLE_BOOKS_META.find(b => b.order === parsed.bookOrder);
  const bookKoName = bookMeta ? bookMeta.ko : (item.bookNameKo || item.bookNameEn || "성경");

  const [chapterVerses, setChapterVerses] = useState(null);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [currentVerses, setCurrentVerses] = useState(parsed.verses);
  const [showFullChapter, setShowFullChapter] = useState(false);

  useEffect(() => {
    setCurrentVerses(parsed.verses);
  }, [item]);

  // 카드가 화면에 나타나면 해당 장의 한국어 성경 전체 절을 자동으로 가져옴 (방법 A)
  useEffect(() => {
    if (!parsed.bookOrder || parsed.bookOrder > 66) return;
    const cacheKey = `${parsed.bookOrder}_${parsed.chapter}`;
    if (koreanChapterCache[cacheKey]) {
      setChapterVerses(koreanChapterCache[cacheKey]);
      return;
    }

    let isMounted = true;
    setLoadingChapter(true);
    fetch(`https://api.getbible.net/v2/korean/${parsed.bookOrder}/${parsed.chapter}.json`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.verses)) {
          const map = {};
          data.verses.forEach(v => {
            map[Number(v.verse)] = (v.text || "").trim();
          });
          koreanChapterCache[cacheKey] = map;
          if (isMounted) setChapterVerses(map);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingChapter(false);
      });

    return () => {
      isMounted = false;
    };
  }, [parsed.bookOrder, parsed.chapter]);

  const maxVerseInChapter = useMemo(() => {
    if (!chapterVerses) return 999;
    const nums = Object.keys(chapterVerses).map(Number);
    return nums.length > 0 ? Math.max(...nums) : 999;
  }, [chapterVerses]);

  const firstV = currentVerses[0] || 1;
  const lastV = currentVerses[currentVerses.length - 1] || firstV;

  const handlePrevVerse = () => {
    if (firstV > 1) {
      setCurrentVerses([firstV - 1]);
    }
  };

  const handleNextVerse = () => {
    if (lastV < maxVerseInChapter) {
      setCurrentVerses([lastV + 1]);
    }
  };

  const handleResetOriginalVerse = () => {
    setCurrentVerses(parsed.verses);
  };

  const verseLabel = currentVerses.length > 1
    ? `${bookKoName} ${parsed.chapter}:${currentVerses[0]}-${currentVerses[currentVerses.length - 1]}`
    : `${bookKoName} ${parsed.chapter}:${currentVerses[0]}`;

  const isViewingOriginal =
    currentVerses.length === parsed.verses.length &&
    currentVerses[0] === parsed.verses[0];

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-2.5">
        <span className="text-sm font-bold text-emerald-800">
          #{idx + 1}. 📖 {item.refKo || item.ref} ({item.ref})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => speak(item.en)}
            className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold hover:bg-amber-200"
          >
            🔊 인용문 발음
          </button>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold">
            출처: {item.sourceTitle} (문장 #{item.sentenceNo})
          </span>
        </div>
      </div>

      {/* 네빌 고다드 강의 내 영어/한글 문장 */}
      <p style={{ fontFamily: "Georgia, serif", fontSize: "13.5pt" }} className="text-slate-900">
        {item.en}
      </p>
      <p className="text-sm text-slate-700 bg-stone-50 p-2.5 rounded border-l-4 border-stone-700">
        {item.ko}
      </p>

      {/* ★ 한국어 성경 원문 전체 표시 + 앞뒤 절 이동 + 장 전체 보기 (KJV 원문 제거됨) */}
      <div className="text-xs text-slate-800 bg-emerald-50/80 p-3.5 rounded-lg border border-emerald-200 space-y-2.5">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-emerald-200/70 pb-2">
          <div className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
            <span>📜 [한국어 성경 원문 전체]</span>
            <span className="bg-emerald-700 text-white px-2 py-0.5 rounded text-[11px]">
              {verseLabel}
            </span>
            {!isViewingOriginal && (
              <button
                onClick={handleResetOriginalVerse}
                className="text-[11px] text-emerald-800 underline ml-1 font-semibold"
              >
                (원래 인용절 {parsed.chapter}:{parsed.verses.join(",")}로 복귀)
              </button>
            )}
          </div>

          {/* 절 앞뒤 넘기기 & 장 전체 보기 버튼 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handlePrevVerse}
              disabled={firstV <= 1}
              className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-900 font-bold hover:bg-emerald-100 disabled:opacity-40"
            >
              ◀ 이전 절 ({parsed.chapter}:{Math.max(1, firstV - 1)})
            </button>
            <button
              onClick={handleNextVerse}
              disabled={lastV >= maxVerseInChapter}
              className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-900 font-bold hover:bg-emerald-100 disabled:opacity-40"
            >
              다음 절 ({parsed.chapter}:{lastV + 1}) ▶
            </button>
            <button
              onClick={() => setShowFullChapter(!showFullChapter)}
              className={"px-2.5 py-1 rounded font-bold transition " + (showFullChapter ? "bg-emerald-800 text-white" : "bg-emerald-200/80 text-emerald-950 hover:bg-emerald-300")}
            >
              {showFullChapter ? `▲ ${bookKoName} ${parsed.chapter}장 접기` : `📖 ${bookKoName} ${parsed.chapter}장 전체 보기 ▼`}
            </button>
          </div>
        </div>

        {/* 해당 절(예: 사무엘상 3:9 또는 3:9,10)의 한국어 성경 전체 원문 표시 */}
        <div className="space-y-1.5 leading-relaxed text-[13px] text-slate-900">
          {loadingChapter ? (
            <div className="text-emerald-800 py-1">⏳ 한국어 성경 원문 전체를 불러오는 중...</div>
          ) : chapterVerses ? (
            currentVerses.map(vNum => (
              <div key={vNum} className="p-2 rounded bg-white/90 border border-emerald-100">
                <b className="text-emerald-800 mr-1.5">[{parsed.chapter}:{vNum}]</b>
                <span>{chapterVerses[vNum] || item.krv || "해당 절 원문을 찾을 수 없습니다."}</span>
              </div>
            ))
          ) : (
            <div className="p-2 rounded bg-white/90 border border-emerald-100">
              {item.krv || "성경 원문 데이터가 없습니다."}
            </div>
          )}
        </div>

        {/* [📖 장 전체 보기] 펼침창 (인용된 절 노란색 형광펜 하이라이트) */}
        {showFullChapter && chapterVerses && (
          <div className="mt-2 pt-2.5 border-t border-emerald-300/80 bg-white p-3 rounded-lg max-h-80 overflow-y-auto space-y-1.5">
            <div className="text-xs font-bold text-emerald-900 mb-2 sticky top-0 bg-white pb-1 border-b">
              📖 {bookKoName} {parsed.chapter}장 전체 원문 (노란색 표시: 네빌 인용 절)
            </div>
            {Object.keys(chapterVerses)
              .map(Number)
              .sort((a, b) => a - b)
              .map(vNum => {
                const isQuoted = parsed.verses.includes(vNum);
                const isCurrent = currentVerses.includes(vNum);
                return (
                  <div
                    key={vNum}
                    onClick={() => setCurrentVerses([vNum])}
                    className={
                      "px-2.5 py-1.5 rounded text-xs leading-relaxed cursor-pointer transition " +
                      (isQuoted
                        ? "bg-amber-100 border border-amber-300 font-bold text-slate-950"
                        : isCurrent
                        ? "bg-emerald-50 border border-emerald-200 font-semibold"
                        : "hover:bg-stone-50 text-slate-700")
                    }
                  >
                    <span className="text-emerald-800 font-bold mr-1.5">{parsed.chapter}:{vNum}</span>
                    <span>{chapterVerses[vNum]}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {item.nevilleContext && (
        <div className="text-xs text-amber-950 bg-amber-50 p-3 rounded border border-amber-200">
          <b>💡 네빌 고다드 영적 해설:</b> {item.nevilleContext}
        </div>
      )}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("lecture");
  const [openBooksMenu, setOpenBooksMenu] = useState(false);
  const [openEra, setOpenEra] = useState(1);

  // 성경 탭 전용 사이드바 상태 (BIBLE_BOOK_ORDER 1~66권 메뉴)
  const [openBibleBookOrder, setOpenBibleBookOrder] = useState(null);
  const [selectedBibleBookOrder, setSelectedBibleBookOrder] = useState("all");
  const [selectedBibleItemId, setSelectedBibleItemId] = useState(null);

  const [loadingLectures, setLoadingLectures] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState({});
  const [bibleSearch, setBibleSearch] = useState("");

  const [allLectures, setAllLectures] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_all_lectures_294");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

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
    eraOrderNum: 1,
    title: "At Your Command",
    url: "https://www.neville-goddard.com/neville-goddard-lectures/at-your-command-neville-goddard-lecture/"
  });
  const [targetUrl, setTargetUrl] = useState("https://www.neville-goddard.com/neville-goddard-lectures/at-your-command-neville-goddard-lecture/");
  const [rawText, setRawText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [quizMode, setQuizMode] = useState(false);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");

  const [store, setStore] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_vol_accordion_store");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [bibleList, setBibleList] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_bible_store");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
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
        if (fileName === "bible.json" && Array.isArray(data)) {
          setBibleList(prev => appendOnlyNewBibleVerses(data, prev));
        } else {
          mergePublicDataToStore(data, fallbackTitle);
        }
        setLoadedFiles(prev => Object.assign({}, prev, { [fileName]: true }));
      }
    } catch (e) {}
  };

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
      if (combined.length > 0) setAllLectures(combined);
    } catch (e) {
    } finally {
      setLoadingLectures(false);
    }
  };

  useEffect(() => {
    loadJsonFile("bible.json", null);
    loadJsonFile("neville_data.json", null);
    for (let i = 1; i <= 8; i++) loadJsonFile("era" + i + ".json", null);
    for (let v = 1; v <= 6; v++) loadJsonFile("vol" + v + ".json", null);
    BOOKS.forEach(b => loadJsonFile("book" + b.bookNum + ".json", b.title));
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

  useEffect(() => {
    try { localStorage.setItem("neville_bible_store", JSON.stringify(bibleList)); } catch (e) {}
  }, [bibleList]);

  // ★ 각 기수(Era 1~8)의 강의를 오래된 연도순(오름차순)으로 정렬하고 기수별 번호(1, 2, 3...)를 매기는 함수
  const getSortedEraLectures = (eraNum) => {
    const rawList = allLectures.filter(l => getEraForLecture(l, lectureYears) === eraNum);
    const sorted = [...rawList].sort((a, b) => {
      const yA = lectureYears[a.title] || KNOWN_YEARS[a.title] || a.year || 9999;
      const yB = lectureYears[b.title] || KNOWN_YEARS[b.title] || b.year || 9999;
      if (yA !== yB) return yA - yB; // 오래된 연도가 먼저 오도록 오름차순 정렬
      return (a.title || "").localeCompare(b.title || "");
    });
    return sorted.map((lec, idx) => ({
      ...lec,
      eraOrderNum: idx + 1 // 각 기수 안에서 1번부터 다시 번호 부여!
    }));
  };

  // BIBLE_BOOK_ORDER 기준 전체 정렬 및 성경책별 분류
  const sortedAllBible = useMemo(() => {
    return [...bibleList].sort((a, b) => getBibleSortWeight(a) - getBibleSortWeight(b));
  }, [bibleList]);

  const bibleByBookMap = useMemo(() => {
    const map = {};
    sortedAllBible.forEach(item => {
      const { bookOrder } = parseBibleRefDetails(item);
      if (!map[bookOrder]) map[bookOrder] = [];
      map[bookOrder].push(item);
    });
    return map;
  }, [sortedAllBible]);

  const displayedBibleItems = useMemo(() => {
    let base = sortedAllBible;
    if (selectedBibleBookOrder !== "all") {
      base = bibleByBookMap[selectedBibleBookOrder] || [];
    }
    if (selectedBibleItemId) {
      const found = base.filter(x => (x.id || `${x.sourceTitle}_${x.sentenceNo}_${x.ref}`) === selectedBibleItemId);
      if (found.length > 0) base = found;
    }
    const q = bibleSearch.trim().toLowerCase();
    if (!q) return base;
    return base.filter(b =>
      (b.ref || "").toLowerCase().includes(q) ||
      (b.refKo || "").toLowerCase().includes(q) ||
      (b.en || "").toLowerCase().includes(q) ||
      (b.ko || "").toLowerCase().includes(q) ||
      (b.sourceTitle || "").toLowerCase().includes(q)
    );
  }, [sortedAllBible, bibleByBookMap, selectedBibleBookOrder, selectedBibleItemId, bibleSearch]);

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
    loadJsonFile("era" + eraObj.era + ".json", null);
    if (allLectures.length === 0) fetchAll294Lectures();
  };

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  const currentEraNum = selectedLec.isBook
    ? 1
    : openEra || getEraForLecture(selectedLec, lectureYears);

  // 현재 선택된 강의의 해당 기수 내 순번(1번~N번) 계산
  const currentLectureDisplayNum = useMemo(() => {
    if (selectedLec.isBook) return selectedLec.num;
    const list = getSortedEraLectures(currentEraNum);
    const found = list.find(x => x.title === selectedLec.title);
    return found ? found.eraOrderNum : (selectedLec.eraOrderNum || 1);
  }, [selectedLec, currentEraNum, allLectures, lectureYears]);

  const handleFetchLectureBody = async (urlToFetch, titleToSet, isBookItem) => {
    const finalUrl = (urlToFetch || targetUrl).trim();
    const targetTitle = titleToSet || selectedLec.title;
    if (!finalUrl) return;

    setFetching(true);
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

      if (!isBookItem) {
        const detectedYear = extractLectureYear(cleanBody, targetTitle);
        if (detectedYear) {
          setLectureYears(prev => Object.assign({}, prev, { [targetTitle]: detectedYear }));
          const matchedEra = getEraForLecture({ title: targetTitle, year: detectedYear }, { [targetTitle]: detectedYear });
          setOpenEra(matchedEra);
          setStatusMsg("✅ 원문 추출 완료! (본문에서 [" + detectedYear + "] 감지 ➔ 제" + matchedEra + "기로 자동 분류됨)");
        } else {
          setStatusMsg("✅ 원문 추출 완료! 이제 [⚡ 2. 강독 노트 + 성경구문 생성]을 눌러주세요.");
        }
      } else {
        setStatusMsg("✅ 단행본 원문 추출 완료! [⚡ 2. 강독 노트 + 성경구문 생성]을 눌러주세요.");
      }

      setRawText(cleanBody.trim());
    } catch (err) {
      setStatusMsg("❌ 원문 가져오기 실패: " + err.message);
    } finally {
      setFetching(false);
    }
  };

  // ★ high demand 과부하 멈춤 방지를 위해 무료 등급 친화 모델 순환 + 8초 자동 대기 재시도 적용
  const callGeminiWithFallback = async (promptText, chunkIndex, totalChunks, currentCount) => {
      const models = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash"];
    let lastError = null;

    for (let m = 0; m < models.length; m++) {
      const modelName = models[m];
      for (let attempt = 1; attempt <= 3; attempt++) {
        setStatusMsg(
          `⏳ AI 분석 중 (${modelName}, 시도 ${attempt}/3) [${chunkIndex + 1}/${totalChunks} 구간] ... (현재 ${currentCount}문장 완료)`
        );
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.2
                }
              })
            }
          );

          const data = await res.json();
          if (data.error) {
            lastError = new Error(data.error.message);
            setStatusMsg(`⏸️ 서버 혼잡 대기 중... 8초 후 자동 재시도합니다 (${modelName})`);
            await sleep(8000);
            continue;
          }

          const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
          const parsed = safeParseJSON(outputText);
          if (parsed) return parsed;
        } catch (err) {
          lastError = err;
          await sleep(6000);
        }
      }
    }
    throw lastError || new Error("모든 AI 모델 호출에 실패했습니다.");
  };

  const handleAnalyze = async (forceFromStart = false) => {
    if (!apiKey.trim()) {
      alert("상단 노란색 입력칸에 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }
    if (!rawText.trim()) {
      alert("먼저 왼쪽 목록에서 강의를 클릭해 원문을 불러와 주세요.");
      return;
    }

    setAnalyzing(true);
    try {
      const existingSentences = forceFromStart ? [] : (Array.isArray(store[selectedLec.title]) ? store[selectedLec.title] : []);
      let textToProcess = rawText.trim();

      if (existingSentences.length > 0) {
        let matchedEndPos = -1;
        for (let k = existingSentences.length - 1; k >= Math.max(0, existingSentences.length - 15); k--) {
          const lastEn = (existingSentences[k]?.en || "").trim();
          if (lastEn.length < 10) continue;

          const snippet = lastEn.slice(-35);
          const idx = textToProcess.lastIndexOf(snippet);
          if (idx !== -1) {
            matchedEndPos = idx + snippet.length;
            break;
          }
          const headSnippet = lastEn.slice(0, 35);
          const idx2 = textToProcess.lastIndexOf(headSnippet);
          if (idx2 !== -1) {
            matchedEndPos = idx2 + lastEn.length;
            break;
          }
        }

        if (matchedEndPos !== -1 && matchedEndPos < textToProcess.length - 30) {
          textToProcess = textToProcess.slice(matchedEndPos).trim();
          textToProcess = textToProcess.replace(/^[^A-Za-z0-9"“'‘\[]+/, "").trim();
        } else if (matchedEndPos >= textToProcess.length - 30) {
          setStatusMsg(`🎉 이미 마지막 문장(${existingSentences.length}문장)까지 모두 분석이 완료된 강의입니다!`);
          setAnalyzing(false);
          return;
        }
      }

      const paragraphs = textToProcess.split(/\n\s*\n/);
      const chunks = [];
      let currentChunk = "";

      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i].trim();
        if (!p) continue;
        if ((currentChunk + "\n\n" + p).length > 1400 && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = p;
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + p;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());

      if (chunks.length === 0) {
        setStatusMsg("✅ 추가로 분석할 남은 본문이 없습니다.");
        setAnalyzing(false);
        return;
      }

      let accumulated = [...existingSentences];
      if (forceFromStart) {
        setStore(prev => Object.assign({}, prev, { [selectedLec.title]: [] }));
      }

      const sourceLabel = selectedLec.isBook
        ? `Book ${selectedLec.num}. ${selectedLec.title}`
        : selectedLec.title;

      for (let i = 0; i < chunks.length; i++) {
        const prompt = [
          "당신은 네빌 고다드(Neville Goddard) 전문 번역가이자 성경 신비주의 강독 전문가입니다.",
          "아래 영어 본문의 문장을 단 한 문장도 빠뜨리지 말고 순서대로 100% 분리하여 JSON으로 반환하세요.",
          "규칙:",
          "1. sentences 배열: 각 문장마다 en(영어 원문), ko(한국어 번역), vocab(핵심 어휘 배열 [{word, mean}]), grammar(구문 및 네빌 사상 해설 배열 [{tag, desc}])를 작성하세요.",
          "2. bibleQuotes 배열: 해당 문장에 성경 구절 직·간접 인용이 있다면 추출하여 [{sentenceOffset(0부터 시작), bookNameEn, bookNameKo, chapter(숫자), verse(숫자), ref(예: '1 Samuel 3:9'), refKo(예: '사무엘상 3:9'), quoteInText, krv(짧은 인용구가 아니라 실제 한국어 개역한글/개역개정 성경의 해당 장·절 전체 원문), nevilleContext}] 형태로 넣으세요.",
          '반드시 순수 JSON 객체만 출력하세요: {"sentences":[...], "bibleQuotes":[...]}',
          "본문:",
          chunks[i]
        ].join("\n");

        const result = await callGeminiWithFallback(prompt, i, chunks.length, accumulated.length);
        const newSentences = Array.isArray(result)
          ? result
          : Array.isArray(result?.sentences)
          ? result.sentences
          : [];
        const newQuotes = Array.isArray(result?.bibleQuotes) ? result.bibleQuotes : [];

        const existingNormSet = new Set(accumulated.slice(-10).map(x => normalizeStr(x.en)));
        const filteredNew = newSentences.filter(item => item?.en && !existingNormSet.has(normalizeStr(item.en)));

        const baseSentenceCount = accumulated.length;
        accumulated = accumulated.concat(filteredNew);

        setStore(prev => Object.assign({}, prev, { [selectedLec.title]: accumulated }));

        if (newQuotes.length > 0) {
          const formattedQuotes = newQuotes.map(q => {
            const sNo = baseSentenceCount + (typeof q.sentenceOffset === "number" ? q.sentenceOffset + 1 : 1);
            const targetSent = accumulated[sNo - 1] || filteredNew[0] || { en: "", ko: "" };
            const ref = q.ref || `${q.bookNameEn || "Bible"} ${q.chapter || 1}:${q.verse || 1}`;
            return {
              id: `${sourceLabel}_${ref}_${normalizeStr(targetSent.en).slice(0, 25)}`,
              sourceTitle: sourceLabel,
              sentenceNo: sNo,
              bookNameEn: q.bookNameEn || "",
              bookNameKo: q.bookNameKo || "",
              chapter: Number(q.chapter) || 1,
              verse: Number(q.verse) || 1,
              ref: ref,
              refKo: q.refKo || ref,
              en: targetSent.en || "",
              ko: targetSent.ko || "",
              quoteInText: q.quoteInText || targetSent.en || "",
              krv: q.krv || "",
              nevilleContext: q.nevilleContext || ""
            };
          });

          setBibleList(prev => appendOnlyNewBibleVerses(prev, formattedQuotes));
        }

        // 무료 API 분당 요청 제한(Rate Limit)을 피하기 위해 구간 사이 4초 호흡
        if (i < chunks.length - 1) await sleep(4000);
      }

      setStatusMsg(`🎉 분석 완료! 총 ${accumulated.length}개 문장이 저장되었습니다.`);
    } catch (err) {
      setStatusMsg(`⚠️ 일부 구간에서 중단됨 (${err.message}). 잠시 후 다시 버튼을 누르면 멈춘 문장 다음부터 이어서 진행합니다!`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExtractBibleFromCurrentNote = async () => {
    const currentSentences = store[selectedLec.title] || [];
    if (currentSentences.length === 0) {
      alert("현재 노트에 저장된 문장이 없습니다.");
      return;
    }
    if (!apiKey.trim()) {
      alert("상단 노란색 입력칸에 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }

    setAnalyzing(true);
    try {
      const sourceLabel = selectedLec.isBook
        ? `Book ${selectedLec.num}. ${selectedLec.title}`
        : selectedLec.title;

      const batchSize = 40;
      let totalFound = 0;

      for (let i = 0; i < currentSentences.length; i += batchSize) {
        const slice = currentSentences.slice(i, i + batchSize).map((s, idx) => ({
          sentenceNo: i + idx + 1,
          en: s.en,
          ko: s.ko
        }));

        const prompt = [
          "아래 네빌 고다드 강독 문장 목록에서 성경 구절 직·간접 인용이나 비유가 포함된 문장을 모두 찾아 JSON 배열로 반환하세요.",
          "주의: krv에는 네빌의 짧은 인용구가 아니라 실제 한국어 성경(개역한글/개역개정)의 해당 장·절 전체 원문을 정확히 적으세요.",
          '형식: [{"sentenceNo":숫자,"bookNameEn":"영문책명","bookNameKo":"한글책명","chapter":장(숫자),"verse":절(숫자),"ref":"1 Samuel 3:9","refKo":"사무엘상 3:9","quoteInText":"인용구","krv":"실제 한국어 성경 해당 절 전체 원문","nevilleContext":"네빌의 영적 해석"}]',
          "문장 목록:",
          JSON.stringify(slice)
        ].join("\n");

        const quotes = await callGeminiWithFallback(
          prompt,
          Math.floor(i / batchSize),
          Math.ceil(currentSentences.length / batchSize),
          totalFound
        );

        if (Array.isArray(quotes) && quotes.length > 0) {
          totalFound += quotes.length;
          const formatted = quotes.map(q => {
            const orig = currentSentences[(q.sentenceNo || 1) - 1] || {};
            const ref = q.ref || `${q.bookNameEn} ${q.chapter}:${q.verse}`;
            return {
              id: `${sourceLabel}_${ref}_${normalizeStr(orig.en).slice(0, 25)}`,
              sourceTitle: sourceLabel,
              sentenceNo: q.sentenceNo || 1,
              bookNameEn: q.bookNameEn || "",
              bookNameKo: q.bookNameKo || "",
              chapter: Number(q.chapter) || 1,
              verse: Number(q.verse) || 1,
              ref,
              refKo: q.refKo || ref,
              en: orig.en || "",
              ko: orig.ko || "",
              quoteInText: q.quoteInText || orig.en || "",
              krv: q.krv || "",
              nevilleContext: q.nevilleContext || ""
            };
          });

         setBibleList(prev => appendOnlyNewBibleVerses(prev, formatted));
        }
        await sleep(3500);
      }
      setStatusMsg(`🎉 현재 노트에서 총 ${totalFound}개의 성경 인용 구절을 추출하여 [✝️ 성경 구절] 탭에 추가했습니다!`);
    } catch (err) {
      setStatusMsg("⚠️ 성경 구절 추출 중 오류: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExportCurrentTargetJson = () => {
    if (selectedLec.isBook) {
      const bookData = store[selectedLec.title] || [];
      if (bookData.length === 0) {
        alert("아직 이 책의 강독 노트가 없습니다.");
        return;
      }
      const exportObj = { [selectedLec.title]: bookData };
      const fileName = "book" + selectedLec.num + ".json";
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json;charset=utf-8" });
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
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJson = () => {
    const exportObj = Object.assign({ _lectureYears: lectureYears }, store);
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neville_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportBibleJson = () => {
    const sorted = [...bibleList].sort((a, b) => getBibleSortWeight(a) - getBibleSortWeight(b));
    const blob = new Blob([JSON.stringify(sorted, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bible.json";
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
        if (Array.isArray(imported)) {
          if (imported[0]?.ref !== undefined || imported[0]?.krv !== undefined || file.name.indexOf("bible") !== -1) {
            setBibleList(prev => {
              const map = new Map();
              prev.forEach(item => map.set(item.id || `${item.sourceTitle}_${item.sentenceNo}_${item.ref}`, item));
              imported.forEach(item => map.set(item.id || `${item.sourceTitle}_${item.sentenceNo}_${item.ref}`, item));
              return Array.from(map.values());
            });
            alert(`✅ [${file.name}] 성경 구절 ${imported.length}개가 성공적으로 병합되었습니다!`);
          } else {
            mergePublicDataToStore(imported, selectedLec.title);
            alert(`✅ [${file.name}] 강독 노트가 성공적으로 복원되었습니다!`);
          }
        } else if (typeof imported === "object") {
          mergePublicDataToStore(imported, selectedLec.title);
          alert(`✅ [${file.name}] 번역 노트 및 연도 분류가 성공적으로 병합되었습니다!`);
        }
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
    if (sentences.length === 0) return;
    if (quizMode) setQuizMode(false);
    const originalTitle = document.title;
    const prefix = selectedLec.isBook
      ? "Book" + String(selectedLec.num).padStart(2, "0") + "_"
      : currentLectureDisplayNum ? String(currentLectureDisplayNum).padStart(2, "0") + "_" : "";
    document.title = prefix + selectedLec.title + "_강독노트";
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 사이드바 */}
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Neville Goddard Pro Studio</div>
        <h1 className="text-lg font-bold mb-2">네빌 고다드 저서·8기·성경</h1>

        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-lg mb-3 border border-slate-800">
          <button
            onClick={() => setActiveTab("lecture")}
            className={"py-2 rounded text-xs font-bold transition " + (activeTab === "lecture" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            📚 강독 노트 ({Object.keys(store).filter(k => k !== "_lectureYears").length})
          </button>
          <button
            onClick={() => setActiveTab("bible")}
            className={"py-2 rounded text-xs font-bold transition " + (activeTab === "bible" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            ✝️ 성경 구절 ({bibleList.length})
          </button>
        </div>

        {/* 탭에 따라 왼쪽 사이드바 메뉴 자동 전환 */}
        {activeTab === "bible" ? (
          /* [✝️ 성경 구절] 탭 선택 시: BIBLE_BOOK_ORDER (1. 창세기 ~ 66. 요한계시록) 순서 메뉴 */
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            <button
              onClick={() => {
                setSelectedBibleBookOrder("all");
                setSelectedBibleItemId(null);
              }}
              className={"w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition flex justify-between items-center " + (selectedBibleBookOrder === "all" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-slate-200")}
            >
              <span>📖 전체 성경 구절 보기 (1~66권 순)</span>
              <span className="text-[11px] font-bold">{bibleList.length}구절</span>
            </button>

            <div className="text-[11px] text-emerald-400 font-bold pt-2 pb-1">
              📜 성경 66권 분류순 (BIBLE_BOOK_ORDER)
            </div>

            {BIBLE_BOOKS_META.map(bMeta => {
              const itemsInBook = bibleByBookMap[bMeta.order] || [];
              if (itemsInBook.length === 0) return null;
              const isOpen = openBibleBookOrder === bMeta.order;
              const isSelectedBook = selectedBibleBookOrder === bMeta.order;

              return (
                <div key={bMeta.order} className="rounded-lg overflow-hidden border border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedBibleBookOrder(bMeta.order);
                      setSelectedBibleItemId(null);
                      setOpenBibleBookOrder(isOpen ? null : bMeta.order);
                    }}
                    className={"w-full text-left px-3 py-2 text-xs font-bold transition flex justify-between items-center " + (isSelectedBook ? "bg-emerald-600 text-white" : "bg-slate-800/80 hover:bg-slate-700 text-slate-200")}
                  >
                    <span>{bMeta.order}. {bMeta.ko} ({bMeta.en})</span>
                    <span className="text-[10px] bg-slate-950/60 px-2 py-0.5 rounded">
                      {itemsInBook.length}구절 {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="bg-slate-950 p-1.5 space-y-1 max-h-64 overflow-y-auto border-t border-slate-800">
                      {itemsInBook.map((item, idx) => {
                        const itemId = item.id || `${item.sourceTitle}_${item.sentenceNo}_${item.ref}`;
                        const isItemSel = selectedBibleItemId === itemId;
                        return (
                          <button
                            key={itemId + "_" + idx}
                            onClick={() => setSelectedBibleItemId(isItemSel ? null : itemId)}
                            className={"w-full text-left px-2.5 py-1.5 rounded text-xs transition flex justify-between items-center " + (isItemSel ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                          >
                            <span className="truncate pr-2">
                              {idx + 1}. {item.refKo || item.ref}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 truncate max-w-[100px]">
                              {item.sourceTitle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* [📚 강독 노트] 탭 선택 시: 14권 저서 + 연도별 8기 메뉴 (각 기수 내 오래된 연도순 정렬 + 1번부터 재부여) */
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {/* 1. 14권 정규 저서 */}
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
                            <div>{b.bookNum}. [{b.year}] {b.title}</div>
                            <div className="text-[10px] text-slate-400 truncate">{b.koTitle}</div>
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

            {/* 2. 294개 강의 연도별 8기 분류 */}
            <div className="text-[11px] text-amber-400 font-bold mb-1 pt-2 border-t border-slate-800 flex justify-between items-center">
              <span>📅 294개 강의 연도별 8기 분류 (era1~8.json)</span>
              {loadingLectures && <span className="text-[10px] text-amber-300 animate-pulse">동기화중...</span>}
            </div>

            {ERAS.map(eObj => {
              const isOpen = openEra === eObj.era;
              const subList = getSortedEraLectures(eObj.era);

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
                        subList.map((lec) => {
                          const isSelected = !selectedLec.isBook && selectedLec.title === lec.title;
                          const savedCount = (store[lec.title] || []).length;
                          const knownY = lectureYears[lec.title] || KNOWN_YEARS[lec.title] || lec.year;
                          return (
                            <button
                              key={lec.title}
                              onClick={() => {
                                setSelectedLec({
                                  isBook: false,
                                  num: lec.num,
                                  eraOrderNum: lec.eraOrderNum,
                                  title: lec.title,
                                  url: lec.url
                                });
                                setTargetUrl(lec.url);
                                handleFetchLectureBody(lec.url, lec.title, false);
                              }}
                              className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                            >
                              <div className="truncate pr-2">
                                <span>{lec.eraOrderNum}. </span>
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
        )}
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main className="print-container flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="no-print bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-amber-900">🔑 Gemini API Key (자동 이어하기 & 과부하 자동 대기 호환):</span>
          <div className="flex gap-2 flex-1 max-w-md">
            <input
              type="password"
              placeholder="AIzaSy... 키를 입력하세요"
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

        {activeTab === "bible" ? (
          /* [✝️ 성경 구절 아카이브] 화면 */
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b">
              <div>
                <h2 className="text-2xl font-bold">
                  ✝️ 네빌 고다드 성경 인용 아카이브 ({displayedBibleItems.length}구절)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  한국어 성경 해당 절 전체 원문을 표시하며, [◀ 이전 절 / 다음 절 ▶] 및 [📖 장 전체 보기]를 지원합니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportBibleJson}
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow"
                >
                  💾 bible.json 다운로드 ({bibleList.length}개)
                </button>
                <label className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow cursor-pointer">
                  📂 bible.json 불러오기
                  <input type="file" accept=".json" onChange={handleImportAllJson} className="hidden" />
                </label>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={bibleSearch}
                onChange={e => setBibleSearch(e.target.value)}
                placeholder="성경 장절(예: 사무엘상 3:9, 창세기 1:2, 요한복음), 영어/한글 문장, 출처 강의명으로 검색..."
                className="w-full px-3.5 py-2 text-xs border rounded-lg bg-white shadow-sm"
              />
            </div>

            <div className="space-y-4">
              {displayedBibleItems.map((b, idx) => (
                <BibleQuoteCard
                  key={(b.id || `${b.sourceTitle}_${b.sentenceNo}_${b.ref}`) + "_" + idx}
                  item={b}
                  idx={idx}
                  speak={speak}
                />
              ))}
            </div>
          </div>
        ) : (
          /* [📚 강독 노트 스튜디오] 화면 */
          <div>
            <div className="no-print bg-white border rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-600">
                  🌐 선택된 {selectedLec.isBook ? "단행본 저서" : "강의"}의 실제 웹페이지 주소(URL):
                </span>
                {!selectedLec.isBook && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-semibold">📅 강의 연도 지정:</span>
                    <select
                      value={lectureYears[selectedLec.title] || KNOWN_YEARS[selectedLec.title] || ""}
                      onChange={e => {
                        const y = parseInt(e.target.value, 10);
                        if (y) {
                          setLectureYears(prev => Object.assign({}, prev, { [selectedLec.title]: y }));
                          setOpenEra(getEraForLecture({ title: selectedLec.title, year: y }, { [selectedLec.title]: y }));
                        }
                      }}
                      className="px-2 py-1 border rounded bg-stone-50 font-bold text-amber-900"
                    >
                      <option value="">[?] 연도 미상</option>
                      {Array.from({ length: 25 }, (_, idx) => 1948 + idx).map(yr => (
                        <option key={yr} value={yr}>[{yr}]년</option>
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
                  disabled={fetching || analyzing}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
                >
                  {fetching ? "⏳ 본문 읽는 중..." : "🌐 1. 사이트 실시간 읽어오기"}
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                rows={4}
                placeholder="왼쪽에서 [14권 저서] 또는 [연도별 8기 강의] 중 원하는 항목을 클릭하면 영어 원문과 강연 연도가 자동으로 추출됩니다!"
                className="w-full p-3 border rounded-lg text-xs font-mono bg-stone-50 mb-2"
              />

              {statusMsg && (
                <div className="text-xs font-bold text-blue-700 mb-2">{statusMsg}</div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleExtractBibleFromCurrentNote}
                    disabled={analyzing || sentences.length === 0}
                    className="px-4 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-bold shadow"
                  >
                    🔍 현재 노트에서 성경 인용만 추출
                  </button>

                  <button
                    onClick={() => handleAnalyze(false)}
                    disabled={analyzing || !rawText.trim()}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold disabled:opacity-50 shadow"
                  >
                    {analyzing
                      ? "⏳ 정밀 분석 중..."
                      : sentences.length > 0
                      ? `⚡ 2. 강독 노트 + 성경구문 이어서 생성 (${sentences.length + 1}번 문장부터)`
                      : "⚡ 2. 강독 노트 + 성경구문 생성"}
                  </button>

                  {sentences.length > 0 && !analyzing && (
                    <button
                      onClick={() => {
                        if (confirm("기존 " + sentences.length + "문장을 지우고 1번 문장부터 새로 분석할까요?")) {
                          handleAnalyze(true);
                        }
                      }}
                      className="px-3 py-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                    >
                      🔄 처음부터 다시
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
              <div>
                {selectedLec.isBook ? (
                  <div className="text-xs font-bold text-emerald-700 mb-1">
                    📖 NEVILLE GODDARD BOOK #{String(selectedLec.num).padStart(2, "0")} {selectedLec.koTitle ? "— " + selectedLec.koTitle : ""}
                  </div>
                ) : (
                  <div className="text-xs font-bold text-amber-700 mb-1">
                    📅 제{currentEraNum}기 강연 (기수 내 #{currentLectureDisplayNum}번) [{lectureYears[selectedLec.title] || KNOWN_YEARS[selectedLec.title] || "?"}]
                  </div>
                )}
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
                  {selectedLec.isBook
                    ? "Book " + selectedLec.num + ". " + selectedLec.title
                    : currentLectureDisplayNum + ". [" + (lectureYears[selectedLec.title] || KNOWN_YEARS[selectedLec.title] || "?") + "] " + selectedLec.title}
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
                  {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기"}
                </button>
              </div>
            </div>

            {sentences.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center text-slate-500">
                <div className="text-base font-bold text-slate-700 mb-2">아직 생성된 강독 노트가 없습니다.</div>
                <div className="text-xs">상단의 [⚡ 2. 강독 노트 + 성경구문 생성] 버튼을 눌러 분석을 시작하세요.</div>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
