const { useState, useEffect } = React;

// 네빌 고다드 온라인 강의 6개 권(Volume 1 ~ 6 : 총 294개 강의 수록 페이지)
const VOLUME_PAGES = [
  { vol: 1, range: "001 ~ 050번 강의", url: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-1" },
  { vol: 2, range: "051 ~ 100번 강의", url: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-2" },
  { vol: 3, range: "101 ~ 150번 강의", url: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-3" },
  { vol: 4, range: "151 ~ 200번 강의", url: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-4" },
  { vol: 5, range: "201 ~ 250번 강의", url: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-5" },
  { vol: 6, range: "251 ~ 294번 강의", url: "https://www.neville-goddard.com/neville-goddard-lectures/read-neville-goddard-lectures-on-line-6" }
];

// 기본 1번 강의 샘플 데이터
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
  },
  {
    en: "It is an event which puts an entirely different light upon human life, for it proclaims that man has been saved.",
    ko: "이 사건은 인간의 삶을 완전히 다른 시각으로 보게 만드는데, 왜냐하면 인간이 이미 구원받았음을 선포하기 때문입니다.",
    vocab: [
      { word: "put ~ upon a different light", mean: "~을 새로운 각도/시각에서 보게 하다" },
      { word: "entirely", mean: "전적으로, 완전히" },
      { word: "for", mean: "[접속사] 왜냐하면 ~이므로 (앞 절의 근거 제시)" },
      { word: "man", mean: "[무관사 단수] 인류, 인간 일반" }
    ],
    grammar: [
      { tag: "주격 관계대명사 (which)", desc: "선행사 an event를 수식하는 형용사절을 이끕니다." },
      { tag: "현재완료 수동태 (has been saved)", desc: "구원이 미래의 조건부 사건이 아니라 이미 완료되어 현재까지 확정된 상태임을 나타냅니다." }
    ]
  }
];

function App() {
  const [targetUrl, setTargetUrl] = useState(VOLUME_PAGES[0].url);
  const [lectureTitle, setLectureTitle] = useState("A Divine Event (1969-12-08)");
  const [rawText, setRawText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [quizMode, setQuizMode] = useState(false);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [sentences, setSentences] = useState(() => {
    const saved = localStorage.getItem("neville_live_sentences");
    return saved ? JSON.parse(saved) : INITIAL_LECTURE;
  });

  useEffect(() => {
    localStorage.setItem("neville_live_sentences", JSON.stringify(sentences));
  }, [sentences]);

  const saveApiKey = (val) => {
    setApiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  // 원어민 발음 듣기 (TTS)
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  // 1. 실시간으로 외부 웹사이트(neville-goddard.com)의 본문을 읽어오는 함수 (Jina Reader API 활용)
  const handleFetchLiveSite = async (urlToFetch) => {
    const finalUrl = urlToFetch || targetUrl;
    setFetching(true);
    setStatusMsg("🌐 실시간으로 네빌 고다드 사이트에서 강의 본문을 읽어오는 중입니다...");
    try {
      // r.jina.ai를 통해 외부 웹페이지를 실시간 텍스트로 추출
      const response = await fetch(`https://r.jina.ai/${finalUrl}`);
      if (!response.ok) throw new Error("사이트 접속 실패");
      const text = await response.text();
      setRawText(text);
      setStatusMsg("✅ 실시간 원문 불러오기 완료! 원하는 구간을 남기고 [AI 자동 강독 생성]을 눌러주세요.");
    } catch (err) {
      alert("실시간 읽어오기 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setFetching(false);
    }
  };

  // 2. 읽어온 영어 원문을 Gemini AI로 문장별 분석 (번역 + 핵심 어휘 + 직관적 문법)
  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      alert("상단에 무료 Gemini API 키를 먼저 입력해 주세요!");
      return;
    }
    if (!rawText.trim()) {
      alert("먼저 [실시간 원문 읽어오기]를 누르거나 영어 원문을 입력해 주세요.");
      return;
    }

    setAnalyzing(true);
    setStatusMsg("⏳ AI가 실시간 원문을 문장별로 쪼개어 번역·어휘·문법 노트를 생성 중입니다...");

    try {
      // 한 번에 너무 긴 페이지 전체를 보내면 시간이 오래 걸리므로 앞부분 4500자 기준으로 정밀 분석
      const targetChunk = rawText.slice(0, 4500);

      const prompt = `
당신은 네빌 고다드(Neville Goddard) 강의 전문 번역가이자 영어 구문 강독 전문가입니다.
다음 웹페이지에서 실시간으로 읽어온 텍스트 중 메뉴/링크 등 불필요한 부분을 제외하고, 실제 네빌 고다드의 강의 본문 문장만 한 문장씩 순서대로 분리하여 JSON 배열로 반환하세요.

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

실시간 추출 원문:
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

      setSentences(parsed);
      setStatusMsg(`🎉 총 ${parsed.length}개 문장을 실시간 분석하여 화면에 표시했습니다!`);
    } catch (err) {
      alert("AI 분석 오류: " + err.message);
      setStatusMsg("");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 좌측: 실시간 연결된 6개 권(294개 강의) 선택 패널 */}
      <aside className="w-full md:w-72 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Live Web Crawler</div>
        <h1 className="text-lg font-bold mb-4">네빌 고다드 294 실시간 강독</h1>

        <div className="text-xs text-slate-400 mb-2">실시간 원문 서버 선택 (Vol.1 ~ 6)</div>
        <div className="space-y-2 mb-6">
          {VOLUME_PAGES.map(v => (
            <button
              key={v.vol}
              onClick={() => {
                setTargetUrl(v.url);
                setLectureTitle(`Vol.${v.vol} (${v.range})`);
                handleFetchLiveSite(v.url);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition flex justify-between items-center ${
                targetUrl === v.url ? "bg-amber-500 text-slate-900 font-bold" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              <span>📚 제{v.vol}권 ({v.range})</span>
              <span>실시간 읽기 ➔</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
          💡 왼쪽의 권(Volume) 버튼을 누르거나 원하는 강의 웹페이지 주소를 입력하면, <b>파일을 따로 만들 필요 없이 실시간으로 사이트 내용을 읽어와</b> 영어 강독 노트로 변환합니다.
        </div>
      </aside>

      {/* 우측: 메인 학습 스튜디오 */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* 1. Gemini API 키 입력창 */}
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

        {/* 2. 실시간 URL 읽어오기 컨트롤러 */}
        <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-xs font-bold text-slate-600 mb-2">
            🌐 실시간으로 읽어올 네빌 고다드 강의 웹페이지 주소(URL):
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              placeholder="https://www.neville-goddard.com/..."
            />
            <button
              onClick={() => handleFetchLiveSite(targetUrl)}
              disabled={fetching}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
            >
              {fetching ? "⏳ 사이트 읽는 중..." : "🌐 1. 사이트 실시간 읽어오기"}
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            rows={4}
            placeholder="위의 [1. 사이트 실시간 읽어오기] 버튼을 누르면 이곳에 웹사이트의 영어 원문이 자동으로 채워집니다! (분석하고 싶은 강의 구간만 남기고 지우셔도 됩니다)"
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

        {/* 3. 강의 제목 및 퀴즈 버튼 */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b">
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt", color: "#292929" }} className="font-bold">
            {lectureTitle}
          </h2>
          <button
            onClick={() => setQuizMode(!quizMode)}
            className="px-4 py-2 rounded bg-slate-800 text-white text-xs font-bold"
          >
            {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기 연습"}
          </button>
        </div>

        {/* 4. 문장별 강독 결과 카드 (Georgia 14pt, 줄간격 1.55, 글자색 #292929) */}
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
