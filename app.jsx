const { useState, useEffect } = React;

const BOOKS = [
  { bookNum: 1, year: 1939, title: "At Your Command", koTitle: "당신의 명령대로", url: "https://www.neville-goddard.com/neville-goddard-books/at-your-command-by-neville-goddard/" },
  { bookNum: 2, year: 1941, title: "Your Faith Is Your Fortune", koTitle: "당신의 믿음이 당신의 행운이다", url: "https://www.neville-goddard.com/neville-goddard-books/your-faith-is-your-fortune-by-neville-goddard/" },
  { bookNum: 3, year: 1942, title: "Freedom For All", koTitle: "모두를 위한 자유", url: "https://www.neville-goddard.com/neville-goddard-books/freedom-for-all-by-neville-goddard/" },
  { bookNum: 4, year: 1944, title: "Feeling Is The Secret", koTitle: "느낌이 비밀이다", url: "https://www.neville-goddard.com/neville-goddard-books/feeling-is-the-secret-by-neville-goddard/" },
  { bookNum: 5, year: 1945, title: "Prayer, The Art Of Believing", koTitle: "기도, 믿음의 기술", url: "https://www.neville-goddard.com/neville-goddard-books/prayer-the-art-of-believing-by-neville-goddard/" },
  { bookNum: 6, year: 1946, title: "The Search", koTitle: "탐구", url: "https://www.neville-goddard.com/neville-goddard-books/the-search-by-neville-goddard/" },
  { bookNum: 7, year: 1949, title: "Out Of This World", koTitle: "이 세상의 것이 아닌", url: "https://www.neville-goddard.com/neville-goddard-books/out-of-this-world-by-neville-goddard/" },
  { bookNum: 8, year: 1952, title: "The Power Of Awareness", koTitle: "자각의 힘", url: "https://www.neville-goddard.com/neville-goddard-books/the-power-of-awareness-by-neville-goddard/" },
  { bookNum: 9, year: 1954, title: "Awakened Imagination", koTitle: "깨어난 상상력", url: "https://www.neville-goddard.com/neville-goddard-books/awakened-imagination-by-neville-goddard/" },
  { bookNum: 10, year: 1956, title: "Seedtime And Harvest", koTitle: "씨 뿌릴 때와 거둘 때", url: "https://www.neville-goddard.com/neville-goddard-books/seedtime-and-harvest-by-neville-goddard/" },
  { bookNum: 11, year: 1961, title: "The Law And The Promise", koTitle: "법칙과 약속", url: "https://www.neville-goddard.com/neville-goddard-books/the-law-and-the-promise-by-neville-goddard/" },
  { bookNum: 12, year: 1965, title: "I Know My Father", koTitle: "나는 내 아버지를 안다", url: "https://www.neville-goddard.com/neville-goddard-books/i-know-my-father-by-neville-goddard/" },
  { bookNum: 13, year: 1966, title: "Resurrection", koTitle: "부활, 신앙 고백", url: "https://www.neville-goddard.com/neville-goddard-books/resurrection-by-neville-goddard/" },
  { bookNum: 14, year: 1970, title: "He Breaks The Shell", koTitle: "그가 껍질을 깨뜨리다", url: "https://www.neville-goddard.com/neville-goddard-books/he-breaks-the-shell-by-neville-goddard/" }
];

const VOLUMES = [
  { vol: 1, title: "제1권 (001 ~ 050번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1" },
  { vol: 2, title: "제2권 (051 ~ 100번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2" },
  { vol: 3, title: "제3권 (101 ~ 150번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3" },
  { vol: 4, title: "제4권 (151 ~ 200번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4" },
  { vol: 5, title: "제5권 (201 ~ 250번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5" },
  { vol: 6, title: "제6권 (251 ~ 294번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6" }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// 문장 정규화 비교용 헬퍼 (이미 분석된 457번째 문장이 원문 어디에 있는지 찾을 때 사용)
const normalizeStr = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

function App() {
  const [activeTab, setActiveTab] = useState("lecture"); // "lecture" | "bible"
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
    vol: 1,
    num: 20,
    title: "Awake o Sleeper 2",
    url: "https://neville-goddard.com/neville-goddard-lectures/awake-o-sleeper-2-neville-goddard-lecture"
  });
  const [targetUrl, setTargetUrl] = useState("https://neville-goddard.com/neville-goddard-lectures/awake-o-sleeper-2-neville-goddard-lecture");
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

  // JSON 데이터 병합 헬퍼 (문장 수가 더 많은 쪽 유지)
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

  const loadJsonFile = async (fileName, fallbackTitle) => {
    if (loadedFiles[fileName]) return;
    try {
      const res = await fetch("./" + fileName + "?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        mergeDataToStore(data, fallbackTitle);
        setLoadedFiles(prev => ({ ...prev, [fileName]: true }));
      }
    } catch (e) {}
  };

  // 초기 실행 시 vol1.json, neville_data.json, book1~14.json, bible.json 자동 로드
  useEffect(() => {
    loadJsonFile("vol1.json", null);
    loadJsonFile("neville_data.json", null);
    BOOKS.forEach(b => loadJsonFile("book" + b.bookNum + ".json", b.title));

    fetch("./bible.json?t=" + Date.now(), { cache: "no-store" })
      .then(res => (res.ok ? res.json() : []))
      .then(pubBible => {
        if (Array.isArray(pubBible) && pubBible.length > 0) {
          setBibleList(prev => {
            const map = new Map();
            pubBible.forEach(item => map.set(item.id || `${item.sourceTitle}_${item.sentenceNo}_${item.ref}`, item));
            prev.forEach(item => map.set(item.id || `${item.sourceTitle}_${item.sentenceNo}_${item.ref}`, item));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});

    fetchVolumeList(VOLUMES[0]);
  }, []);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_menus", JSON.stringify(volLectures)); } catch (e) {}
  }, [volLectures]);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_accordion_store", JSON.stringify(store)); } catch (e) {}
  }, [store]);

  useEffect(() => {
    try { localStorage.setItem("neville_bible_store", JSON.stringify(bibleList)); } catch (e) {}
  }, [bibleList]);

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
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
            list.push({ vol: volObj.vol, num: startNum++, title: title, url: url });
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
    loadJsonFile("vol" + volObj.vol + ".json", null);
    fetchVolumeList(volObj);
  };

  // Jina 원문에서 웹사이트 상단 메뉴/하단 링크 쓰레기 텍스트 제거
  const cleanJinaMarkdown = (raw) => {
    if (!raw) return "";
    const lines = raw.split("\n");
    const cleaned = [];
    let started = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!started) {
        if (line.startsWith("## ") || (line.length > 60 && !line.includes("](") && !line.startsWith("Title:") && !line.startsWith("URL Source:"))) {
          started = true;
        } else {
          continue;
        }
      }
      if (
        line.includes("Neville Goddard Lectures") && line.includes("](") ||
        line.startsWith("* [") ||
        line.startsWith("- [")
      ) {
        continue;
      }
      cleaned.push(lines[i]);
    }
    return (cleaned.length > 0 ? cleaned.join("\n") : raw).trim();
  };

  const handleFetchJina = async (customUrl) => {
    const urlToFetch = (typeof customUrl === "string" ? customUrl : targetUrl).trim();
    if (!urlToFetch) {
      alert("원문을 가져올 URL을 입력해 주세요.");
      return;
    }
    setFetching(true);
    setStatusMsg("⏳ Jina AI 리더로 원문을 추출하는 중...");
    try {
      const res = await fetch("https://r.jina.ai/" + urlToFetch);
      const text = await res.text();
      const cleaned = cleanJinaMarkdown(text);
      setRawText(cleaned);
      setStatusMsg("✅ 원문 추출 완료! 이제 [⚡ 2. 강독 노트 + 성경구문 생성]을 눌러주세요.");
    } catch (err) {
      setStatusMsg("❌ 원문 가져오기 실패: " + err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedLec(item);
    setTargetUrl(item.url || "");
    if (item.url) {
      handleFetchJina(item.url);
    }
  };

  // ✅ 실제 존재하는 정식 Gemini 모델만 순차 호출 (gemini-3.8-flash 완전 제거!)
// ⭕ 수정할 코드 (구형 2.0 완전 제거 + 최신 3.5 & 2.5 정식 모델만 배치)
// 1. 무료 등급(Free Tier)에서 튕기지 않는 고속 모델 2개만 지정
  const callGeminiWithFallback = async (promptText, chunkIndex, totalChunks, currentCount) => {
    const models = [
      "gemini-3.5-flash-lite", // 1순위: 무료 할당량이 가장 많고 가장 빠름
      "gemini-3.5-flash",      // 2순위: 3.5 표준 모델
      "gemini-2.5-flash"       // 3순위: 2.5 표준 호환 모델
    ];
    let lastError = null;

    for (let m = 0; m < models.length; m++) {
      const modelName = models[m];
      for (let attempt = 1; attempt <= 3; attempt++) {
        setStatusMsg(
          `⏳ AI 분석 중 (${modelName}) [${chunkIndex + 1}/${totalChunks} 구간] ... (현재 ${currentCount}문장 완료)`
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
            const errMsg = data.error.message || "";
            lastError = new Error(`[${modelName}] ${errMsg}`);

            // 없는 모델명이면 즉시 다음 모델로 이동
            if (res.status === 404 || errMsg.includes("not found") || errMsg.includes("no longer available")) {
              break;
            }
            // 무료 등급 분당 제한(429)에 걸렸을 때는 10초 숨 고른 뒤 재시도!
            setStatusMsg(`⏳ 무료 API 속도 제한 대기 중... 10초 후 [${chunkIndex + 1}/${totalChunks} 구간] 자동 재시도합니다.`);
            await sleep(10000);
            continue;
          }

          const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
          const parsed = safeParseJSON(outputText);
          if (parsed) return parsed;
        } catch (err) {
          lastError = err;
          await sleep(3000);
        }
      }
    }
    throw lastError || new Error("호출 실패");
  };
  // ✅ 핵심: 이미 457문장이 있으면 457번째 문장 이후의 원문부터 이어서 분석!
  const handleAnalyze = async (forceFromStart = false) => {
    if (!apiKey.trim()) {
      alert("상단 노란색 입력칸에 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }
    if (!rawText.trim()) {
      alert("먼저 원문을 불러와 주세요.");
      return;
    }

    setAnalyzing(true);

    try {
      const existingSentences = forceFromStart ? [] : (Array.isArray(store[selectedLec.title]) ? store[selectedLec.title] : []);
      let textToProcess = rawText.trim();

      // 이미 분석된 문장(예: 457문장)이 존재하는 경우, 마지막 문장들을 원문에서 찾아 그 이후부터 잘라냄
      if (existingSentences.length > 0) {
        let matchedEndPos = -1;
        // 뒤에서부터 최대 15개 문장을 역순으로 탐색하여 원문 내 위치 추적
        for (let k = existingSentences.length - 1; k >= Math.max(0, existingSentences.length - 15); k--) {
          const lastEn = (existingSentences[k]?.en || "").trim();
          if (lastEn.length < 10) continue;

          // 1차: 원문에서 부분 문자열 검색 (앞 35자 또는 뒤 35자)
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
          // 잘린 첫머리의 문장부호 정리
          textToProcess = textToProcess.replace(/^[^A-Za-z0-9"“'‘\[]+/, "").trim();
        } else if (matchedEndPos >= textToProcess.length - 30) {
          setStatusMsg(`🎉 이미 마지막 문장(${existingSentences.length}문장)까지 모두 분석이 완료된 강의입니다!`);
          setAnalyzing(false);
          return;
        }
      }

      // 원문을 1400자 내외의 구간(Chunk)으로 분할
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
        setStore(prev => ({ ...prev, [selectedLec.title]: [] }));
      }

      const sourceLabel = selectedLec.isBook
        ? `Book ${selectedLec.num}. ${selectedLec.title}`
        : selectedLec.title;

      for (let i = 0; i < chunks.length; i++) {
        const prompt = [
          "당신은 네빌 고다드(Neville Goddard) 전문 번역가이자 성경 신비주의 강독 전문가입니다.",
          "아래 영어 본문의 문장을 단 한 문장도 빠뜨리지 말고 순서대로 100% 분리하여 JSON으로 반환하세요.",
          "규칙:",
          "1. sentences 배열: 각 문장마다 en(영어 원문), ko(자연스럽고 격조 있는 한국어 번역), vocab(핵심 어휘 배열 [{word, mean}]), grammar(구문 및 네빌 사상 해설 배열 [{tag, desc}])를 작성하세요.",
          "2. bibleQuotes 배열: 해당 문장에 성경 구절 직·간접 인용이나 비유가 있다면 반드시 추출하여 [{sentenceOffset(현재 구간 내 0부터 시작하는 문장 번호), bookNameEn, bookNameKo, chapter(숫자), verse(숫자), ref(예: 'John 14:6'), refKo(예: '요한복음 14:6'), quoteInText, kjv, krv, nevilleContext}] 형태로 넣으세요.",
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

        // 중복 문장 방지 필터
        const existingNormSet = new Set(accumulated.slice(-10).map(x => normalizeStr(x.en)));
        const filteredNew = newSentences.filter(item => item?.en && !existingNormSet.has(normalizeStr(item.en)));

        const baseSentenceCount = accumulated.length;
        accumulated = accumulated.concat(filteredNew);

        setStore(prev => ({
          ...prev,
          [selectedLec.title]: accumulated
        }));

        if (newQuotes.length > 0) {
          const formattedQuotes = newQuotes.map(q => {
            const sNo = baseSentenceCount + (typeof q.sentenceOffset === "number" ? q.sentenceOffset + 1 : 1);
            const targetSent = accumulated[sNo - 1] || filteredNew[0] || { en: "", ko: "" };
            const ref = q.ref || `${q.bookNameEn || "Bible"} ${q.chapter || 1}:${q.verse || 1}`;
            return {
              id: `${sourceLabel}_${ref}_${(targetSent.en || "").slice(0, 22)}`,
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
              kjv: q.kjv || "",
              krv: q.krv || "",
              nevilleContext: q.nevilleContext || ""
            };
          });

          setBibleList(prev => {
            const map = new Map();
            prev.forEach(item => map.set(item.id, item));
            formattedQuotes.forEach(item => map.set(item.id, item));
            return Array.from(map.values());
          });
        }

        if (i < chunks.length - 1) {
          await sleep(1200);
        }
      }

      setStatusMsg(`🎉 분석 완료! 총 ${accumulated.length}개 문장이 저장되었습니다.`);
    } catch (err) {
      setStatusMsg(`⚠️ 일부 구간에서 중단됨 (${err.message}). 다시 [⚡ 2. 강독 노트 생성]을 누르면 멈춘 문장 다음부터 이어서 진행합니다!`);
    } finally {
      setAnalyzing(false);
    }
  };

  // 현재 이미 번역된 노트(예: 457문장)에서 성경 인용구만 추출
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
          "아래 네빌 고다드 강독 문장 목록에서 성경 구절 직·간접 인용이나 성경적 비유가 포함된 문장을 모두 찾아 JSON 배열로 반환하세요.",
          '형식: [{"sentenceNo":숫자,"bookNameEn":"영문책명","bookNameKo":"한글책명","chapter":장(숫자),"verse":절(숫자),"ref":"John 14:6","refKo":"요한복음 14:6","quoteInText":"인용구","kjv":"KJV 원문","krv":"개역한글 원문","nevilleContext":"네빌의 영적 해석"}]',
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
              id: `${sourceLabel}_${ref}_${(orig.en || "").slice(0, 22)}`,
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
              kjv: q.kjv || "",
              krv: q.krv || "",
              nevilleContext: q.nevilleContext || ""
            };
          });

          setBibleList(prev => {
            const map = new Map();
            prev.forEach(item => map.set(item.id, item));
            formatted.forEach(item => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
        await sleep(1000);
      }
      setStatusMsg(`🎉 현재 노트에서 총 ${totalFound}개의 성경 인용 구절을 추출하여 성경 탭에 추가했습니다!`);
    } catch (err) {
      setStatusMsg("⚠️ 성경 구절 추출 중 오류: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // 권별(vol1.json 등) 또는 단행본(book1.json 등) 개별 백업
  const handleDownloadCurrentGroupJson = () => {
    if (selectedLec.isBook) {
      const fileName = `book${selectedLec.num}.json`;
      const payload = { [selectedLec.title]: store[selectedLec.title] || [] };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const volNum = selectedLec.vol || openVol || 1;
    const list = volLectures[volNum] || [];
    const volPayload = {};
    if (list.length > 0) {
      list.forEach(item => {
        if (store[item.title] && store[item.title].length > 0) {
          volPayload[item.title] = store[item.title];
        }
      });
    } else {
      Object.keys(store).forEach(k => {
        volPayload[k] = store[k];
      });
    }

    const blob = new Blob([JSON.stringify(volPayload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vol${volNum}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJson = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neville_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportBibleJson = () => {
    const blob = new Blob([JSON.stringify(bibleList, null, 2)], { type: "application/json;charset=utf-8" });
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
          if (imported[0]?.ref && imported[0]?.kjv !== undefined) {
            setBibleList(imported);
            alert(`✅ 성경 구절 ${imported.length}개가 복원되었습니다!`);
          } else {
            setStore(prev => ({ ...prev, [selectedLec.title]: imported }));
            alert(`✅ ${selectedLec.title} 노트에 ${imported.length}문장이 복원되었습니다!`);
          }
        } else if (typeof imported === "object") {
          mergeDataToStore(imported, null);
          alert("✅ 모든 번역 노트가 성공적으로 병합·복원되었습니다!");
        }
      } catch (err) {
        alert("올바른 JSON 파일이 아닙니다.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const sentences = Array.isArray(store[selectedLec.title]) ? store[selectedLec.title] : [];

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
      document.title = originalTitle;
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 좌측 사이드바 */}
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Neville Goddard Studio</div>
        <h1 className="text-lg font-bold mb-2">네빌 고다드 강독 아카이브</h1>

        {/* 상단 모드 전환 탭 */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-lg mb-3 border border-slate-800">
          <button
            onClick={() => setActiveTab("lecture")}
            className={"py-1.5 rounded text-xs font-bold transition " + (activeTab === "lecture" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            📚 강독 노트 ({Object.keys(store).length})
          </button>
          <button
            onClick={() => setActiveTab("bible")}
            className={"py-1.5 rounded text-xs font-bold transition " + (activeTab === "bible" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            ✝️ 성경 구절 ({bibleList.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {/* 정규 단행본 저서 (14권) */}
          <div className="rounded-lg overflow-hidden border border-emerald-700/60">
            <button
              onClick={() => setOpenBooksMenu(!openBooksMenu)}
              className={"w-full text-left px-3 py-3 text-xs font-bold transition flex justify-between items-center " + (openBooksMenu ? "bg-emerald-500 text-slate-950" : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200")}
            >
              <span>📖 정규 단행본 저서 (14권)</span>
              <span>{openBooksMenu ? "▲" : "▼"}</span>
            </button>

            {openBooksMenu && (
              <div className="bg-slate-950 p-2 space-y-1 max-h-72 overflow-y-auto border-t border-emerald-800/50">
                {BOOKS.map(b => {
                  const isSelected = selectedLec.isBook && selectedLec.title === b.title;
                  const savedCount = (store[b.title] || []).length;
                  return (
                    <button
                      key={b.bookNum}
                      onClick={() => {
                        setActiveTab("lecture");
                        handleSelectItem({ isBook: true, num: b.bookNum, title: b.title, koTitle: b.koTitle, url: b.url });
                        loadJsonFile("book" + b.bookNum + ".json", b.title);
                      }}
                      className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" : savedCount > 0 ? "text-slate-200 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-900")}
                    >
                      <span className="truncate pr-2">{b.bookNum}. {b.title}</span>
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

          {/* 294개 강의록 (제1권 ~ 제6권) */}
          {VOLUMES.map(v => {
            const isOpen = openVol === v.vol;
            const subList = volLectures[v.vol] || [];

            return (
              <div key={v.vol} className="rounded-lg overflow-hidden border border-slate-800">
                <button
                  onClick={() => handleToggleVolume(v)}
                  className={"w-full text-left px-3 py-3 text-xs font-bold transition flex justify-between items-center " + (isOpen ? "bg-amber-500 text-slate-900" : "bg-slate-800 hover:bg-slate-700 text-slate-200")}
                >
                  <span>📚 {v.title}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="bg-slate-950 p-2 space-y-1 max-h-80 overflow-y-auto border-t border-slate-800">
                    {loadingVol && subList.length === 0 ? (
                      <div className="text-xs text-amber-400 p-3 text-center">⏳ 목록 불러오는 중...</div>
                    ) : (
                      subList.map((lec, i) => {
                        const isSelected = !selectedLec.isBook && selectedLec.title === lec.title;
                        const savedCount = (store[lec.title] || []).length;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setActiveTab("lecture");
                              handleSelectItem({ isBook: false, vol: v.vol, num: lec.num, title: lec.title, url: lec.url });
                            }}
                            className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : savedCount > 0 ? "text-slate-200 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-900")}
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
      </aside>

      {/* 우측 메인 영역 */}
      <main className="print-container flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* 상단 API Key 입력바 */}
        <div className="no-print bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold text-amber-900">🔑 Gemini API Key (유료/무료 호환 · 자동 이어하기 지원)</div>
          <input
            type="password"
            value={apiKey}
            onChange={e => saveApiKey(e.target.value)}
            placeholder="AIzaSy... 키를 입력하세요"
            className="flex-1 min-w-[220px] px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
          />
        </div>

        {activeTab === "bible" ? (
          /* 성경 구절 아카이브 탭 */
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
              <div>
                <h2 className="text-2xl font-bold">✝️ 네빌 고다드 성경 인용 아카이브 ({bibleList.length}구절)</h2>
                <p className="text-xs text-slate-500 mt-1">14권 저서 및 강의록에서 추출된 성경 구절과 네빌의 신비주의적 해설입니다.</p>
              </div>
              <button
                onClick={handleExportBibleJson}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow"
              >
                💾 bible.json 다운로드 ({bibleList.length}개)
              </button>
            </div>

            <div className="space-y-4">
              {bibleList.map((b, idx) => (
                <div key={b.id || idx} className="bg-white p-5 rounded-xl border shadow-sm space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm font-bold text-emerald-800">
                      📖 {b.refKo || b.ref} ({b.ref})
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold">
                      출처: {b.sourceTitle} (문장 #{b.sentenceNo})
                    </span>
                  </div>
                  <p className="text-sm font-serif text-slate-900">{b.en}</p>
                  <p className="text-sm text-slate-700 bg-stone-50 p-2.5 rounded border-l-4 border-stone-700">{b.ko}</p>
                  {b.kjv && (
                    <div className="text-xs text-slate-600 bg-emerald-50/60 p-2.5 rounded">
                      <div><b>[KJV]</b> {b.kjv}</div>
                      {b.krv && <div className="mt-1"><b>[개역한글]</b> {b.krv}</div>}
                    </div>
                  )}
                  {b.nevilleContext && (
                    <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded">
                      <b>💡 네빌 고다드 영적 해설:</b> {b.nevilleContext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 강독 스튜디오 탭 */
          <div>
            {/* 크롤링 & AI 분석 컨트롤 패널 */}
            <div className="no-print bg-white border rounded-2xl p-4 mb-6 shadow-sm space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  placeholder="https://neville-goddard.com/..."
                  className="flex-1 px-3 py-2 text-xs border rounded-lg bg-slate-50"
                />
                <button
                  onClick={() => handleFetchJina(targetUrl)}
                  disabled={fetching || analyzing}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shrink-0"
                >
                  {fetching ? "⏳ 추출 중..." : "1. 원문 다시 가져오기"}
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                rows={4}
                placeholder="왼쪽 메뉴에서 강의를 클릭하면 자동으로 원문이 추출됩니다."
                className="w-full p-3 text-xs font-mono border rounded-lg bg-slate-50"
              />

              {statusMsg && (
                <div className="text-xs font-bold text-blue-700">{statusMsg}</div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
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
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow"
                >
                  {analyzing
                    ? "⏳ AI 강독 노트 생성 중..."
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

            {/* 강의 제목 & 백업 버튼 바 */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
                {selectedLec.isBook
                  ? `Book ${selectedLec.num}. ${selectedLec.title}`
                  : `#${String(selectedLec.num || 1).padStart(3, "0")}. ${selectedLec.title}`}
              </h2>

              <div className="no-print flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadCurrentGroupJson}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  💾 {selectedLec.isBook ? `book${selectedLec.num}.json` : `vol${selectedLec.vol || openVol || 1}.json`} 백업
                </button>
                <button
                  onClick={handleExportAllJson}
                  className="px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
                >
                  💾 전체 백업
                </button>
                <label className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer">
                  📂 JSON 복원
                  <input type="file" accept=".json" onChange={handleImportAllJson} className="hidden" />
                </label>
                <button
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                >
                  📄 PDF
                </button>
                <button
                  onClick={() => setQuizMode(!quizMode)}
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
                >
                  {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기"}
                </button>
              </div>
            </div>

            {/* 문장 카드 리스트 */}
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
