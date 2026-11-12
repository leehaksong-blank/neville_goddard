const { useState, useEffect } = React;

const VOLUMES = [
  { vol: 1, title: "제1권 (001 ~ 050번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1" },
  { vol: 2, title: "제2권 (051 ~ 100번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2" },
  { vol: 3, title: "제3권 (101 ~ 150번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3" },
  { vol: 4, title: "제4권 (151 ~ 200번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4" },
  { vol: 5, title: "제5권 (201 ~ 250번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5" },
  { vol: 6, title: "제6권 (251 ~ 294번 강의)", indexUrl: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6" }
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
    ]
  }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [openVol, setOpenVol] = useState(null);
  const [loadingVol, setLoadingVol] = useState(false);

  const [volLectures, setVolLectures] = useState(() => {
    try {
      const saved = localStorage.getItem("neville_vol_menus");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [selectedLec, setSelectedLec] = useState({
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
  // 진행 중이던 구간(Chunk) 번호를 기억하여 끊긴 곳부터 이어하기 지원
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

  useEffect(() => {
    try { localStorage.setItem("neville_vol_menus", JSON.stringify(volLectures)); } catch (e) {}
  }, [volLectures]);

  useEffect(() => {
    try { localStorage.setItem("neville_vol_accordion_store", JSON.stringify(store)); } catch (e) {}
  }, [store]);

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  const sentences = store[selectedLec.title] || [];

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  // A4 PDF 다운로드(인쇄) 함수
  const handleDownloadPdf = () => {
    if (sentences.length === 0) {
      alert("저장할 강독 노트가 없습니다. 먼저 강독 노트를 생성해 주세요.");
      return;
    }
    if (quizMode) setQuizMode(false);

    const originalTitle = document.title;
    const prefix = selectedLec.num ? String(selectedLec.num).padStart(3, "0") + "_" : "";
    document.title = prefix + selectedLec.title + "_강독노트";

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  };

  const handleToggleVolume = async (volObj) => {
    if (openVol === volObj.vol) {
      setOpenVol(null);
      return;
    }
    setOpenVol(volObj.vol);

    if (!volLectures[volObj.vol] || volLectures[volObj.vol].length === 0) {
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
              list.push({ num: startNum++, title: title, url: url });
            }
          }
        }
        setVolLectures(prev => ({ ...prev, [volObj.vol]: list }));
      } catch (e) {
        alert("강의 목록 불러오기 오류: " + e.message);
      } finally {
        setLoadingVol(false);
      }
    }
  };

  const handleFetchLectureBody = async (urlToFetch, titleToSet) => {
    const finalUrl = urlToFetch || targetUrl;
    setFetching(true);
    setResumeChunkIdx(0);
    setStatusMsg("🌐 [" + (titleToSet || selectedLec.title) + "] 강의의 영어 본문 전체를 읽어오는 중...");
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
      cleanBody = lines.join("\n\n");

      setRawText(cleanBody.trim());
      setStatusMsg("✅ 원문 추출 완료! 오른쪽의 [⚡ 2. 강독 노트 생성]을 눌러주세요.");
    } catch (err) {
      alert("실시간 읽어오기 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setFetching(false);
    }
  };

  // ★ 핵심: High demand(과부하) 발생 시 4개 서버를 자동으로 돌아가며 재시도하는 함수
  const callGeminiWithFallback = async (promptText, chunkIdx, totalChunks) => {
    const models = [
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    for (let attempt = 1; attempt <= 4; attempt++) {
      for (let m = 0; m < models.length; m++) {
        const modelName = models[m];
        try {
          if (attempt > 1 || m > 0) {
            setStatusMsg(
              "🔄 기본 서버가 혼잡하여 [" + modelName + "] 서버로 우회 분석 중... (" +
              (chunkIdx + 1) + "/" + totalChunks + " 구간)"
            );
          }

          const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey.trim(),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { responseMimeType: "application/json" }
              })
            }
          );

          const data = await res.json();

          if (data.error) {
            const msg = (data.error.message || "").toLowerCase();
            // 과부하, 수요 폭증(high demand), 할당량 초과 시 2초 쉬고 바로 다음 모델로 우회!
            if (
              msg.indexOf("demand") !== -1 ||
              msg.indexOf("overloaded") !== -1 ||
              msg.indexOf("quota") !== -1 ||
              msg.indexOf("unavailable") !== -1 ||
              res.status === 503 ||
              res.status === 429
            ) {
              await sleep(2000);
              continue;
            }
            throw new Error(data.error.message);
          }

          let textOutput = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) || "[]";
          textOutput = textOutput.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
          return JSON.parse(textOutput);
        } catch (err) {
          if (m === models.length - 1 && attempt === 4) {
            throw err;
          }
          await sleep(1500);
        }
      }
      setStatusMsg("⏳ 구글 AI 서버 대기열 통과 중... 4초 후 자동 재시도합니다 (" + attempt + "/4)");
      await sleep(4000);
    }
    throw new Error("구글 무료 서버가 모두 혼잡합니다. 잠시 후 버튼을 다시 누르시면 이어서 진행됩니다.");
  };

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      alert("상단 노란색 칸에 무료 Gemini API Key를 먼저 입력해 주세요!");
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
        if ((currentChunk + "\n\n" + p).length > 3200 && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = p;
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + p;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());

      // 처음부터 시작하는 경우에만 초기화, 이어하기인 경우 기존 문장 유지
      let allParsedSentences = resumeChunkIdx > 0 ? (store[selectedLec.title] || []) : [];
      if (resumeChunkIdx === 0) {
        setStore(prev => ({ ...prev, [selectedLec.title]: [] }));
      }

      for (let i = resumeChunkIdx; i < chunks.length; i++) {
        setStatusMsg("⏳ 전체 " + chunks.length + "구간 중 [" + (i + 1) + "/" + chunks.length + " 구간] 분석 중... (현재 " + allParsedSentences.length + "문장 완료)");

        const prompt = [
          "당신은 네빌 고다드(Neville Goddard) 강의 전문 번역가이자 영어 구문 강독 전문가입니다.",
          "아래 텍스트에서 웹사이트 메뉴나 링크를 제외하고 실제 네빌 고다드의 영어 강의 본문 문장만 한 문장도 빠짐없이 순서대로 분리하여 JSON 배열로 반환하세요.",
          "규칙:",
          "1. 반복 기초 어휘는 제외하고 핵심 어휘/숙어만 vocab에 넣으세요.",
          "2. 기계적인 1~5형식 분류는 절대 쓰지 말고, 직관적인 독해/구문 구조와 성경적 맥락만 grammar에 설명하세요.",
          "3. 반드시 순수 JSON 배열만 출력하세요.",
          '형식: [{"en":"영어 원문","ko":"한글 번역","vocab":[{"word":"단어","mean":"뜻"}],"grammar":[{"tag":"구문 포인트","desc":"해설"}]}]',
          "강의 본문:",
          chunks[i]
        ].join("\n");

        const parsed = await callGeminiWithFallback(prompt, i, chunks.length);

        allParsedSentences = allParsedSentences.concat(parsed);
        setResumeChunkIdx(i + 1);

        setStore(prev => ({
          ...prev,
          [selectedLec.title]: allParsedSentences
        }));

        if (i < chunks.length - 1) {
          await sleep(1500);
        }
      }

      setResumeChunkIdx(0);
      setStatusMsg("🎉 강의 끝까지 총 " + allParsedSentences.length + "개 문장 전체의 강독 노트가 완성되었습니다!");
    } catch (err) {
      alert("일시적 서버 혼잡 안내: " + err.message);
      setStatusMsg("⚠️ 완료된 구간까지 자동 저장되었습니다! [⚡ 2. 이어서 강독 노트 생성] 버튼을 누르면 남은 구간부터 이어서 분석합니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Live Web Crawler</div>
        <h1 className="text-lg font-bold mb-3">네빌 고다드 294 실시간 강독</h1>
        <div className="text-xs text-slate-400 mb-2">권(Volume)을 클릭하면 50개 강의 목록이 펼쳐집니다:</div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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
                      <div className="text-xs text-amber-400 p-3 text-center">
                        ⏳ 50개 강의 목록을 실시간으로 가져오는 중...
                      </div>
                    ) : (
                      subList.map((lec, i) => {
                        const isSelected = selectedLec.title === lec.title;
                        const savedCount = (store[lec.title] || []).length;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedLec(lec);
                              setTargetUrl(lec.url);
                              handleFetchLectureBody(lec.url, lec.title);
                            }}
                            className={"w-full text-left px-2.5 py-2 rounded text-xs transition flex justify-between items-center " + (isSelected ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : "text-slate-300 hover:bg-slate-800")}
                          >
                            <span className="truncate pr-2">{lec.num}. {lec.title}</span>
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
          <span className="font-bold text-amber-900">🔑 Gemini API Key (1회 입력 시 자동 저장):</span>
          <div className="flex gap-2 flex-1 max-w-md">
            <input
              type="password"
              placeholder="여기에 무료 Gemini API Key 붙여넣기"
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
              무료 발급 ↗
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
            rows={5}
            placeholder="왼쪽에서 권(Volume)을 눌러 50개 목록을 펼친 뒤, 원하는 강의를 클릭하면 이곳에 해당 강의의 영어 본문 전체가 자동으로 채워집니다!"
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
                  ? "⏳ 전체 구간 연속 분석 중..."
                  : resumeChunkIdx > 0
                  ? "⚡ 2. 이어서 강독 노트 생성 (" + (resumeChunkIdx + 1) + "구간부터)"
                  : "⚡ 2. 강독 노트 생성 (서버 자동우회)"}
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
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
            {selectedLec.num ? "#" + String(selectedLec.num).padStart(3, "0") + ". " : ""}{selectedLec.title}
          </h2>
          <div className="no-print flex gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
            >
              📄 PDF 다운로드
            </button>
            <button
              onClick={() => setQuizMode(!quizMode)}
              className="px-4 py-2 rounded bg-slate-800 text-white text-xs font-bold"
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
