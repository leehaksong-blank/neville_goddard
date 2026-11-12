const { useState, useEffect } = React;

// 제1권 (1~50번) 실제 개별 강의 본문 직통 URL 목록
const VOL1_LECTURES = [
  { id: 1, title: "A Divine Event", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-divine-event-neville-goddard-lecture/" },
  { id: 2, title: "A Lesson in Scripture", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-lesson-in-scripture-neville-goddard-lecture/" },
  { id: 3, title: "A Movement of Mind", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-movement-of-mind-neville-goddard-lecture/" },
  { id: 4, title: "A Movement Within God", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-movement-within-god-neville-goddard-lecture/" },
  { id: 5, title: "A Parabolic Revelation", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-parabolic-revelation-neville-goddard-lectures/" },
  { id: 6, title: "A Prophecy", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-prophecy-neville-goddard-lecture/" },
  { id: 7, title: "A Riddle", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-riddle-neville-goddard-lecture/" },
  { id: 8, title: "A State Called Moses", url: "https://www.neville-goddard.com/neville-goddard-lectures/a-state-called-moses-neville-goddard-lecture/" },
  { id: 9, title: "All Powerful Human Word", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-powerfull-human-words-neville-goddard-lecture/" },
  { id: 10, title: "All That is Divine", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-that-is-divine-neville-goddard-lecture/" },
  { id: 11, title: "All That You Behold", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-that-you-behold-neville-goddard-lecture/" },
  { id: 12, title: "All Things are Possible 1", url: "https://www.neville-goddard.com/neville-goddard-lectures/att-things-are-possible-1-neville-goddard-lecture/" },
  { id: 13, title: "All Things are Possible 2", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-things-are-possible-2-neville-goddard-lecture/" },
  { id: 14, title: "All Things Exist", url: "https://www.neville-goddard.com/neville-goddard-lectures/all-things-exist-neville-goddard-lecture/" },
  { id: 15, title: "An Assured Understanding", url: "https://www.neville-goddard.com/neville-goddard-lectures/an-assured-understanding-neville-goddard-lecture/" },
  { id: 16, title: "An Inner Conviction", url: "https://www.neville-goddard.com/neville-goddard-lectures/an-inner-conviction-neville-goddard-lecture/" },
  { id: 17, title: "Arise", url: "https://www.neville-goddard.com/neville-goddard-lectures/arise-neville-goddard-lecture/" },
  { id: 18, title: "At Your Command", url: "https://www.neville-goddard.com/neville-goddard-books/neville-goddard-at-your-command-audio-book-mp3-and-pdf" },
  { id: 19, title: "Awake o Sleeper 1", url: "https://www.neville-goddard.com/neville-goddard-lectures/awake-o-sleeper-1-neville-goddard-lecture/" },
  { id: 20, title: "Awake o Sleeper 2", url: "https://www.neville-goddard.com/neville-goddard-lectures/awake-o-sleeper-2-neville-goddard-lecture/" },
  { id: 21, title: "Barabbas or Jesus", url: "https://www.neville-goddard.com/neville-goddard-lectures/barabbas-or-jesus-neville-goddard-lecture/" },
  { id: 22, title: "Be Imitators of God", url: "https://www.neville-goddard.com/neville-goddard-lectures/be-imitators-of-god-neville-goddard-lecture/" },
  { id: 23, title: "Bear Ye One Another's Burdens", url: "https://www.neville-goddard.com/neville-goddard-lectures/bear-ye-one-anothers-burdens-neville-goddard-lecture/" },
  { id: 24, title: "Before Abraham was I AM", url: "https://www.neville-goddard.com/neville-goddard-lectures/before-abraham-was-i-am-neville-goddard-lecture/" },
  { id: 25, title: "Behold The Dreamer Cometh", url: "https://www.neville-goddard.com/neville-goddard-lectures/behold-the-dreamer-cometh-neville-goddard-lecture/" },
  { id: 26, title: "Believe In Him", url: "https://www.neville-goddard.com/neville-goddard-lectures/believe-in-him-neville-goddard-lecture/" },
  { id: 27, title: "Believe It In", url: "https://www.neville-goddard.com/neville-goddard-lectures/believe-it-in-neville-goddard-lecture/" },
  { id: 28, title: "Biblical Language", url: "https://www.neville-goddard.com/neville-goddard-lectures/biblical-language-neville-goddard-lecture/" },
  { id: 29, title: "Blake On Religion", url: "https://www.neville-goddard.com/neville-goddard-lectures/blake-on-religion-neville-goddard-lecture/" },
  { id: 30, title: "Brazen Impudence", url: "https://www.neville-goddard.com/neville-goddard-lectures/brazen-impudence-neville-goddard-lecture/" },
  { id: 31, title: "Building Your Temple", url: "https://www.neville-goddard.com/neville-goddard-lectures/building-your-temple-neville-goddard-lecture/" },
  { id: 32, title: "By Water And By Blood", url: "https://www.neville-goddard.com/neville-goddard-lectures/by-water-and-by-blood-neville-goddard-lecture/" },
  { id: 33, title: "Catch The Mood", url: "https://www.neville-goddard.com/neville-goddard-lectures/catch-the-mood-neville-goddard-lecture/" },
  { id: 34, title: "Changing The Feeling of I", url: "https://www.neville-goddard.com/neville-goddard-lectures/changing-the-feeling-of-i-neville-goddard-lecture/" },
  { id: 35, title: "Christ Bears Our Sins", url: "https://www.neville-goddard.com/neville-goddard-lectures/christ-bears-our-sins-neville-goddard-lecture/" },
  { id: 36, title: "Christ in Man", url: "https://www.neville-goddard.com/neville-goddard-lectures/christ-in-man-neville-goddard-lecture/" },
  { id: 37, title: "Christ in You", url: "https://www.neville-goddard.com/neville-goddard-lectures/christ-in-you-neville-goddard-lecture/" },
  { id: 38, title: "Christ is Your Life", url: "https://www.neville-goddard.com/neville-goddard-lectures/christ-is-your-life-neville-goddard-lecture/" },
  { id: 39, title: "Christ Unveiled", url: "https://www.neville-goddard.com/neville-goddard-lectures/christ-unveiled-neville-goddard-lecture/" },
  { id: 40, title: "Christmas - Man's Birth As God", url: "https://www.neville-goddard.com/neville-goddard-lectures/christmas-mans-birth-as-god-neville-goddard-lecture/" },
  { id: 41, title: "Come o Blessed", url: "https://www.neville-goddard.com/neville-goddard-lectures/come-o-blessed-neville-goddard-lecture/" },
  { id: 42, title: "Conception", url: "https://www.neville-goddard.com/neville-goddard-lectures/conception-neville-goddard-lecture/" },
  { id: 43, title: "Consigned To Disobedience", url: "https://www.neville-goddard.com/neville-goddard-lectures/consigned-to-disobedience-neville-goddard-lecture/" },
  { id: 44, title: "Control Your Inner Conversations", url: "https://www.neville-goddard.com/neville-goddard-lectures/control-your-inner-conversation/" },
  { id: 45, title: "Creation Faith", url: "https://www.neville-goddard.com/neville-goddard-lectures/creation-faith-neville-goddard-lecture/" },
  { id: 46, title: "Divine Signs", url: "https://www.neville-goddard.com/neville-goddard-lectures/divine-signs-neville-goddard-lecture/" },
  { id: 47, title: "Election And Change Of Consciousness", url: "https://www.neville-goddard.com/neville-goddard-lectures/election-and-change-of-consciousness-neville-goddard-lecture/" },
  { id: 48, title: "Enter The Dream", url: "https://www.neville-goddard.com/neville-goddard-lectures/enter-the-dream-neville-goddard-lecture/" },
  { id: 49, title: "Esau And Jacob", url: "https://www.neville-goddard.com/neville-goddard-lectures/esau-and-jacob-neville-goddard-lecture/" }
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

function App() {
  const [selectedLec, setSelectedLec] = useState(VOL1_LECTURES[0]);
  const [targetUrl, setTargetUrl] = useState(VOL1_LECTURES[0].url);
  const [search, setSearch] = useState("");
  const [rawText, setRawText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [quizMode, setQuizMode] = useState(false);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem("neville_vol1_store");
    return saved ? JSON.parse(saved) : { 1: INITIAL_LECTURE };
  });

  useEffect(() => {
    localStorage.setItem("neville_vol1_store", JSON.stringify(store));
  }, [store]);

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  const sentences = store[selectedLec.id] || [];

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  // 실시간으로 선택한 강의의 '진짜 본문'만 깔끔하게 추출해서 읽어오는 함수
  const handleFetchLiveSite = async (urlToFetch) => {
    const finalUrl = urlToFetch || targetUrl;
    setFetching(true);
    setStatusMsg("🌐 네빌 고다드 사이트에서 해당 강의의 영어 본문을 실시간으로 가져오는 중...");
    try {
      const response = await fetch(`https://r.jina.ai/${finalUrl}`);
      if (!response.ok) throw new Error("사이트 접속 실패");
      const fullText = await response.text();

      // 상단 메뉴·사이드바 링크들을 자동으로 잘라내고 진짜 강의 본문만 추출
      let cleanBody = fullText;
      const startMarker = cleanBody.indexOf("Markdown Content:");
      if (startMarker !== -1) cleanBody = cleanBody.slice(startMarker + 17);
      // 메뉴 끝나는 지점 이후 본문 찾기
      const lines = cleanBody.split("\n").filter(line => {
        const t = line.trim();
        if (!t) return false;
        if (t.startsWith("*   [") || t.startsWith("[Got it!]") || t.startsWith("This website uses cookies")) return false;
        return true;
      });
      cleanBody = lines.join("\n\n");

      setRawText(cleanBody.trim());
      setStatusMsg("✅ 강의 원문 추출 완료! 이제 오른쪽의 [2. 읽어온 원문으로 강독 노트 자동 생성] 버튼을 눌러주세요.");
    } catch (err) {
      alert("실시간 읽어오기 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setFetching(false);
    }
  };

  // 읽어온 강의 본문을 문장별로 번역 + 어휘 + 문법 분석
  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      alert("상단 노란색 박스에 무료 Gemini API Key를 먼저 입력해 주세요!");
      return;
    }
    if (!rawText.trim()) {
      alert("먼저 왼쪽에서 강의를 클릭하거나 [1. 사이트 실시간 읽어오기]를 눌러주세요.");
      return;
    }

    setAnalyzing(true);
    setStatusMsg("⏳ AI가 영어 강의 본문을 한 문장씩 번역·어휘·구문 분석 중입니다 (약 5~10초 소요)...");

    try {
      const targetChunk = rawText.slice(0, 4500);
      const prompt = `
당신은 네빌 고다드(Neville Goddard) 강의 전문 번역가이자 영어 구문 강독 전문가입니다.
아래 텍스트에서 웹사이트 메뉴나 링크 목록을 모두 무시하고, 오직 네빌 고다드의 실제 영어 강의 본문 문장만 순서대로 분리하여 JSON 배열로 반환하세요.

규칙:
1. 반복되는 기초 어휘는 제외하고 핵심 어휘/숙어만 vocab에 넣으세요.
2. 기계적인 1~5형식 분류는 절대 쓰지 말고, 직관적인 독해/구문 구조와 성경적 맥락만 grammar에 설명하세요.
3. 반드시 순수 JSON 배열만 출력하세요.

형식:
[
  {
    "en": "영어 원문 문장",
    "ko": "자연스럽고 품격 있는 한글 번역",
    "vocab": [{"word": "단어/숙어", "mean": "한글 뜻"}],
    "grammar": [{"tag": "핵심 구문 포인트 제목", "desc": "직관적인 문법·구조 해설"}]
  }
]

강의 원문 텍스트:
${targetChunk}
      `.trim();

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const parsed = JSON.parse(textOutput);

      setStore(prev => ({
        ...prev,
        [selectedLec.id]: parsed
      }));
      setStatusMsg(`🎉 성공! 총 ${parsed.length}개 문장의 강독 노트가 생성되었습니다!`);
    } catch (err) {
      alert("AI 분석 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 사이드바: 개별 강의 바로 선택 */}
      <aside className="w-full md:w-80 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Live Lecture Reader</div>
        <h1 className="text-lg font-bold mb-3">네빌 고다드 실시간 강독</h1>

        <input
          type="text"
          placeholder="강의 제목 또는 번호 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-xs text-white"
        />

        <div className="text-xs text-slate-400 mb-2">클릭하면 해당 강의 본문을 바로 읽어옵니다:</div>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {VOL1_LECTURES.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || String(l.id).includes(search)).map(lec => {
            const savedCount = (store[lec.id] || []).length;
            return (
              <button
                key={lec.id}
                onClick={() => {
                  setSelectedLec(lec);
                  setTargetUrl(lec.url);
                  handleFetchLiveSite(lec.url);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition flex justify-between items-center ${
                  selectedLec.id === lec.id ? "bg-amber-500 text-slate-900 font-bold" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                <span className="truncate">#{String(lec.id).padStart(3, "0")}. {lec.title}</span>
                {savedCount > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 shrink-0">{savedCount}문장</span>
                ) : (
                  <span className="text-[10px] opacity-70 shrink-0">본문 읽기 ➔</span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* 오른쪽 메인 화면 */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* 상단 API 키 입력 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
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

        {/* 실시간 본문 추출 컨트롤러 */}
        <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-xs font-bold text-slate-600 mb-2">
            🌐 현재 선택된 강의의 실제 본문 주소(URL):
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={() => handleFetchLiveSite(targetUrl)}
              disabled={fetching}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
            >
              {fetching ? "⏳ 본문 읽는 중..." : "🌐 1. 사이트 실시간 읽어오기"}
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            rows={5}
            placeholder="왼쪽 목록에서 강의를 클릭하면 이곳에 목차 링크가 아닌 '진짜 영어 강의 본문'이 자동으로 들어옵니다!"
            className="w-full p-3 border rounded-lg text-xs font-mono bg-stone-50 mb-2"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700">{statusMsg}</span>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold disabled:opacity-50"
            >
              {analyzing ? "⏳ AI가 강독 노트 생성 중..." : "⚡ 2. 읽어온 원문으로 강독 노트 자동 생성"}
            </button>
          </div>
        </div>

        {/* 강의 제목 헤더 */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b">
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
            #{String(selectedLec.id).padStart(3, "0")}. {selectedLec.title}
          </h2>
          <button
            onClick={() => setQuizMode(!quizMode)}
            className="px-4 py-2 rounded bg-slate-800 text-white text-xs font-bold"
          >
            {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기 연습"}
          </button>
        </div>

        {/* 문장별 강독 카드 (Georgia 14pt, 줄간격 1.55, 글자색 #292929) */}
        <div className="space-y-6">
          {sentences.map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center mb-2 border-b pb-2">
                <span style={{ fontFamily: "Georgia, serif", fontSize: "17pt", color: "#292929" }} className="font-bold">
                  Sentence {String(idx + 1).padStart(2, "0")}
                </span>
                <button
                  onClick={() => speak(s.en)}
                  className="px-3 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold hover:bg-amber-200"
                >
                  🔊 발음 듣기
                </button>
              </div>

              <p style={{ fontFamily: "Georgia, serif", fontSize: "14pt", lineHeight: "1.55", color: "#292929" }} className="mb-3">
                {s.en}
              </p>

              <p
                style={{ fontFamily: "Georgia, serif", fontSize: "14pt", lineHeight: "1.55", color: "#292929" }}
                className={`p-3 bg-stone-50 border-l-4 border-stone-800 rounded mb-4 ${quizMode ? "blur-sm hover:blur-none transition cursor-pointer" : ""}`}
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
