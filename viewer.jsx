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

  // JSON 데이터를 store에 병합 (단일 배열/객체 구조 모두 호환)
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

  // JSON 파일(vol1~6.json, book1~14.json, neville_data.json) 자동 로드
  const loadJsonFile = async (fileName, fallbackTitle, showSpinner) => {
    if (loadedFiles[fileName]) return;
    if (showSpinner) setLoadingData(true);
    try {
      const res = await fetch("./" + fileName + "?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        mergeDataToStore(data, fallbackTitle);
        setLoadedFiles(prev => Object.assign({}, prev, { [fileName]: true }));
      }
    } catch (e) {
    } finally {
      if (showSpinner) setLoadingData(false);
    }
  };

  // 첫 실행 시 데이터 및 제1권 강의 목록 불러오기
  useEffect(() => {
    loadJsonFile("vol1.json", null, true);
    loadJsonFile("neville_data.json", null, false);
    BOOKS.forEach(b => {
      loadJsonFile("book" + b.bookNum + ".json", b.title, false);
    });
    fetchVolumeList(VOLUMES[0]);
  }, []);

  const handleToggleBooksMenu = () => {
    const nextState = !openBooksMenu;
    setOpenBooksMenu(nextState);
    if (nextState) {
      BOOKS.forEach(b => {
        loadJsonFile("book" + b.bookNum + ".json", b.title, false);
      });
    }
  };

  // 정규표현식 충돌 없이 안전하게 각 권의 강의 목록 추출
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
            list.push({ num: startNum++, title: title });
          }
        }
      }
      setVolLectures(prev => Object.assign({}, prev, { [volObj.vol]: list }));
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
      document.title = originalTitle;
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 사이드바: 14권 저서 + 294개 강의 목차 */}
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Neville Goddard Archive</div>
        <h1 className="text-lg font-bold mb-1">네빌 고다드 강독 아카이브</h1>
        <div className="text-xs text-slate-400 mb-3">
          문장 수 배지가 표시된 저서·강의를 선택해 열람하세요.
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {/* 1. 네빌 고다드 14권 정규 저서 */}
          <div className="mb-3">
            <div className="text-[11px] text-emerald-400 font-bold mb-1">📖 정규 출간 단행본 (14권)</div>
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
                          setSelectedLec({ isBook: true, num: b.bookNum, title: b.title, koTitle: b.koTitle });
                          loadJsonFile("book" + b.bookNum + ".json", b.title, true);
                        }}
                        className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" : savedCount > 0 ? "text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-900")}
                      >
                        <div className="truncate pr-2">
                          <div>{b.bookNum}. {b.title} ({b.year})</div>
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

          {/* 2. 294개 강의록 (제1권 ~ 제6권) */}
          <div className="text-[11px] text-amber-400 font-bold mb-1 pt-2 border-t border-slate-800">
            📚 294개 강의록 (제1권 ~ 제6권)
          </div>
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
                  <span>{isOpen ? "▲ 접기" : "▼ 펼치기"}</span>
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
                              setSelectedLec({ isBook: false, num: lec.num, title: lec.title });
                              loadJsonFile("vol" + v.vol + ".json", null, true);
                            }}
                            className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : savedCount > 0 ? "text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-900")}
                          >
                            <span className="truncate pr-2">{lec.num}. {lec.title}</span>
                            {savedCount > 0 ? (
                              <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-bold shrink-0">
                                {savedCount}문장
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600 shrink-0">준비중</span>
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

      {/* 오른쪽 본문: 조회 · 발음 듣기 · 해석 가리기 · PDF 출력 전용 */}
      <main className="print-container flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b">
          <div>
            {selectedLec.isBook && (
              <div className="text-xs font-bold text-emerald-700 mb-1">
                📖 NEVILLE GODDARD BOOK #{String(selectedLec.num).padStart(2, "0")} {selectedLec.koTitle ? "— " + selectedLec.koTitle : ""}
              </div>
            )}
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
              {selectedLec.isBook
                ? "Book " + selectedLec.num + ". " + selectedLec.title
                : (selectedLec.num ? "#" + String(selectedLec.num).padStart(3, "0") + ". " : "") + selectedLec.title}
            </h2>
          </div>

          {sentences.length > 0 && (
            <div className="no-print flex flex-wrap gap-2">
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
              >
                📄 PDF 다운로드
              </button>
              <button
                onClick={() => setQuizMode(!quizMode)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기 연습"}
              </button>
            </div>
          )}
        </div>

        {loadingData && sentences.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">⏳ 강독 데이터를 불러오는 중입니다...</div>
        ) : sentences.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-slate-500">
            <div className="text-base font-bold text-slate-700 mb-2">아직 강독 노트가 등록되지 않은 항목입니다.</div>
            <div className="text-xs">왼쪽 목록에서 문장 수 배지(초록색/노란색)가 표시된 저서나 강의를 선택해 주세요.</div>
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
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ViewerApp />);
